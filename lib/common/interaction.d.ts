import Message from './messages.gen.js';
export interface Options {
    connAttemptCount?: number;
    connAttemptGap?: number;
}
declare type Start = {
    type: 'start';
    ingestPoint: string;
    pageNo: number;
    timestamp: number;
    url: string;
} & Options;
declare type Auth = {
    type: 'auth';
    token: string;
    beaconSizeLimit?: number;
};
export declare type ToWorkerData = null | 'stop' | Start | Auth | Array<Message>;
declare type Failure = {
    type: 'failure';
    reason: string;
};
export declare type FromWorkerData = 'restart' | Failure;
export {};
