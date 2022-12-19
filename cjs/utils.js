"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOpenreplayAttribute = exports.getLabelAttribute = exports.deprecationWarn = exports.DOCS_HOST = exports.isURL = exports.normSpaces = exports.stars = exports.now = exports.getTimeOrigin = exports.adjustTimeOrigin = exports.MAX_STR_LEN = exports.IS_FIREFOX = exports.IN_BROWSER = void 0;
const DEPRECATED_ATTRS = { htmlmasked: 'hidden', masked: 'obscured' };
exports.IN_BROWSER = !(typeof window === 'undefined');
exports.IS_FIREFOX = exports.IN_BROWSER && navigator.userAgent.match(/firefox|fxios/i);
exports.MAX_STR_LEN = 1e5;
// Buggy to use `performance.timeOrigin || performance.timing.navigationStart`
// https://github.com/mdn/content/issues/4713
// Maybe move to timer/ticker
let timeOrigin = exports.IN_BROWSER ? Date.now() - performance.now() : 0;
function adjustTimeOrigin() {
    timeOrigin = Date.now() - performance.now();
}
exports.adjustTimeOrigin = adjustTimeOrigin;
function getTimeOrigin() {
    return timeOrigin;
}
exports.getTimeOrigin = getTimeOrigin;
exports.now = exports.IN_BROWSER && !!performance.now
    ? () => Math.round(performance.now() + timeOrigin)
    : () => Date.now();
exports.stars = 'repeat' in String.prototype
    ? (str) => '*'.repeat(str.length)
    : (str) => str.replace(/./g, '*');
function normSpaces(str) {
    return str.trim().replace(/\s+/g, ' ');
}
exports.normSpaces = normSpaces;
// isAbsoluteUrl regexp:  /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
function isURL(s) {
    return s.startsWith('https://') || s.startsWith('http://');
}
exports.isURL = isURL;
// TODO: JOIN IT WITH LOGGER somehow (use logging decorators?); Don't forget about index.js loggin when there is no logger instance.
exports.DOCS_HOST = 'https://docs.openreplay.com';
const warnedFeatures = {};
function deprecationWarn(nameOfFeature, useInstead, docsPath = '/') {
    if (warnedFeatures[nameOfFeature]) {
        return;
    }
    console.warn(`OpenReplay: ${nameOfFeature} is deprecated. ${useInstead ? `Please, use ${useInstead} instead.` : ''} Visit ${exports.DOCS_HOST}${docsPath} for more information.`);
    warnedFeatures[nameOfFeature] = true;
}
exports.deprecationWarn = deprecationWarn;
function getLabelAttribute(e) {
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
exports.getLabelAttribute = getLabelAttribute;
function hasOpenreplayAttribute(e, attr) {
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
exports.hasOpenreplayAttribute = hasOpenreplayAttribute;
