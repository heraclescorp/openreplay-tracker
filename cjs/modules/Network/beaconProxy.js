"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconProxyHandler = void 0;
const networkMessage_js_1 = require("./networkMessage.js");
const utils_js_1 = require("./utils.js");
// https://fetch.spec.whatwg.org/#concept-bodyinit-extract
const getContentType = (data) => {
    if (data instanceof Blob) {
        return data.type;
    }
    if (data instanceof FormData) {
        return 'multipart/form-data';
    }
    if (data instanceof URLSearchParams) {
        return 'application/x-www-form-urlencoded;charset=UTF-8';
    }
    return 'text/plain;charset=UTF-8';
};
class BeaconProxyHandler {
    constructor(ignoredHeaders, setSessionTokenHeader, sanitize, sendMessage, isServiceUrl) {
        this.ignoredHeaders = ignoredHeaders;
        this.setSessionTokenHeader = setSessionTokenHeader;
        this.sanitize = sanitize;
        this.sendMessage = sendMessage;
        this.isServiceUrl = isServiceUrl;
    }
    apply(target, thisArg, argsList) {
        const urlString = argsList[0];
        const data = argsList[1];
        const item = new networkMessage_js_1.default(this.ignoredHeaders, this.setSessionTokenHeader, this.sanitize);
        if (this.isServiceUrl(urlString)) {
            return target.apply(thisArg, argsList);
        }
        const url = (0, utils_js_1.getURL)(urlString);
        item.method = 'POST';
        item.url = urlString;
        item.name = (url.pathname.split('/').pop() || '') + url.search;
        item.requestType = 'beacon';
        item.requestHeader = { 'Content-Type': getContentType(data) };
        item.status = 0;
        item.statusText = 'Pending';
        if (url.search && url.searchParams) {
            item.getData = {};
            for (const [key, value] of url.searchParams) {
                item.getData[key] = value;
            }
        }
        item.requestData = (0, utils_js_1.genStringBody)(data);
        if (!item.startTime) {
            item.startTime = performance.now();
        }
        const isSuccess = target.apply(thisArg, argsList);
        if (isSuccess) {
            item.endTime = performance.now();
            item.duration = item.endTime - (item.startTime || item.endTime);
            item.status = 0;
            item.statusText = 'Sent';
            item.readyState = 4;
        }
        else {
            item.status = 500;
            item.statusText = 'Unknown';
        }
        this.sendMessage(item.getMessage());
        return isSuccess;
    }
}
exports.BeaconProxyHandler = BeaconProxyHandler;
class BeaconProxy {
    static hasSendBeacon() {
        return !!BeaconProxy.origSendBeacon;
    }
    static create(ignoredHeaders, setSessionTokenHeader, sanitize, sendMessage, isServiceUrl) {
        if (!BeaconProxy.hasSendBeacon()) {
            return undefined;
        }
        return new Proxy(BeaconProxy.origSendBeacon, new BeaconProxyHandler(ignoredHeaders, setSessionTokenHeader, sanitize, sendMessage, isServiceUrl));
    }
}
exports.default = BeaconProxy;
BeaconProxy.origSendBeacon = (_a = window === null || window === void 0 ? void 0 : window.navigator) === null || _a === void 0 ? void 0 : _a.sendBeacon;
