import { getOpenapiDetails } from "./getOpenapiDetails.js";
import { getSchemaAtDotLocation } from "../util/getSchemaAtDotLocation.js";
import { getDotLocationBase } from "../util/getDotlocationBase.js";
/**
This is the main function to execute things. Please note that the data storage method is abstracted away from this one as every environment implements their own for that.

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
    const { dotLocation, schema, databaseId, value, skipPlugin, returnDotLocation, recurseFunction, getData, getStatus, setData, setStatus, updateCallbackUrl, actionSchemaPlugins, fetchPlugin, } = context;
    // Set `busy` status (to not conflict with spawner)
    await setStatus(dotLocation, "busy");
    let setValueResult = undefined;
    //===== Looks at the schema and relevant existing data
    const completeContext = {};
    //====== Executes the plugin
    const schemaHere = getSchemaAtDotLocation(schema, dotLocation);
    const plugin = schemaHere["x-plugin"];
    console.log({ schemaHere, plugin });
    if (value !== undefined) {
        //===== Set a new value into the db (Optional, if given)
        setValueResult = await setData(dotLocation, value);
        if (!plugin || skipPlugin) {
            return setValueResult;
        }
    }
    if (!plugin || skipPlugin) {
        await setStatus(dotLocation, null);
        return {
            isSuccessful: true,
            message: "Did not set any value, did not execute any plugin",
        };
    }
    //
    //====== Gathers authorization info
    const $openapi = plugin.$openapi;
    const details = await getOpenapiDetails($openapi, actionSchemaPlugins);
    if (!details) {
        await setStatus(dotLocation, null);
        return {
            isSuccessful: false,
            message: "Could not find openapi details",
        };
    }
    //===== Executes the plugin
    const newValue = await fetchPlugin(details, completeContext);
    //===== Updates the data with the result
    // const values = flatten(newValue);
    await setData(dotLocation, newValue);
    const setNewValueResult = { isSuccessful: true, message: "Set the value" };
    //======= Remove `busy` status
    await setStatus(dotLocation, null);
    //=== Look at other columns that have this dotLocation in `propertyDependencies`, Set those status to `stale`
    // This would be one level up, so the entire object
    const baseDotLocation = getDotLocationBase(dotLocation);
    // Look at other columns that have this datapoint in `propertyDependencies`
    const properties = getSchemaAtDotLocation(schema, baseDotLocation).properties || {};
    const dependantKeys = Object.keys(properties).filter((key) => {
        const schema = properties[key];
        const plugin = schema["x-plugin"];
        const isDependant = plugin?.dataDependencies?.includes(dotLocation);
        return isDependant;
    });
    // Set those status to `stale`
    const dependantDotLocations = dependantKeys.map((k) => getDotLocationBase(dotLocation, k));
    await Promise.all(dependantDotLocations.map(async (dotLocation) => {
        await setStatus(dotLocation, "stale");
    }));
    //====== Try to execute `executeGridPlugin` for dependants directly incase available. (No probem if it fails)
    dependantDotLocations.map((dotLocation) => {
        // NB: Don't wait for this
        recurseFunction({ ...context, dotLocation });
    });
    return setNewValueResult;
};
//# sourceMappingURL=execute.js.map