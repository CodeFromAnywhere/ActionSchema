import { cleanFetch } from "../../plugin/cleanFetch.js";
import { execute } from "../../plugin/execute.js";
import { indexedDbGetStoreItem, indexedDbPutData, initDb, } from "./storage/indexedDb.js";
/**
Local offline IndexedDb store wrapper around `execute`
 */
export const executeBrowser = async (context) => {
    const { actionSchemaPlugins, databaseId, dotLocation, schema, returnDotLocation, skipPlugin, updateCallbackUrl, value, } = context;
    // 1) Init data and status dbs for this particular schema
    console.log(await initDb(databaseId));
    console.log(await initDb(`status-${databaseId}`));
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
            return indexedDbPutData(databaseId, key, value);
        },
        setStatus: async (key, value) => {
            await indexedDbPutData(`status-${databaseId}`, key, value);
            return;
        },
        fetchPlugin: async (details, completeContext) => {
            // localhost for now
            const host = `http://localhost:3000`;
            return cleanFetch({
                ...details,
                apiUrl: `${host}/api/cors-proxy?url=${details.apiUrl}`,
            }, completeContext);
        },
        getData: async (key) => {
            const data = await indexedDbGetStoreItem(databaseId, key);
            return data;
        },
        getStatus: async (key) => {
            const data = await indexedDbGetStoreItem(`status-${databaseId}`, key);
            return data;
        },
    });
};
//# sourceMappingURL=executeBrowser.js.map