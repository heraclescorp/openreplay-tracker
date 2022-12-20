import App from './app/index.js';
export { default as App } from './app/index.js';
import * as _Messages from './app/messages.gen.js';
export declare const Messages: typeof _Messages;
export { SanitizeLevel } from './app/sanitizer.js';
import type { Options as AppOptions } from './app/index.js';
import type { Options as ConsoleOptions } from './modules/console.js';
import type { Options as ExceptionOptions } from './modules/exception.js';
import type { Options as InputOptions } from './modules/input.js';
import type { Options as PerformanceOptions } from './modules/performance.js';
import type { Options as TimingOptions } from './modules/timing.js';
import type { StartOptions } from './app/index.js';
import type { StartPromiseReturn } from './app/index.js';
export declare type Options = Partial<AppOptions & ConsoleOptions & ExceptionOptions & InputOptions & PerformanceOptions & TimingOptions> & {
    projectID?: number;
    projectKey: string;
    sessionToken?: string;
    respectDoNotTrack?: boolean;
    autoResetOnWindowOpen?: boolean;
    __DISABLE_SECURE_MODE?: boolean;
};
export default class API {
    private readonly options;
    private readonly app;
    constructor(options: Options);
    use<T>(fn: (app: App | null, options?: Options) => T): T;
    isActive(): boolean;
    start(startOpts?: Partial<StartOptions>): Promise<StartPromiseReturn>;
    stop(): string | undefined;
    getSessionToken(): string | null | undefined;
    getSessionID(): string | null | undefined;
    sessionID(): string | null | undefined;
    getSessionURL(): string | undefined;
    setUserID(id: string): void;
    userID(id: string): void;
    setUserAnonymousID(id: string): void;
    userAnonymousID(id: string): void;
    setMetadata(key: string, value: string): void;
    metadata(key: string, value: string): void;
    event(key: string, payload?: any, issue?: boolean): void;
    issue(key: string, payload?: any): void;
    handleError: (e: Error | ErrorEvent | PromiseRejectionEvent, metadata?: Record<string, any>) => void;
}