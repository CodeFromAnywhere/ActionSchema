import { cleanFetch } from "../../plugin/cleanFetch.js";
import { execute } from "../../plugin/execute.js";
import { ExecuteContext } from "../../plugin/types.js";
import {
  indexedDbBuildObject,
  indexedDbGetStoreItem,
  indexedDbPutData,
  initDb,
} from "./storage/indexedDb.js";

/**
Local offline IndexedDb store wrapper around `execute` 
 */
export const executeBrowser = async (
  context: ExecuteContext,
): Promise<{
  isSuccessful: boolean;
  message: string;
}> => {
  const {
    actionSchemaPlugins,
    databaseId,
    dotLocation,
    schema,
    returnDotLocation,
    skipPlugin,
    updateCallbackUrl,
    value,
  } = context;

  // 1) Init data and status dbs for this particular schema
  const initDbSuccess = await initDb(databaseId);
  const initStatusDbSuccess = await initDb(`status-${databaseId}`);

  return execute({
    actionSchemaPlugins,
    databaseId,
    dotLocation,
    schema,
    returnDotLocation,
    skipPlugin,
    updateCallbackUrl,
    value,
    recurseFunction: (item) => {
      return executeBrowser(item);
    },

    setData: async (key, value) => {
      const putDataResult = await indexedDbPutData(databaseId, key, value);

      // Super inefficient magic! After put, also set entire JSON to the local storage
      const json = await indexedDbBuildObject(databaseId);
      window.localStorage.setItem(
        databaseId,
        JSON.stringify(json, undefined, 2),
      );

      return putDataResult;
    },

    setStatus: async (key, value) => {
      await indexedDbPutData(`status-${databaseId}`, key, value);
      return;
    },

    fetchPlugin: async (details, completeContext) => {
      // localhost for now
      const host = `http://localhost:42000`;

      // const url = new URL(details.apiUrl);
      // const domainAndPath = url.host + url.pathname + url.search + url.hash;
      return cleanFetch(
        {
          ...details,
          //   apiUrl: `${host}/api/${domainAndPath}`,
        },
        completeContext,
      );
    },

    getData: async (key) => {
      const data = await indexedDbGetStoreItem(databaseId, key);
      return data;
    },

    getStatus: async (key) => {
      const data = await indexedDbGetStoreItem(`status-${databaseId}`, key);
      return data as string;
    },
  });
};
