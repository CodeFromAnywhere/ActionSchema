import { getOpenapiDetails } from "../../plugin/getOpenapiDetails.js";
import { setValue } from "./setValue.js";
import { getSchemaAtDotLocation } from "../../util/getSchemaAtDotLocation.js";
import { cleanFetch } from "../../plugin/cleanFetch.js";
/** This thing is executed in another thread everytime, which frees up the load */
const executeGridPluginWorker = async (context) => {
    const { completeContext, dotLocation, schema, actionSchemaPlugins, databaseId, } = context;
    const plugins = getSchemaAtDotLocation(schema, dotLocation);
    const plugin = Array.isArray(plugins) ? plugins[0] : plugins;
    if (!plugin) {
        return;
    }
    const $openapi = plugin.$openapi;
    const details = await getOpenapiDetails($openapi, actionSchemaPlugins);
    if (!details) {
        return;
    }
    const data = await cleanFetch(details, completeContext);
    await setValue(databaseId, dotLocation, schema, data);
};
export default executeGridPluginWorker;
//# sourceMappingURL=executeGridPluginWorker.js.map