import type App from './index.js';
interface SessionInfo {
    sessionID: string | undefined;
    metadata: Record<string, string>;
    userID: string | null;
    timestamp: number;
    projectID?: string;
}
declare type OnUpdateCallback = (i: Partial<SessionInfo>) => void;
export declare type Options = {
    session_token_key: string;
    session_pageno_key: string;
};
export default class Session {
    private readonly app;
    private readonly options;
    private metadata;
    private userID;
    private sessionID;
    private readonly callbacks;
    private timestamp;
    private projectID;
    constructor(app: App, options: Options);
    attachUpdateCallback(cb: OnUpdateCallback): void;
    private handleUpdate;
    assign(newInfo: Partial<SessionInfo>): void;
    setMetadata(key: string, value: string): void;
    setUserID(userID: string): void;
    private getPageNumber;
    incPageNo(): number;
    getSessionToken(): string | undefined;
    setSessionToken(token: string): void;
    applySessionHash(hash: string): void;
    getSessionHash(): string | undefined;
    getInfo(): SessionInfo;
    reset(): void;
}
export {};
