import { fetchPlugin } from "../../plugin/fetchPlugin.js";
import { execute } from "../../plugin/execute.js";
import { getStoreData, putData } from "./vercelKvStore.js";
/**
Local offline IndexedDb store wrapper around `execute`
 */
export const executeServerless = (context) => {
    const { actionSchemaPlugins, databaseId, dotLocation, schema, returnDotLocation, skipPlugin, updateCallbackUrl, value, } = context;
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
            await putData(databaseId, key, value);
            return;
        },
        setStatus: async (key, value) => {
            await putData(`status-${databaseId}`, key, value);
            return;
        },
        fetchPlugin: async (details, completeContext) => {
            //TODO: this one fetches things in the next.js edge environment
            fetchPlugin;
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
        recurseFunction: async (item) => {
            const result = await fetch("https://actionschema.com/api/execute", {
                method: "POST",
                body: JSON.stringify(context),
                headers: {},
            });
        },
    });
};
//# sourceMappingURL=executeServerless.js.map