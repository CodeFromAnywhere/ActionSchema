/** DB name is always the same. 1 DB */
let version = 1;
let request: IDBOpenDBRequest;
let db: IDBDatabase;

export const initDb = async (databaseId: string): Promise<boolean> => {
  const isSuccessful = await new Promise<boolean>((resolve) => {
    // open the connection
    request = indexedDB.open(databaseId);

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(databaseId)) {
        console.log("Creating store", databaseId);
        db.createObjectStore(databaseId, {
          // keyPath: "id"
        });
      }
      // no need to resolve here
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;

      console.log(
        "request.onsuccess - initDB",
        version,
        request.result.objectStoreNames,
      );
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });

  return isSuccessful;
};

export const indexedDbPutData = <T>(
  databaseId: string,
  key: string,
  value: T,
): Promise<{ isSuccessful: boolean; message: string; result?: T }> => {
  return new Promise((resolve) => {
    request = indexedDB.open(databaseId, version);

    request.onsuccess = () => {
      console.log("request.onsuccess - putData", databaseId);
      db = request.result;
      const tx = db.transaction(databaseId, "readwrite");
      const store = tx.objectStore(databaseId);

      if (value === null) {
        // NB: null means delete
        store.delete(key);
      } else {
        store.put(value, key);
      }
      resolve({ isSuccessful: true, message: `Put ${key}`, result: value });
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve({ isSuccessful: false, message: error, result: undefined });
      } else {
        resolve({
          isSuccessful: false,
          message: "Unknown error",
          result: undefined,
        });
      }
    };
  });
};

export const indexedDbDeleteData = (
  databaseId: string,
  key: string,
): Promise<boolean> => {
  return new Promise((resolve) => {
    request = indexedDB.open(databaseId, version);

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
export const indexedDbUpdateData = <T>(
  databaseId: string,
  key: string,
  data: T,
): Promise<T | string | null> => {
  return new Promise((resolve) => {
    request = indexedDB.open(databaseId, version);

    request.onsuccess = () => {
      console.log("request.onsuccess - updateData", key);
      db = request.result;

      db.createObjectStore;
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
export const indexedDbGetStoreData = <T>(
  /** E.g. the full JSON object */
  databaseId: string,
): Promise<T[]> => {
  return new Promise((resolve) => {
    request = indexedDB.open(databaseId);

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
export const indexedDbGetStoreItem = <T>(
  /** E.g. the full JSON object */
  databaseId: string,
  key: string,
): Promise<T> => {
  return new Promise((resolve) => {
    request = indexedDB.open(databaseId);

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
