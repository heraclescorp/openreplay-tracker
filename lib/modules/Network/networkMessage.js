import { NetworkRequest } from '../../app/messages.gen.js';
import { getTimeOrigin } from '../../utils.js';
export var RequestState;
(function (RequestState) {
    RequestState[RequestState["UNSENT"] = 0] = "UNSENT";
    RequestState[RequestState["OPENED"] = 1] = "OPENED";
    RequestState[RequestState["HEADERS_RECEIVED"] = 2] = "HEADERS_RECEIVED";
    RequestState[RequestState["LOADING"] = 3] = "LOADING";
    RequestState[RequestState["DONE"] = 4] = "DONE";
})(RequestState = RequestState || (RequestState = {}));
/**
 * I know we're not using most of the information from this class
 * but it can be useful in the future if we will decide to display more stuff in our ui
 * */
export default class NetworkMessage {
    constructor(ignoredHeaders = [], setSessionTokenHeader, sanitize) {
        this.ignoredHeaders = ignoredHeaders;
        this.setSessionTokenHeader = setSessionTokenHeader;
        this.sanitize = sanitize;
        this.id = '';
        this.name = '';
        this.method = '';
        this.url = '';
        this.status = 0;
        this.statusText = '';
        this.cancelState = 0;
        this.readyState = 0;
        this.header = {};
        this.responseType = '';
        this.requestHeader = {};
        this.responseSize = 0; // bytes
        this.responseSizeText = '';
        this.startTime = 0;
        this.endTime = 0;
        this.duration = 0;
        this.getData = {};
        this.requestData = null;
    }
    getMessage() {
        const { reqHs, resHs } = this.writeHeaders();
        const request = {
            headers: reqHs,
            body: this.method === 'GET' ? JSON.stringify(this.getData) : this.requestData,
        };
        const response = { headers: resHs, body: this.response };
        const messageInfo = this.sanitize({
            url: this.url,
            method: this.method,
            status: this.status,
            request,
            response,
        });
        return NetworkRequest(this.requestType, messageInfo.method, messageInfo.url, JSON.stringify(messageInfo.request), JSON.stringify(messageInfo.response), messageInfo.status, this.startTime + getTimeOrigin(), this.duration);
    }
    writeHeaders() {
        const reqHs = {};
        Object.entries(this.requestHeader).forEach(([key, value]) => {
            if (this.isHeaderIgnored(key))
                return;
            reqHs[key] = value;
        });
        this.setSessionTokenHeader((name, value) => {
            reqHs[name] = value;
        });
        const resHs = {};
        Object.entries(this.header).forEach(([key, value]) => {
            if (this.isHeaderIgnored(key))
                return;
            resHs[key] = value;
        });
        return { reqHs, resHs };
    }
    isHeaderIgnored(key) {
        if (Array.isArray(this.ignoredHeaders))
            return this.ignoredHeaders.includes(key);
        return this.ignoredHeaders;
    }
}
