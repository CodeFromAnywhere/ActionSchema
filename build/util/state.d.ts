export declare const localStorageKeys: {
    getPositionKey: (editorId: string) => string;
};
export declare const idbKeys: {
    dataUpdatedAt: string;
    /** should be present on idb */
    isFileHandle: (key: string) => boolean;
    getFileHandleKey: (fileId: string) => string;
};
export declare const upstashKeys: {
    isDataKey: (key: string) => boolean;
    /** key needed to determine last time some data changed */
    dataUpdatedAt: string;
    getDataKey: (dotLocation: string) => string;
    getStatusKey: (dotLocation: string) => string;
};
//# sourceMappingURL=state.d.ts.map