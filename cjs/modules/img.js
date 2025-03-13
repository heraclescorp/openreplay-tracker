"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("../utils.js");
const messages_gen_js_1 = require("../app/messages.gen.js");
const guards_js_1 = require("../app/guards.js");
function resolveURL(url, location = document.location) {
    url = url.trim();
    if (url.startsWith('//') ||
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('data:') // any other possible value here? https://bugzilla.mozilla.org/show_bug.cgi?id=1758035
    ) {
        return url;
    }
    else if (url.startsWith('/')) {
        return location.origin + url;
    }
    else {
        return location.origin + location.pathname + url;
    }
}
// https://bugzilla.mozilla.org/show_bug.cgi?id=1607081
function isSVGInFireFox(url) {
    return utils_js_1.IS_FIREFOX && (url.startsWith('data:image/svg+xml') || url.match(/.svg$|/i));
}
const PLACEHOLDER_SRC = 'https://static.openreplay.com/tracker/placeholder.jpeg';
function default_1(app) {
    function sendPlaceholder(id, node) {
        app.attributeSender.sendSetAttribute(id, 'src', PLACEHOLDER_SRC);
        const { width, height } = node.getBoundingClientRect();
        if (!node.hasAttribute('width')) {
            app.attributeSender.sendSetAttribute(id, 'width', String(width));
        }
        if (!node.hasAttribute('height')) {
            app.attributeSender.sendSetAttribute(id, 'height', String(height));
        }
    }
    const sendSrcset = function (id, img) {
        const { srcset } = img;
        if (!srcset) {
            return;
        }
        const resolvedSrcset = srcset
            .split(',')
            .map((str) => resolveURL(str))
            .join(',');
        app.attributeSender.sendSetAttribute(id, 'srcset', resolvedSrcset);
    };
    const sendSrc = function (id, img) {
        if (img.src.length > utils_js_1.MAX_STR_LEN) {
            sendPlaceholder(id, img);
        }
        app.send((0, messages_gen_js_1.SetNodeAttributeURLBased)(id, 'src', img.src, app.getBaseHref()));
    };
    const sendImgError = app.safe(function (img) {
        const resolvedSrc = resolveURL(img.src || ''); // Src type is null sometimes. - is it true?
        if ((0, utils_js_1.isURL)(resolvedSrc)) {
            app.send((0, messages_gen_js_1.ResourceTiming)(app.timestamp(), 0, 0, 0, 0, 0, resolvedSrc, 'img', 0, false));
        }
    });
    const sendImgAttrs = app.safe(function (img) {
        const id = app.nodes.getID(img);
        if (id === undefined) {
            return;
        }
        if (!img.complete) {
            return;
        }
        if (img.naturalHeight === 0 && img.naturalWidth === 0 && !isSVGInFireFox(img.src)) {
            sendImgError(img);
        }
        else if (app.sanitizer.isHidden(id) || app.sanitizer.isObscured(id)) {
            sendPlaceholder(id, img);
        }
        else {
            sendSrc(id, img);
            sendSrcset(id, img);
        }
    });
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes') {
                const target = mutation.target;
                const id = app.nodes.getID(target);
                if (id === undefined) {
                    return;
                }
                if (mutation.attributeName === 'src') {
                    sendSrc(id, target);
                }
                if (mutation.attributeName === 'srcset') {
                    sendSrcset(id, target);
                }
            }
        }
    });
    app.attachStopCallback(() => {
        observer.disconnect();
    });
    app.nodes.attachNodeCallback((node) => {
        if (!(0, guards_js_1.hasTag)(node, 'img')) {
            return;
        }
        app.nodes.attachNodeListener(node, 'error', () => sendImgError(node));
        app.nodes.attachNodeListener(node, 'load', () => sendImgAttrs(node));
        sendImgAttrs(node);
        observer.observe(node, { attributes: true, attributeFilter: ['src', 'srcset'] });
    });
}
exports.default = default_1;
