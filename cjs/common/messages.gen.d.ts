export declare const enum Type {
    BatchMetadata = 81,
    PartitionedMessage = 82,
    Timestamp = 0,
    SetPageLocation = 4,
    SetViewportSize = 5,
    SetViewportScroll = 6,
    CreateDocument = 7,
    CreateElementNode = 8,
    CreateTextNode = 9,
    MoveNode = 10,
    RemoveNode = 11,
    SetNodeAttribute = 12,
    RemoveNodeAttribute = 13,
    SetNodeData = 14,
    SetNodeScroll = 16,
    SetInputTarget = 17,
    SetInputValue = 18,
    SetInputChecked = 19,
    MouseMove = 20,
    ConsoleLog = 22,
    PageLoadTiming = 23,
    PageRenderTiming = 24,
    JSExceptionDeprecated = 25,
    RawCustomEvent = 27,
    UserID = 28,
    UserAnonymousID = 29,
    Metadata = 30,
    CSSInsertRule = 37,
    CSSDeleteRule = 38,
    Fetch = 39,
    Profiler = 40,
    OTable = 41,
    StateAction = 42,
    Redux = 44,
    Vuex = 45,
    MobX = 46,
    NgRx = 47,
    GraphQL = 48,
    PerformanceTrack = 49,
    ResourceTiming = 53,
    ConnectionInformation = 54,
    SetPageVisibility = 55,
    LoadFontFace = 57,
    SetNodeFocus = 58,
    LongTask = 59,
    SetNodeAttributeURLBased = 60,
    SetCSSDataURLBased = 61,
    TechnicalInfo = 63,
    CustomIssue = 64,
    CSSInsertRuleURLBased = 67,
    MouseClick = 69,
    CreateIFrameDocument = 70,
    AdoptedSSReplaceURLBased = 71,
    AdoptedSSInsertRuleURLBased = 73,
    AdoptedSSDeleteRule = 75,
    AdoptedSSAddOwner = 76,
    AdoptedSSRemoveOwner = 77,
    Zustand = 79,
    JSException = 78
}
export declare type BatchMetadata = [
    Type.BatchMetadata,
    number,
    number,
    number,
    number,
    string
];
export declare type PartitionedMessage = [
    Type.PartitionedMessage,
    number,
    number
];
export declare type Timestamp = [
    Type.Timestamp,
    number
];
export declare type SetPageLocation = [
    Type.SetPageLocation,
    string,
    string,
    number
];
export declare type SetViewportSize = [
    Type.SetViewportSize,
    number,
    number
];
export declare type SetViewportScroll = [
    Type.SetViewportScroll,
    number,
    number
];
export declare type CreateDocument = [
    Type.CreateDocument
];
export declare type CreateElementNode = [
    Type.CreateElementNode,
    number,
    number,
    number,
    string,
    boolean
];
export declare type CreateTextNode = [
    Type.CreateTextNode,
    number,
    number,
    number
];
export declare type MoveNode = [
    Type.MoveNode,
    number,
    number,
    number
];
export declare type RemoveNode = [
    Type.RemoveNode,
    number
];
export declare type SetNodeAttribute = [
    Type.SetNodeAttribute,
    number,
    string,
    string
];
export declare type RemoveNodeAttribute = [
    Type.RemoveNodeAttribute,
    number,
    string
];
export declare type SetNodeData = [
    Type.SetNodeData,
    number,
    string
];
export declare type SetNodeScroll = [
    Type.SetNodeScroll,
    number,
    number,
    number
];
export declare type SetInputTarget = [
    Type.SetInputTarget,
    number,
    string
];
export declare type SetInputValue = [
    Type.SetInputValue,
    number,
    string,
    number
];
export declare type SetInputChecked = [
    Type.SetInputChecked,
    number,
    boolean
];
export declare type MouseMove = [
    Type.MouseMove,
    number,
    number
];
export declare type ConsoleLog = [
    Type.ConsoleLog,
    string,
    string
];
export declare type PageLoadTiming = [
    Type.PageLoadTiming,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
export declare type PageRenderTiming = [
    Type.PageRenderTiming,
    number,
    number,
    number
];
export declare type JSExceptionDeprecated = [
    Type.JSExceptionDeprecated,
    string,
    string,
    string
];
export declare type RawCustomEvent = [
    Type.RawCustomEvent,
    string,
    string
];
export declare type UserID = [
    Type.UserID,
    string
];
export declare type UserAnonymousID = [
    Type.UserAnonymousID,
    string
];
export declare type Metadata = [
    Type.Metadata,
    string,
    string
];
export declare type CSSInsertRule = [
    Type.CSSInsertRule,
    number,
    string,
    number
];
export declare type CSSDeleteRule = [
    Type.CSSDeleteRule,
    number,
    number
];
export declare type Fetch = [
    Type.Fetch,
    string,
    string,
    string,
    string,
    number,
    number,
    number
];
export declare type Profiler = [
    Type.Profiler,
    string,
    number,
    string,
    string
];
export declare type OTable = [
    Type.OTable,
    string,
    string
];
export declare type StateAction = [
    Type.StateAction,
    string
];
export declare type Redux = [
    Type.Redux,
    string,
    string,
    number
];
export declare type Vuex = [
    Type.Vuex,
    string,
    string
];
export declare type MobX = [
    Type.MobX,
    string,
    string
];
export declare type NgRx = [
    Type.NgRx,
    string,
    string,
    number
];
export declare type GraphQL = [
    Type.GraphQL,
    string,
    string,
    string,
    string
];
export declare type PerformanceTrack = [
    Type.PerformanceTrack,
    number,
    number,
    number,
    number
];
export declare type ResourceTiming = [
    Type.ResourceTiming,
    number,
    number,
    number,
    number,
    number,
    number,
    string,
    string
];
export declare type ConnectionInformation = [
    Type.ConnectionInformation,
    number,
    string
];
export declare type SetPageVisibility = [
    Type.SetPageVisibility,
    boolean
];
export declare type LoadFontFace = [
    Type.LoadFontFace,
    number,
    string,
    string,
    string
];
export declare type SetNodeFocus = [
    Type.SetNodeFocus,
    number
];
export declare type LongTask = [
    Type.LongTask,
    number,
    number,
    number,
    number,
    string,
    string,
    string
];
export declare type SetNodeAttributeURLBased = [
    Type.SetNodeAttributeURLBased,
    number,
    string,
    string,
    string
];
export declare type SetCSSDataURLBased = [
    Type.SetCSSDataURLBased,
    number,
    string,
    string
];
export declare type TechnicalInfo = [
    Type.TechnicalInfo,
    string,
    string
];
export declare type CustomIssue = [
    Type.CustomIssue,
    string,
    string
];
export declare type CSSInsertRuleURLBased = [
    Type.CSSInsertRuleURLBased,
    number,
    string,
    number,
    string
];
export declare type MouseClick = [
    Type.MouseClick,
    number,
    number,
    string,
    string
];
export declare type CreateIFrameDocument = [
    Type.CreateIFrameDocument,
    number,
    number
];
export declare type AdoptedSSReplaceURLBased = [
    Type.AdoptedSSReplaceURLBased,
    number,
    string,
    string
];
export declare type AdoptedSSInsertRuleURLBased = [
    Type.AdoptedSSInsertRuleURLBased,
    number,
    string,
    number,
    string
];
export declare type AdoptedSSDeleteRule = [
    Type.AdoptedSSDeleteRule,
    number,
    number
];
export declare type AdoptedSSAddOwner = [
    Type.AdoptedSSAddOwner,
    number,
    number
];
export declare type AdoptedSSRemoveOwner = [
    Type.AdoptedSSRemoveOwner,
    number,
    number
];
export declare type Zustand = [
    Type.Zustand,
    string,
    string
];
export declare type JSException = [
    Type.JSException,
    string,
    string,
    string,
    string
];
declare type Message = BatchMetadata | PartitionedMessage | Timestamp | SetPageLocation | SetViewportSize | SetViewportScroll | CreateDocument | CreateElementNode | CreateTextNode | MoveNode | RemoveNode | SetNodeAttribute | RemoveNodeAttribute | SetNodeData | SetNodeScroll | SetInputTarget | SetInputValue | SetInputChecked | MouseMove | ConsoleLog | PageLoadTiming | PageRenderTiming | JSExceptionDeprecated | RawCustomEvent | UserID | UserAnonymousID | Metadata | CSSInsertRule | CSSDeleteRule | Fetch | Profiler | OTable | StateAction | Redux | Vuex | MobX | NgRx | GraphQL | PerformanceTrack | ResourceTiming | ConnectionInformation | SetPageVisibility | LoadFontFace | SetNodeFocus | LongTask | SetNodeAttributeURLBased | SetCSSDataURLBased | TechnicalInfo | CustomIssue | CSSInsertRuleURLBased | MouseClick | CreateIFrameDocument | AdoptedSSReplaceURLBased | AdoptedSSInsertRuleURLBased | AdoptedSSDeleteRule | AdoptedSSAddOwner | AdoptedSSRemoveOwner | Zustand | JSException;
export default Message;
