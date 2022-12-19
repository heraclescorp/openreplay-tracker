"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("../utils.js");
const messages_gen_js_1 = require("../app/messages.gen.js");
function default_1(app) {
    let url, width, height;
    let navigationStart;
    const sendSetPageLocation = app.safe(() => {
        const { URL } = document;
        if (URL !== url) {
            url = URL;
            app.send((0, messages_gen_js_1.SetPageLocation)(url, document.referrer, navigationStart));
            navigationStart = 0;
        }
    });
    const sendSetViewportSize = app.safe(() => {
        const { innerWidth, innerHeight } = window;
        if (innerWidth !== width || innerHeight !== height) {
            width = innerWidth;
            height = innerHeight;
            app.send((0, messages_gen_js_1.SetViewportSize)(width, height));
        }
    });
    const sendSetPageVisibility = document.hidden === undefined
        ? Function.prototype
        : app.safe(() => app.send((0, messages_gen_js_1.SetPageVisibility)(document.hidden)));
    app.attachStartCallback(() => {
        url = '';
        navigationStart = (0, utils_js_1.getTimeOrigin)();
        width = height = -1;
        sendSetPageLocation();
        sendSetViewportSize();
        sendSetPageVisibility();
    });
    if (document.hidden !== undefined) {
        app.attachEventListener(document, 'visibilitychange', sendSetPageVisibility, false, false);
    }
    app.ticker.attach(sendSetPageLocation, 1, false);
    app.ticker.attach(sendSetViewportSize, 5, false);
}
exports.default = default_1;
