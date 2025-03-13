import { Timestamp, Metadata, UserID, TabChange, TabData } from './messages.gen.js';
import { now, adjustTimeOrigin, deprecationWarn, inIframe } from '../utils.js';
import Nodes from './nodes.js';
import Observer from './observer/top_observer.js';
import Sanitizer from './sanitizer.js';
import Ticker from './ticker.js';
import Logger, { LogLevel } from './logger.js';
import Session from './session.js';
import { gzip } from 'fflate';
import { deviceMemory, jsHeapSizeLimit } from '../modules/performance.js';
import AttributeSender from '../modules/attributeSender.js';
const CANCELED = 'canceled';
const START_ERROR = ':(';
const UnsuccessfulStart = (reason) => ({ reason, success: false });
const SuccessfulStart = (body) => (Object.assign(Object.assign({}, body), { success: true }));
var ActivityState;
(function (ActivityState) {
    ActivityState[ActivityState["NotActive"] = 0] = "NotActive";
    ActivityState[ActivityState["Starting"] = 1] = "Starting";
    ActivityState[ActivityState["Active"] = 2] = "Active";
})(ActivityState || (ActivityState = {}));
// TODO: use backendHost only
export const DEFAULT_INGEST_POINT = 'https://api.openreplay.com/ingest';
function getTimezone() {
    const offset = new Date().getTimezoneOffset() * -1;
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
export default class App {
    constructor(projectKey, sessionToken, options) {
        var _a, _b;
        this.messages = [];
        this.startCallbacks = [];
        this.stopCallbacks = [];
        this.commitCallbacks = [];
        this.notInitCallbacks = [];
        this.forceFlushCompletedCallbacks = [];
        this.activityState = ActivityState.NotActive;
        this.version = '9.0.11'; // TODO: version compatability check inside each plugin.
        this.compressionThreshold = 24 * 1000;
        this.restartAttempts = 0;
        this.bc = null;
        this._usingOldFetchPlugin = false;
        this.delay = 0;
        // if (options.onStart !== undefined) {
        //   deprecationWarn("'onStart' option", "tracker.start().then(/* handle session info */)")
        // } ?? maybe onStart is good
        this.contextId = Math.random().toString(36).slice(2);
        this.projectKey = projectKey;
        this.networkOptions = options.network;
        this.options = Object.assign({
            revID: '',
            node_id: '__openreplay_id',
            session_token_key: '__openreplay_token',
            session_pageno_key: '__openreplay_pageno',
            session_reset_key: '__openreplay_reset',
            session_tabid_key: '__openreplay_tabid',
            local_uuid_key: '__openreplay_uuid',
            ingestPoint: DEFAULT_INGEST_POINT,
            resourceBaseHref: null,
            verbose: false,
            __is_snippet: false,
            __debug_report_edp: null,
            localStorage: null,
            sessionStorage: null,
            disableStringDict: false,
            forceSingleTab: false,
        }, options);
        if (!this.options.forceSingleTab && globalThis && 'BroadcastChannel' in globalThis) {
            this.bc = inIframe() ? null : new BroadcastChannel('rick');
        }
        this.revID = this.options.revID;
        this.localStorage = (_a = this.options.localStorage) !== null && _a !== void 0 ? _a : window.localStorage;
        this.sessionStorage = (_b = this.options.sessionStorage) !== null && _b !== void 0 ? _b : window.sessionStorage;
        this.sanitizer = new Sanitizer(this, options);
        this.nodes = new Nodes(this.options.node_id);
        this.observer = new Observer(this, options);
        this.ticker = new Ticker(this);
        this.ticker.attach(() => this.commit());
        this.debug = new Logger(this.options.__debug__);
        this.notify = new Logger(this.options.verbose ? LogLevel.Warnings : LogLevel.Silent);
        this.session = new Session(this, this.options);
        this.attributeSender = new AttributeSender(this, Boolean(this.options.disableStringDict));
        this.session.attachUpdateCallback(({ userID, metadata }) => {
            if (userID != null) {
                // TODO: nullable userID
                this.send(UserID(userID));
            }
            if (metadata != null) {
                Object.entries(metadata).forEach(([key, value]) => this.send(Metadata(key, value)));
            }
        });
        // @deprecated (use sessionHash on start instead)
        if (sessionToken != null) {
            this.session.applySessionHash(sessionToken);
        }
        try {
            this.worker = new Worker(URL.createObjectURL(new Blob(['"use strict";class t{constructor(t,i,s,e=10,n=1e3,r){this.onUnauthorised=i,this.onFailure=s,this.MAX_ATTEMPTS_COUNT=e,this.ATTEMPT_TIMEOUT=n,this.onCompress=r,this.attemptsCount=0,this.busy=!1,this.queue=[],this.token=null,this.ingestURL=t+"/v1/web/i",this.isCompressing=void 0!==r}authorise(t){this.token=t,this.busy||this.sendNext()}push(t){this.busy||!this.token?this.queue.push(t):(this.busy=!0,this.isCompressing&&this.onCompress?this.onCompress(t):this.sendBatch(t))}sendNext(){const t=this.queue.shift();t?(this.busy=!0,this.isCompressing&&this.onCompress?this.onCompress(t):this.sendBatch(t)):this.busy=!1}retry(t,i){this.attemptsCount>=this.MAX_ATTEMPTS_COUNT?this.onFailure(`Failed to send batch after ${this.attemptsCount} attempts.`):(this.attemptsCount++,setTimeout(()=>this.sendBatch(t,i),this.ATTEMPT_TIMEOUT*this.attemptsCount))}sendBatch(t,i){this.busy=!0;const s={Authorization:"Bearer "+this.token};i&&(s["Content-Encoding"]="gzip"),null!==this.token?fetch(this.ingestURL,{body:t,method:"POST",headers:s,keepalive:t.length<65536}).then(s=>{if(401===s.status)return this.busy=!1,void this.onUnauthorised();s.status>=400?this.retry(t,i):(this.attemptsCount=0,this.sendNext())}).catch(s=>{console.warn("OpenReplay:",s),this.retry(t,i)}):setTimeout(()=>{this.sendBatch(t,i)},500)}sendCompressed(t){this.sendBatch(t,!0)}sendUncompressed(t){this.sendBatch(t,!1)}clean(){this.sendNext(),setTimeout(()=>{this.token=null,this.queue.length=0},10)}}const i="function"==typeof TextEncoder?new TextEncoder:{encode(t){const i=t.length,s=new Uint8Array(3*i);let e=-1;for(let n=0,r=0,h=0;h!==i;){if(n=t.charCodeAt(h),h+=1,n>=55296&&n<=56319){if(h===i){s[e+=1]=239,s[e+=1]=191,s[e+=1]=189;break}if(r=t.charCodeAt(h),!(r>=56320&&r<=57343)){s[e+=1]=239,s[e+=1]=191,s[e+=1]=189;continue}if(n=1024*(n-55296)+r-56320+65536,h+=1,n>65535){s[e+=1]=240|n>>>18,s[e+=1]=128|n>>>12&63,s[e+=1]=128|n>>>6&63,s[e+=1]=128|63&n;continue}}n<=127?s[e+=1]=0|n:n<=2047?(s[e+=1]=192|n>>>6,s[e+=1]=128|63&n):(s[e+=1]=224|n>>>12,s[e+=1]=128|n>>>6&63,s[e+=1]=128|63&n)}return s.subarray(0,e+1)}};class s extends class{constructor(t){this.size=t,this.offset=0,this.checkpointOffset=0,this.data=new Uint8Array(t)}getCurrentOffset(){return this.offset}checkpoint(){this.checkpointOffset=this.offset}get isEmpty(){return 0===this.offset}skip(t){return this.offset+=t,this.offset<=this.size}set(t,i){this.data.set(t,i)}boolean(t){return this.data[this.offset++]=+t,this.offset<=this.size}uint(t){for((t<0||t>Number.MAX_SAFE_INTEGER)&&(t=0);t>=128;)this.data[this.offset++]=t%256|128,t=Math.floor(t/128);return this.data[this.offset++]=t,this.offset<=this.size}int(t){return t=Math.round(t),this.uint(t>=0?2*t:-2*t-1)}string(t){const s=i.encode(t),e=s.byteLength;return!(!this.uint(e)||this.offset+e>this.size)&&(this.data.set(s,this.offset),this.offset+=e,!0)}reset(){this.offset=0,this.checkpointOffset=0}flush(){const t=this.data.slice(0,this.checkpointOffset);return this.reset(),t}}{encode(t){switch(t[0]){case 0:return this.uint(t[1]);case 4:return this.string(t[1])&&this.string(t[2])&&this.uint(t[3]);case 5:return this.uint(t[1])&&this.uint(t[2]);case 6:return this.int(t[1])&&this.int(t[2]);case 7:return!0;case 8:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3])&&this.string(t[4])&&this.boolean(t[5]);case 9:case 10:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3]);case 11:return this.uint(t[1]);case 12:return this.uint(t[1])&&this.string(t[2])&&this.string(t[3]);case 13:case 14:return this.uint(t[1])&&this.string(t[2]);case 16:return this.uint(t[1])&&this.int(t[2])&&this.int(t[3]);case 17:return this.uint(t[1])&&this.string(t[2]);case 18:return this.uint(t[1])&&this.string(t[2])&&this.int(t[3]);case 19:return this.uint(t[1])&&this.boolean(t[2]);case 20:return this.uint(t[1])&&this.uint(t[2]);case 21:return this.string(t[1])&&this.string(t[2])&&this.string(t[3])&&this.string(t[4])&&this.string(t[5])&&this.uint(t[6])&&this.uint(t[7])&&this.uint(t[8]);case 22:return this.string(t[1])&&this.string(t[2]);case 23:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3])&&this.uint(t[4])&&this.uint(t[5])&&this.uint(t[6])&&this.uint(t[7])&&this.uint(t[8])&&this.uint(t[9]);case 24:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3]);case 27:return this.string(t[1])&&this.string(t[2]);case 28:case 29:return this.string(t[1]);case 30:return this.string(t[1])&&this.string(t[2]);case 37:return this.uint(t[1])&&this.string(t[2])&&this.uint(t[3]);case 38:return this.uint(t[1])&&this.uint(t[2]);case 39:return this.string(t[1])&&this.string(t[2])&&this.string(t[3])&&this.string(t[4])&&this.uint(t[5])&&this.uint(t[6])&&this.uint(t[7]);case 40:return this.string(t[1])&&this.uint(t[2])&&this.string(t[3])&&this.string(t[4]);case 41:return this.string(t[1])&&this.string(t[2]);case 42:return this.string(t[1]);case 44:return this.string(t[1])&&this.string(t[2])&&this.uint(t[3]);case 45:case 46:return this.string(t[1])&&this.string(t[2]);case 47:return this.string(t[1])&&this.string(t[2])&&this.uint(t[3]);case 48:return this.string(t[1])&&this.string(t[2])&&this.string(t[3])&&this.string(t[4]);case 49:return this.int(t[1])&&this.int(t[2])&&this.uint(t[3])&&this.uint(t[4]);case 50:return this.uint(t[1])&&this.string(t[2]);case 51:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3]);case 53:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3])&&this.uint(t[4])&&this.uint(t[5])&&this.uint(t[6])&&this.string(t[7])&&this.string(t[8]);case 54:return this.uint(t[1])&&this.string(t[2]);case 55:return this.boolean(t[1]);case 57:return this.uint(t[1])&&this.string(t[2])&&this.string(t[3])&&this.string(t[4]);case 58:return this.int(t[1]);case 59:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3])&&this.uint(t[4])&&this.string(t[5])&&this.string(t[6])&&this.string(t[7]);case 60:return this.uint(t[1])&&this.string(t[2])&&this.string(t[3])&&this.string(t[4]);case 61:return this.uint(t[1])&&this.string(t[2])&&this.string(t[3]);case 63:case 64:return this.string(t[1])&&this.string(t[2]);case 67:return this.uint(t[1])&&this.string(t[2])&&this.uint(t[3])&&this.string(t[4]);case 69:return this.uint(t[1])&&this.uint(t[2])&&this.string(t[3])&&this.string(t[4]);case 70:return this.uint(t[1])&&this.uint(t[2]);case 71:return this.uint(t[1])&&this.string(t[2])&&this.string(t[3]);case 73:return this.uint(t[1])&&this.string(t[2])&&this.uint(t[3])&&this.string(t[4]);case 75:case 76:case 77:return this.uint(t[1])&&this.uint(t[2]);case 78:return this.string(t[1])&&this.string(t[2])&&this.string(t[3])&&this.string(t[4]);case 79:return this.string(t[1])&&this.string(t[2]);case 81:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3])&&this.int(t[4])&&this.string(t[5]);case 82:return this.uint(t[1])&&this.uint(t[2]);case 83:return this.string(t[1])&&this.string(t[2])&&this.string(t[3])&&this.string(t[4])&&this.string(t[5])&&this.uint(t[6])&&this.uint(t[7])&&this.uint(t[8])&&this.uint(t[9]);case 112:return this.uint(t[1])&&this.string(t[2])&&this.boolean(t[3])&&this.string(t[4])&&this.int(t[5])&&this.int(t[6]);case 113:return this.uint(t[1])&&this.uint(t[2])&&this.string(t[3]);case 114:case 115:return this.uint(t[1]);case 116:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3])&&this.uint(t[4])&&this.uint(t[5])&&this.uint(t[6])&&this.string(t[7])&&this.string(t[8])&&this.uint(t[9])&&this.boolean(t[10]);case 117:case 118:return this.string(t[1])}}}class e{constructor(t,i,e,n,r){this.pageNo=t,this.timestamp=i,this.url=e,this.onBatch=n,this.tabId=r,this.nextIndex=0,this.beaconSize=2e5,this.encoder=new s(this.beaconSize),this.sizeBuffer=new Uint8Array(3),this.isEmpty=!0,this.beaconSizeLimit=1e6,this.prepare()}writeType(t){return this.encoder.uint(t[0])}writeFields(t){return this.encoder.encode(t)}writeSizeAt(t,i){for(let i=0;i<3;i++)this.sizeBuffer[i]=t>>8*i;this.encoder.set(this.sizeBuffer,i)}prepare(){if(!this.encoder.isEmpty)return;const t=[81,1,this.pageNo,this.nextIndex,this.timestamp,this.url],i=[118,this.tabId];this.writeType(t),this.writeFields(t),this.writeWithSize(i),this.isEmpty=!0}writeWithSize(t){const i=this.encoder;if(!this.writeType(t)||!i.skip(3))return!1;const s=i.getCurrentOffset(),e=this.writeFields(t);if(e){const e=i.getCurrentOffset()-s;if(e>16777215)return console.warn("OpenReplay: max message size overflow."),!1;this.writeSizeAt(e,s-3),i.checkpoint(),this.isEmpty=this.isEmpty&&0===t[0],this.nextIndex++}return e}setBeaconSizeLimit(t){this.beaconSizeLimit=t}writeMessage(t){0===t[0]&&(this.timestamp=t[1]),4===t[0]&&(this.url=t[1]),this.writeWithSize(t)||(this.finaliseBatch(),this.writeWithSize(t)||(this.encoder=new s(this.beaconSizeLimit),this.prepare(),this.writeWithSize(t)?this.finaliseBatch():console.warn("OpenReplay: beacon size overflow. Skipping large message.",t,this),this.encoder=new s(this.beaconSize),this.prepare()))}finaliseBatch(){if(this.isEmpty)return;const t=this.encoder.flush();this.onBatch(t),this.prepare()}clean(){this.encoder.reset()}}var n,r=function(t,i,s,e){return new(s||(s=Promise))((function(n,r){function h(t){try{o(e.next(t))}catch(t){r(t)}}function u(t){try{o(e.throw(t))}catch(t){r(t)}}function o(t){var i;t.done?n(t.value):(i=t.value,i instanceof s?i:new s((function(t){t(i)}))).then(h,u)}o((e=e.apply(t,i||[])).next())}))};!function(t){t[t.NotActive=0]="NotActive",t[t.Starting=1]="Starting",t[t.Stopping=2]="Stopping",t[t.Active=3]="Active",t[t.Stopped=4]="Stopped"}(n||(n={}));let h=null,u=null,o=n.NotActive;function a(){u&&u.finaliseBatch()}function c(){o=n.Stopping,null!==f&&(clearInterval(f),f=null),u&&(u.clean(),u=null),h&&(h.clean(),setTimeout(()=>{h=null},20)),setTimeout(()=>{o=n.NotActive},100)}function g(){o!==n.Stopped&&(postMessage("restart"),c())}let p,f=null;function l(){(function(t=30){return r(this,void 0,void 0,(function*(){if(!h||0===h.queue.length)return!0;const i=h.queue[h.queue.length-1];for(let s=0;s<t;s++){if(!h)return!0;if(!h.queue.includes(i))return!0;yield new Promise(t=>setTimeout(t,100))}return console.warn("OpenReplay: waitForNetworkCompletion - Network completion timeout reached. Some data may not have been sent."),!1}))})().then(t=>{postMessage({type:"force_flush_completed",success:t})}).catch(t=>{console.error("OpenReplay: postFlushMessageAfterNetworkCompletion - Error during network completion.",t),postMessage({type:"force_flush_completed",success:!1})})}self.onmessage=({data:i})=>{if(null!=i){if("stop"===i)return a(),c(),o=n.Stopped;if("forceFlushBatch"===i)return a(),void l();if(!Array.isArray(i)){if("compressed"===i.type){if(!h)return console.debug("WebWorker: sender not initialised. Compressed batch."),void g();h.sendCompressed(i.batch)}if("uncompressed"===i.type){if(!h)return console.debug("WebWorker: sender not initialised. Uncompressed batch."),void g();h.sendUncompressed(i.batch)}return"start"===i.type?(o=n.Starting,h=new t(i.ingestPoint,()=>{g()},t=>{!function(t){postMessage({type:"failure",reason:t}),c()}(t)},i.connAttemptCount,i.connAttemptGap,t=>{postMessage({type:"compress",batch:t},[t.buffer])}),u=new e(i.pageNo,i.timestamp,i.url,t=>h&&h.push(t),i.tabId),null===f&&(f=setInterval(a,1e4)),o=n.Active):"auth"===i.type?h?u?(h.authorise(i.token),void(i.beaconSizeLimit&&u.setBeaconSizeLimit(i.beaconSizeLimit))):(console.debug("WebWorker: writer not initialised. Received auth."),void g()):(console.debug("WebWorker: sender not initialised. Received auth."),void g()):void 0}if(null!==u){const t=u;i.forEach(i=>{55===i[0]&&(i[1]?p=setTimeout(()=>g(),18e5):clearTimeout(p)),t.writeMessage(i)})}u||(postMessage("not_init"),g())}else a()};'], { type: 'text/javascript' })));
            this.worker.onerror = (e) => {
                this._debug('webworker_error', e);
            };
            this.worker.onmessage = ({ data }) => {
                var _a;
                if (data === 'restart') {
                    this.stop(false);
                    void this.start({}, true);
                }
                else if (data === 'not_init') {
                    console.warn('WebWorker: writer not initialised. Restarting tracker');
                }
                else if (data.type === 'failure') {
                    this.stop(false);
                    this._debug('worker_failed', data.reason);
                }
                else if (data.type === 'force_flush_completed') {
                    this.forceFlushCompletedCallbacks.forEach((cb) => {
                        try {
                            cb(data.success);
                        }
                        catch (e) {
                            this._debug('force_flush_completed_callback_error', e);
                        }
                    });
                }
                else if (data.type === 'compress') {
                    const batch = data.batch;
                    const batchSize = batch.byteLength;
                    if (batchSize > this.compressionThreshold) {
                        gzip(data.batch, { mtime: 0 }, (err, result) => {
                            var _a;
                            if (err) {
                                console.error('Openreplay compression error:', err);
                                this.stop(false);
                                if (this.restartAttempts < 3) {
                                    this.restartAttempts += 1;
                                    void this.start({}, true);
                                }
                            }
                            // @ts-ignore
                            (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage({ type: 'compressed', batch: result });
                        });
                    }
                    else {
                        (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage({ type: 'uncompressed', batch: batch });
                    }
                }
            };
            const alertWorker = () => {
                if (this.worker) {
                    this.worker.postMessage(null);
                }
            };
            // keep better tactics, discard others?
            this.attachEventListener(window, 'beforeunload', alertWorker, false);
            this.attachEventListener(document.body, 'mouseleave', alertWorker, false, false);
            // TODO: stop session after inactivity timeout (make configurable)
            this.attachEventListener(document, 'visibilitychange', alertWorker, false);
        }
        catch (e) {
            this._debug('worker_start', e);
        }
        const thisTab = this.session.getTabId();
        const proto = {
            // ask if there are any tabs alive
            ask: 'never-gonna-give-you-up',
            // yes, there are someone out there
            resp: 'never-gonna-let-you-down',
            // you stole someone's identity
            reg: 'never-gonna-run-around-and-desert-you',
        };
        if (this.bc) {
            this.bc.postMessage({
                line: proto.ask,
                source: thisTab,
                context: this.contextId,
            });
        }
        if (this.bc !== null) {
            this.bc.onmessage = (ev) => {
                if (ev.data.context === this.contextId) {
                    return;
                }
                if (ev.data.line === proto.resp) {
                    const sessionToken = ev.data.token;
                    this.session.setSessionToken(sessionToken);
                }
                if (ev.data.line === proto.reg) {
                    const sessionToken = ev.data.token;
                    this.session.regenerateTabId();
                    this.session.setSessionToken(sessionToken);
                }
                if (ev.data.line === proto.ask) {
                    const token = this.session.getSessionToken();
                    if (token && this.bc) {
                        this.bc.postMessage({
                            line: ev.data.source === thisTab ? proto.reg : proto.resp,
                            token,
                            source: thisTab,
                            context: this.contextId,
                        });
                    }
                }
            };
        }
    }
    _debug(context, e) {
        if (this.options.__debug_report_edp !== null) {
            void fetch(this.options.__debug_report_edp, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    context,
                    // @ts-ignore
                    error: `${e}`,
                }),
            });
        }
        this.debug.error('OpenReplay error: ', context, e);
    }
    send(message, urgent = false) {
        if (this.activityState === ActivityState.NotActive) {
            return;
        }
        // === Back compatibility with Fetch/Axios plugins ===
        if (message[0] === 39 /* MType.Fetch */) {
            this._usingOldFetchPlugin = true;
            deprecationWarn('Fetch plugin', "'network' init option", '/installation/network-options');
            deprecationWarn('Axios plugin', "'network' init option", '/installation/network-options');
        }
        if (this._usingOldFetchPlugin && message[0] === 83 /* MType.NetworkRequest */) {
            return;
        }
        // ====================================================
        this.messages.push(message);
        // TODO: commit on start if there were `urgent` sends;
        // Clarify where urgent can be used for;
        // Clarify workflow for each type of message in case it was sent before start
        //      (like Fetch before start; maybe add an option "preCapture: boolean" or sth alike)
        // Careful: `this.delay` is equal to zero before start hense all Timestamp-s will have to be updated on start
        if (this.activityState === ActivityState.Active && urgent) {
            this.commit();
        }
    }
    commit() {
        if (this.worker && this.messages.length) {
            this.messages.unshift(TabData(this.session.getTabId()));
            this.messages.unshift(Timestamp(this.timestamp()));
            this.worker.postMessage(this.messages);
            this.commitCallbacks.forEach((cb) => cb(this.messages));
            this.messages.length = 0;
        }
    }
    timestamp() {
        return now() + this.delay;
    }
    safe(fn) {
        const app = this;
        return function (...args) {
            try {
                fn.apply(this, args);
            }
            catch (e) {
                app._debug('safe_fn_call', e);
                // time: this.timestamp(),
                // name: e.name,
                // message: e.message,
                // stack: e.stack
            }
        }; // TODO: correct typing
    }
    attachCommitCallback(cb) {
        this.commitCallbacks.push(cb);
    }
    attachStartCallback(cb, useSafe = false) {
        if (useSafe) {
            cb = this.safe(cb);
        }
        this.startCallbacks.push(cb);
    }
    attachStopCallback(cb, useSafe = false) {
        if (useSafe) {
            cb = this.safe(cb);
        }
        this.stopCallbacks.push(cb);
    }
    attachForceFlushCompletedCallback(cb, useSafe = false) {
        if (useSafe) {
            cb = this.safe(cb);
        }
        this.forceFlushCompletedCallbacks.push(cb);
    }
    // Use  app.nodes.attachNodeListener for registered nodes instead
    attachEventListener(target, type, listener, useSafe = true, useCapture = true) {
        if (useSafe) {
            listener = this.safe(listener);
        }
        this.attachStartCallback(() => target === null || target === void 0 ? void 0 : target.addEventListener(type, listener, useCapture), useSafe);
        this.attachStopCallback(() => target === null || target === void 0 ? void 0 : target.removeEventListener(type, listener, useCapture), useSafe);
    }
    // TODO: full correct semantic
    checkRequiredVersion(version) {
        const reqVer = version.split(/[.-]/);
        const ver = this.version.split(/[.-]/);
        for (let i = 0; i < 3; i++) {
            if (isNaN(Number(ver[i])) || isNaN(Number(reqVer[i]))) {
                return false;
            }
            if (Number(ver[i]) > Number(reqVer[i])) {
                return true;
            }
            if (Number(ver[i]) < Number(reqVer[i])) {
                return false;
            }
        }
        return true;
    }
    getTrackerInfo() {
        return {
            userUUID: this.localStorage.getItem(this.options.local_uuid_key),
            projectKey: this.projectKey,
            revID: this.revID,
            trackerVersion: this.version,
            isSnippet: this.options.__is_snippet,
        };
    }
    getSessionInfo() {
        return Object.assign(Object.assign({}, this.session.getInfo()), this.getTrackerInfo());
    }
    getSessionToken() {
        return this.session.getSessionToken();
    }
    getSessionID() {
        return this.session.getInfo().sessionID || undefined;
    }
    getSessionURL(options) {
        const { projectID, sessionID, timestamp } = this.session.getInfo();
        if (!projectID || !sessionID) {
            this.debug.error('OpenReplay error: Unable to build session URL');
            return undefined;
        }
        const ingest = this.options.ingestPoint;
        const isSaas = /api\.openreplay\.com/.test(ingest);
        const projectPath = isSaas ? 'https://app.openreplay.com/ingest' : ingest;
        const url = projectPath.replace(/ingest$/, `${projectID}/session/${sessionID}`);
        if (options === null || options === void 0 ? void 0 : options.withCurrentTime) {
            const jumpTo = now() - timestamp;
            return `${url}?jumpto=${jumpTo}`;
        }
        return url;
    }
    getHost() {
        return new URL(this.options.ingestPoint).host;
    }
    getProjectKey() {
        return this.projectKey;
    }
    getBaseHref() {
        var _a, _b;
        if (typeof this.options.resourceBaseHref === 'string') {
            return this.options.resourceBaseHref;
        }
        else if (typeof this.options.resourceBaseHref === 'object') {
            //TODO: switch between types
        }
        if (document.baseURI) {
            return document.baseURI;
        }
        // IE only
        return (((_b = (_a = document.head) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('base')[0]) === null || _b === void 0 ? void 0 : _b.getAttribute('href')) ||
            location.origin + location.pathname);
    }
    resolveResourceURL(resourceURL) {
        const base = new URL(this.getBaseHref());
        base.pathname += '/' + new URL(resourceURL).pathname;
        base.pathname.replace(/\/+/g, '/');
        return base.toString();
    }
    isServiceURL(url) {
        return url.startsWith(this.options.ingestPoint);
    }
    active() {
        return this.activityState === ActivityState.Active;
    }
    resetNextPageSession(flag) {
        if (flag) {
            this.sessionStorage.setItem(this.options.session_reset_key, 't');
        }
        else {
            this.sessionStorage.removeItem(this.options.session_reset_key);
        }
    }
    _start(startOpts = {}, resetByWorker = false) {
        if (!this.worker) {
            return Promise.resolve(UnsuccessfulStart('No worker found: perhaps, CSP is not set.'));
        }
        if (this.activityState !== ActivityState.NotActive) {
            return Promise.resolve(UnsuccessfulStart('OpenReplay: trying to call `start()` on the instance that has been started already.'));
        }
        this.activityState = ActivityState.Starting;
        adjustTimeOrigin();
        if (startOpts.sessionHash) {
            this.session.applySessionHash(startOpts.sessionHash);
        }
        if (startOpts.forceNew) {
            // Reset session metadata only if requested directly
            this.session.reset();
        }
        this.session.assign({
            // MBTODO: maybe it would make sense to `forceNew` if the `userID` was changed
            userID: startOpts.userID,
            metadata: startOpts.metadata,
        });
        const timestamp = now();
        this.worker.postMessage({
            type: 'start',
            pageNo: this.session.incPageNo(),
            ingestPoint: this.options.ingestPoint,
            timestamp,
            url: document.URL,
            connAttemptCount: this.options.connAttemptCount,
            connAttemptGap: this.options.connAttemptGap,
            tabId: this.session.getTabId(),
        });
        const lsReset = this.sessionStorage.getItem(this.options.session_reset_key) !== null;
        this.sessionStorage.removeItem(this.options.session_reset_key);
        const needNewSessionID = startOpts.forceNew || lsReset || resetByWorker;
        const sessionToken = this.session.getSessionToken();
        const isNewSession = needNewSessionID || !sessionToken;
        console.log('OpenReplay: starting session', needNewSessionID, sessionToken);
        return window
            .fetch(this.options.ingestPoint + '/v1/web/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.assign(Object.assign({}, this.getTrackerInfo()), { timestamp, userID: this.session.getInfo().userID, token: isNewSession ? undefined : sessionToken, deviceMemory,
                jsHeapSizeLimit, timezone: getTimezone() })),
        })
            .then((r) => {
            if (r.status === 200) {
                return r.json();
            }
            else {
                return r
                    .text()
                    .then((text) => text === CANCELED
                    ? Promise.reject(CANCELED)
                    : Promise.reject(`Server error: ${r.status}. ${text}`));
            }
        })
            .then((r) => {
            if (!this.worker) {
                return Promise.reject('no worker found after start request (this might not happen)');
            }
            if (this.activityState === ActivityState.NotActive) {
                return Promise.reject('Tracker stopped during authorization');
            }
            const { token, userUUID, projectID, beaconSizeLimit, compressionThreshold, // how big the batch should be before we decide to compress it
            delay, //  derived from token
            sessionID, //  derived from token
            startTimestamp, // real startTS (server time), derived from sessionID
            userBrowser, userCity, userCountry, userDevice, userOS, userState, } = r;
            if (typeof token !== 'string' ||
                typeof userUUID !== 'string' ||
                (typeof startTimestamp !== 'number' && typeof startTimestamp !== 'undefined') ||
                typeof sessionID !== 'string' ||
                typeof delay !== 'number' ||
                (typeof beaconSizeLimit !== 'number' && typeof beaconSizeLimit !== 'undefined')) {
                return Promise.reject(`Incorrect server response: ${JSON.stringify(r)}`);
            }
            this.delay = delay;
            this.session.setSessionToken(token);
            this.session.setUserInfo({
                userBrowser,
                userCity,
                userCountry,
                userDevice,
                userOS,
                userState,
            });
            this.session.assign({
                sessionID,
                timestamp: startTimestamp || timestamp,
                projectID,
            });
            if (!isNewSession && token === sessionToken) {
                console.log('continuing session on new tab', this.session.getTabId());
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                this.send(TabChange(this.session.getTabId()));
            }
            // (Re)send Metadata for the case of a new session
            Object.entries(this.session.getInfo().metadata).forEach(([key, value]) => this.send(Metadata(key, value)));
            this.localStorage.setItem(this.options.local_uuid_key, userUUID);
            this.worker.postMessage({
                type: 'auth',
                token,
                beaconSizeLimit,
            });
            this.compressionThreshold = compressionThreshold;
            const onStartInfo = { sessionToken: token, userUUID, sessionID };
            // TODO: start as early as possible (before receiving the token)
            this.startCallbacks.forEach((cb) => cb(onStartInfo)); // MBTODO: callbacks after DOM "mounted" (observed)
            this.observer.observe();
            this.ticker.start();
            this.activityState = ActivityState.Active;
            this.notify.log('OpenReplay tracking started.');
            // get rid of onStart ?
            if (typeof this.options.onStart === 'function') {
                this.options.onStart(onStartInfo);
            }
            this.restartAttempts = 0;
            return SuccessfulStart(onStartInfo);
        })
            .catch((reason) => {
            this.stop();
            this.session.reset();
            if (reason === CANCELED) {
                return UnsuccessfulStart(CANCELED);
            }
            this.notify.log('OpenReplay was unable to start. ', reason);
            this._debug('session_start', reason);
            return UnsuccessfulStart(START_ERROR);
        });
    }
    /**
     * basically we ask other tabs during constructor
     * and here we just apply 10ms delay just in case
     * */
    start(...args) {
        if (!document.hidden) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this._start(...args));
                }, 25);
            });
        }
        else {
            return new Promise((resolve) => {
                const onVisibilityChange = () => {
                    if (!document.hidden) {
                        document.removeEventListener('visibilitychange', onVisibilityChange);
                        setTimeout(() => {
                            resolve(this._start(...args));
                        }, 25);
                    }
                };
                document.addEventListener('visibilitychange', onVisibilityChange);
            });
        }
    }
    forceFlushBatch() {
        var _a;
        (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage('forceFlushBatch');
    }
    getTabId() {
        return this.session.getTabId();
    }
    stop(stopWorker = true) {
        if (this.activityState !== ActivityState.NotActive) {
            try {
                this.attributeSender.clear();
                this.sanitizer.clear();
                this.observer.disconnect();
                this.nodes.clear();
                this.ticker.stop();
                this.stopCallbacks.forEach((cb) => cb());
                this.notify.log('OpenReplay tracking stopped.');
                if (this.worker && stopWorker) {
                    this.worker.postMessage('stop');
                }
            }
            finally {
                this.activityState = ActivityState.NotActive;
            }
        }
    }
}
