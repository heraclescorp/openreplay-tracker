import { NetworkRequest } from '../app/messages.gen.js';
import { getTimeOrigin } from '../utils.js';
import axiosSpy from './axiosSpy.js';
import setProxy from './Network/index.js';
function getXHRRequestDataObject(xhr) {
    // @ts-ignore  this is 3x faster than using Map<XHR, XHRRequestData>
    if (!xhr.__or_req_data__) {
        // @ts-ignore
        xhr.__or_req_data__ = { body: undefined, headers: {} };
    }
    // @ts-ignore
    return xhr.__or_req_data__;
}
function strMethod(method) {
    return typeof method === 'string' ? method.toUpperCase() : 'GET';
}
export default function (app, opts = {}) {
    const options = Object.assign({
        failuresOnly: false,
        ignoreHeaders: ['Cookie', 'Set-Cookie', 'Authorization'],
        capturePayload: false,
        sessionTokenHeader: false,
        captureInIframes: true,
        axiosInstances: undefined,
        useProxy: false,
    }, opts);
    if (options.useProxy === false) {
        app.debug.warn('Network module is migrating to proxy api, to gradually migrate and test it set useProxy to true');
    }
    const ignoreHeaders = options.ignoreHeaders;
    const isHIgnored = Array.isArray(ignoreHeaders)
        ? (name) => ignoreHeaders.includes(name)
        : () => ignoreHeaders;
    const stHeader = options.sessionTokenHeader === true ? 'X-OpenReplay-SessionToken' : options.sessionTokenHeader;
    function setSessionTokenHeader(setRequestHeader) {
        if (stHeader) {
            const sessionToken = app.getSessionToken();
            if (sessionToken) {
                app.safe(setRequestHeader)(stHeader, sessionToken);
            }
        }
    }
    function sanitize(reqResInfo) {
        if (!options.capturePayload) {
            // @ts-ignore
            delete reqResInfo.request.body;
            delete reqResInfo.response.body;
        }
        if (options.sanitizer) {
            const resBody = reqResInfo.response.body;
            if (typeof resBody === 'string') {
                // Parse response in order to have handy view in sanitization function
                try {
                    reqResInfo.response.body = JSON.parse(resBody);
                }
                catch (_a) { }
            }
            return options.sanitizer(reqResInfo);
        }
        return reqResInfo;
    }
    function stringify(r) {
        if (r && typeof r.body !== 'string') {
            try {
                r.body = JSON.stringify(r.body);
            }
            catch (_a) {
                r.body = '<unable to stringify>';
                app.notify.warn("Openreplay fetch couldn't stringify body:", r.body);
            }
        }
        return JSON.stringify(r);
    }
    const patchWindow = (context) => {
        /* ====== modern way ====== */
        if (options.useProxy) {
            return setProxy(context, options.ignoreHeaders, setSessionTokenHeader, sanitize, (message) => app.send(message), (url) => app.isServiceURL(url), options.tokenUrlMatcher);
        }
        /* ====== Fetch ====== */
        const origFetch = context.fetch.bind(context);
        const trackFetch = (input, init = {}) => {
            if (!(typeof input === 'string' || input instanceof URL) || app.isServiceURL(String(input))) {
                return origFetch(input, init);
            }
            setSessionTokenHeader(function (name, value) {
                if (init.headers === undefined) {
                    init.headers = {};
                }
                if (init.headers instanceof Headers) {
                    init.headers.append(name, value);
                }
                else if (Array.isArray(init.headers)) {
                    init.headers.push([name, value]);
                }
                else {
                    init.headers[name] = value;
                }
            });
            const startTime = performance.now();
            return origFetch(input, init).then((response) => {
                const duration = performance.now() - startTime;
                if (options.failuresOnly && response.status < 400) {
                    return response;
                }
                const r = response.clone();
                r.text()
                    .then((text) => {
                    const reqHs = {};
                    const resHs = {};
                    if (ignoreHeaders !== true) {
                        // request headers
                        const writeReqHeader = ([n, v]) => {
                            if (!isHIgnored(n)) {
                                reqHs[n] = v;
                            }
                        };
                        if (init.headers instanceof Headers) {
                            init.headers.forEach((v, n) => writeReqHeader([n, v]));
                        }
                        else if (Array.isArray(init.headers)) {
                            init.headers.forEach(writeReqHeader);
                        }
                        else if (typeof init.headers === 'object') {
                            Object.entries(init.headers).forEach(writeReqHeader);
                        }
                        // response headers
                        r.headers.forEach((v, n) => {
                            if (!isHIgnored(n))
                                resHs[n] = v;
                        });
                    }
                    const method = strMethod(init.method);
                    const reqResInfo = sanitize({
                        url: String(input),
                        method,
                        status: r.status,
                        request: {
                            headers: reqHs,
                            // @ts-ignore
                            body: init.body || null,
                        },
                        response: {
                            headers: resHs,
                            body: text,
                        },
                    });
                    if (!reqResInfo) {
                        return;
                    }
                    app.send(NetworkRequest('fetch', method, String(reqResInfo.url), stringify(reqResInfo.request), stringify(reqResInfo.response), r.status, startTime + getTimeOrigin(), duration));
                })
                    .catch((e) => app.debug.error('Could not process Fetch response:', e));
                return response;
            });
        };
        context.fetch = trackFetch;
        /* ====== <> ====== */
        /* ====== XHR ====== */
        const nativeOpen = context.XMLHttpRequest.prototype.open;
        const nativeSetRequestHeader = context.XMLHttpRequest.prototype.setRequestHeader;
        const nativeSend = context.XMLHttpRequest.prototype.send;
        function trackXMLHttpReqOpen(initMethod, url) {
            const xhr = this;
            setSessionTokenHeader((name, value) => xhr.setRequestHeader(name, value));
            let startTime = 0;
            xhr.addEventListener('loadstart', (e) => {
                startTime = e.timeStamp;
            });
            xhr.addEventListener('load', app.safe((e) => {
                const { headers: reqHs, body: reqBody } = getXHRRequestDataObject(xhr);
                const duration = startTime > 0 ? e.timeStamp - startTime : 0;
                const hString = xhr.getAllResponseHeaders() || ''; // might be null (only if no response received though)
                const headersArr = hString.trim().split(/[\r\n]+/);
                const headerMap = {};
                headersArr.forEach(function (line) {
                    const parts = line.split(': ');
                    const header = parts.shift();
                    if (!isHIgnored(header)) {
                        headerMap[header] = parts.join(': ');
                    }
                });
                const method = strMethod(initMethod);
                const reqResInfo = sanitize({
                    url: String(url),
                    method,
                    status: xhr.status,
                    request: {
                        headers: reqHs,
                        // @ts-ignore
                        body: reqBody || null,
                    },
                    response: {
                        headers: headerMap,
                        body: xhr.response,
                    },
                });
                if (!reqResInfo) {
                    return;
                }
                app.send(NetworkRequest('xhr', method, String(reqResInfo.url), stringify(reqResInfo.request), stringify(reqResInfo.response), xhr.status, startTime + getTimeOrigin(), duration));
            }));
            //TODO: handle error (though it has no Error API nor any useful information)
            //xhr.addEventListener('error', (e) => {})
            return nativeOpen.apply(this, arguments);
        }
        function trackXHRSend(body) {
            const rdo = getXHRRequestDataObject(this);
            rdo.body = body;
            // @ts-ignore ??? this -> XMLHttpRequest
            return nativeSend.apply(this, arguments);
        }
        function trackSetReqHeader(name, value) {
            if (!isHIgnored(name)) {
                const rdo = getXHRRequestDataObject(this);
                rdo.headers[name] = value;
            }
            return nativeSetRequestHeader.apply(this, arguments);
        }
        if (!options.axiosInstances) {
            context.XMLHttpRequest.prototype.open = trackXMLHttpReqOpen;
            context.XMLHttpRequest.prototype.send = trackXHRSend;
            context.XMLHttpRequest.prototype.setRequestHeader = trackSetReqHeader;
        }
        /* ====== <> ====== */
    };
    patchWindow(window);
    if (options.axiosInstances) {
        options.axiosInstances.forEach((axiosInstance) => {
            axiosSpy(app, axiosInstance, options, sanitize, stringify);
        });
    }
    if (options.captureInIframes) {
        app.observer.attachContextCallback(app.safe(patchWindow));
    }
}
