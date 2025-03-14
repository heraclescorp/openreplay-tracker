export declare const IN_BROWSER: boolean;
export declare const IS_FIREFOX: false | RegExpMatchArray | null;
export declare const MAX_STR_LEN = 100000;
export declare function adjustTimeOrigin(): void;
export declare function getTimeOrigin(): number;
export declare const now: () => number;
export declare const stars: (str: string) => string;
export declare function normSpaces(str: string): string;
export declare function isURL(s: string): boolean;
export declare const DOCS_HOST = "https://docs.openreplay.com";
export declare function deprecationWarn(nameOfFeature: string, useInstead: string, docsPath?: string): void;
export declare function getLabelAttribute(e: Element): string | null;
export declare function hasOpenreplayAttribute(e: Element, attr: string): boolean;
/**
 * checks if iframe is accessible
 **/
export declare function canAccessIframe(iframe: HTMLIFrameElement): boolean;
export declare function generateRandomId(len?: number): string;
export declare function inIframe(): boolean;
