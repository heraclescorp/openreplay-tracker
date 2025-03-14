var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class FeatureFlags {
    constructor(app) {
        this.app = app;
        this.flags = [];
        this.storageKey = '__openreplay_flags';
        const persistFlags = this.app.sessionStorage.getItem(this.storageKey);
        if (persistFlags) {
            const persistFlagsStrArr = persistFlags.split(';').filter(Boolean);
            this.flags = persistFlagsStrArr.map((flag) => JSON.parse(flag));
        }
    }
    getFeatureFlag(flagName) {
        return this.flags.find((flag) => flag.key === flagName);
    }
    isFlagEnabled(flagName) {
        return this.flags.findIndex((flag) => flag.key === flagName) !== -1;
    }
    onFlagsLoad(cb) {
        this.onFlagsCb = cb;
    }
    reloadFlags() {
        return __awaiter(this, void 0, void 0, function* () {
            const persistFlagsStr = this.app.sessionStorage.getItem(this.storageKey);
            const persistFlags = {};
            if (persistFlagsStr) {
                const persistArray = persistFlagsStr.split(';').filter(Boolean);
                persistArray.forEach((flag) => {
                    const flagObj = JSON.parse(flag);
                    persistFlags[flagObj.key] = { key: flagObj.key, value: flagObj.value };
                });
            }
            const sessionInfo = this.app.session.getInfo();
            const userInfo = this.app.session.userInfo;
            const requestObject = {
                projectID: sessionInfo.projectID,
                userID: sessionInfo.userID,
                metadata: sessionInfo.metadata,
                referrer: document.referrer,
                // todo: get from backend
                os: userInfo.userOS,
                device: userInfo.userDevice,
                country: userInfo.userCountry,
                state: userInfo.userState,
                city: userInfo.userCity,
                browser: userInfo.userBrowser,
                persistFlags: persistFlags,
            };
            const resp = yield fetch(this.app.options.ingestPoint + '/v1/web/feature-flags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.app.session.getSessionToken()}`,
                },
                body: JSON.stringify(requestObject),
            });
            if (resp.status === 200) {
                const data = yield resp.json();
                return this.handleFlags(data.flags);
            }
        });
    }
    handleFlags(flags) {
        var _a;
        const persistFlags = [];
        flags.forEach((flag) => {
            if (flag.is_persist)
                persistFlags.push(flag);
        });
        let str = '';
        const uniquePersistFlags = this.diffPersist(persistFlags);
        uniquePersistFlags.forEach((flag) => {
            str += `${JSON.stringify(flag)};`;
        });
        this.app.sessionStorage.setItem(this.storageKey, str);
        this.flags = flags;
        return (_a = this.onFlagsCb) === null || _a === void 0 ? void 0 : _a.call(this, flags);
    }
    clearPersistFlags() {
        this.app.sessionStorage.removeItem(this.storageKey);
    }
    diffPersist(flags) {
        const persistFlags = this.app.sessionStorage.getItem(this.storageKey);
        if (!persistFlags)
            return flags;
        const persistFlagsStrArr = persistFlags.split(';').filter(Boolean);
        const persistFlagsArr = persistFlagsStrArr.map((flag) => JSON.parse(flag));
        return flags.filter((flag) => persistFlagsArr.findIndex((pf) => pf.key === flag.key) === -1);
    }
}
