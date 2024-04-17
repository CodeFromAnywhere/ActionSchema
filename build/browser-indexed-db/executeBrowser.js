import { cleanFetch } from "../util/cleanFetch.js";
import { execute } from "../util/execute.js";
import { indexedDbBuildObject, indexedDbGetStoreItem, indexedDbPutData, initDb, } from "./indexedDb.js";
/**
Local offline IndexedDb store wrapper around `execute`
 */
export const executeBrowser = async (context) => {
    const { actionSchemaPlugins, databaseId, dotLocation, schema, returnDotLocation, skipPlugin, updateCallbackUrl, value, } = context;
    // 1) Init data and status dbs for this particular schema
    const initDbSuccess = await initDb(databaseId);
    const initStatusDbSuccess = await initDb(`status-${databaseId}`);
    const getData = async (key) => {
        const json = await indexedDbBuildObject(databaseId, key);
        return json;
    };
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
            // This causes a 10MB limit but would make it observable as idb isn't observable.
            // const json = await getData(key);
            // const jsonString = JSON.stringify(json, undefined, 2);
            // window.localStorage.setItem(databaseId, jsonString);
            return putDataResult;
        },
        setStatus: async (key, value) => {
            await indexedDbPutData(`status-${databaseId}`, key, value);
            return;
        },
        fetchPlugin: cleanFetch,
        getData,
        getStatus: async (key) => {
            const data = await indexedDbGetStoreItem(`status-${databaseId}`, key);
            return data;
        },
    });
};
//# sourceMappingURL=executeBrowser.js.map