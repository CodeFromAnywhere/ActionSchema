import { cleanFetch } from "../util/cleanFetch.js";
import { ExecuteContext } from "../types.js";
import { execute } from "../util/execute.js";
import { getDb } from "./storage/getDb.js";
import { getValue } from "./storage/getValue.js";
import { getStatusDb } from "./storage/getStatusDb.js";
import { fetchExecute } from "../util/fetchExecute.js";

/**
 * This thing is executed in another thread everytime, which frees up the load
 *
 * To save the server this should not be used directly.
 */
const executeServerWorker = async (executeContext: ExecuteContext) => {
  const { databaseId } = executeContext;
  return execute({
    ...executeContext,

    setData: async (key, value) => {
      //1) Set new data
      // could be a more direct usage of lmdb
      let db = getDb(databaseId);
      const resx = await db.put(key, value);

      return { isSuccessful: true, message: "Set" };
    },

    getData: async (key) => {
      return getValue(databaseId, key);
    },

    setStatus: async (key, value) => {
      let status = getStatusDb(databaseId);
      // Set status to queued
      const res = await status.put(key, value);

      return;
    },

    fetchPlugin: cleanFetch,

    getStatus: async (key) => {
      let status = getStatusDb(databaseId);
      return status.get(key);
    },

    recurseFunction: (context) => {
      //TODO:
      return fetchExecute(context, "", undefined, undefined);
    },
  });
};

export default executeServerWorker;
