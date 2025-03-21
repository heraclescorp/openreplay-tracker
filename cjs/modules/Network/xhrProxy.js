"use strict";
/**
 * I took inspiration in few stack exchange posts
 * and Tencent vConsole library (MIT)
 * by wrapping the XMLHttpRequest object in a Proxy
 * we can intercept the network requests
 * in not-so-hacky way
 * */
Object.defineProperty(exports, "__esModule", { value: true });
exports.XHRProxyHandler = void 0;
const networkMessage_js_1 = require("./networkMessage.js");
const utils_js_1 = require("./utils.js");
class XHRProxyHandler {
    constructor(XMLReq, ignoredHeaders, setSessionTokenHeader, sanitize, sendMessage, isServiceUrl, tokenUrlMatcher) {
        this.ignoredHeaders = ignoredHeaders;
        this.setSessionTokenHeader = setSessionTokenHeader;
        this.sanitize = sanitize;
        this.sendMessage = sendMessage;
        this.isServiceUrl = isServiceUrl;
        this.tokenUrlMatcher = tokenUrlMatcher;
        this.XMLReq = XMLReq;
        this.XMLReq.onreadystatechange = () => {
            this.onReadyStateChange();
        };
        this.XMLReq.onabort = () => {
            this.onAbort();
        };
        this.XMLReq.ontimeout = () => {
            this.onTimeout();
        };
        this.item = new networkMessage_js_1.default(ignoredHeaders, setSessionTokenHeader, sanitize);
        this.item.requestType = 'xhr';
    }
    get(target, key) {
        switch (key) {
            case 'open':
                return this.getOpen(target);
            case 'send':
                this.setSessionTokenHeader((name, value) => {
                    if (this.tokenUrlMatcher !== undefined) {
                        if (!this.tokenUrlMatcher(this.item.url)) {
                            return;
                        }
                    }
                    target.setRequestHeader(name, value);
                });
                return this.getSend(target);
            case 'setRequestHeader':
                return this.getSetRequestHeader(target);
            default:
                // eslint-disable-next-line no-case-declarations
                const value = Reflect.get(target, key);
                if (typeof value === 'function') {
                    return value.bind(target);
                }
                else {
                    return value;
                }
        }
    }
    set(target, key, value) {
        switch (key) {
            case 'onreadystatechange':
                return this.setOnReadyStateChange(target, key, value);
            case 'onabort':
                return this.setOnAbort(target, key, value);
            case 'ontimeout':
                return this.setOnTimeout(target, key, value);
            default:
            // not tracked methods
        }
        return Reflect.set(target, key, value);
    }
    onReadyStateChange() {
        if (this.item.url && this.isServiceUrl(this.item.url))
            return;
        this.item.readyState = this.XMLReq.readyState;
        this.item.responseType = this.XMLReq.responseType;
        this.item.endTime = performance.now();
        this.item.duration = this.item.endTime - this.item.startTime;
        this.updateItemByReadyState();
        setTimeout(() => {
            this.item.response = (0, utils_js_1.getStringResponseByType)(this.item.responseType, this.item.response);
        }, 0);
        if (this.XMLReq.readyState === networkMessage_js_1.RequestState.DONE) {
            this.sendMessage(this.item.getMessage());
        }
    }
    onAbort() {
        this.item.cancelState = 1;
        this.item.statusText = 'Abort';
        this.sendMessage(this.item.getMessage());
    }
    onTimeout() {
        this.item.cancelState = 3;
        this.item.statusText = 'Timeout';
        this.sendMessage(this.item.getMessage());
    }
    getOpen(target) {
        const targetFunction = Reflect.get(target, 'open');
        return (...args) => {
            const method = args[0];
            const url = args[1];
            this.item.method = method ? method.toUpperCase() : 'GET';
            this.item.url = url || '';
            this.item.name = this.item.url.replace(new RegExp('/*$'), '').split('/').pop() || '';
            this.item.getData = (0, utils_js_1.genGetDataByUrl)(this.item.url, {});
            return targetFunction.apply(target, args);
        };
    }
    getSend(target) {
        const targetFunction = Reflect.get(target, 'send');
        return (...args) => {
            const data = args[0];
            this.item.requestData = (0, utils_js_1.genStringBody)(data);
            return targetFunction.apply(target, args);
        };
    }
    getSetRequestHeader(target) {
        const targetFunction = Reflect.get(target, 'setRequestHeader');
        return (...args) => {
            if (!this.item.requestHeader) {
                this.item.requestHeader = {};
            }
            // @ts-ignore
            this.item.requestHeader[args[0]] = args[1];
            return targetFunction.apply(target, args);
        };
    }
    setOnReadyStateChange(target, key, orscFunction) {
        return Reflect.set(target, key, (...args) => {
            this.onReadyStateChange();
            orscFunction.apply(target, args);
        });
    }
    setOnAbort(target, key, oaFunction) {
        return Reflect.set(target, key, (...args) => {
            this.onAbort();
            oaFunction.apply(target, args);
        });
    }
    setOnTimeout(target, key, otFunction) {
        return Reflect.set(target, key, (...args) => {
            this.onTimeout();
            otFunction.apply(target, args);
        });
    }
    /**
     * Update item's properties according to readyState.
     */
    updateItemByReadyState() {
        switch (this.XMLReq.readyState) {
            case networkMessage_js_1.RequestState.UNSENT:
            case networkMessage_js_1.RequestState.OPENED:
                this.item.status = networkMessage_js_1.RequestState.UNSENT;
                this.item.statusText = 'Pending';
                if (!this.item.startTime) {
                    this.item.startTime = performance.now();
                }
                break;
            case networkMessage_js_1.RequestState.HEADERS_RECEIVED:
                this.item.status = this.XMLReq.status;
                this.item.statusText = 'Loading';
                this.item.header = {};
                // eslint-disable-next-line no-case-declarations
                const header = this.XMLReq.getAllResponseHeaders() || '', headerArr = header.split('\n');
                // extract plain text to key-value format
                for (let i = 0; i < headerArr.length; i++) {
                    const line = headerArr[i];
                    if (!line) {
                        continue;
                    }
                    const arr = line.split(': ');
                    const key = arr[0];
                    this.item.header[key] = arr.slice(1).join(': ');
                }
                break;
            case networkMessage_js_1.RequestState.LOADING:
                this.item.status = this.XMLReq.status;
                this.item.statusText = 'Loading';
                if (!!this.XMLReq.response && this.XMLReq.response.length) {
                    this.item.responseSize = this.XMLReq.response.length;
                    this.item.responseSizeText = (0, utils_js_1.formatByteSize)(this.item.responseSize);
                }
                break;
            case networkMessage_js_1.RequestState.DONE:
                // `XMLReq.abort()` will change `status` from 200 to 0, so use previous value in this case
                this.item.status = this.XMLReq.status || this.item.status || 0;
                // show status code when request completed
                this.item.statusText = String(this.item.status);
                this.item.endTime = performance.now();
                this.item.duration = this.item.endTime - (this.item.startTime || this.item.endTime);
                this.item.response = this.XMLReq.response;
                if (!!this.XMLReq.response && this.XMLReq.response.length) {
                    this.item.responseSize = this.XMLReq.response.length;
                    this.item.responseSizeText = (0, utils_js_1.formatByteSize)(this.item.responseSize);
                }
                break;
            default:
                this.item.status = this.XMLReq.status;
                this.item.statusText = 'Unknown';
                break;
        }
    }
}
exports.XHRProxyHandler = XHRProxyHandler;
class XHRProxy {
    static create(ignoredHeaders, setSessionTokenHeader, sanitize, sendMessage, isServiceUrl, tokenUrlMatcher) {
        return new Proxy(XMLHttpRequest, {
            construct(original) {
                const XMLReq = new original();
                return new Proxy(XMLReq, new XHRProxyHandler(XMLReq, ignoredHeaders, setSessionTokenHeader, sanitize, sendMessage, isServiceUrl, tokenUrlMatcher));
            },
        });
    }
}
exports.default = XHRProxy;
XHRProxy.origXMLHttpRequest = XMLHttpRequest;
