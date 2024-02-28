import { execute } from "../util/execute.js";
import { getStoreData, putData } from "./vercelKvStore.js";
import { fetchExecute } from "../util/fetchExecute.js";
import { cleanFetch } from "../util/cleanFetch.js";
import { ExecuteContext, ExecuteResult } from "../util/types.js";

/**
Serverless wrapper around `execute`

- Used in the `execute` api

*/
export const executeServerless = (
  context: ExecuteContext,
): Promise<ExecuteResult> => {
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
    setData: async (key, value) => {
      return putData(databaseId, key, value);
    },

    setStatus: async (key, value) => {
      await putData(`status-${databaseId}`, key, value);
      return;
    },
    fetchPlugin: cleanFetch,

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

    recurseFunction: (context) => {
      const host = `http://localhost:3000`;
      return fetchExecute({
        ...context,
        executeApiPath: `${host}/api/execute`,
        executeApiHeaders: {},
      });
    },
  });
};
