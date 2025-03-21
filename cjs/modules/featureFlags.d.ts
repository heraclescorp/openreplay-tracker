import App from '../app/index.js';
export interface IFeatureFlag {
    key: string;
    is_persist: boolean;
    value: string | boolean;
    payload: string;
}
export interface FetchPersistFlagsData {
    key: string;
    value: string | boolean;
}
export default class FeatureFlags {
    private readonly app;
    flags: IFeatureFlag[];
    storageKey: string;
    onFlagsCb: (flags: IFeatureFlag[]) => void;
    constructor(app: App);
    getFeatureFlag(flagName: string): IFeatureFlag | undefined;
    isFlagEnabled(flagName: string): boolean;
    onFlagsLoad(cb: (flags: IFeatureFlag[]) => void): void;
    reloadFlags(): Promise<void>;
    handleFlags(flags: IFeatureFlag[]): void;
    clearPersistFlags(): void;
    diffPersist(flags: IFeatureFlag[]): IFeatureFlag[];
}
