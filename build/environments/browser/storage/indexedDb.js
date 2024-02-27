/** DB name is always the same. 1 DB */
const dbName = "schema";
let version = 1;
let request;
let db;
export const initDb = async (databaseId) => {
    const isSuccessful = await new Promise((resolve) => {
        // open the connection
        request = indexedDB.open(dbName);
        request.onupgradeneeded = () => {
            db = request.result;
            // if the data object store doesn't exist, create it
            if (!db.objectStoreNames.contains(databaseId)) {
                console.log("Creating users store");
                db.createObjectStore(databaseId, {
                // keyPath: "id"
                });
            }
            // no need to resolve here
        };
        request.onsuccess = () => {
            db = request.result;
            version = db.version;
            console.log("request.onsuccess - initDB", version);
            resolve(true);
        };
        request.onerror = () => {
            resolve(false);
        };
    });
    return isSuccessful;
};
export const indexedDbPutData = (databaseId, key, value) => {
    return new Promise((resolve) => {
        request = indexedDB.open(dbName, version);
        request.onsuccess = () => {
            console.log("request.onsuccess - putData");
            db = request.result;
            const tx = db.transaction(databaseId, "readwrite");
            const store = tx.objectStore(databaseId);
            store.put(value, key);
            resolve({ isSuccessful: true, message: `Put ${key}`, result: value });
        };
        request.onerror = () => {
            const error = request.error?.message;
            if (error) {
                resolve({ isSuccessful: false, message: error, result: undefined });
            }
            else {
                resolve({
                    isSuccessful: false,
                    message: "Unknown error",
                    result: undefined,
                });
            }
        };
    });
};
export const indexedDbDeleteData = (databaseId, key) => {
    return new Promise((resolve) => {
        request = indexedDB.open(dbName, version);
        request.onsuccess = () => {
            console.log("request.onsuccess - deleteData", key);
            db = request.result;
            const tx = db.transaction(databaseId, "readwrite");
            const store = tx.objectStore(databaseId);
            const res = store.delete(key);
            res.onsuccess = () => {
                resolve(true);
            };
            res.onerror = () => {
                resolve(false);
            };
        };
    });
};
/** Probably don't need for now */
export const indexedDbUpdateData = (databaseId, key, data) => {
    return new Promise((resolve) => {
        request = indexedDB.open(dbName, version);
        request.onsuccess = () => {
            console.log("request.onsuccess - updateData", key);
            db = request.result;
            const tx = db.transaction(databaseId, "readwrite");
            const store = tx.objectStore(databaseId);
            const res = store.get(key);
            res.onsuccess = () => {
                const newData = { ...res.result, ...data };
                store.put(newData);
                resolve(newData);
            };
            res.onerror = () => {
                resolve(null);
            };
        };
    });
};
/** Gets all store data */
export const indexedDbGetStoreData = (
/** E.g. the full JSON object */
databaseId) => {
    return new Promise((resolve) => {
        request = indexedDB.open(dbName);
        request.onsuccess = () => {
            console.log("request.onsuccess - getAllData");
            db = request.result;
            const tx = db.transaction(databaseId, "readonly");
            const store = tx.objectStore(databaseId);
            const res = store.getAll();
            res.onsuccess = () => {
                resolve(res.result);
            };
        };
    });
};
/** Gets one key store data */
export const indexedDbGetStoreItem = (
/** E.g. the full JSON object */
databaseId, key) => {
    return new Promise((resolve) => {
        request = indexedDB.open(dbName);
        request.onsuccess = () => {
            console.log("request.onsuccess - getAllData");
            db = request.result;
            const tx = db.transaction(databaseId, "readonly");
            const store = tx.objectStore(databaseId);
            const res = store.get(key);
            res.onsuccess = () => {
                resolve(res.result);
            };
        };
    });
};
//# sourceMappingURL=indexedDb.js.map