import { getDotLocationBase } from "./util/getDotlocationBase.js";
import { getSchemaAtDotLocation } from "./util/getSchemaAtDotLocation.js";
import { getStatusDb } from "./getStatusDb.js";
export const setPropertyStatusDone = async (schema, dotLocation, databaseId) => {
    let status = getStatusDb(databaseId);
    // Remove busy status
    status.remove(dotLocation);
    // Look at other columns that have this datapoint in `propertyDependencies`
    const properties = getSchemaAtDotLocation(schema, dotLocation);
    const dependantKeys = Object.keys(properties).filter((key) => {
        const schema = properties[key];
        const isDependant = schema["x-plugin"]?.propertyDependencies?.includes(dotLocation);
        return isDependant;
    });
    // Set those status to `stale`
    const dependantDotLocations = dependantKeys.map((k) => getDotLocationBase(dotLocation, k));
    await Promise.all(dependantDotLocations.map(async (dotLocation) => {
        await status.put(dotLocation, "stale");
    }));
};
//# sourceMappingURL=setPropertyStatusDone.js.map