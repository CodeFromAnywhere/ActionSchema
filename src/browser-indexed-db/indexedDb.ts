import { openDB } from "idb";
import { flatten, set, get } from "../util/dot-wild.js";
import { O } from "js-util";
import { getDotLocation } from "../util/getDotLocation.js";
/** DB name is always the same. 1 DB */
let version = 1;
let request: IDBOpenDBRequest;
let db: IDBDatabase;

const getDotLocationRange = (key: string | undefined) =>
  !key || key === ""
    ? undefined
    : IDBKeyRange.bound(`${key}.`, `${key}.~~~~~~~~`);

export const initDb = async (databaseId: string): Promise<boolean> => {
  const db = await openDB(databaseId, version);
  if (!db.objectStoreNames.contains(databaseId)) {
    console.log("Creating store", databaseId);
    db.createObjectStore(databaseId, {
      // keyPath: "id"
    });
  }

  return true;
};

export const indexedDbPutData = async <T>(
  databaseId: string,
  key: string,
  value: T,
): Promise<{ isSuccessful: boolean; message: string; result?: T }> => {
  const db = await openDB(databaseId, version);
  const tx = db.transaction(databaseId, "readwrite");
  const store = tx.objectStore(databaseId);

  if (value === null) {
    // Delete all keys starting with the key
    const range = getDotLocationRange(key);

    // console.log({ key, range });
    // get keys first
    const keys = (await store.getAllKeys(range)) as string[];

    await Promise.all(
      keys.map((k) => {
        return store.delete(k);
      }),
    );
    //exact match too
    store.delete(key);
  } else if (typeof value === "object") {
    // For bigger things we flatten it first!
    const flat = flatten(value);
    const flatKeys = Object.keys(flat);

    const keys = flatKeys.map((k) => (key === "" ? k : `${key}.${k}`));

    // console.log({ keys });
    await Promise.all(
      flatKeys.map((k) => {
        const v = getDotLocation(value, k);
        const fullKey = key === "" ? k : `${key}.${k}`;
        return store.put(v, fullKey);
      }),
    );
  } else {
    await store.put(value, key);
  }

  await tx.done;

  // console.log("put data done", { value });
  return { isSuccessful: true, message: "Put data done", result: value };
};

/** Gets all store data */
export const indexedDbBuildObject = async (
  /** E.g. the full JSON object */
  databaseId: string,
  /** if given, this is required prefix */
  dotLocationBase?: string,
): Promise<any> => {
  const db = await openDB(databaseId);
  const tx = db.transaction(databaseId, "readonly");
  const store = tx.objectStore(databaseId);

  const range = getDotLocationRange(dotLocationBase);

  // get keys first
  const keys = (await store.getAllKeys(range)) as string[];

  const items = await Promise.all(
    keys.map(async (key) => {
      return { key, value: await store.get(key) };
    }),
  );

  const result = items.reduce((previous, item) => {
    const result = set(previous, item.key, item.value);
    return result;
  }, {} as O);

  return result;
};

/** Gets all store data */
export const indexedDbGetItems = async (
  /** E.g. the full JSON object */
  databaseId: string,
): Promise<any[]> => {
  const db = await openDB(databaseId);
  const tx = db.transaction(databaseId, "readonly");
  const store = tx.objectStore(databaseId);
  const items = await store.getAll();
  return items;
};

/** Gets one key store data */
export const indexedDbGetStoreItem = async <T>(
  /** E.g. the full JSON object */
  databaseId: string,
  key: string,
): Promise<T | undefined> => {
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
