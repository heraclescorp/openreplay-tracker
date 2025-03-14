import * as Messages from '../common/messages.gen.js';
export { default, Type } from '../common/messages.gen.js';
export declare function Timestamp(timestamp: number): Messages.Timestamp;
export declare function SetPageLocation(url: string, referrer: string, navigationStart: number): Messages.SetPageLocation;
export declare function SetViewportSize(width: number, height: number): Messages.SetViewportSize;
export declare function SetViewportScroll(x: number, y: number): Messages.SetViewportScroll;
export declare function CreateDocument(): Messages.CreateDocument;
export declare function CreateElementNode(id: number, parentID: number, index: number, tag: string, svg: boolean): Messages.CreateElementNode;
export declare function CreateTextNode(id: number, parentID: number, index: number): Messages.CreateTextNode;
export declare function MoveNode(id: number, parentID: number, index: number): Messages.MoveNode;
export declare function RemoveNode(id: number): Messages.RemoveNode;
export declare function SetNodeAttribute(id: number, name: string, value: string): Messages.SetNodeAttribute;
export declare function RemoveNodeAttribute(id: number, name: string): Messages.RemoveNodeAttribute;
export declare function SetNodeData(id: number, data: string): Messages.SetNodeData;
export declare function SetNodeScroll(id: number, x: number, y: number): Messages.SetNodeScroll;
export declare function SetInputTarget(id: number, label: string): Messages.SetInputTarget;
export declare function SetInputValue(id: number, value: string, mask: number): Messages.SetInputValue;
export declare function SetInputChecked(id: number, checked: boolean): Messages.SetInputChecked;
export declare function MouseMove(x: number, y: number): Messages.MouseMove;
export declare function NetworkRequest(type: string, method: string, url: string, request: string, response: string, status: number, timestamp: number, duration: number): Messages.NetworkRequest;
export declare function ConsoleLog(level: string, value: string): Messages.ConsoleLog;
export declare function PageLoadTiming(requestStart: number, responseStart: number, responseEnd: number, domContentLoadedEventStart: number, domContentLoadedEventEnd: number, loadEventStart: number, loadEventEnd: number, firstPaint: number, firstContentfulPaint: number): Messages.PageLoadTiming;
export declare function PageRenderTiming(speedIndex: number, visuallyComplete: number, timeToInteractive: number): Messages.PageRenderTiming;
export declare function CustomEvent(name: string, payload: string): Messages.CustomEvent;
export declare function UserID(id: string): Messages.UserID;
export declare function UserAnonymousID(id: string): Messages.UserAnonymousID;
export declare function Metadata(key: string, value: string): Messages.Metadata;
export declare function CSSInsertRule(id: number, rule: string, index: number): Messages.CSSInsertRule;
export declare function CSSDeleteRule(id: number, index: number): Messages.CSSDeleteRule;
export declare function Fetch(method: string, url: string, request: string, response: string, status: number, timestamp: number, duration: number): Messages.Fetch;
export declare function Profiler(name: string, duration: number, args: string, result: string): Messages.Profiler;
export declare function OTable(key: string, value: string): Messages.OTable;
export declare function StateAction(type: string): Messages.StateAction;
export declare function Redux(action: string, state: string, duration: number): Messages.Redux;
export declare function Vuex(mutation: string, state: string): Messages.Vuex;
export declare function MobX(type: string, payload: string): Messages.MobX;
export declare function NgRx(action: string, state: string, duration: number): Messages.NgRx;
export declare function GraphQL(operationKind: string, operationName: string, variables: string, response: string): Messages.GraphQL;
export declare function PerformanceTrack(frames: number, ticks: number, totalJSHeapSize: number, usedJSHeapSize: number): Messages.PerformanceTrack;
export declare function StringDict(key: number, value: string): Messages.StringDict;
export declare function SetNodeAttributeDict(id: number, nameKey: number, valueKey: number): Messages.SetNodeAttributeDict;
export declare function ResourceTimingDeprecated(timestamp: number, duration: number, ttfb: number, headerSize: number, encodedBodySize: number, decodedBodySize: number, url: string, initiator: string): Messages.ResourceTimingDeprecated;
export declare function ConnectionInformation(downlink: number, type: string): Messages.ConnectionInformation;
export declare function SetPageVisibility(hidden: boolean): Messages.SetPageVisibility;
export declare function LoadFontFace(parentID: number, family: string, source: string, descriptors: string): Messages.LoadFontFace;
export declare function SetNodeFocus(id: number): Messages.SetNodeFocus;
export declare function LongTask(timestamp: number, duration: number, context: number, containerType: number, containerSrc: string, containerId: string, containerName: string): Messages.LongTask;
export declare function SetNodeAttributeURLBased(id: number, name: string, value: string, baseURL: string): Messages.SetNodeAttributeURLBased;
export declare function SetCSSDataURLBased(id: number, data: string, baseURL: string): Messages.SetCSSDataURLBased;
export declare function TechnicalInfo(type: string, value: string): Messages.TechnicalInfo;
export declare function CustomIssue(name: string, payload: string): Messages.CustomIssue;
export declare function CSSInsertRuleURLBased(id: number, rule: string, index: number, baseURL: string): Messages.CSSInsertRuleURLBased;
export declare function MouseClick(id: number, hesitationTime: number, label: string, selector: string): Messages.MouseClick;
export declare function CreateIFrameDocument(frameID: number, id: number): Messages.CreateIFrameDocument;
export declare function AdoptedSSReplaceURLBased(sheetID: number, text: string, baseURL: string): Messages.AdoptedSSReplaceURLBased;
export declare function AdoptedSSInsertRuleURLBased(sheetID: number, rule: string, index: number, baseURL: string): Messages.AdoptedSSInsertRuleURLBased;
export declare function AdoptedSSDeleteRule(sheetID: number, index: number): Messages.AdoptedSSDeleteRule;
export declare function AdoptedSSAddOwner(sheetID: number, id: number): Messages.AdoptedSSAddOwner;
export declare function AdoptedSSRemoveOwner(sheetID: number, id: number): Messages.AdoptedSSRemoveOwner;
export declare function JSException(name: string, message: string, payload: string, metadata: string): Messages.JSException;
export declare function Zustand(mutation: string, state: string): Messages.Zustand;
export declare function BatchMetadata(version: number, pageNo: number, firstIndex: number, timestamp: number, location: string): Messages.BatchMetadata;
export declare function PartitionedMessage(partNo: number, partTotal: number): Messages.PartitionedMessage;
export declare function InputChange(id: number, value: string, valueMasked: boolean, label: string, hesitationTime: number, inputDuration: number): Messages.InputChange;
export declare function SelectionChange(selectionStart: number, selectionEnd: number, selection: string): Messages.SelectionChange;
export declare function MouseThrashing(timestamp: number): Messages.MouseThrashing;
export declare function UnbindNodes(totalRemovedPercent: number): Messages.UnbindNodes;
export declare function ResourceTiming(timestamp: number, duration: number, ttfb: number, headerSize: number, encodedBodySize: number, decodedBodySize: number, url: string, initiator: string, transferredSize: number, cached: boolean): Messages.ResourceTiming;
export declare function TabChange(tabId: string): Messages.TabChange;
export declare function TabData(tabId: string): Messages.TabData;
