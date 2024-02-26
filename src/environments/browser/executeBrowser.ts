import { ExecuteContext, execute } from "../../plugin/execute.js";
import { getStoreData, putData } from "./storage/indexedDb.js";

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
      await putData(databaseId, key, value);
      return;
    },

    setStatus: async (key, value) => {
      await putData(`status-${databaseId}`, key, value);
      return;
    },

    fetchPlugin: async (details, completeContext) => {
      // TODO: this one fetches things via the corse-proxy
      return undefined;
    },

    getData: async (key) => {
      //TODO
      const data = await getStoreData(databaseId);
      return data;
    },

    getStatus: async (key) => {
      //TODO
      const data = await getStoreData(`status-${databaseId}`);
      return "busy";
    },
  });
};
