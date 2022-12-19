"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputLabel = void 0;
const utils_js_1 = require("../utils.js");
const guards_js_1 = require("../app/guards.js");
const messages_gen_js_1 = require("../app/messages.gen.js");
const INPUT_TYPES = ['text', 'password', 'email', 'search', 'number', 'range', 'date', 'tel'];
function isTextEditable(node) {
    if ((0, guards_js_1.hasTag)(node, 'TEXTAREA')) {
        return true;
    }
    if (!(0, guards_js_1.hasTag)(node, 'INPUT')) {
        return false;
    }
    return INPUT_TYPES.includes(node.type);
}
function isCheckable(node) {
    if (!(0, guards_js_1.hasTag)(node, 'INPUT')) {
        return false;
    }
    const type = node.type;
    return type === 'checkbox' || type === 'radio';
}
const labelElementFor = utils_js_1.IN_BROWSER && 'labels' in HTMLInputElement.prototype
    ? (node) => {
        let p = node;
        while ((p = p.parentNode) !== null) {
            if ((0, guards_js_1.hasTag)(p, 'LABEL')) {
                return p;
            }
        }
        const labels = node.labels;
        if (labels !== null && labels.length === 1) {
            return labels[0];
        }
    }
    : (node) => {
        let p = node;
        while ((p = p.parentNode) !== null) {
            if ((0, guards_js_1.hasTag)(p, 'LABEL')) {
                return p;
            }
        }
        const id = node.id;
        if (id) {
            const labels = node.ownerDocument.querySelectorAll('label[for="' + id + '"]');
            if (labels !== null && labels.length === 1) {
                return labels[0];
            }
        }
    };
function getInputLabel(node) {
    let label = (0, utils_js_1.getLabelAttribute)(node);
    if (label === null) {
        const labelElement = labelElementFor(node);
        label =
            (labelElement && labelElement.innerText) ||
                node.placeholder ||
                node.name ||
                node.id ||
                node.className ||
                node.type;
    }
    return (0, utils_js_1.normSpaces)(label).slice(0, 100);
}
exports.getInputLabel = getInputLabel;
function default_1(app, opts) {
    const options = Object.assign({
        obscureInputNumbers: true,
        obscureInputEmails: true,
        defaultInputMode: 0 /* Plain */,
        obscureInputDates: false,
    }, opts);
    function sendInputTarget(id, node) {
        const label = getInputLabel(node);
        if (label !== '') {
            app.send((0, messages_gen_js_1.SetInputTarget)(id, label));
        }
    }
    function sendInputValue(id, node) {
        let value = node.value;
        let inputMode = options.defaultInputMode;
        if (node.type === 'password' || app.sanitizer.isHidden(id)) {
            inputMode = 2 /* Hidden */;
        }
        else if (app.sanitizer.isObscured(id) ||
            (inputMode === 0 /* Plain */ &&
                ((options.obscureInputNumbers && node.type !== 'date' && /\d\d\d\d/.test(value)) ||
                    (options.obscureInputDates && node.type === 'date') ||
                    (options.obscureInputEmails && (node.type === 'email' || !!~value.indexOf('@')))))) {
            inputMode = 1 /* Obscured */;
        }
        let mask = 0;
        switch (inputMode) {
            case 2 /* Hidden */:
                mask = -1;
                value = '';
                break;
            case 1 /* Obscured */:
                mask = value.length;
                value = '';
                break;
        }
        app.send((0, messages_gen_js_1.SetInputValue)(id, value, mask));
    }
    const inputValues = new Map();
    const checkableValues = new Map();
    const registeredTargets = new Set();
    app.attachStopCallback(() => {
        inputValues.clear();
        checkableValues.clear();
        registeredTargets.clear();
    });
    app.ticker.attach(() => {
        inputValues.forEach((value, id) => {
            const node = app.nodes.getNode(id);
            if (!node)
                return;
            if (!isTextEditable(node)) {
                inputValues.delete(id);
                return;
            }
            if (value !== node.value) {
                inputValues.set(id, node.value);
                if (!registeredTargets.has(id)) {
                    registeredTargets.add(id);
                    sendInputTarget(id, node);
                }
                sendInputValue(id, node);
            }
        });
        checkableValues.forEach((checked, id) => {
            const node = app.nodes.getNode(id);
            if (!node)
                return;
            if (!isCheckable(node)) {
                checkableValues.delete(id);
                return;
            }
            if (checked !== node.checked) {
                checkableValues.set(id, node.checked);
                app.send((0, messages_gen_js_1.SetInputChecked)(id, node.checked));
            }
        });
    });
    app.ticker.attach(Set.prototype.clear, 100, false, registeredTargets);
    app.nodes.attachNodeCallback(app.safe((node) => {
        const id = app.nodes.getID(node);
        if (id === undefined) {
            return;
        }
        // TODO: support multiple select (?): use selectedOptions; Need send target?
        if ((0, guards_js_1.hasTag)(node, 'SELECT')) {
            sendInputValue(id, node);
            app.attachEventListener(node, 'change', () => {
                sendInputValue(id, node);
            });
        }
        if (isTextEditable(node)) {
            inputValues.set(id, node.value);
            sendInputValue(id, node);
            return;
        }
        if (isCheckable(node)) {
            checkableValues.set(id, node.checked);
            app.send((0, messages_gen_js_1.SetInputChecked)(id, node.checked));
            return;
        }
    }));
}
exports.default = default_1;
