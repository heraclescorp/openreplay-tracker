type NodeCallback = (node: Node, isStart: boolean) => void;
export default class Nodes {
    private readonly node_id;
    private nodes;
    private totalNodeAmount;
    private readonly nodeCallbacks;
    private readonly elementListeners;
    constructor(node_id: string);
    attachNodeCallback(nodeCallback: NodeCallback): void;
    attachNodeListener(node: Node, type: string, listener: EventListener, useCapture?: boolean): void;
    registerNode(node: Node): [/*id:*/ number, /*isNew:*/ boolean];
    unregisterNode(node: Node): number | undefined;
    cleanTree(): void;
    callNodeCallbacks(node: Node, isStart: boolean): void;
    getID(node: Node): number | undefined;
    getNode(id: number): void | Node;
    getNodeCount(): number;
    clear(): void;
}
export {};
