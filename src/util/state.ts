// aiming to have a central place where I can keep track of different state keys and its purpose

export const localStorageKeys = {
  getPositionKey: (editorId: string) => `position-${editorId}`,
};

export const idbKeys = {
  dataUpdatedAt: `misc:dataUpdatedAt`,
  /** should be present on idb */
  isFileHandle: (key: string) => key.startsWith("fsFileHandle:"),
  getFileHandleKey: (fileId: string) => `fsFileHandle:${fileId}`,
};

export const upstashKeys = {
  isDataKey: (key: string) => key.startsWith("data:"),
  /** key needed to determine last time some data changed */
  dataUpdatedAt: `misc:dataUpdatedAt`,
  getDataKey: (dotLocation: string) => `data:${dotLocation}`,
  getStatusKey: (dotLocation: string) => `status:${dotLocation}`,
};
