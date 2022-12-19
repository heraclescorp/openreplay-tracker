// Auto-generated, do not edit
export function BatchMetadata(version, pageNo, firstIndex, timestamp, location) {
    return [81 /* BatchMetadata */, version, pageNo, firstIndex, timestamp, location];
}
export function PartitionedMessage(partNo, partTotal) {
    return [82 /* PartitionedMessage */, partNo, partTotal];
}
export function Timestamp(timestamp) {
    return [0 /* Timestamp */, timestamp];
}
export function SetPageLocation(url, referrer, navigationStart) {
    return [4 /* SetPageLocation */, url, referrer, navigationStart];
}
export function SetViewportSize(width, height) {
    return [5 /* SetViewportSize */, width, height];
}
export function SetViewportScroll(x, y) {
    return [6 /* SetViewportScroll */, x, y];
}
export function CreateDocument() {
    return [7 /* CreateDocument */];
}
export function CreateElementNode(id, parentID, index, tag, svg) {
    return [8 /* CreateElementNode */, id, parentID, index, tag, svg];
}
export function CreateTextNode(id, parentID, index) {
    return [9 /* CreateTextNode */, id, parentID, index];
}
export function MoveNode(id, parentID, index) {
    return [10 /* MoveNode */, id, parentID, index];
}
export function RemoveNode(id) {
    return [11 /* RemoveNode */, id];
}
export function SetNodeAttribute(id, name, value) {
    return [12 /* SetNodeAttribute */, id, name, value];
}
export function RemoveNodeAttribute(id, name) {
    return [13 /* RemoveNodeAttribute */, id, name];
}
export function SetNodeData(id, data) {
    return [14 /* SetNodeData */, id, data];
}
export function SetNodeScroll(id, x, y) {
    return [16 /* SetNodeScroll */, id, x, y];
}
export function SetInputTarget(id, label) {
    return [17 /* SetInputTarget */, id, label];
}
export function SetInputValue(id, value, mask) {
    return [18 /* SetInputValue */, id, value, mask];
}
export function SetInputChecked(id, checked) {
    return [19 /* SetInputChecked */, id, checked];
}
export function MouseMove(x, y) {
    return [20 /* MouseMove */, x, y];
}
export function ConsoleLog(level, value) {
    return [22 /* ConsoleLog */, level, value];
}
export function PageLoadTiming(requestStart, responseStart, responseEnd, domContentLoadedEventStart, domContentLoadedEventEnd, loadEventStart, loadEventEnd, firstPaint, firstContentfulPaint) {
    return [
        23 /* PageLoadTiming */,
        requestStart,
        responseStart,
        responseEnd,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart,
        loadEventEnd,
        firstPaint,
        firstContentfulPaint,
    ];
}
export function PageRenderTiming(speedIndex, visuallyComplete, timeToInteractive) {
    return [24 /* PageRenderTiming */, speedIndex, visuallyComplete, timeToInteractive];
}
export function JSException(name, message, payload, metadata) {
    return [78 /* JSException */, name, message, payload, metadata];
}
export function RawCustomEvent(name, payload) {
    return [27 /* RawCustomEvent */, name, payload];
}
export function UserID(id) {
    return [28 /* UserID */, id];
}
export function UserAnonymousID(id) {
    return [29 /* UserAnonymousID */, id];
}
export function Metadata(key, value) {
    return [30 /* Metadata */, key, value];
}
export function CSSInsertRule(id, rule, index) {
    return [37 /* CSSInsertRule */, id, rule, index];
}
export function CSSDeleteRule(id, index) {
    return [38 /* CSSDeleteRule */, id, index];
}
export function Fetch(method, url, request, response, status, timestamp, duration) {
    return [39 /* Fetch */, method, url, request, response, status, timestamp, duration];
}
export function Profiler(name, duration, args, result) {
    return [40 /* Profiler */, name, duration, args, result];
}
export function OTable(key, value) {
    return [41 /* OTable */, key, value];
}
export function StateAction(type) {
    return [42 /* StateAction */, type];
}
export function Redux(action, state, duration) {
    return [44 /* Redux */, action, state, duration];
}
export function Vuex(mutation, state) {
    return [45 /* Vuex */, mutation, state];
}
export function MobX(type, payload) {
    return [46 /* MobX */, type, payload];
}
export function NgRx(action, state, duration) {
    return [47 /* NgRx */, action, state, duration];
}
export function GraphQL(operationKind, operationName, variables, response) {
    return [48 /* GraphQL */, operationKind, operationName, variables, response];
}
export function PerformanceTrack(frames, ticks, totalJSHeapSize, usedJSHeapSize) {
    return [49 /* PerformanceTrack */, frames, ticks, totalJSHeapSize, usedJSHeapSize];
}
export function ResourceTiming(timestamp, duration, ttfb, headerSize, encodedBodySize, decodedBodySize, url, initiator) {
    return [
        53 /* ResourceTiming */,
        timestamp,
        duration,
        ttfb,
        headerSize,
        encodedBodySize,
        decodedBodySize,
        url,
        initiator,
    ];
}
export function ConnectionInformation(downlink, type) {
    return [54 /* ConnectionInformation */, downlink, type];
}
export function SetPageVisibility(hidden) {
    return [55 /* SetPageVisibility */, hidden];
}
export function LongTask(timestamp, duration, context, containerType, containerSrc, containerId, containerName) {
    return [
        59 /* LongTask */,
        timestamp,
        duration,
        context,
        containerType,
        containerSrc,
        containerId,
        containerName,
    ];
}
export function SetNodeAttributeURLBased(id, name, value, baseURL) {
    return [60 /* SetNodeAttributeURLBased */, id, name, value, baseURL];
}
export function SetCSSDataURLBased(id, data, baseURL) {
    return [61 /* SetCSSDataURLBased */, id, data, baseURL];
}
export function TechnicalInfo(type, value) {
    return [63 /* TechnicalInfo */, type, value];
}
export function CustomIssue(name, payload) {
    return [64 /* CustomIssue */, name, payload];
}
export function CSSInsertRuleURLBased(id, rule, index, baseURL) {
    return [67 /* CSSInsertRuleURLBased */, id, rule, index, baseURL];
}
export function MouseClick(id, hesitationTime, label, selector) {
    return [69 /* MouseClick */, id, hesitationTime, label, selector];
}
export function CreateIFrameDocument(frameID, id) {
    return [70 /* CreateIFrameDocument */, frameID, id];
}
