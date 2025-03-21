"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchProxy_js_1 = require("./fetchProxy.js");
const xhrProxy_js_1 = require("./xhrProxy.js");
const getWarning = (api) => console.warn(`Openreplay: Can't find ${api} in global context. 
If you're using serverside rendering in your app, make sure that tracker is loaded dynamically, otherwise ${api} won't be tracked.`);
function setProxy(context, ignoredHeaders, setSessionTokenHeader, sanitize, sendMessage, isServiceUrl, tokenUrlMatcher) {
    if (context.XMLHttpRequest) {
        context.XMLHttpRequest = xhrProxy_js_1.default.create(ignoredHeaders, setSessionTokenHeader, sanitize, sendMessage, isServiceUrl, tokenUrlMatcher);
    }
    else {
        getWarning('XMLHttpRequest');
    }
    if (context.fetch) {
        context.fetch = fetchProxy_js_1.default.create(ignoredHeaders, setSessionTokenHeader, sanitize, sendMessage, isServiceUrl, tokenUrlMatcher);
    }
    else {
        getWarning('fetch');
    }
}
exports.default = setProxy;
