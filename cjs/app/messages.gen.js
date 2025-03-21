"use strict";
// Auto-generated, do not edit
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSInsertRuleURLBased = exports.CustomIssue = exports.TechnicalInfo = exports.SetCSSDataURLBased = exports.SetNodeAttributeURLBased = exports.LongTask = exports.SetNodeFocus = exports.LoadFontFace = exports.SetPageVisibility = exports.ConnectionInformation = exports.ResourceTimingDeprecated = exports.SetNodeAttributeDict = exports.StringDict = exports.PerformanceTrack = exports.GraphQL = exports.NgRx = exports.MobX = exports.Vuex = exports.Redux = exports.StateAction = exports.OTable = exports.Profiler = exports.Fetch = exports.CSSDeleteRule = exports.CSSInsertRule = exports.Metadata = exports.UserAnonymousID = exports.UserID = exports.CustomEvent = exports.PageRenderTiming = exports.PageLoadTiming = exports.ConsoleLog = exports.NetworkRequest = exports.MouseMove = exports.SetInputChecked = exports.SetInputValue = exports.SetInputTarget = exports.SetNodeScroll = exports.SetNodeData = exports.RemoveNodeAttribute = exports.SetNodeAttribute = exports.RemoveNode = exports.MoveNode = exports.CreateTextNode = exports.CreateElementNode = exports.CreateDocument = exports.SetViewportScroll = exports.SetViewportSize = exports.SetPageLocation = exports.Timestamp = void 0;
exports.TabData = exports.TabChange = exports.ResourceTiming = exports.UnbindNodes = exports.MouseThrashing = exports.SelectionChange = exports.InputChange = exports.PartitionedMessage = exports.BatchMetadata = exports.Zustand = exports.JSException = exports.AdoptedSSRemoveOwner = exports.AdoptedSSAddOwner = exports.AdoptedSSDeleteRule = exports.AdoptedSSInsertRuleURLBased = exports.AdoptedSSReplaceURLBased = exports.CreateIFrameDocument = exports.MouseClick = void 0;
function Timestamp(timestamp) {
    return [
        0 /* Messages.Type.Timestamp */,
        timestamp,
    ];
}
exports.Timestamp = Timestamp;
function SetPageLocation(url, referrer, navigationStart) {
    return [
        4 /* Messages.Type.SetPageLocation */,
        url,
        referrer,
        navigationStart,
    ];
}
exports.SetPageLocation = SetPageLocation;
function SetViewportSize(width, height) {
    return [
        5 /* Messages.Type.SetViewportSize */,
        width,
        height,
    ];
}
exports.SetViewportSize = SetViewportSize;
function SetViewportScroll(x, y) {
    return [
        6 /* Messages.Type.SetViewportScroll */,
        x,
        y,
    ];
}
exports.SetViewportScroll = SetViewportScroll;
function CreateDocument() {
    return [
        7 /* Messages.Type.CreateDocument */,
    ];
}
exports.CreateDocument = CreateDocument;
function CreateElementNode(id, parentID, index, tag, svg) {
    return [
        8 /* Messages.Type.CreateElementNode */,
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
        9 /* Messages.Type.CreateTextNode */,
        id,
        parentID,
        index,
    ];
}
exports.CreateTextNode = CreateTextNode;
function MoveNode(id, parentID, index) {
    return [
        10 /* Messages.Type.MoveNode */,
        id,
        parentID,
        index,
    ];
}
exports.MoveNode = MoveNode;
function RemoveNode(id) {
    return [
        11 /* Messages.Type.RemoveNode */,
        id,
    ];
}
exports.RemoveNode = RemoveNode;
function SetNodeAttribute(id, name, value) {
    return [
        12 /* Messages.Type.SetNodeAttribute */,
        id,
        name,
        value,
    ];
}
exports.SetNodeAttribute = SetNodeAttribute;
function RemoveNodeAttribute(id, name) {
    return [
        13 /* Messages.Type.RemoveNodeAttribute */,
        id,
        name,
    ];
}
exports.RemoveNodeAttribute = RemoveNodeAttribute;
function SetNodeData(id, data) {
    return [
        14 /* Messages.Type.SetNodeData */,
        id,
        data,
    ];
}
exports.SetNodeData = SetNodeData;
function SetNodeScroll(id, x, y) {
    return [
        16 /* Messages.Type.SetNodeScroll */,
        id,
        x,
        y,
    ];
}
exports.SetNodeScroll = SetNodeScroll;
function SetInputTarget(id, label) {
    return [
        17 /* Messages.Type.SetInputTarget */,
        id,
        label,
    ];
}
exports.SetInputTarget = SetInputTarget;
function SetInputValue(id, value, mask) {
    return [
        18 /* Messages.Type.SetInputValue */,
        id,
        value,
        mask,
    ];
}
exports.SetInputValue = SetInputValue;
function SetInputChecked(id, checked) {
    return [
        19 /* Messages.Type.SetInputChecked */,
        id,
        checked,
    ];
}
exports.SetInputChecked = SetInputChecked;
function MouseMove(x, y) {
    return [
        20 /* Messages.Type.MouseMove */,
        x,
        y,
    ];
}
exports.MouseMove = MouseMove;
function NetworkRequest(type, method, url, request, response, status, timestamp, duration) {
    return [
        21 /* Messages.Type.NetworkRequest */,
        type,
        method,
        url,
        request,
        response,
        status,
        timestamp,
        duration,
    ];
}
exports.NetworkRequest = NetworkRequest;
function ConsoleLog(level, value) {
    return [
        22 /* Messages.Type.ConsoleLog */,
        level,
        value,
    ];
}
exports.ConsoleLog = ConsoleLog;
function PageLoadTiming(requestStart, responseStart, responseEnd, domContentLoadedEventStart, domContentLoadedEventEnd, loadEventStart, loadEventEnd, firstPaint, firstContentfulPaint) {
    return [
        23 /* Messages.Type.PageLoadTiming */,
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
        24 /* Messages.Type.PageRenderTiming */,
        speedIndex,
        visuallyComplete,
        timeToInteractive,
    ];
}
exports.PageRenderTiming = PageRenderTiming;
function CustomEvent(name, payload) {
    return [
        27 /* Messages.Type.CustomEvent */,
        name,
        payload,
    ];
}
exports.CustomEvent = CustomEvent;
function UserID(id) {
    return [
        28 /* Messages.Type.UserID */,
        id,
    ];
}
exports.UserID = UserID;
function UserAnonymousID(id) {
    return [
        29 /* Messages.Type.UserAnonymousID */,
        id,
    ];
}
exports.UserAnonymousID = UserAnonymousID;
function Metadata(key, value) {
    return [
        30 /* Messages.Type.Metadata */,
        key,
        value,
    ];
}
exports.Metadata = Metadata;
function CSSInsertRule(id, rule, index) {
    return [
        37 /* Messages.Type.CSSInsertRule */,
        id,
        rule,
        index,
    ];
}
exports.CSSInsertRule = CSSInsertRule;
function CSSDeleteRule(id, index) {
    return [
        38 /* Messages.Type.CSSDeleteRule */,
        id,
        index,
    ];
}
exports.CSSDeleteRule = CSSDeleteRule;
function Fetch(method, url, request, response, status, timestamp, duration) {
    return [
        39 /* Messages.Type.Fetch */,
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
        40 /* Messages.Type.Profiler */,
        name,
        duration,
        args,
        result,
    ];
}
exports.Profiler = Profiler;
function OTable(key, value) {
    return [
        41 /* Messages.Type.OTable */,
        key,
        value,
    ];
}
exports.OTable = OTable;
function StateAction(type) {
    return [
        42 /* Messages.Type.StateAction */,
        type,
    ];
}
exports.StateAction = StateAction;
function Redux(action, state, duration) {
    return [
        44 /* Messages.Type.Redux */,
        action,
        state,
        duration,
    ];
}
exports.Redux = Redux;
function Vuex(mutation, state) {
    return [
        45 /* Messages.Type.Vuex */,
        mutation,
        state,
    ];
}
exports.Vuex = Vuex;
function MobX(type, payload) {
    return [
        46 /* Messages.Type.MobX */,
        type,
        payload,
    ];
}
exports.MobX = MobX;
function NgRx(action, state, duration) {
    return [
        47 /* Messages.Type.NgRx */,
        action,
        state,
        duration,
    ];
}
exports.NgRx = NgRx;
function GraphQL(operationKind, operationName, variables, response) {
    return [
        48 /* Messages.Type.GraphQL */,
        operationKind,
        operationName,
        variables,
        response,
    ];
}
exports.GraphQL = GraphQL;
function PerformanceTrack(frames, ticks, totalJSHeapSize, usedJSHeapSize) {
    return [
        49 /* Messages.Type.PerformanceTrack */,
        frames,
        ticks,
        totalJSHeapSize,
        usedJSHeapSize,
    ];
}
exports.PerformanceTrack = PerformanceTrack;
function StringDict(key, value) {
    return [
        50 /* Messages.Type.StringDict */,
        key,
        value,
    ];
}
exports.StringDict = StringDict;
function SetNodeAttributeDict(id, nameKey, valueKey) {
    return [
        51 /* Messages.Type.SetNodeAttributeDict */,
        id,
        nameKey,
        valueKey,
    ];
}
exports.SetNodeAttributeDict = SetNodeAttributeDict;
function ResourceTimingDeprecated(timestamp, duration, ttfb, headerSize, encodedBodySize, decodedBodySize, url, initiator) {
    return [
        53 /* Messages.Type.ResourceTimingDeprecated */,
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
exports.ResourceTimingDeprecated = ResourceTimingDeprecated;
function ConnectionInformation(downlink, type) {
    return [
        54 /* Messages.Type.ConnectionInformation */,
        downlink,
        type,
    ];
}
exports.ConnectionInformation = ConnectionInformation;
function SetPageVisibility(hidden) {
    return [
        55 /* Messages.Type.SetPageVisibility */,
        hidden,
    ];
}
exports.SetPageVisibility = SetPageVisibility;
function LoadFontFace(parentID, family, source, descriptors) {
    return [
        57 /* Messages.Type.LoadFontFace */,
        parentID,
        family,
        source,
        descriptors,
    ];
}
exports.LoadFontFace = LoadFontFace;
function SetNodeFocus(id) {
    return [
        58 /* Messages.Type.SetNodeFocus */,
        id,
    ];
}
exports.SetNodeFocus = SetNodeFocus;
function LongTask(timestamp, duration, context, containerType, containerSrc, containerId, containerName) {
    return [
        59 /* Messages.Type.LongTask */,
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
        60 /* Messages.Type.SetNodeAttributeURLBased */,
        id,
        name,
        value,
        baseURL,
    ];
}
exports.SetNodeAttributeURLBased = SetNodeAttributeURLBased;
function SetCSSDataURLBased(id, data, baseURL) {
    return [
        61 /* Messages.Type.SetCSSDataURLBased */,
        id,
        data,
        baseURL,
    ];
}
exports.SetCSSDataURLBased = SetCSSDataURLBased;
function TechnicalInfo(type, value) {
    return [
        63 /* Messages.Type.TechnicalInfo */,
        type,
        value,
    ];
}
exports.TechnicalInfo = TechnicalInfo;
function CustomIssue(name, payload) {
    return [
        64 /* Messages.Type.CustomIssue */,
        name,
        payload,
    ];
}
exports.CustomIssue = CustomIssue;
function CSSInsertRuleURLBased(id, rule, index, baseURL) {
    return [
        67 /* Messages.Type.CSSInsertRuleURLBased */,
        id,
        rule,
        index,
        baseURL,
    ];
}
exports.CSSInsertRuleURLBased = CSSInsertRuleURLBased;
function MouseClick(id, hesitationTime, label, selector) {
    return [
        69 /* Messages.Type.MouseClick */,
        id,
        hesitationTime,
        label,
        selector,
    ];
}
exports.MouseClick = MouseClick;
function CreateIFrameDocument(frameID, id) {
    return [
        70 /* Messages.Type.CreateIFrameDocument */,
        frameID,
        id,
    ];
}
exports.CreateIFrameDocument = CreateIFrameDocument;
function AdoptedSSReplaceURLBased(sheetID, text, baseURL) {
    return [
        71 /* Messages.Type.AdoptedSSReplaceURLBased */,
        sheetID,
        text,
        baseURL,
    ];
}
exports.AdoptedSSReplaceURLBased = AdoptedSSReplaceURLBased;
function AdoptedSSInsertRuleURLBased(sheetID, rule, index, baseURL) {
    return [
        73 /* Messages.Type.AdoptedSSInsertRuleURLBased */,
        sheetID,
        rule,
        index,
        baseURL,
    ];
}
exports.AdoptedSSInsertRuleURLBased = AdoptedSSInsertRuleURLBased;
function AdoptedSSDeleteRule(sheetID, index) {
    return [
        75 /* Messages.Type.AdoptedSSDeleteRule */,
        sheetID,
        index,
    ];
}
exports.AdoptedSSDeleteRule = AdoptedSSDeleteRule;
function AdoptedSSAddOwner(sheetID, id) {
    return [
        76 /* Messages.Type.AdoptedSSAddOwner */,
        sheetID,
        id,
    ];
}
exports.AdoptedSSAddOwner = AdoptedSSAddOwner;
function AdoptedSSRemoveOwner(sheetID, id) {
    return [
        77 /* Messages.Type.AdoptedSSRemoveOwner */,
        sheetID,
        id,
    ];
}
exports.AdoptedSSRemoveOwner = AdoptedSSRemoveOwner;
function JSException(name, message, payload, metadata) {
    return [
        78 /* Messages.Type.JSException */,
        name,
        message,
        payload,
        metadata,
    ];
}
exports.JSException = JSException;
function Zustand(mutation, state) {
    return [
        79 /* Messages.Type.Zustand */,
        mutation,
        state,
    ];
}
exports.Zustand = Zustand;
function BatchMetadata(version, pageNo, firstIndex, timestamp, location) {
    return [
        81 /* Messages.Type.BatchMetadata */,
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
        82 /* Messages.Type.PartitionedMessage */,
        partNo,
        partTotal,
    ];
}
exports.PartitionedMessage = PartitionedMessage;
function InputChange(id, value, valueMasked, label, hesitationTime, inputDuration) {
    return [
        112 /* Messages.Type.InputChange */,
        id,
        value,
        valueMasked,
        label,
        hesitationTime,
        inputDuration,
    ];
}
exports.InputChange = InputChange;
function SelectionChange(selectionStart, selectionEnd, selection) {
    return [
        113 /* Messages.Type.SelectionChange */,
        selectionStart,
        selectionEnd,
        selection,
    ];
}
exports.SelectionChange = SelectionChange;
function MouseThrashing(timestamp) {
    return [
        114 /* Messages.Type.MouseThrashing */,
        timestamp,
    ];
}
exports.MouseThrashing = MouseThrashing;
function UnbindNodes(totalRemovedPercent) {
    return [
        115 /* Messages.Type.UnbindNodes */,
        totalRemovedPercent,
    ];
}
exports.UnbindNodes = UnbindNodes;
function ResourceTiming(timestamp, duration, ttfb, headerSize, encodedBodySize, decodedBodySize, url, initiator, transferredSize, cached) {
    return [
        116 /* Messages.Type.ResourceTiming */,
        timestamp,
        duration,
        ttfb,
        headerSize,
        encodedBodySize,
        decodedBodySize,
        url,
        initiator,
        transferredSize,
        cached,
    ];
}
exports.ResourceTiming = ResourceTiming;
function TabChange(tabId) {
    return [
        117 /* Messages.Type.TabChange */,
        tabId,
    ];
}
exports.TabChange = TabChange;
function TabData(tabId) {
    return [
        118 /* Messages.Type.TabData */,
        tabId,
    ];
}
exports.TabData = TabData;
