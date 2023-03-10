"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExceptionMessageFromEvent = exports.getExceptionMessage = void 0;
const messages_gen_js_1 = require("../app/messages.gen.js");
const error_stack_parser_1 = require("error-stack-parser");
function getDefaultStack(e) {
    return [
        {
            columnNumber: e.colno,
            lineNumber: e.lineno,
            fileName: e.filename,
            functionName: '',
            source: '',
        },
    ];
}
function getExceptionMessage(error, fallbackStack, metadata = {}) {
    let stack = fallbackStack;
    try {
        stack = error_stack_parser_1.default.parse(error);
    }
    catch (e) { }
    return (0, messages_gen_js_1.JSException)(error.name, error.message, JSON.stringify(stack), JSON.stringify(metadata));
}
exports.getExceptionMessage = getExceptionMessage;
function getExceptionMessageFromEvent(e, context = window, metadata = {}) {
    if (e instanceof ErrorEvent) {
        if (e.error instanceof Error) {
            return getExceptionMessage(e.error, getDefaultStack(e), metadata);
        }
        else {
            let [name, message] = e.message.split(':');
            if (!message) {
                name = 'Error';
                message = e.message;
            }
            return (0, messages_gen_js_1.JSException)(name, message, JSON.stringify(getDefaultStack(e)), JSON.stringify(metadata));
        }
    }
    else if ('PromiseRejectionEvent' in context && e instanceof context.PromiseRejectionEvent) {
        if (e.reason instanceof Error) {
            return getExceptionMessage(e.reason, [], metadata);
        }
        else {
            let message;
            try {
                message = JSON.stringify(e.reason);
            }
            catch (_) {
                message = String(e.reason);
            }
            return (0, messages_gen_js_1.JSException)('Unhandled Promise Rejection', message, '[]', JSON.stringify(metadata));
        }
    }
    return null;
}
exports.getExceptionMessageFromEvent = getExceptionMessageFromEvent;
function default_1(app, opts) {
    const options = Object.assign({
        captureExceptions: true,
    }, opts);
    function patchContext(context) {
        function handler(e) {
            const msg = getExceptionMessageFromEvent(e, context);
            if (msg != null) {
                app.send(msg);
            }
        }
        app.attachEventListener(context, 'unhandledrejection', handler);
        app.attachEventListener(context, 'error', handler);
    }
    if (options.captureExceptions) {
        app.observer.attachContextCallback(patchContext); // TODO: attach once-per-iframe (?)
        patchContext(window);
    }
}
exports.default = default_1;
