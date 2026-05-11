import Observer from './observer.js';
import { Offset } from './iframe_offsets.js';
import App from '../index.js';
export interface Options {
    captureIFrames: boolean;
    /**
     * Exact hostnames whose iframes may be captured. Required when
     * captureIFrames is true — omitting it (or passing an empty array)
     * disables iframe capture entirely. Hostname comparison is
     * case-insensitive and matched against the iframe's resolved src.
     * Iframes without a parseable http(s) src (empty, about:blank,
     * javascript:, data:) are never captured.
     */
    allowedIframeDomains: string[];
}
type Context = Window & typeof globalThis;
type ContextCallback = (context: Context) => void;
export default class TopObserver extends Observer {
    private readonly options;
    private readonly iframeOffsets;
    constructor(app: App, options: Partial<Options>);
    private readonly contextCallbacks;
    private readonly contextsSet;
    attachContextCallback(cb: ContextCallback): void;
    getDocumentOffset(doc: Document): Offset;
    private iframeObservers;
    private handleIframe;
    private shadowRootObservers;
    private handleShadowRoot;
    observe(): void;
    disconnect(): void;
}
export {};
