import Piscina from "piscina";
import { getStatusDb } from "./storage/getStatusDb.js";
const piscina = new Piscina({
    // The URL must be a file:// URL
    filename: new URL("./executeGridPluginWorker.js", import.meta.url).href,
});
const authToken = "jlgdgmsuwpqqxrwkwmdxaore";
const hardcodedPlugins = [
    {
        __id: "https://api.codefromanywhere.com/openapi.json",
        url: "https://api.codefromanywhere.com/openapi.json",
        headers: `{"Authorization":"Bearer ${authToken}"}`,
        localhostOpenapiUrl: "http://localhost:42000/openapi.json?hostname=api.codefromanywhere.com",
    },
];
export const executeGridPlugin = async (context) => {
    const { completeContext, dotLocation, schema, databaseId } = context;
    const workerContext = {
        completeContext,
        dotLocation,
        schema,
        actionSchemaPlugins: hardcodedPlugins,
        databaseId,
    };
    let status = getStatusDb(databaseId);
    // Set status to queued
    await status.put(dotLocation, "queued");
    // Execute plugin and set result
    const result = await piscina.run(workerContext);
    console.log({ result }); // Prints 10
};
//# sourceMappingURL=executeGridPlugin.js.map