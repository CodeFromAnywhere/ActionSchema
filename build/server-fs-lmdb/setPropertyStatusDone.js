import { getDotLocationBase } from "../util/getDotlocationBase.js";
import { getSchemaAtDotLocation } from "../util/getSchemaAtDotLocation.js";
import { getStatusDb } from "./storage/getStatusDb.js";
/** NB: This look only at dependants in the same object. Ultimately we want to look at dependants everywhere! */
export const setPropertyStatusDone = async (schema, dotLocation, databaseId) => {
    let status = getStatusDb(databaseId);
    // Remove busy status
    status.remove(dotLocation);
    // This would be one level up, so the entire object
    const baseDotLocation = getDotLocationBase(dotLocation);
    // Look at other columns that have this datapoint in `propertyDependencies`
    const properties = getSchemaAtDotLocation(schema, baseDotLocation)
        ?.properties;
    if (!properties) {
        return;
    }
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
};
//# sourceMappingURL=setPropertyStatusDone.js.map