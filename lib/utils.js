const DEPRECATED_ATTRS = { htmlmasked: 'hidden', masked: 'obscured' };
export const IN_BROWSER = !(typeof window === 'undefined');
export const IS_FIREFOX = IN_BROWSER && navigator.userAgent.match(/firefox|fxios/i);
export const MAX_STR_LEN = 1e5;
// Buggy to use `performance.timeOrigin || performance.timing.navigationStart`
// https://github.com/mdn/content/issues/4713
// Maybe move to timer/ticker
let timeOrigin = IN_BROWSER ? Date.now() - performance.now() : 0;
export function adjustTimeOrigin() {
    timeOrigin = Date.now() - performance.now();
}
export function getTimeOrigin() {
    return timeOrigin;
}
export const now = IN_BROWSER && !!performance.now
    ? () => Math.round(performance.now() + timeOrigin)
    : () => Date.now();
export const stars = 'repeat' in String.prototype
    ? (str) => '*'.repeat(str.length)
    : (str) => str.replace(/./g, '*');
export function normSpaces(str) {
    return str.trim().replace(/\s+/g, ' ');
}
// isAbsoluteUrl regexp:  /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
export function isURL(s) {
    return s.startsWith('https://') || s.startsWith('http://');
}
// TODO: JOIN IT WITH LOGGER somehow (use logging decorators?); Don't forget about index.js loggin when there is no logger instance.
export const DOCS_HOST = 'https://docs.openreplay.com';
const warnedFeatures = {};
export function deprecationWarn(nameOfFeature, useInstead, docsPath = '/') {
    if (warnedFeatures[nameOfFeature]) {
        return;
    }
    console.warn(`OpenReplay: ${nameOfFeature} is deprecated. ${useInstead ? `Please, use ${useInstead} instead.` : ''} Visit ${DOCS_HOST}${docsPath} for more information.`);
    warnedFeatures[nameOfFeature] = true;
}
export function getLabelAttribute(e) {
    let value = e.getAttribute('data-openreplay-label');
    if (value !== null) {
        return value;
    }
    value = e.getAttribute('data-asayer-label');
    if (value !== null) {
        deprecationWarn('"data-asayer-label" attribute', '"data-openreplay-label" attribute', '/');
    }
    return value;
}
export function hasOpenreplayAttribute(e, attr) {
    const newName = `data-openreplay-${attr}`;
    if (e.hasAttribute(newName)) {
        // @ts-ignore
        if (DEPRECATED_ATTRS[attr]) {
            deprecationWarn(`"${newName}" attribute`, 
            // @ts-ignore
            `"${DEPRECATED_ATTRS[attr]}" attribute`, '/installation/sanitize-data');
        }
        return true;
    }
    return false;
}
