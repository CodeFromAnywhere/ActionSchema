import { getSchemaAtDotLocation } from "../util/getSchemaAtDotLocation.js";
import { getDotLocationBase } from "../util/getDotlocationBase.js";
import { fetchPluginOrDefault } from "./fetchPluginOrDefault.js";
import { makeArray, onlyUnique2 } from "from-anywhere";
import { getDotLocation } from "../util/getDotLocation.js";
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
    //====== Executes the plugin
    const schemaHere = getSchemaAtDotLocation(schema, dotLocation);
    if (!schemaHere) {
        return {
            isSuccessful: false,
            message: "Invalid plugin output location",
        };
    }
    const plugin = schemaHere["x-plugin"];
    const defaultValue = schemaHere.default;
    const noEntryPossible = skipPlugin || (!plugin && !defaultValue);
    //console.log({ schemaHere, plugin, noEntryPossible });
    if (value !== undefined) {
        //===== Set a new value into the db (Optional, if given)
        setValueResult = await setData(dotLocation, value);
        if (noEntryPossible) {
            return setValueResult;
        }
    }
    if (noEntryPossible) {
        await setStatus(dotLocation, null);
        return {
            isSuccessful: true,
            message: "Did not set any value, did not execute any plugin",
        };
    }
    const fetchResult = await fetchPluginOrDefault({
        ...context,
        // used parameters
        dotLocation,
        setStatus,
        fetchPlugin,
        actionSchemaPlugins,
        // more specific schema
        schema: schemaHere,
    });
    console.log({ fetchResult });
    //===== Updates the data with the result
    // const values = flatten(newValue);
    if (fetchResult.hasStaleStatus) {
        await setStatus(dotLocation, null);
        return { isSuccessful: false, message: "Stale Dependants Found" };
    }
    const realValue = fetchResult.value !== undefined
        ? plugin && plugin.outputLocation && plugin.outputLocation !== ""
            ? getDotLocation(fetchResult.value, plugin.outputLocation)
            : fetchResult.value
        : undefined;
    const setNewValueResult = realValue
        ? await setData(dotLocation, fetchResult.value)
        : { isSuccessful: true, message: "No value set" };
    //======= Remove `busy` status
    await setStatus(dotLocation, null);
    //=== Look at other columns that have this dotLocation in `dataDependencies`, Set those status to `stale`
    // This would be one level up, so the entire object
    const baseDotLocation = getDotLocationBase(dotLocation);
    const newObjectExposedDotLocations = getNewObjectExposedDotLocations(schemaHere, fetchResult.value, dotLocation) || [];
    const newArrayExposedDotLocations = getNewArrayExposedDotLocations(schemaHere, fetchResult.value, dotLocation) || [];
    // console.log({
    //   schemaHere,
    //   value: fetchResult.value,
    //   dotLocation,
    //   newArrayExposedDotLocations,
    // });
    // Look at other columns that have this datapoint in `dataDependencies`
    const properties = getSchemaAtDotLocation(schema, baseDotLocation)?.properties || {};
    const dependantKeys = Object.keys(properties).filter((key) => {
        const schema = properties[key];
        const plugin = schema["x-plugin"];
        const isDependant = plugin?.dataDependencies?.includes(dotLocation);
        return isDependant;
    });
    // Set those status to `stale`
    const dependantDotLocations = dependantKeys.map((k) => getDotLocationBase(dotLocation, k));
    const exposedDotLocations = dependantDotLocations
        .concat(newObjectExposedDotLocations)
        .concat(newArrayExposedDotLocations);
    await Promise.all(exposedDotLocations.map(async (dotLocation) => {
        await setStatus(dotLocation, "stale");
    }));
    console.log({ dotLocation, exposedDotLocations });
    //====== Try to execute `executeGridPlugin` for new exposed locations directly incase available. (No probem if it fails)
    exposedDotLocations.map((dotLocation) => {
        // NB: Don't wait for this
        recurseFunction({ ...context, dotLocation, value: undefined }).then((result) => {
            console.log("recursed", { dotLocation, result });
        });
    });
    return setNewValueResult;
};
/**
 * Find dotLocations for each property in the object that we don't have yet
 */
export const getNewObjectExposedDotLocations = (schemaHere, newValue, dotLocation) => {
    if (schemaHere.type === "object" &&
        schemaHere.properties &&
        newValue &&
        typeof newValue === "object" &&
        !Array.isArray(newValue)) {
        const allKeys = Object.keys(schemaHere.properties);
        const newKeys = Object.keys(newValue);
        const notYetKeys = allKeys.filter((k) => !newKeys.includes(k));
        const dotLocations = notYetKeys.map((k) => dotLocation === "" ? k : `${dotLocation}.${k}`);
        return dotLocations;
    }
};
/** Find dotLocations for each property of each item that got created */
export const getNewArrayExposedDotLocations = (schemaHere, newValue, dotLocation) => {
    if (schemaHere.type === "array" &&
        schemaHere.items &&
        newValue &&
        Array.isArray(newValue)) {
        // NB: get properties for every object possibility of the items
        const allKeys = schemaHere.items === true
            ? []
            : makeArray(schemaHere.items)
                .filter((x) => x.type === "object" && x.properties)
                .map((x) => Object.keys(x.properties))
                .flat()
                .filter(onlyUnique2());
        // try execute for each new item in the array, for each property we don't have yet
        const dotLocations = newValue
            .map((item, index) => {
            const newKeys = typeof item === "object" && !Array.isArray(item)
                ? Object.keys(item)
                : // NB: we don't support non-object expansion Iguess
                    [];
            const notYetKeys = allKeys.filter((k) => !newKeys.includes(k));
            return notYetKeys.map((k) => `${dotLocation}.${index}.${k}`);
        })
            .flat();
        return dotLocations;
    }
};
//# sourceMappingURL=execute.js.map