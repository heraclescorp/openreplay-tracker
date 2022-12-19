"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_INGEST_POINT = void 0;
const messages_gen_js_1 = require("./messages.gen.js");
const utils_js_1 = require("../utils.js");
const nodes_js_1 = require("./nodes.js");
const top_observer_js_1 = require("./observer/top_observer.js");
const sanitizer_js_1 = require("./sanitizer.js");
const ticker_js_1 = require("./ticker.js");
const logger_js_1 = require("./logger.js");
const session_js_1 = require("./session.js");
const performance_js_1 = require("../modules/performance.js");
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
exports.DEFAULT_INGEST_POINT = 'https://api.openreplay.com/ingest';
class App {
    constructor(projectKey, sessionToken, options) {
        // if (options.onStart !== undefined) {
        //   deprecationWarn("'onStart' option", "tracker.start().then(/* handle session info */)")
        // } ?? maybe onStart is good
        var _a, _b;
        this.messages = [];
        this.startCallbacks = [];
        this.stopCallbacks = [];
        this.commitCallbacks = [];
        this.activityState = ActivityState.NotActive;
        this.version = '4.1.9'; // TODO: version compatability check inside each plugin.
        this.delay = 0;
        this.projectKey = projectKey;
        this.options = Object.assign({
            revID: '',
            node_id: '__openreplay_id',
            session_token_key: '__openreplay_token',
            session_pageno_key: '__openreplay_pageno',
            session_reset_key: '__openreplay_reset',
            local_uuid_key: '__openreplay_uuid',
            ingestPoint: exports.DEFAULT_INGEST_POINT,
            resourceBaseHref: null,
            verbose: false,
            __is_snippet: false,
            __debug_report_edp: null,
            localStorage: null,
            sessionStorage: null,
        }, options);
        this.revID = this.options.revID;
        this.localStorage = (_a = this.options.localStorage) !== null && _a !== void 0 ? _a : window.localStorage;
        this.sessionStorage = (_b = this.options.sessionStorage) !== null && _b !== void 0 ? _b : window.sessionStorage;
        this.sanitizer = new sanitizer_js_1.default(this, options);
        this.nodes = new nodes_js_1.default(this.options.node_id);
        this.observer = new top_observer_js_1.default(this, options);
        this.ticker = new ticker_js_1.default(this);
        this.ticker.attach(() => this.commit());
        this.debug = new logger_js_1.default(this.options.__debug__);
        this.notify = new logger_js_1.default(this.options.verbose ? logger_js_1.LogLevel.Warnings : logger_js_1.LogLevel.Silent);
        this.session = new session_js_1.default(this, this.options);
        this.session.attachUpdateCallback(({ userID, metadata }) => {
            if (userID != null) {
                // TODO: nullable userID
                this.send((0, messages_gen_js_1.UserID)(userID));
            }
            if (metadata != null) {
                Object.entries(metadata).forEach(([key, value]) => this.send((0, messages_gen_js_1.Metadata)(key, value)));
            }
        });
        // @depricated (use sessionHash on start instead)
        if (sessionToken != null) {
            this.session.applySessionHash(sessionToken);
        }
        try {
            this.worker = new Worker(URL.createObjectURL(new Blob(['"use strict";class t{constructor(t,i,s,e=10,n=1e3){this.onUnauthorised=i,this.onFailure=s,this.MAX_ATTEMPTS_COUNT=e,this.ATTEMPT_TIMEOUT=n,this.attemptsCount=0,this.busy=!1,this.queue=[],this.token=null,this.ingestURL=t+"/v1/web/i"}authorise(t){this.token=t}push(t){this.busy||!this.token?this.queue.push(t):this.sendBatch(t)}retry(t){this.attemptsCount>=this.MAX_ATTEMPTS_COUNT?this.onFailure(`Failed to send batch after ${this.attemptsCount} attempts.`):(this.attemptsCount++,setTimeout(()=>this.sendBatch(t),this.ATTEMPT_TIMEOUT*this.attemptsCount))}sendBatch(t){this.busy=!0,fetch(this.ingestURL,{body:t,method:"POST",headers:{Authorization:"Bearer "+this.token},keepalive:t.length<65536}).then(i=>{if(401===i.status)return this.busy=!1,void this.onUnauthorised();if(i.status>=400)return void this.retry(t);this.attemptsCount=0;const s=this.queue.shift();s?this.sendBatch(s):this.busy=!1}).catch(i=>{console.warn("OpenReplay:",i),this.retry(t)})}clean(){this.queue.length=0}}const i="function"==typeof TextEncoder?new TextEncoder:{encode(t){const i=t.length,s=new Uint8Array(3*i);let e=-1;for(let n=0,r=0,h=0;h!==i;){if(n=t.charCodeAt(h),h+=1,n>=55296&&n<=56319){if(h===i){s[e+=1]=239,s[e+=1]=191,s[e+=1]=189;break}if(r=t.charCodeAt(h),!(r>=56320&&r<=57343)){s[e+=1]=239,s[e+=1]=191,s[e+=1]=189;continue}if(n=1024*(n-55296)+r-56320+65536,h+=1,n>65535){s[e+=1]=240|n>>>18,s[e+=1]=128|n>>>12&63,s[e+=1]=128|n>>>6&63,s[e+=1]=128|63&n;continue}}n<=127?s[e+=1]=0|n:n<=2047?(s[e+=1]=192|n>>>6,s[e+=1]=128|63&n):(s[e+=1]=224|n>>>12,s[e+=1]=128|n>>>6&63,s[e+=1]=128|63&n)}return s.subarray(0,e+1)}};class s extends class{constructor(t){this.size=t,this.offset=0,this.checkpointOffset=0,this.data=new Uint8Array(t)}getCurrentOffset(){return this.offset}checkpoint(){this.checkpointOffset=this.offset}isEmpty(){return 0===this.offset}skip(t){return this.offset+=t,this.offset<=this.size}set(t,i){this.data.set(t,i)}boolean(t){return this.data[this.offset++]=+t,this.offset<=this.size}uint(t){for((t<0||t>Number.MAX_SAFE_INTEGER)&&(t=0);t>=128;)this.data[this.offset++]=t%256|128,t=Math.floor(t/128);return this.data[this.offset++]=t,this.offset<=this.size}int(t){return t=Math.round(t),this.uint(t>=0?2*t:-2*t-1)}string(t){const s=i.encode(t),e=s.byteLength;return!(!this.uint(e)||this.offset+e>this.size)&&(this.data.set(s,this.offset),this.offset+=e,!0)}reset(){this.offset=0,this.checkpointOffset=0}flush(){const t=this.data.slice(0,this.checkpointOffset);return this.reset(),t}}{encode(t){switch(t[0]){case 81:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3])&&this.int(t[4])&&this.string(t[5]);case 82:return this.uint(t[1])&&this.uint(t[2]);case 0:return this.uint(t[1]);case 4:return this.string(t[1])&&this.string(t[2])&&this.uint(t[3]);case 5:return this.uint(t[1])&&this.uint(t[2]);case 6:return this.int(t[1])&&this.int(t[2]);case 7:return!0;case 8:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3])&&this.string(t[4])&&this.boolean(t[5]);case 9:case 10:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3]);case 11:return this.uint(t[1]);case 12:return this.uint(t[1])&&this.string(t[2])&&this.string(t[3]);case 13:case 14:return this.uint(t[1])&&this.string(t[2]);case 16:return this.uint(t[1])&&this.int(t[2])&&this.int(t[3]);case 17:return this.uint(t[1])&&this.string(t[2]);case 18:return this.uint(t[1])&&this.string(t[2])&&this.int(t[3]);case 19:return this.uint(t[1])&&this.boolean(t[2]);case 20:return this.uint(t[1])&&this.uint(t[2]);case 22:return this.string(t[1])&&this.string(t[2]);case 23:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3])&&this.uint(t[4])&&this.uint(t[5])&&this.uint(t[6])&&this.uint(t[7])&&this.uint(t[8])&&this.uint(t[9]);case 24:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3]);case 25:return this.string(t[1])&&this.string(t[2])&&this.string(t[3]);case 27:return this.string(t[1])&&this.string(t[2]);case 28:case 29:return this.string(t[1]);case 30:return this.string(t[1])&&this.string(t[2]);case 37:return this.uint(t[1])&&this.string(t[2])&&this.uint(t[3]);case 38:return this.uint(t[1])&&this.uint(t[2]);case 39:return this.string(t[1])&&this.string(t[2])&&this.string(t[3])&&this.string(t[4])&&this.uint(t[5])&&this.uint(t[6])&&this.uint(t[7]);case 40:return this.string(t[1])&&this.uint(t[2])&&this.string(t[3])&&this.string(t[4]);case 41:return this.string(t[1])&&this.string(t[2]);case 42:return this.string(t[1]);case 44:return this.string(t[1])&&this.string(t[2])&&this.uint(t[3]);case 45:case 46:return this.string(t[1])&&this.string(t[2]);case 47:return this.string(t[1])&&this.string(t[2])&&this.uint(t[3]);case 48:return this.string(t[1])&&this.string(t[2])&&this.string(t[3])&&this.string(t[4]);case 49:return this.int(t[1])&&this.int(t[2])&&this.uint(t[3])&&this.uint(t[4]);case 53:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3])&&this.uint(t[4])&&this.uint(t[5])&&this.uint(t[6])&&this.string(t[7])&&this.string(t[8]);case 54:return this.uint(t[1])&&this.string(t[2]);case 55:return this.boolean(t[1]);case 57:return this.uint(t[1])&&this.string(t[2])&&this.string(t[3])&&this.string(t[4]);case 58:return this.int(t[1]);case 59:return this.uint(t[1])&&this.uint(t[2])&&this.uint(t[3])&&this.uint(t[4])&&this.string(t[5])&&this.string(t[6])&&this.string(t[7]);case 60:return this.uint(t[1])&&this.string(t[2])&&this.string(t[3])&&this.string(t[4]);case 61:return this.uint(t[1])&&this.string(t[2])&&this.string(t[3]);case 63:case 64:return this.string(t[1])&&this.string(t[2]);case 67:return this.uint(t[1])&&this.string(t[2])&&this.uint(t[3])&&this.string(t[4]);case 69:return this.uint(t[1])&&this.uint(t[2])&&this.string(t[3])&&this.string(t[4]);case 70:return this.uint(t[1])&&this.uint(t[2]);case 71:return this.uint(t[1])&&this.string(t[2])&&this.string(t[3]);case 73:return this.uint(t[1])&&this.string(t[2])&&this.uint(t[3])&&this.string(t[4]);case 75:case 76:case 77:return this.uint(t[1])&&this.uint(t[2]);case 79:return this.string(t[1])&&this.string(t[2]);case 78:return this.string(t[1])&&this.string(t[2])&&this.string(t[3])&&this.string(t[4])}}}class e{constructor(t,i,e,n){this.pageNo=t,this.timestamp=i,this.url=e,this.onBatch=n,this.nextIndex=0,this.beaconSize=2e5,this.encoder=new s(this.beaconSize),this.sizeBuffer=new Uint8Array(3),this.isEmpty=!0,this.beaconSizeLimit=1e6,this.prepare()}writeType(t){return this.encoder.uint(t[0])}writeFields(t){return this.encoder.encode(t)}writeSizeAt(t,i){for(let i=0;i<3;i++)this.sizeBuffer[i]=t>>8*i;this.encoder.set(this.sizeBuffer,i)}prepare(){if(!this.encoder.isEmpty())return;const t=[81,1,this.pageNo,this.nextIndex,this.timestamp,this.url];this.writeType(t),this.writeFields(t),this.isEmpty=!0}writeWithSize(t){const i=this.encoder;if(!this.writeType(t)||!i.skip(3))return!1;const s=i.getCurrentOffset(),e=this.writeFields(t);if(e){const e=i.getCurrentOffset()-s;if(e>16777215)return console.warn("OpenReplay: max message size overflow."),!1;this.writeSizeAt(e,s-3),i.checkpoint(),this.isEmpty=this.isEmpty&&0===t[0],this.nextIndex++}return e}setBeaconSizeLimit(t){this.beaconSizeLimit=t}writeMessage(t){if(0===t[0]&&(this.timestamp=t[1]),4===t[0]&&(this.url=t[1]),!this.writeWithSize(t))for(this.finaliseBatch();!this.writeWithSize(t);){if(this.beaconSize===this.beaconSizeLimit)return console.warn("OpenReplay: beacon size overflow. Skipping large message.",t,this),this.encoder.reset(),void this.prepare();this.beaconSize=Math.min(2*this.beaconSize,this.beaconSizeLimit),this.encoder=new s(this.beaconSize),this.prepare()}}finaliseBatch(){this.isEmpty||(this.onBatch(this.encoder.flush()),this.prepare())}clean(){this.encoder.reset()}}var n;!function(t){t[t.NotActive=0]="NotActive",t[t.Starting=1]="Starting",t[t.Stopping=2]="Stopping",t[t.Active=3]="Active"}(n||(n={}));let r=null,h=null;function u(){h&&h.finaliseBatch()}function a(){n.Stopping,null!==g&&(clearInterval(g),g=null),h&&(h.clean(),h=null),r&&(r.clean(),r=null),n.NotActive}function o(){postMessage("restart"),a()}n.NotActive;let c,g=null;self.onmessage=({data:i})=>{if(null!=i){if("stop"===i)return u(),void a();if(Array.isArray(i)){if(!h)throw new Error("WebWorker: writer not initialised. Service Should be Started.");const t=h;i.forEach(i=>{55===i[0]&&(i[1]?c=setTimeout(()=>o(),18e5):clearTimeout(c)),t.writeMessage(i)})}else{if("start"===i.type)return n.Starting,r=new t(i.ingestPoint,()=>{o()},t=>{!function(t){postMessage({type:"failure",reason:t}),a()}(t)},i.connAttemptCount,i.connAttemptGap),h=new e(i.pageNo,i.timestamp,i.url,t=>r&&r.push(t)),null===g&&(g=setInterval(u,1e4)),n.Active;if("auth"===i.type){if(!r)throw new Error("WebWorker: sender not initialised. Received auth.");if(!h)throw new Error("WebWorker: writer not initialised. Received auth.");return r.authorise(i.token),void(i.beaconSizeLimit&&h.setBeaconSizeLimit(i.beaconSizeLimit))}}}else u()};'], { type: 'text/javascript' })));
            this.worker.onerror = (e) => {
                this._debug('webworker_error', e);
            };
            this.worker.onmessage = ({ data }) => {
                if (data === 'restart') {
                    this.stop(false);
                    this.start({}, true);
                }
                else if (data.type === 'failure') {
                    this.stop(false);
                    this._debug('worker_failed', data.reason);
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
    }
    _debug(context, e) {
        if (this.options.__debug_report_edp !== null) {
            void fetch(this.options.__debug_report_edp, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    context,
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
            this.messages.unshift((0, messages_gen_js_1.Timestamp)(this.timestamp()));
            this.worker.postMessage(this.messages);
            this.commitCallbacks.forEach((cb) => cb(this.messages));
            this.messages.length = 0;
        }
    }
    timestamp() {
        return (0, utils_js_1.now)() + this.delay;
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
    getSessionURL() {
        const { projectID, sessionID } = this.session.getInfo();
        if (!projectID || !sessionID) {
            this.debug.error('OpenReplay error: Unable to build session URL');
            return undefined;
        }
        const ingest = this.options.ingestPoint;
        const isSaas = ingest === exports.DEFAULT_INGEST_POINT;
        const projectPath = isSaas ? ingest.replace('api', 'app') : ingest;
        return projectPath.replace(/ingest$/, `${projectID}/session/${sessionID}`);
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
        (0, utils_js_1.adjustTimeOrigin)();
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
        const timestamp = (0, utils_js_1.now)();
        this.worker.postMessage({
            type: 'start',
            pageNo: this.session.incPageNo(),
            ingestPoint: this.options.ingestPoint,
            timestamp,
            url: document.URL,
            connAttemptCount: this.options.connAttemptCount,
            connAttemptGap: this.options.connAttemptGap,
        });
        const lsReset = this.sessionStorage.getItem(this.options.session_reset_key) !== null;
        this.sessionStorage.removeItem(this.options.session_reset_key);
        const needNewSessionID = startOpts.forceNew || lsReset || resetByWorker;
        return window
            .fetch(this.options.ingestPoint + '/v1/web/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.assign(Object.assign({}, this.getTrackerInfo()), { timestamp, userID: this.session.getInfo().userID, token: needNewSessionID ? undefined : this.session.getSessionToken(), deviceMemory: performance_js_1.deviceMemory,
                jsHeapSizeLimit: performance_js_1.jsHeapSizeLimit })),
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
                return Promise.reject('Tracker stopped during authorisation');
            }
            const { token, userUUID, projectID, beaconSizeLimit, delay, //  derived from token
            sessionID, //  derived from token
            startTimestamp, // real startTS (server time), derived from sessionID
             } = r;
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
            this.session.assign({
                sessionID,
                timestamp: startTimestamp || timestamp,
                projectID,
            });
            // (Re)send Metadata for the case of a new session
            Object.entries(this.session.getInfo().metadata).forEach(([key, value]) => this.send((0, messages_gen_js_1.Metadata)(key, value)));
            this.localStorage.setItem(this.options.local_uuid_key, userUUID);
            this.worker.postMessage({
                type: 'auth',
                token,
                beaconSizeLimit,
            });
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
    start(...args) {
        if (!document.hidden) {
            return this._start(...args);
        }
        else {
            return new Promise((resolve) => {
                const onVisibilityChange = () => {
                    if (!document.hidden) {
                        document.removeEventListener('visibilitychange', onVisibilityChange);
                        resolve(this._start(...args));
                    }
                };
                document.addEventListener('visibilitychange', onVisibilityChange);
            });
        }
    }
    stop(stopWorker = true) {
        if (this.activityState !== ActivityState.NotActive) {
            try {
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
exports.default = App;
