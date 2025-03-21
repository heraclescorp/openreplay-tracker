"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Nodes {
    constructor(node_id) {
        this.node_id = node_id;
        this.nodes = [];
        this.totalNodeAmount = 0;
        this.nodeCallbacks = [];
        this.elementListeners = new Map();
    }
    // Attached once per Tracker instance
    attachNodeCallback(nodeCallback) {
        this.nodeCallbacks.push(nodeCallback);
    }
    attachNodeListener(node, type, listener, useCapture = true) {
        const id = this.getID(node);
        if (id === undefined) {
            return;
        }
        node.addEventListener(type, listener, useCapture);
        let listeners = this.elementListeners.get(id);
        if (listeners === undefined) {
            listeners = [];
            this.elementListeners.set(id, listeners);
        }
        listeners.push([type, listener, useCapture]);
    }
    registerNode(node) {
        let id = node[this.node_id];
        const isNew = id === undefined;
        if (isNew) {
            this.totalNodeAmount++;
            id = this.nodes.length;
            this.nodes[id] = node;
            node[this.node_id] = id;
        }
        return [id, isNew];
    }
    unregisterNode(node) {
        const id = node[this.node_id];
        if (id !== undefined) {
            delete node[this.node_id];
            delete this.nodes[id];
            const listeners = this.elementListeners.get(id);
            if (listeners !== undefined) {
                this.elementListeners.delete(id);
                listeners.forEach((listener) => node.removeEventListener(listener[0], listener[1], listener[2]));
            }
            this.totalNodeAmount--;
        }
        return id;
    }
    cleanTree() {
        // sadly we keep empty items in array here resulting in some memory still being used
        // but its still better than keeping dead nodes or undef elements
        // plus we keep our index positions for new/alive nodes
        // performance test: 3ms for 30k nodes with 17k dead ones
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            if (node && !document.contains(node)) {
                this.unregisterNode(node);
            }
        }
    }
    callNodeCallbacks(node, isStart) {
        this.nodeCallbacks.forEach((cb) => cb(node, isStart));
    }
    getID(node) {
        if (!node)
            return undefined;
        return node[this.node_id];
    }
    getNode(id) {
        return this.nodes[id];
    }
    getNodeCount() {
        return this.totalNodeAmount;
    }
    clear() {
        for (let id = 0; id < this.nodes.length; id++) {
            const node = this.nodes[id];
            if (node === undefined) {
                continue;
            }
            this.unregisterNode(node);
        }
        this.nodes.length = 0;
    }
}
exports.default = Nodes;
