"use strict";
// Auto-generated, do not edit
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSInsertRuleURLBased = exports.CustomIssue = exports.TechnicalInfo = exports.SetCSSDataURLBased = exports.SetNodeAttributeURLBased = exports.LongTask = exports.SetNodeFocus = exports.LoadFontFace = exports.SetPageVisibility = exports.ConnectionInformation = exports.ResourceTiming = exports.PerformanceTrack = exports.GraphQL = exports.NgRx = exports.MobX = exports.Vuex = exports.Redux = exports.StateAction = exports.OTable = exports.Profiler = exports.Fetch = exports.CSSDeleteRule = exports.CSSInsertRule = exports.Metadata = exports.UserAnonymousID = exports.UserID = exports.RawCustomEvent = exports.JSExceptionDeprecated = exports.PageRenderTiming = exports.PageLoadTiming = exports.ConsoleLog = exports.MouseMove = exports.SetInputChecked = exports.SetInputValue = exports.SetInputTarget = exports.SetNodeScroll = exports.SetNodeData = exports.RemoveNodeAttribute = exports.SetNodeAttribute = exports.RemoveNode = exports.MoveNode = exports.CreateTextNode = exports.CreateElementNode = exports.CreateDocument = exports.SetViewportScroll = exports.SetViewportSize = exports.SetPageLocation = exports.Timestamp = exports.PartitionedMessage = exports.BatchMetadata = void 0;
exports.JSException = exports.Zustand = exports.AdoptedSSRemoveOwner = exports.AdoptedSSAddOwner = exports.AdoptedSSDeleteRule = exports.AdoptedSSInsertRuleURLBased = exports.AdoptedSSReplaceURLBased = exports.CreateIFrameDocument = exports.MouseClick = void 0;
function BatchMetadata(version, pageNo, firstIndex, timestamp, location) {
    return [
        81 /* BatchMetadata */,
        version,
        pageNo,
        firstIndex,
        timestamp,
        location,
    ];
}
exports.BatchMetadata = BatchMetadata;
function PartitionedMessage(partNo, partTotal) {
    return [
        82 /* PartitionedMessage */,
        partNo,
        partTotal,
    ];
}
exports.PartitionedMessage = PartitionedMessage;
function Timestamp(timestamp) {
    return [
        0 /* Timestamp */,
        timestamp,
    ];
}
exports.Timestamp = Timestamp;
function SetPageLocation(url, referrer, navigationStart) {
    return [
        4 /* SetPageLocation */,
        url,
        referrer,
        navigationStart,
    ];
}
exports.SetPageLocation = SetPageLocation;
function SetViewportSize(width, height) {
    return [
        5 /* SetViewportSize */,
        width,
        height,
    ];
}
exports.SetViewportSize = SetViewportSize;
function SetViewportScroll(x, y) {
    return [
        6 /* SetViewportScroll */,
        x,
        y,
    ];
}
exports.SetViewportScroll = SetViewportScroll;
function CreateDocument() {
    return [
        7 /* CreateDocument */,
    ];
}
exports.CreateDocument = CreateDocument;
function CreateElementNode(id, parentID, index, tag, svg) {
    return [
        8 /* CreateElementNode */,
        id,
        parentID,
        index,
        tag,
        svg,
    ];
}
exports.CreateElementNode = CreateElementNode;
function CreateTextNode(id, parentID, index) {
    return [
        9 /* CreateTextNode */,
        id,
        parentID,
        index,
    ];
}
exports.CreateTextNode = CreateTextNode;
function MoveNode(id, parentID, index) {
    return [
        10 /* MoveNode */,
        id,
        parentID,
        index,
    ];
}
exports.MoveNode = MoveNode;
function RemoveNode(id) {
    return [
        11 /* RemoveNode */,
        id,
    ];
}
exports.RemoveNode = RemoveNode;
function SetNodeAttribute(id, name, value) {
    return [
        12 /* SetNodeAttribute */,
        id,
        name,
        value,
    ];
}
exports.SetNodeAttribute = SetNodeAttribute;
function RemoveNodeAttribute(id, name) {
    return [
        13 /* RemoveNodeAttribute */,
        id,
        name,
    ];
}
exports.RemoveNodeAttribute = RemoveNodeAttribute;
function SetNodeData(id, data) {
    return [
        14 /* SetNodeData */,
        id,
        data,
    ];
}
exports.SetNodeData = SetNodeData;
function SetNodeScroll(id, x, y) {
    return [
        16 /* SetNodeScroll */,
        id,
        x,
        y,
    ];
}
exports.SetNodeScroll = SetNodeScroll;
function SetInputTarget(id, label) {
    return [
        17 /* SetInputTarget */,
        id,
        label,
    ];
}
exports.SetInputTarget = SetInputTarget;
function SetInputValue(id, value, mask) {
    return [
        18 /* SetInputValue */,
        id,
        value,
        mask,
    ];
}
exports.SetInputValue = SetInputValue;
function SetInputChecked(id, checked) {
    return [
        19 /* SetInputChecked */,
        id,
        checked,
    ];
}
exports.SetInputChecked = SetInputChecked;
function MouseMove(x, y) {
    return [
        20 /* MouseMove */,
        x,
        y,
    ];
}
exports.MouseMove = MouseMove;
function ConsoleLog(level, value) {
    return [
        22 /* ConsoleLog */,
        level,
        value,
    ];
}
exports.ConsoleLog = ConsoleLog;
function PageLoadTiming(requestStart, responseStart, responseEnd, domContentLoadedEventStart, domContentLoadedEventEnd, loadEventStart, loadEventEnd, firstPaint, firstContentfulPaint) {
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
exports.PageLoadTiming = PageLoadTiming;
function PageRenderTiming(speedIndex, visuallyComplete, timeToInteractive) {
    return [
        24 /* PageRenderTiming */,
        speedIndex,
        visuallyComplete,
        timeToInteractive,
    ];
}
exports.PageRenderTiming = PageRenderTiming;
function JSExceptionDeprecated(name, message, payload) {
    return [
        25 /* JSExceptionDeprecated */,
        name,
        message,
        payload,
    ];
}
exports.JSExceptionDeprecated = JSExceptionDeprecated;
function RawCustomEvent(name, payload) {
    return [
        27 /* RawCustomEvent */,
        name,
        payload,
    ];
}
exports.RawCustomEvent = RawCustomEvent;
function UserID(id) {
    return [
        28 /* UserID */,
        id,
    ];
}
exports.UserID = UserID;
function UserAnonymousID(id) {
    return [
        29 /* UserAnonymousID */,
        id,
    ];
}
exports.UserAnonymousID = UserAnonymousID;
function Metadata(key, value) {
    return [
        30 /* Metadata */,
        key,
        value,
    ];
}
exports.Metadata = Metadata;
function CSSInsertRule(id, rule, index) {
    return [
        37 /* CSSInsertRule */,
        id,
        rule,
        index,
    ];
}
exports.CSSInsertRule = CSSInsertRule;
function CSSDeleteRule(id, index) {
    return [
        38 /* CSSDeleteRule */,
        id,
        index,
    ];
}
exports.CSSDeleteRule = CSSDeleteRule;
function Fetch(method, url, request, response, status, timestamp, duration) {
    return [
        39 /* Fetch */,
        method,
        url,
        request,
        response,
        status,
        timestamp,
        duration,
    ];
}
exports.Fetch = Fetch;
function Profiler(name, duration, args, result) {
    return [
        40 /* Profiler */,
        name,
        duration,
        args,
        result,
    ];
}
exports.Profiler = Profiler;
function OTable(key, value) {
    return [
        41 /* OTable */,
        key,
        value,
    ];
}
exports.OTable = OTable;
function StateAction(type) {
    return [
        42 /* StateAction */,
        type,
    ];
}
exports.StateAction = StateAction;
function Redux(action, state, duration) {
    return [
        44 /* Redux */,
        action,
        state,
        duration,
    ];
}
exports.Redux = Redux;
function Vuex(mutation, state) {
    return [
        45 /* Vuex */,
        mutation,
        state,
    ];
}
exports.Vuex = Vuex;
function MobX(type, payload) {
    return [
        46 /* MobX */,
        type,
        payload,
    ];
}
exports.MobX = MobX;
function NgRx(action, state, duration) {
    return [
        47 /* NgRx */,
        action,
        state,
        duration,
    ];
}
exports.NgRx = NgRx;
function GraphQL(operationKind, operationName, variables, response) {
    return [
        48 /* GraphQL */,
        operationKind,
        operationName,
        variables,
        response,
    ];
}
exports.GraphQL = GraphQL;
function PerformanceTrack(frames, ticks, totalJSHeapSize, usedJSHeapSize) {
    return [
        49 /* PerformanceTrack */,
        frames,
        ticks,
        totalJSHeapSize,
        usedJSHeapSize,
    ];
}
exports.PerformanceTrack = PerformanceTrack;
function ResourceTiming(timestamp, duration, ttfb, headerSize, encodedBodySize, decodedBodySize, url, initiator) {
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
exports.ResourceTiming = ResourceTiming;
function ConnectionInformation(downlink, type) {
    return [
        54 /* ConnectionInformation */,
        downlink,
        type,
    ];
}
exports.ConnectionInformation = ConnectionInformation;
function SetPageVisibility(hidden) {
    return [
        55 /* SetPageVisibility */,
        hidden,
    ];
}
exports.SetPageVisibility = SetPageVisibility;
function LoadFontFace(parentID, family, source, descriptors) {
    return [
        57 /* LoadFontFace */,
        parentID,
        family,
        source,
        descriptors,
    ];
}
exports.LoadFontFace = LoadFontFace;
function SetNodeFocus(id) {
    return [
        58 /* SetNodeFocus */,
        id,
    ];
}
exports.SetNodeFocus = SetNodeFocus;
function LongTask(timestamp, duration, context, containerType, containerSrc, containerId, containerName) {
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
exports.LongTask = LongTask;
function SetNodeAttributeURLBased(id, name, value, baseURL) {
    return [
        60 /* SetNodeAttributeURLBased */,
        id,
        name,
        value,
        baseURL,
    ];
}
exports.SetNodeAttributeURLBased = SetNodeAttributeURLBased;
function SetCSSDataURLBased(id, data, baseURL) {
    return [
        61 /* SetCSSDataURLBased */,
        id,
        data,
        baseURL,
    ];
}
exports.SetCSSDataURLBased = SetCSSDataURLBased;
function TechnicalInfo(type, value) {
    return [
        63 /* TechnicalInfo */,
        type,
        value,
    ];
}
exports.TechnicalInfo = TechnicalInfo;
function CustomIssue(name, payload) {
    return [
        64 /* CustomIssue */,
        name,
        payload,
    ];
}
exports.CustomIssue = CustomIssue;
function CSSInsertRuleURLBased(id, rule, index, baseURL) {
    return [
        67 /* CSSInsertRuleURLBased */,
        id,
        rule,
        index,
        baseURL,
    ];
}
exports.CSSInsertRuleURLBased = CSSInsertRuleURLBased;
function MouseClick(id, hesitationTime, label, selector) {
    return [
        69 /* MouseClick */,
        id,
        hesitationTime,
        label,
        selector,
    ];
}
exports.MouseClick = MouseClick;
function CreateIFrameDocument(frameID, id) {
    return [
        70 /* CreateIFrameDocument */,
        frameID,
        id,
    ];
}
exports.CreateIFrameDocument = CreateIFrameDocument;
function AdoptedSSReplaceURLBased(sheetID, text, baseURL) {
    return [
        71 /* AdoptedSSReplaceURLBased */,
        sheetID,
        text,
        baseURL,
    ];
}
exports.AdoptedSSReplaceURLBased = AdoptedSSReplaceURLBased;
function AdoptedSSInsertRuleURLBased(sheetID, rule, index, baseURL) {
    return [
        73 /* AdoptedSSInsertRuleURLBased */,
        sheetID,
        rule,
        index,
        baseURL,
    ];
}
exports.AdoptedSSInsertRuleURLBased = AdoptedSSInsertRuleURLBased;
function AdoptedSSDeleteRule(sheetID, index) {
    return [
        75 /* AdoptedSSDeleteRule */,
        sheetID,
        index,
    ];
}
exports.AdoptedSSDeleteRule = AdoptedSSDeleteRule;
function AdoptedSSAddOwner(sheetID, id) {
    return [
        76 /* AdoptedSSAddOwner */,
        sheetID,
        id,
    ];
}
exports.AdoptedSSAddOwner = AdoptedSSAddOwner;
function AdoptedSSRemoveOwner(sheetID, id) {
    return [
        77 /* AdoptedSSRemoveOwner */,
        sheetID,
        id,
    ];
}
exports.AdoptedSSRemoveOwner = AdoptedSSRemoveOwner;
function Zustand(mutation, state) {
    return [
        79 /* Zustand */,
        mutation,
        state,
    ];
}
exports.Zustand = Zustand;
function JSException(name, message, payload, metadata) {
    return [
        78 /* JSException */,
        name,
        message,
        payload,
        metadata,
    ];
}
exports.JSException = JSException;
