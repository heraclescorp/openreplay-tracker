import App, { DEFAULT_INGEST_POINT } from './app/index.js';
export { default as App } from './app/index.js';
import { UserAnonymousID, CustomEvent, CustomIssue } from './app/messages.gen.js';
import * as _Messages from './app/messages.gen.js';
export const Messages = _Messages;
export { SanitizeLevel } from './app/sanitizer.js';
import Connection from './modules/connection.js';
import Console from './modules/console.js';
import Exception, { getExceptionMessageFromEvent, getExceptionMessage, } from './modules/exception.js';
import Img from './modules/img.js';
import Input from './modules/input.js';
import Mouse from './modules/mouse.js';
import Timing from './modules/timing.js';
import Performance from './modules/performance.js';
import Scroll from './modules/scroll.js';
import Viewport from './modules/viewport.js';
import CSSRules from './modules/cssrules.js';
import Focus from './modules/focus.js';
import Fonts from './modules/fonts.js';
import Network from './modules/network.js';
import ConstructedStyleSheets from './modules/constructedStyleSheets.js';
import Selection from './modules/selection.js';
import Tabs from './modules/tabs.js';
import { IN_BROWSER, deprecationWarn, DOCS_HOST } from './utils.js';
import FeatureFlags from './modules/featureFlags.js';
const DOCS_SETUP = '/installation/javascript-sdk';
function processOptions(obj) {
    if (obj == null) {
        console.error(`OpenReplay: invalid options argument type. Please, check documentation on ${DOCS_HOST}${DOCS_SETUP}`);
        return false;
    }
    if (typeof obj.projectKey !== 'string') {
        if (typeof obj.projectKey !== 'number') {
            if (typeof obj.projectID !== 'number') {
                // Back compatability
                console.error(`OpenReplay: projectKey is missing or wrong type (string is expected). Please, check ${DOCS_HOST}${DOCS_SETUP} for more information.`);
                return false;
            }
            else {
                obj.projectKey = obj.projectID.toString();
                deprecationWarn('`projectID` option', '`projectKey` option', DOCS_SETUP);
            }
        }
        else {
            console.warn('OpenReplay: projectKey is expected to have a string type.');
            obj.projectKey = obj.projectKey.toString();
        }
    }
    if (obj.sessionToken != null) {
        deprecationWarn('`sessionToken` option', '`sessionHash` start() option', '/');
    }
    return true;
}
export default class API {
    constructor(options) {
        this.options = options;
        this.app = null;
        this.handleError = (e, metadata = {}) => {
            if (this.app === null) {
                return;
            }
            if (e instanceof Error) {
                const msg = getExceptionMessage(e, [], metadata);
                this.app.send(msg);
            }
            else if (e instanceof ErrorEvent ||
                ('PromiseRejectionEvent' in window && e instanceof PromiseRejectionEvent)) {
                const msg = getExceptionMessageFromEvent(e, undefined, metadata);
                if (msg != null) {
                    this.app.send(msg);
                }
            }
        };
        if (!IN_BROWSER || !processOptions(options)) {
            return;
        }
        if (window.__OPENREPLAY__) {
            console.error('OpenReplay: one tracker instance has been initialised already');
            return;
        }
        if (!options.__DISABLE_SECURE_MODE && location.protocol !== 'https:') {
            console.error('OpenReplay: Your website must be publicly accessible and running on SSL in order for OpenReplay to properly capture and replay the user session. You can disable this check by setting `__DISABLE_SECURE_MODE` option to `true` if you are testing in localhost. Keep in mind, that asset files on a local machine are not available to the outside world. This might affect tracking if you use css files.');
            return;
        }
        const doNotTrack = options.respectDoNotTrack &&
            (navigator.doNotTrack == '1' ||
                // @ts-ignore
                window.doNotTrack == '1');
        const app = (this.app =
            doNotTrack ||
                !('Map' in window) ||
                !('Set' in window) ||
                !('MutationObserver' in window) ||
                !('performance' in window) ||
                !('timing' in performance) ||
                !('startsWith' in String.prototype) ||
                !('Blob' in window) ||
                !('Worker' in window)
                ? null
                : new App(options.projectKey, options.sessionToken, options));
        if (app !== null) {
            Viewport(app);
            CSSRules(app);
            ConstructedStyleSheets(app);
            Connection(app);
            Console(app, options);
            Exception(app, options);
            Img(app);
            Input(app, options);
            Mouse(app, options.mouse);
            Timing(app, options);
            Performance(app, options);
            Scroll(app);
            Focus(app);
            Fonts(app);
            Network(app, options.network);
            Selection(app);
            Tabs(app);
            this.featureFlags = new FeatureFlags(app);
            window.__OPENREPLAY__ = this;
            app.attachStartCallback(() => {
                var _a;
                if ((_a = options.flags) === null || _a === void 0 ? void 0 : _a.onFlagsLoad) {
                    this.onFlagsLoad(options.flags.onFlagsLoad);
                }
                void this.featureFlags.reloadFlags();
            });
            const wOpen = window.open;
            if (options.autoResetOnWindowOpen || options.resetTabOnWindowOpen) {
                app.attachStartCallback(() => {
                    var _a;
                    const tabId = app.getTabId();
                    const sessStorage = (_a = app.sessionStorage) !== null && _a !== void 0 ? _a : window.sessionStorage;
                    // @ts-ignore ?
                    window.open = function (...args) {
                        if (options.autoResetOnWindowOpen) {
                            app.resetNextPageSession(true);
                        }
                        if (options.resetTabOnWindowOpen) {
                            sessStorage.removeItem(options.session_tabid_key || '__openreplay_tabid');
                        }
                        wOpen.call(window, ...args);
                        app.resetNextPageSession(false);
                        sessStorage.setItem(options.session_tabid_key || '__openreplay_tabid', tabId);
                    };
                });
                app.attachStopCallback(() => {
                    window.open = wOpen;
                });
            }
        }
        else {
            console.log("OpenReplay: browser doesn't support API required for tracking or doNotTrack is set to 1.");
            const req = new XMLHttpRequest();
            const orig = options.ingestPoint || DEFAULT_INGEST_POINT;
            req.open('POST', orig + '/v1/web/not-started');
            // no-cors issue only with text/plain or not-set Content-Type
            // req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            req.send(JSON.stringify({
                trackerVersion: '9.0.12',
                projectKey: options.projectKey,
                doNotTrack,
                // TODO: add precise reason (an exact API missing)
            }));
        }
    }
    isFlagEnabled(flagName) {
        return this.featureFlags.isFlagEnabled(flagName);
    }
    onFlagsLoad(callback) {
        this.featureFlags.onFlagsLoad(callback);
    }
    clearPersistFlags() {
        this.featureFlags.clearPersistFlags();
    }
    reloadFlags() {
        return this.featureFlags.reloadFlags();
    }
    getFeatureFlag(flagName) {
        return this.featureFlags.getFeatureFlag(flagName);
    }
    getAllFeatureFlags() {
        return this.featureFlags.flags;
    }
    use(fn) {
        return fn(this.app, this.options);
    }
    isActive() {
        if (this.app === null) {
            return false;
        }
        return this.app.active();
    }
    start(startOpts) {
        if (!IN_BROWSER) {
            console.error(`OpenReplay: you are trying to start Tracker on a node.js environment. If you want to use OpenReplay with SSR, please, use componentDidMount or useEffect API for placing the \`tracker.start()\` line. Check documentation on ${DOCS_HOST}${DOCS_SETUP}`);
            return Promise.reject('Trying to start not in browser.');
        }
        if (this.app === null) {
            return Promise.reject("Browser doesn't support required api, or doNotTrack is active.");
        }
        // TODO: check argument type
        return this.app.start(startOpts);
    }
    stop() {
        if (this.app === null) {
            return;
        }
        this.app.stop();
        return this.app.session.getSessionHash();
    }
    forceFlushBatch(callback) {
        if (this.app === null) {
            return;
        }
        if (callback) {
            this.app.attachForceFlushCompletedCallback(callback);
        }
        this.app.forceFlushBatch();
    }
    getSessionToken() {
        if (this.app === null) {
            return null;
        }
        return this.app.getSessionToken();
    }
    getSessionID() {
        if (this.app === null) {
            return null;
        }
        return this.app.getSessionID();
    }
    getTabId() {
        if (this.app === null) {
            return null;
        }
        return this.app.getTabId();
    }
    sessionID() {
        deprecationWarn("'sessionID' method", "'getSessionID' method", '/');
        return this.getSessionID();
    }
    getSessionURL(options) {
        if (this.app === null) {
            return undefined;
        }
        return this.app.getSessionURL(options);
    }
    setUserID(id) {
        if (typeof id === 'string' && this.app !== null) {
            this.app.session.setUserID(id);
        }
    }
    userID(id) {
        deprecationWarn("'userID' method", "'setUserID' method", '/');
        this.setUserID(id);
    }
    setUserAnonymousID(id) {
        if (typeof id === 'string' && this.app !== null) {
            this.app.send(UserAnonymousID(id));
        }
    }
    userAnonymousID(id) {
        deprecationWarn("'userAnonymousID' method", "'setUserAnonymousID' method", '/');
        this.setUserAnonymousID(id);
    }
    setMetadata(key, value) {
        if (typeof key === 'string' && typeof value === 'string' && this.app !== null) {
            this.app.session.setMetadata(key, value);
        }
    }
    metadata(key, value) {
        deprecationWarn("'metadata' method", "'setMetadata' method", '/');
        this.setMetadata(key, value);
    }
    event(key, payload = null, issue = false) {
        if (typeof key === 'string' && this.app !== null) {
            if (issue) {
                return this.issue(key, payload);
            }
            else {
                try {
                    payload = JSON.stringify(payload);
                }
                catch (e) {
                    return;
                }
                this.app.send(CustomEvent(key, payload));
            }
        }
    }
    issue(key, payload = null) {
        if (typeof key === 'string' && this.app !== null) {
            try {
                payload = JSON.stringify(payload);
            }
            catch (e) {
                return;
            }
            this.app.send(CustomIssue(key, payload));
        }
    }
}
