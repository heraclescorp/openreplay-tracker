"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleSheetIDMap = exports.nextID = void 0;
const messages_gen_js_1 = require("../app/messages.gen.js");
const guards_js_1 = require("../app/guards.js");
function hasAdoptedSS(node) {
    return ((0, guards_js_1.isRootNode)(node) &&
        // @ts-ignore
        !!node.adoptedStyleSheets);
}
// TODO: incapsulate to be init-ed on-start and join with cssrules.ts under one folder
let _id = 0xf;
function nextID() {
    return _id++;
}
exports.nextID = nextID;
exports.styleSheetIDMap = new Map();
function default_1(app) {
    if (app === null) {
        return;
    }
    if (!hasAdoptedSS(document)) {
        return;
    }
    const styleSheetIDMap = new Map();
    const adoptedStyleSheetsOwnings = new Map();
    const sendAdoptedStyleSheetsUpdate = (root) => setTimeout(() => {
        let nodeID = app.nodes.getID(root);
        if (root === document) {
            nodeID = 0; // main document doesn't have nodeID. ID count starts from the documentElement
        }
        if (nodeID === undefined) {
            return;
        }
        let pastOwning = adoptedStyleSheetsOwnings.get(nodeID);
        if (!pastOwning) {
            pastOwning = [];
        }
        const nowOwning = [];
        const styleSheets = root.adoptedStyleSheets;
        for (const s of styleSheets) {
            let sheetID = styleSheetIDMap.get(s);
            const init = !sheetID;
            if (!sheetID) {
                sheetID = nextID();
                styleSheetIDMap.set(s, sheetID);
            }
            if (!pastOwning.includes(sheetID)) {
                app.send((0, messages_gen_js_1.AdoptedSSAddOwner)(sheetID, nodeID));
            }
            if (init) {
                const rules = s.cssRules;
                for (let i = 0; i < rules.length; i++) {
                    app.send((0, messages_gen_js_1.AdoptedSSInsertRuleURLBased)(sheetID, rules[i].cssText, i, app.getBaseHref()));
                }
            }
            nowOwning.push(sheetID);
        }
        for (const sheetID of pastOwning) {
            if (!nowOwning.includes(sheetID)) {
                app.send((0, messages_gen_js_1.AdoptedSSRemoveOwner)(sheetID, nodeID));
            }
        }
        adoptedStyleSheetsOwnings.set(nodeID, nowOwning);
    }, 20); // Misterious bug:
    /* On the page https://explore.fast.design/components/fast-accordion
      the only rule inside the only adoptedStyleSheet of the iframe-s document
      gets changed during first milliseconds after the load.
      Howerer, none of the documented methods (replace, insertRule) is triggered.
      The rule is not substituted (remains the same object), however the text gets changed.
    */
    function patchAdoptedStyleSheets(prototype) {
        const nativeAdoptedStyleSheetsDescriptor = Object.getOwnPropertyDescriptor(prototype, 'adoptedStyleSheets');
        if (nativeAdoptedStyleSheetsDescriptor) {
            Object.defineProperty(prototype, 'adoptedStyleSheets', Object.assign(Object.assign({}, nativeAdoptedStyleSheetsDescriptor), { set: function (value) {
                    // @ts-ignore
                    const retVal = nativeAdoptedStyleSheetsDescriptor.set.call(this, value);
                    sendAdoptedStyleSheetsUpdate(this);
                    return retVal;
                } }));
        }
    }
    const patchContext = (context) => {
        // @ts-ignore
        if (context.__openreplay_adpss_patched__) {
            return;
        }
        else {
            // @ts-ignore
            context.__openreplay_adpss_patched__ = true;
        }
        patchAdoptedStyleSheets(context.Document.prototype);
        patchAdoptedStyleSheets(context.ShadowRoot.prototype);
        //@ts-ignore TODO: upgrade ts to 4.8+
        const { replace, replaceSync } = context.CSSStyleSheet.prototype;
        //@ts-ignore
        context.CSSStyleSheet.prototype.replace = function (text) {
            return replace.call(this, text).then((sheet) => {
                const sheetID = styleSheetIDMap.get(this);
                if (sheetID) {
                    app.send((0, messages_gen_js_1.AdoptedSSReplaceURLBased)(sheetID, text, app.getBaseHref()));
                }
                return sheet;
            });
        };
        //@ts-ignore
        context.CSSStyleSheet.prototype.replaceSync = function (text) {
            const sheetID = styleSheetIDMap.get(this);
            if (sheetID) {
                app.send((0, messages_gen_js_1.AdoptedSSReplaceURLBased)(sheetID, text, app.getBaseHref()));
            }
            return replaceSync.call(this, text);
        };
    };
    patchContext(window);
    app.observer.attachContextCallback(app.safe(patchContext));
    app.attachStopCallback(() => {
        styleSheetIDMap.clear();
        adoptedStyleSheetsOwnings.clear();
    });
    // So far main Document is not triggered with nodeCallbacks
    app.attachStartCallback(() => {
        sendAdoptedStyleSheetsUpdate(document);
    });
    app.nodes.attachNodeCallback((node) => {
        if (hasAdoptedSS(node)) {
            sendAdoptedStyleSheetsUpdate(node);
        }
    });
}
exports.default = default_1;
