import { ExecuteContext, execute } from "../../plugin/execute.js";
import {
  indexedDbGetStoreData,
  indexedDbPutData,
} from "./storage/indexedDb.js";

/**
Local offline IndexedDb store wrapper around `execute` 
 */
export const executeBrowser = (
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
      await indexedDbPutData(databaseId, key, value);
      return;
    },

    setStatus: async (key, value) => {
      await indexedDbPutData(`status-${databaseId}`, key, value);
      return;
    },

    fetchPlugin: async (details, completeContext) => {
      // TODO: this one fetches things via the corse-proxy
      return undefined;
    },

    getData: async (key) => {
      //TODO
      const data = await indexedDbGetStoreData(databaseId);
      return data;
    },

    getStatus: async (key) => {
      //TODO
      const data = await indexedDbGetStoreData(`status-${databaseId}`);
      return "busy";
    },
  });
};
