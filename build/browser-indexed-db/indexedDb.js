import { openDB, deleteDB } from "idb";
import { set } from "../util/dot-wild.js";
import { idbKeys } from "../util/state.js";
import { spreadValue } from "../util/spreadValue.js";
/** DB name is always the same. 1 DB */
let version = 1;
let request;
// let db: IDBDatabase;
const getDotLocationRange = (key) => !key || key === ""
    ? undefined
    : IDBKeyRange.bound(`${key}.`, `${key}.~~~~~~~~`);
export const initDb = async (databaseId) => {
    const db = await openDB(databaseId, version, {
        blocked: (db) => {
            console.log("blocked!");
        },
        terminated: () => {
            console.log("TERMINEATED");
        },
        upgrade: (db) => {
            console.log("Upgrade event", databaseId);
            if (!db.objectStoreNames.contains(databaseId)) {
                console.log("Creating store", databaseId);
                const objectStore = db.createObjectStore(databaseId, {
                // keyPath: "id"
                });
            }
        },
    });
    console.log("DB Opened");
    return true;
};
export const indexedDbPutData = async (databaseId, key, value) => {
    const db = await openDB(databaseId, version);
    if (!db.objectStoreNames.contains(databaseId)) {
        // little hack
        console.log("NO Object store. To fix this, db is now deleted", databaseId);
        deleteDB(databaseId);
        return { isSuccessful: false, message: "Db corrupt, was deleted" };
    }
    const tx = db.transaction(databaseId, "readwrite");
    const store = tx.objectStore(databaseId);
    if (value === null) {
        // Delete all keys starting with the key
        const range = getDotLocationRange(key);
        // console.log({ key, range });
        // get keys first
        const keys = (await store.getAllKeys(range));
        await Promise.all(keys.map((k) => {
            return store.delete(k);
        }));
        //exact match too
        store.delete(key);
    }
    else {
        const pairs = spreadValue(key, value);
        await Promise.all(pairs.map((k) => {
            return store.put(k.key, k.value);
        }));
    }
    await tx.done;
    // NB: also set data updated at in the same idb
    store.put(idbKeys.dataUpdatedAt, Date.now());
    // console.log("put data done", { value });
    return { isSuccessful: true, message: "Put data done", result: value };
};
/** Gets all store data and builds a JSON object from it */
export const indexedDbBuildObject = async (
/** E.g. the full JSON object */
databaseId, 
/** if given, this is required prefix */
dotLocationBase) => {
    const db = await openDB(databaseId);
    const tx = db.transaction(databaseId, "readonly");
    const store = tx.objectStore(databaseId);
    const range = getDotLocationRange(dotLocationBase);
    // get keys first
    const keys = (await store.getAllKeys(range));
    const array = await Promise.all(keys.map(async (key) => {
        return { key, value: await store.get(key) };
    }));
    const json = array.reduce((previous, item) => {
        const result = set(previous, item.key, item.value);
        return result;
    }, {});
    return { json, array };
};
/** Gets all store data */
export const indexedDbGetItems = async (
/** E.g. the full JSON object */
databaseId) => {
    const db = await openDB(databaseId);
    const tx = db.transaction(databaseId, "readonly");
    const store = tx.objectStore(databaseId);
    const items = await store.getAll();
    return items;
};
/** Gets one key store data */
export const indexedDbGetStoreItem = async (
/** E.g. the full JSON object */
databaseId, key) => {
    const db = await openDB(databaseId, version);
    const tx = db.transaction(databaseId, "readonly");
    const store = tx.objectStore(databaseId);
    const res = await store.get(key);
    await tx.done;
    return res;
    // return new Promise((resolve) => {
    //   request = indexedDB.open(databaseId);
    //   request.onsuccess = () => {
    //     console.log("request.onsuccess - getAllData");
    //     db = request.result;
    //     const tx = db.transaction(databaseId, "readonly");
    //     const store = tx.objectStore(databaseId);
    //     const res = store.get(key);
    //     res.onsuccess = () => {
    //       resolve(res.result);
    //     };
    //   };
    // });
};
//# sourceMappingURL=indexedDb.js.map