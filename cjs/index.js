"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizeLevel = exports.Messages = exports.App = void 0;
const index_js_1 = require("./app/index.js");
var index_js_2 = require("./app/index.js");
Object.defineProperty(exports, "App", { enumerable: true, get: function () { return index_js_2.default; } });
const messages_gen_js_1 = require("./app/messages.gen.js");
const _Messages = require("./app/messages.gen.js");
exports.Messages = _Messages;
var sanitizer_js_1 = require("./app/sanitizer.js");
Object.defineProperty(exports, "SanitizeLevel", { enumerable: true, get: function () { return sanitizer_js_1.SanitizeLevel; } });
const connection_js_1 = require("./modules/connection.js");
const console_js_1 = require("./modules/console.js");
const exception_js_1 = require("./modules/exception.js");
const img_js_1 = require("./modules/img.js");
const input_js_1 = require("./modules/input.js");
const mouse_js_1 = require("./modules/mouse.js");
const timing_js_1 = require("./modules/timing.js");
const performance_js_1 = require("./modules/performance.js");
const scroll_js_1 = require("./modules/scroll.js");
const viewport_js_1 = require("./modules/viewport.js");
const cssrules_js_1 = require("./modules/cssrules.js");
const focus_js_1 = require("./modules/focus.js");
const fonts_js_1 = require("./modules/fonts.js");
const network_js_1 = require("./modules/network.js");
const constructedStyleSheets_js_1 = require("./modules/constructedStyleSheets.js");
const selection_js_1 = require("./modules/selection.js");
const tabs_js_1 = require("./modules/tabs.js");
const utils_js_1 = require("./utils.js");
const featureFlags_js_1 = require("./modules/featureFlags.js");
const DOCS_SETUP = '/installation/javascript-sdk';
function processOptions(obj) {
    if (obj == null) {
        console.error(`OpenReplay: invalid options argument type. Please, check documentation on ${utils_js_1.DOCS_HOST}${DOCS_SETUP}`);
        return false;
    }
    if (typeof obj.projectKey !== 'string') {
        if (typeof obj.projectKey !== 'number') {
            if (typeof obj.projectID !== 'number') {
                // Back compatability
                console.error(`OpenReplay: projectKey is missing or wrong type (string is expected). Please, check ${utils_js_1.DOCS_HOST}${DOCS_SETUP} for more information.`);
                return false;
            }
            else {
                obj.projectKey = obj.projectID.toString();
                (0, utils_js_1.deprecationWarn)('`projectID` option', '`projectKey` option', DOCS_SETUP);
            }
        }
        else {
            console.warn('OpenReplay: projectKey is expected to have a string type.');
            obj.projectKey = obj.projectKey.toString();
        }
    }
    if (obj.sessionToken != null) {
        (0, utils_js_1.deprecationWarn)('`sessionToken` option', '`sessionHash` start() option', '/');
    }
    return true;
}
class API {
    constructor(options) {
        this.options = options;
        this.app = null;
        this.handleError = (e, metadata = {}) => {
            if (this.app === null) {
                return;
            }
            if (e instanceof Error) {
                const msg = (0, exception_js_1.getExceptionMessage)(e, [], metadata);
                this.app.send(msg);
            }
            else if (e instanceof ErrorEvent ||
                ('PromiseRejectionEvent' in window && e instanceof PromiseRejectionEvent)) {
                const msg = (0, exception_js_1.getExceptionMessageFromEvent)(e, undefined, metadata);
                if (msg != null) {
                    this.app.send(msg);
                }
            }
        };
        if (!utils_js_1.IN_BROWSER || !processOptions(options)) {
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
                : new index_js_1.default(options.projectKey, options.sessionToken, options));
        if (app !== null) {
            (0, viewport_js_1.default)(app);
            (0, cssrules_js_1.default)(app);
            (0, constructedStyleSheets_js_1.default)(app);
            (0, connection_js_1.default)(app);
            (0, console_js_1.default)(app, options);
            (0, exception_js_1.default)(app, options);
            (0, img_js_1.default)(app);
            (0, input_js_1.default)(app, options);
            (0, mouse_js_1.default)(app, options.mouse);
            (0, timing_js_1.default)(app, options);
            (0, performance_js_1.default)(app, options);
            (0, scroll_js_1.default)(app);
            (0, focus_js_1.default)(app);
            (0, fonts_js_1.default)(app);
            (0, network_js_1.default)(app, options.network);
            (0, selection_js_1.default)(app);
            (0, tabs_js_1.default)(app);
            this.featureFlags = new featureFlags_js_1.default(app);
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
            const orig = options.ingestPoint || index_js_1.DEFAULT_INGEST_POINT;
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
        if (!utils_js_1.IN_BROWSER) {
            console.error(`OpenReplay: you are trying to start Tracker on a node.js environment. If you want to use OpenReplay with SSR, please, use componentDidMount or useEffect API for placing the \`tracker.start()\` line. Check documentation on ${utils_js_1.DOCS_HOST}${DOCS_SETUP}`);
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
        (0, utils_js_1.deprecationWarn)("'sessionID' method", "'getSessionID' method", '/');
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
        (0, utils_js_1.deprecationWarn)("'userID' method", "'setUserID' method", '/');
        this.setUserID(id);
    }
    setUserAnonymousID(id) {
        if (typeof id === 'string' && this.app !== null) {
            this.app.send((0, messages_gen_js_1.UserAnonymousID)(id));
        }
    }
    userAnonymousID(id) {
        (0, utils_js_1.deprecationWarn)("'userAnonymousID' method", "'setUserAnonymousID' method", '/');
        this.setUserAnonymousID(id);
    }
    setMetadata(key, value) {
        if (typeof key === 'string' && typeof value === 'string' && this.app !== null) {
            this.app.session.setMetadata(key, value);
        }
    }
    metadata(key, value) {
        (0, utils_js_1.deprecationWarn)("'metadata' method", "'setMetadata' method", '/');
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
                this.app.send((0, messages_gen_js_1.CustomEvent)(key, payload));
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
            this.app.send((0, messages_gen_js_1.CustomIssue)(key, payload));
        }
    }
}
exports.default = API;
