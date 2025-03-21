import Message from './messages.gen.js';
export interface Options {
    connAttemptCount?: number;
    connAttemptGap?: number;
}
type Start = {
    type: 'start';
    ingestPoint: string;
    pageNo: number;
    timestamp: number;
    url: string;
    tabId: string;
} & Options;
type Auth = {
    type: 'auth';
    token: string;
    beaconSizeLimit?: number;
};
export type ToWorkerData = null | 'stop' | Start | Auth | Array<Message> | {
    type: 'compressed';
    batch: Uint8Array;
} | {
    type: 'uncompressed';
    batch: Uint8Array;
} | 'forceFlushBatch';
type Failure = {
    type: 'failure';
    reason: string;
};
type ForceFlushCompleted = {
    type: 'force_flush_completed';
    success: boolean;
};
export type FromWorkerData = 'restart' | Failure | 'not_init' | ForceFlushCompleted | {
    type: 'compress';
    batch: Uint8Array;
};
export {};
