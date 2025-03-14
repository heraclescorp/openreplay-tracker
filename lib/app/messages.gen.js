// Auto-generated, do not edit
/* eslint-disable */
export function Timestamp(timestamp) {
    return [
        0 /* Messages.Type.Timestamp */,
        timestamp,
    ];
}
export function SetPageLocation(url, referrer, navigationStart) {
    return [
        4 /* Messages.Type.SetPageLocation */,
        url,
        referrer,
        navigationStart,
    ];
}
export function SetViewportSize(width, height) {
    return [
        5 /* Messages.Type.SetViewportSize */,
        width,
        height,
    ];
}
export function SetViewportScroll(x, y) {
    return [
        6 /* Messages.Type.SetViewportScroll */,
        x,
        y,
    ];
}
export function CreateDocument() {
    return [
        7 /* Messages.Type.CreateDocument */,
    ];
}
export function CreateElementNode(id, parentID, index, tag, svg) {
    return [
        8 /* Messages.Type.CreateElementNode */,
        id,
        parentID,
        index,
        tag,
        svg,
    ];
}
export function CreateTextNode(id, parentID, index) {
    return [
        9 /* Messages.Type.CreateTextNode */,
        id,
        parentID,
        index,
    ];
}
export function MoveNode(id, parentID, index) {
    return [
        10 /* Messages.Type.MoveNode */,
        id,
        parentID,
        index,
    ];
}
export function RemoveNode(id) {
    return [
        11 /* Messages.Type.RemoveNode */,
        id,
    ];
}
export function SetNodeAttribute(id, name, value) {
    return [
        12 /* Messages.Type.SetNodeAttribute */,
        id,
        name,
        value,
    ];
}
export function RemoveNodeAttribute(id, name) {
    return [
        13 /* Messages.Type.RemoveNodeAttribute */,
        id,
        name,
    ];
}
export function SetNodeData(id, data) {
    return [
        14 /* Messages.Type.SetNodeData */,
        id,
        data,
    ];
}
export function SetNodeScroll(id, x, y) {
    return [
        16 /* Messages.Type.SetNodeScroll */,
        id,
        x,
        y,
    ];
}
export function SetInputTarget(id, label) {
    return [
        17 /* Messages.Type.SetInputTarget */,
        id,
        label,
    ];
}
export function SetInputValue(id, value, mask) {
    return [
        18 /* Messages.Type.SetInputValue */,
        id,
        value,
        mask,
    ];
}
export function SetInputChecked(id, checked) {
    return [
        19 /* Messages.Type.SetInputChecked */,
        id,
        checked,
    ];
}
export function MouseMove(x, y) {
    return [
        20 /* Messages.Type.MouseMove */,
        x,
        y,
    ];
}
export function NetworkRequest(type, method, url, request, response, status, timestamp, duration) {
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
export function ConsoleLog(level, value) {
    return [
        22 /* Messages.Type.ConsoleLog */,
        level,
        value,
    ];
}
export function PageLoadTiming(requestStart, responseStart, responseEnd, domContentLoadedEventStart, domContentLoadedEventEnd, loadEventStart, loadEventEnd, firstPaint, firstContentfulPaint) {
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
export function PageRenderTiming(speedIndex, visuallyComplete, timeToInteractive) {
    return [
        24 /* Messages.Type.PageRenderTiming */,
        speedIndex,
        visuallyComplete,
        timeToInteractive,
    ];
}
export function CustomEvent(name, payload) {
    return [
        27 /* Messages.Type.CustomEvent */,
        name,
        payload,
    ];
}
export function UserID(id) {
    return [
        28 /* Messages.Type.UserID */,
        id,
    ];
}
export function UserAnonymousID(id) {
    return [
        29 /* Messages.Type.UserAnonymousID */,
        id,
    ];
}
export function Metadata(key, value) {
    return [
        30 /* Messages.Type.Metadata */,
        key,
        value,
    ];
}
export function CSSInsertRule(id, rule, index) {
    return [
        37 /* Messages.Type.CSSInsertRule */,
        id,
        rule,
        index,
    ];
}
export function CSSDeleteRule(id, index) {
    return [
        38 /* Messages.Type.CSSDeleteRule */,
        id,
        index,
    ];
}
export function Fetch(method, url, request, response, status, timestamp, duration) {
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
export function Profiler(name, duration, args, result) {
    return [
        40 /* Messages.Type.Profiler */,
        name,
        duration,
        args,
        result,
    ];
}
export function OTable(key, value) {
    return [
        41 /* Messages.Type.OTable */,
        key,
        value,
    ];
}
export function StateAction(type) {
    return [
        42 /* Messages.Type.StateAction */,
        type,
    ];
}
export function Redux(action, state, duration) {
    return [
        44 /* Messages.Type.Redux */,
        action,
        state,
        duration,
    ];
}
export function Vuex(mutation, state) {
    return [
        45 /* Messages.Type.Vuex */,
        mutation,
        state,
    ];
}
export function MobX(type, payload) {
    return [
        46 /* Messages.Type.MobX */,
        type,
        payload,
    ];
}
export function NgRx(action, state, duration) {
    return [
        47 /* Messages.Type.NgRx */,
        action,
        state,
        duration,
    ];
}
export function GraphQL(operationKind, operationName, variables, response) {
    return [
        48 /* Messages.Type.GraphQL */,
        operationKind,
        operationName,
        variables,
        response,
    ];
}
export function PerformanceTrack(frames, ticks, totalJSHeapSize, usedJSHeapSize) {
    return [
        49 /* Messages.Type.PerformanceTrack */,
        frames,
        ticks,
        totalJSHeapSize,
        usedJSHeapSize,
    ];
}
export function StringDict(key, value) {
    return [
        50 /* Messages.Type.StringDict */,
        key,
        value,
    ];
}
export function SetNodeAttributeDict(id, nameKey, valueKey) {
    return [
        51 /* Messages.Type.SetNodeAttributeDict */,
        id,
        nameKey,
        valueKey,
    ];
}
export function ResourceTimingDeprecated(timestamp, duration, ttfb, headerSize, encodedBodySize, decodedBodySize, url, initiator) {
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
export function ConnectionInformation(downlink, type) {
    return [
        54 /* Messages.Type.ConnectionInformation */,
        downlink,
        type,
    ];
}
export function SetPageVisibility(hidden) {
    return [
        55 /* Messages.Type.SetPageVisibility */,
        hidden,
    ];
}
export function LoadFontFace(parentID, family, source, descriptors) {
    return [
        57 /* Messages.Type.LoadFontFace */,
        parentID,
        family,
        source,
        descriptors,
    ];
}
export function SetNodeFocus(id) {
    return [
        58 /* Messages.Type.SetNodeFocus */,
        id,
    ];
}
export function LongTask(timestamp, duration, context, containerType, containerSrc, containerId, containerName) {
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
export function SetNodeAttributeURLBased(id, name, value, baseURL) {
    return [
        60 /* Messages.Type.SetNodeAttributeURLBased */,
        id,
        name,
        value,
        baseURL,
    ];
}
export function SetCSSDataURLBased(id, data, baseURL) {
    return [
        61 /* Messages.Type.SetCSSDataURLBased */,
        id,
        data,
        baseURL,
    ];
}
export function TechnicalInfo(type, value) {
    return [
        63 /* Messages.Type.TechnicalInfo */,
        type,
        value,
    ];
}
export function CustomIssue(name, payload) {
    return [
        64 /* Messages.Type.CustomIssue */,
        name,
        payload,
    ];
}
export function CSSInsertRuleURLBased(id, rule, index, baseURL) {
    return [
        67 /* Messages.Type.CSSInsertRuleURLBased */,
        id,
        rule,
        index,
        baseURL,
    ];
}
export function MouseClick(id, hesitationTime, label, selector) {
    return [
        69 /* Messages.Type.MouseClick */,
        id,
        hesitationTime,
        label,
        selector,
    ];
}
export function CreateIFrameDocument(frameID, id) {
    return [
        70 /* Messages.Type.CreateIFrameDocument */,
        frameID,
        id,
    ];
}
export function AdoptedSSReplaceURLBased(sheetID, text, baseURL) {
    return [
        71 /* Messages.Type.AdoptedSSReplaceURLBased */,
        sheetID,
        text,
        baseURL,
    ];
}
export function AdoptedSSInsertRuleURLBased(sheetID, rule, index, baseURL) {
    return [
        73 /* Messages.Type.AdoptedSSInsertRuleURLBased */,
        sheetID,
        rule,
        index,
        baseURL,
    ];
}
export function AdoptedSSDeleteRule(sheetID, index) {
    return [
        75 /* Messages.Type.AdoptedSSDeleteRule */,
        sheetID,
        index,
    ];
}
export function AdoptedSSAddOwner(sheetID, id) {
    return [
        76 /* Messages.Type.AdoptedSSAddOwner */,
        sheetID,
        id,
    ];
}
export function AdoptedSSRemoveOwner(sheetID, id) {
    return [
        77 /* Messages.Type.AdoptedSSRemoveOwner */,
        sheetID,
        id,
    ];
}
export function JSException(name, message, payload, metadata) {
    return [
        78 /* Messages.Type.JSException */,
        name,
        message,
        payload,
        metadata,
    ];
}
export function Zustand(mutation, state) {
    return [
        79 /* Messages.Type.Zustand */,
        mutation,
        state,
    ];
}
export function BatchMetadata(version, pageNo, firstIndex, timestamp, location) {
    return [
        81 /* Messages.Type.BatchMetadata */,
        version,
        pageNo,
        firstIndex,
        timestamp,
        location,
    ];
}
export function PartitionedMessage(partNo, partTotal) {
    return [
        82 /* Messages.Type.PartitionedMessage */,
        partNo,
        partTotal,
    ];
}
export function InputChange(id, value, valueMasked, label, hesitationTime, inputDuration) {
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
export function SelectionChange(selectionStart, selectionEnd, selection) {
    return [
        113 /* Messages.Type.SelectionChange */,
        selectionStart,
        selectionEnd,
        selection,
    ];
}
export function MouseThrashing(timestamp) {
    return [
        114 /* Messages.Type.MouseThrashing */,
        timestamp,
    ];
}
export function UnbindNodes(totalRemovedPercent) {
    return [
        115 /* Messages.Type.UnbindNodes */,
        totalRemovedPercent,
    ];
}
export function ResourceTiming(timestamp, duration, ttfb, headerSize, encodedBodySize, decodedBodySize, url, initiator, transferredSize, cached) {
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
export function TabChange(tabId) {
    return [
        117 /* Messages.Type.TabChange */,
        tabId,
    ];
}
export function TabData(tabId) {
    return [
        118 /* Messages.Type.TabData */,
        tabId,
    ];
}
