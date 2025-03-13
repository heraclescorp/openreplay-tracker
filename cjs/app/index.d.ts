import type Message from './messages.gen.js';
import Nodes from './nodes.js';
import Observer from './observer/top_observer.js';
import Sanitizer from './sanitizer.js';
import Ticker from './ticker.js';
import Logger from './logger.js';
import Session from './session.js';
import AttributeSender from '../modules/attributeSender.js';
import type { Options as ObserverOptions } from './observer/top_observer.js';
import type { Options as SanitizerOptions } from './sanitizer.js';
import type { Options as LoggerOptions } from './logger.js';
import type { Options as SessOptions } from './session.js';
import type { Options as NetworkOptions } from '../modules/network.js';
import type { Options as WebworkerOptions } from '../common/interaction.js';
export interface StartOptions {
    userID?: string;
    metadata?: Record<string, string>;
    forceNew?: boolean;
    sessionHash?: string;
}
interface OnStartInfo {
    sessionID: string;
    sessionToken: string;
    userUUID: string;
}
declare const CANCELED: "canceled";
type SuccessfulStart = OnStartInfo & {
    success: true;
};
type UnsuccessfulStart = {
    reason: typeof CANCELED | string;
    success: false;
};
declare const UnsuccessfulStart: (reason: string) => UnsuccessfulStart;
declare const SuccessfulStart: (body: OnStartInfo) => SuccessfulStart;
export type StartPromiseReturn = SuccessfulStart | UnsuccessfulStart;
type StartCallback = (i: OnStartInfo) => void;
type CommitCallback = (messages: Array<Message>) => void;
type AppOptions = {
    revID: string;
    node_id: string;
    session_reset_key: string;
    session_token_key: string;
    session_pageno_key: string;
    session_tabid_key: string;
    local_uuid_key: string;
    ingestPoint: string;
    resourceBaseHref: string | null;
    verbose: boolean;
    __is_snippet: boolean;
    __debug_report_edp: string | null;
    __debug__?: LoggerOptions;
    localStorage: Storage | null;
    sessionStorage: Storage | null;
    forceSingleTab?: boolean;
    disableStringDict?: boolean;
    onStart?: StartCallback;
    network?: NetworkOptions;
} & WebworkerOptions & SessOptions;
export type Options = AppOptions & ObserverOptions & SanitizerOptions;
export declare const DEFAULT_INGEST_POINT = "https://api.openreplay.com/ingest";
export default class App {
    readonly nodes: Nodes;
    readonly ticker: Ticker;
    readonly projectKey: string;
    readonly sanitizer: Sanitizer;
    readonly debug: Logger;
    readonly notify: Logger;
    readonly session: Session;
    readonly localStorage: Storage;
    readonly sessionStorage: Storage;
    private readonly messages;
    readonly observer: Observer;
    private readonly startCallbacks;
    private readonly stopCallbacks;
    private readonly commitCallbacks;
    readonly options: AppOptions;
    readonly networkOptions?: NetworkOptions;
    private readonly revID;
    private activityState;
    private readonly version;
    private readonly worker?;
    private compressionThreshold;
    private restartAttempts;
    private readonly bc;
    private readonly contextId;
    attributeSender: AttributeSender;
    constructor(projectKey: string, sessionToken: string | undefined, options: Partial<Options>);
    private _debug;
    private _usingOldFetchPlugin;
    send(message: Message, urgent?: boolean): void;
    private commit;
    private delay;
    timestamp(): number;
    safe<T extends (this: any, ...args: any[]) => void>(fn: T): T;
    attachCommitCallback(cb: CommitCallback): void;
    attachStartCallback(cb: StartCallback, useSafe?: boolean): void;
    attachStopCallback(cb: () => any, useSafe?: boolean): void;
    attachEventListener(target: EventTarget, type: string, listener: EventListener, useSafe?: boolean, useCapture?: boolean): void;
    checkRequiredVersion(version: string): boolean;
    private getTrackerInfo;
    getSessionInfo(): {
        userUUID: string | null;
        projectKey: string;
        revID: string;
        trackerVersion: string;
        isSnippet: boolean;
        sessionID: string | undefined;
        metadata: Record<string, string>;
        userID: string | null;
        timestamp: number;
        projectID?: string | undefined;
    };
    getSessionToken(): string | undefined;
    getSessionID(): string | undefined;
    getSessionURL(options?: {
        withCurrentTime?: boolean;
    }): string | undefined;
    getHost(): string;
    getProjectKey(): string;
    getBaseHref(): string;
    resolveResourceURL(resourceURL: string): string;
    isServiceURL(url: string): boolean;
    active(): boolean;
    resetNextPageSession(flag: boolean): void;
    private _start;
    /**
     * basically we ask other tabs during constructor
     * and here we just apply 10ms delay just in case
     * */
    start(...args: Parameters<App['_start']>): Promise<StartPromiseReturn>;
    forceFlushBatch(): void;
    getTabId(): string;
    stop(stopWorker?: boolean): void;
}
export {};
