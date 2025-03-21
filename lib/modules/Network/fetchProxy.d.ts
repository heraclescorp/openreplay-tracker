/**
 * I took inspiration in few stack exchange posts
 * and Tencent vConsole library (MIT)
 * by wrapping the XMLHttpRequest object in a Proxy
 * we can intercept the network requests
 * in not-so-hacky way
 * */
import NetworkMessage from './networkMessage.js';
import { RequestResponseData } from './types.js';
import { NetworkRequest } from '../../common/messages.gen.js';
export declare class ResponseProxyHandler<T extends Response> implements ProxyHandler<T> {
    resp: Response;
    item: NetworkMessage;
    constructor(resp: T, item: NetworkMessage);
    set(target: T, key: string, value: (args: any[]) => any): boolean;
    get(target: T, key: string): any;
    protected mockReader(): void;
}
export declare class FetchProxyHandler<T extends typeof fetch> implements ProxyHandler<T> {
    private readonly ignoredHeaders;
    private readonly setSessionTokenHeader;
    private readonly sanitize;
    private readonly sendMessage;
    private readonly isServiceUrl;
    private readonly tokenUrlMatcher?;
    constructor(ignoredHeaders: boolean | string[], setSessionTokenHeader: (cb: (name: string, value: string) => void) => void, sanitize: (data: RequestResponseData) => RequestResponseData, sendMessage: (item: NetworkRequest) => void, isServiceUrl: (url: string) => boolean, tokenUrlMatcher?: ((url: string) => boolean) | undefined);
    apply(target: T, _: typeof window, argsList: [RequestInfo | URL, RequestInit]): any;
    protected beforeFetch(item: NetworkMessage, input: RequestInfo, init?: RequestInit): void;
    protected afterFetch(item: NetworkMessage): (resp: Response) => Response;
    protected handleResponseBody(resp: Response, item: NetworkMessage): Promise<string> | Promise<ArrayBuffer>;
}
export default class FetchProxy {
    static origFetch: typeof fetch;
    static create(ignoredHeaders: boolean | string[], setSessionTokenHeader: (cb: (name: string, value: string) => void) => void, sanitize: (data: RequestResponseData) => RequestResponseData, sendMessage: (item: NetworkRequest) => void, isServiceUrl: (url: string) => boolean, tokenUrlMatcher?: (url: string) => boolean): typeof fetch;
}
