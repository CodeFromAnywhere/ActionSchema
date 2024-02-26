import { fetchPlugin } from "../../plugin/fetchPlugin.js";
import { getOpenapiDetails } from "../../plugin/getOpenapiDetails.js";
import { getSchemaAtDotLocation } from "../../util/getSchemaAtDotLocation.js";
import { getDotLocationBase } from "../../util/getDotlocationBase.js";
import { recurseExecute } from "./recurseExecute.js";
import { getDb } from "./storage/getDb.js";
import { getPlugins } from "./storage/getPlugins.js";
import { getStatusDb } from "./storage/getStatusDb.js";
import { setValue } from "./setValue.js";
/**
A: Init
- Set `busy` status (to not conflict with spawner)
- Set a new value into the db (Optional, if given)

B: Plugin
- Looks at the schema and relevant existing data
- Gathers the context
- Gathers authorization info
- Executes the plugin
- Updates the data with the result
- Remove `busy` status

C: Concequences
- Look at other columns that have this dotLocation in `propertyDependencies`
- Set those status to `stale`
- Try to execute `executeGridPlugin` for dependants directly incase available. (No probem if it fails)
 */
export const execute = async (context) => {
    const { dotLocation, schema, databaseId, value, skipPlugin, returnDotLocation, } = context;
    // Set `busy` status (to not conflict with spawner)
    let status = getStatusDb(databaseId);
    await status.put(dotLocation, "busy");
    let setValueResult = undefined;
    if (value !== undefined) {
        //===== Set a new value into the db (Optional, if given)
        setValueResult = await setValue(databaseId, dotLocation, schema, value);
    }
    //===== Looks at the schema and relevant existing data
    const completeContext = {};
    const actionSchemaPlugins = getPlugins();
    //===== Gathers the context
    const workerContext = {
        completeContext,
        dotLocation,
        schema,
        actionSchemaPlugins,
        databaseId,
    };
    //===== Set status to queued
    await status.put(dotLocation, "queued");
    //====== Executes the plugin
    const plugins = getSchemaAtDotLocation(schema, dotLocation)["x-plugin"];
    // NB: for now, always the first
    const plugin = Array.isArray(plugins) ? plugins[0] : plugins;
    if (!plugin || skipPlugin) {
        return (setValueResult || {
            isSuccessful: true,
            message: "Did not set any value, did not execute any plugin",
        });
    }
    //====== Gathers authorization info
    const $openapi = plugin.$openapi;
    const details = await getOpenapiDetails($openapi, actionSchemaPlugins);
    if (!details) {
        await status.remove(dotLocation);
        return {
            isSuccessful: false,
            message: "Could not find openapi details",
        };
    }
    //===== Executes the plugin
    const newValue = await fetchPlugin(details, completeContext);
    //===== Updates the data with the result
    // const values = flatten(newValue);
    let db = getDb(databaseId);
    await db.put(dotLocation, newValue);
    const setNewValueResult = { isSuccessful: true, message: "Set the value" };
    //======= Remove `busy` status
    await status.remove(dotLocation);
    //=== Look at other columns that have this dotLocation in `propertyDependencies`, Set those status to `stale`
    // This would be one level up, so the entire object
    const baseDotLocation = getDotLocationBase(dotLocation);
    // Look at other columns that have this datapoint in `propertyDependencies`
    const properties = getSchemaAtDotLocation(schema, baseDotLocation).properties || {};
    const dependantKeys = Object.keys(properties).filter((key) => {
        const schema = properties[key];
        const plugin = Array.isArray(schema["x-plugin"])
            ? schema["x-plugin"][0]
            : schema["x-plugin"];
        const isDependant = plugin?.propertyDependencies?.includes(dotLocation);
        return isDependant;
    });
    // Set those status to `stale`
    const dependantDotLocations = dependantKeys.map((k) => getDotLocationBase(dotLocation, k));
    await Promise.all(dependantDotLocations.map(async (dotLocation) => {
        await status.put(dotLocation, "stale");
    }));
    //====== Try to execute `executeGridPlugin` for dependants directly incase available. (No probem if it fails)
    dependantDotLocations.map((dotLocation) => {
        // NB: Don't wait for this
        recurseExecute({ ...context, dotLocation });
    });
    return setNewValueResult;
};
//# sourceMappingURL=execute.js.map