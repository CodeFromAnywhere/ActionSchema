import fs from "fs/promises";
import path from "path";
import { executeGridPlugin } from "./executeGridPlugin.js";
import { getStatusDb } from "./getStatusDb.js";
export const spawner = async (databaseId) => {
    let status = getStatusDb(databaseId);
    const schemaPath = path.join(new URL(import.meta.url).pathname, "../../schemas", databaseId + ".schema.json");
    const schemaString = await fs.readFile(schemaPath, "utf8");
    const schema = JSON.parse(schemaString);
    setInterval(() => {
        // get the stale ones
        const dotLocations = status
            // Limit is the maximum amount we'll do each 100ms
            .getRange({ limit: 1000 })
            .filter((entry) => {
            return entry.value === "stale";
        })
            .map((entry) => String(entry.key)).asArray;
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