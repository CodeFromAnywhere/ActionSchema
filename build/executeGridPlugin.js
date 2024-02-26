import Piscina from "piscina";
import { getStatusDb } from "./getStatusDb.js";
const piscina = new Piscina({
    // The URL must be a file:// URL
    filename: new URL("./worker.js", import.meta.url).href,
    maxThreads: 100,
});
export const executeGridPlugin = async (context) => {
    const { completeContext, dotLocation, schema, databaseId } = context;
    // TODO
    const actionSchemaPlugins = [];
    const workerContext = {
        completeContext,
        dotLocation,
        schema,
        actionSchemaPlugins,
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