// import { getOpenapiDetails } from "plugin-util";
import { getDotLocation } from "./util/getDotLocation.js";
import { fetchPlugin } from "./fetchPlugin.js";
import { setValue } from "./setValue.js";
/** This thing is executed in a separate thread everytime */
const worker = async (context) => {
    const { completeContext, dotLocation, schema, actionSchemaPlugins, databaseId, } = context;
    const $openapi = getDotLocation(schema, dotLocation);
    // const details = getOpenapiDetails($openapi, actionSchemaPlugins);
    const data = await fetchPlugin(undefined, completeContext);
    await setValue(databaseId, dotLocation, schema, data);
};
export default worker;
//# sourceMappingURL=worker.js.map