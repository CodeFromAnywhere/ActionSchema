import { executeGridPlugin } from "./executeGridPlugin.js";
import { getStatusDb } from "./storage/getStatusDb.js";
import { getActionSchema } from "./storage/getActionSchema.js";
export const spawner = async (databaseId) => {
    let status = getStatusDb(databaseId);
    const schema = await getActionSchema(databaseId);
    setInterval(() => {
        // get the stale ones
        const dotLocations = status
            // Limit is the maximum amount we'll do each 100ms
            .getRange({ limit: 1000 })
            .filter((entry) => {
            const dotLocation = String(entry.key);
            return entry.value === "stale";
        })
            .map((entry) => String(entry.key)).asArray;
        /**
       TODO: for recalculations, ensure to only get the stale ones of which the dependants are not also stale
    
        1. look in schema for each dotLocation to find x-plugin.propertyDependencies. all at once
    
        2. remove those dotLocations as they
        */
        console.log({ dotLocations });
        dotLocations.map((dotLocation) => executeGridPlugin({
            completeContext: {},
            dotLocation,
            schema,
            databaseId,
        }));
    }, 50);
};
spawner("calendar-event");
//# sourceMappingURL=spawner.test.js.map