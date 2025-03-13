"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guards_js_1 = require("../app/guards.js");
const utils_js_1 = require("../utils.js");
const messages_gen_js_1 = require("../app/messages.gen.js");
function getPaintBlocks(resources) {
    const paintBlocks = [];
    const elements = document.getElementsByTagName('*');
    const styleURL = /url\(("[^"]*"|'[^']*'|[^)]*)\)/i;
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        let src = '';
        if ((0, guards_js_1.hasTag)(element, 'img')) {
            src = element.currentSrc || element.src;
        }
        if (!src) {
            const backgroundImage = getComputedStyle(element).getPropertyValue('background-image');
            if (backgroundImage) {
                const matches = styleURL.exec(backgroundImage);
                if (matches !== null) {
                    src = matches[1];
                    if (src.startsWith('"') || src.startsWith("'")) {
                        src = src.substr(1, src.length - 2);
                    }
                }
            }
        }
        if (!src)
            continue;
        const time = src.substr(0, 10) === 'data:image' ? 0 : resources[src];
        if (time === undefined)
            continue;
        const rect = element.getBoundingClientRect();
        const top = Math.max(rect.top, 0);
        const left = Math.max(rect.left, 0);
        const bottom = Math.min(rect.bottom, window.innerHeight ||
            (document.documentElement && document.documentElement.clientHeight) ||
            0);
        const right = Math.min(rect.right, window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 0);
        if (bottom <= top || right <= left)
            continue;
        const area = (bottom - top) * (right - left);
        paintBlocks.push({ time, area });
    }
    return paintBlocks;
}
function calculateSpeedIndex(firstContentfulPaint, paintBlocks) {
    let a = (Math.max((document.documentElement && document.documentElement.clientWidth) || 0, window.innerWidth || 0) *
        Math.max((document.documentElement && document.documentElement.clientHeight) || 0, window.innerHeight || 0)) /
        10;
    let s = a * firstContentfulPaint;
    for (let i = 0; i < paintBlocks.length; i++) {
        const { time, area } = paintBlocks[i];
        a += area;
        s += area * (time > firstContentfulPaint ? time : firstContentfulPaint);
    }
    return a === 0 ? 0 : s / a;
}
function default_1(app, opts) {
    const options = Object.assign({
        captureResourceTimings: true,
        capturePageLoadTimings: true,
        capturePageRenderTimings: true,
        excludedResourceUrls: [],
    }, opts);
    if (!('PerformanceObserver' in window)) {
        options.captureResourceTimings = false;
    }
    if (!options.captureResourceTimings) {
        return;
    } // Resources are necessary for all timings
    let resources = {};
    function resourceTiming(entry) {
        var _a;
        if (entry.duration < 0 || !(0, utils_js_1.isURL)(entry.name) || app.isServiceURL(entry.name))
            return;
        if (resources !== null) {
            resources[entry.name] = entry.startTime + entry.duration;
        }
        (_a = options.excludedResourceUrls) === null || _a === void 0 ? void 0 : _a.forEach((url) => {
            if (entry.name.startsWith(url)) {
                return;
            }
        });
        app.send((0, messages_gen_js_1.ResourceTiming)(entry.startTime + (0, utils_js_1.getTimeOrigin)(), entry.duration, entry.responseStart && entry.startTime ? entry.responseStart - entry.startTime : 0, entry.transferSize > entry.encodedBodySize ? entry.transferSize - entry.encodedBodySize : 0, entry.encodedBodySize || 0, entry.decodedBodySize || 0, entry.name, entry.initiatorType, entry.transferSize, 
        // @ts-ignore
        (entry.responseStatus && entry.responseStatus === 304) || entry.transferSize === 0));
    }
    const observer = new PerformanceObserver((list) => list.getEntries().forEach(resourceTiming));
    let prevSessionID;
    app.attachStartCallback(function ({ sessionID }) {
        if (sessionID !== prevSessionID) {
            // Send past page resources on a newly started session
            performance.getEntriesByType('resource').forEach(resourceTiming);
            prevSessionID = sessionID;
        }
        observer.observe({ entryTypes: ['resource'] });
    });
    app.attachStopCallback(function () {
        observer.disconnect();
    });
    let firstPaint = 0, firstContentfulPaint = 0;
    if (options.capturePageLoadTimings) {
        let pageLoadTimingSent = false;
        app.ticker.attach(() => {
            if (pageLoadTimingSent) {
                return;
            }
            if (firstPaint === 0 || firstContentfulPaint === 0) {
                performance.getEntriesByType('paint').forEach((entry) => {
                    const { name, startTime } = entry;
                    switch (name) {
                        case 'first-paint':
                            firstPaint = startTime;
                            break;
                        case 'first-contentful-paint':
                            firstContentfulPaint = startTime;
                            break;
                    }
                });
            }
            if (performance.timing.loadEventEnd || performance.now() > 30000) {
                pageLoadTimingSent = true;
                const { 
                // should be ok to use here, (https://github.com/mdn/content/issues/4713)
                // since it is compared with the values obtained on the page load (before any possible sleep state)
                // deprecated though
                navigationStart, requestStart, responseStart, responseEnd, domContentLoadedEventStart, domContentLoadedEventEnd, loadEventStart, loadEventEnd, } = performance.timing;
                app.send((0, messages_gen_js_1.PageLoadTiming)(requestStart - navigationStart || 0, responseStart - navigationStart || 0, responseEnd - navigationStart || 0, domContentLoadedEventStart - navigationStart || 0, domContentLoadedEventEnd - navigationStart || 0, loadEventStart - navigationStart || 0, loadEventEnd - navigationStart || 0, firstPaint, firstContentfulPaint));
            }
        }, 30);
    }
    if (options.capturePageRenderTimings) {
        let visuallyComplete = 0, interactiveWindowStartTime = 0, interactiveWindowTickTime = 0, paintBlocks = null;
        let pageRenderTimingSent = false;
        app.ticker.attach(() => {
            if (pageRenderTimingSent) {
                return;
            }
            const time = performance.now();
            if (resources !== null) {
                visuallyComplete = Math.max.apply(null, Object.keys(resources).map((k) => resources[k]));
                if (time - visuallyComplete > 1000) {
                    paintBlocks = getPaintBlocks(resources);
                    resources = null;
                }
            }
            if (interactiveWindowTickTime !== null) {
                if (time - interactiveWindowTickTime > 50) {
                    interactiveWindowStartTime = time;
                }
                interactiveWindowTickTime = time - interactiveWindowStartTime > 5000 ? null : time;
            }
            if ((paintBlocks !== null && interactiveWindowTickTime === null) || time > 30000) {
                pageRenderTimingSent = true;
                resources = null;
                const speedIndex = paintBlocks === null
                    ? 0
                    : calculateSpeedIndex(firstContentfulPaint || firstPaint, paintBlocks);
                const { domContentLoadedEventEnd, navigationStart } = performance.timing;
                const timeToInteractive = interactiveWindowTickTime === null
                    ? Math.max(interactiveWindowStartTime, firstContentfulPaint, domContentLoadedEventEnd - navigationStart || 0)
                    : 0;
                app.send((0, messages_gen_js_1.PageRenderTiming)(speedIndex, firstContentfulPaint > visuallyComplete ? firstContentfulPaint : visuallyComplete, timeToInteractive));
            }
        });
    }
}
exports.default = default_1;
