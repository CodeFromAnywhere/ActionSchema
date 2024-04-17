// aiming to have a central place where I can keep track of different state keys and its purpose
export const localStorageKeys = {
    getPositionKey: (editorId) => `position-${editorId}`,
};
export const idbKeys = {
    dataUpdatedAt: `misc:dataUpdatedAt`,
    /** should be present on idb */
    isFileHandle: (key) => key.startsWith("fsFileHandle:"),
    getFileHandleKey: (fileId) => `fsFileHandle:${fileId}`,
};
export const upstashKeys = {
    isDataKey: (key) => key.startsWith("data:"),
    /** key needed to determine last time some data changed */
    dataUpdatedAt: `misc:dataUpdatedAt`,
    getDataKey: (dotLocation) => `data:${dotLocation}`,
    getStatusKey: (dotLocation) => `status:${dotLocation}`,
};
//# sourceMappingURL=state.js.map