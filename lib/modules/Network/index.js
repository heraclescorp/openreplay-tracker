import FetchProxy from './fetchProxy.js';
import XHRProxy from './xhrProxy.js';
const getWarning = (api) => console.warn(`Openreplay: Can't find ${api} in global context. 
If you're using serverside rendering in your app, make sure that tracker is loaded dynamically, otherwise ${api} won't be tracked.`);
export default function setProxy(context, ignoredHeaders, setSessionTokenHeader, sanitize, sendMessage, isServiceUrl, tokenUrlMatcher) {
    if (context.XMLHttpRequest) {
        context.XMLHttpRequest = XHRProxy.create(ignoredHeaders, setSessionTokenHeader, sanitize, sendMessage, isServiceUrl, tokenUrlMatcher);
    }
    else {
        getWarning('XMLHttpRequest');
    }
    if (context.fetch) {
        context.fetch = FetchProxy.create(ignoredHeaders, setSessionTokenHeader, sanitize, sendMessage, isServiceUrl, tokenUrlMatcher);
    }
    else {
        getWarning('fetch');
    }
}
