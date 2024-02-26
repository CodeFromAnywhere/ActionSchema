import { setPropertyStatusDone } from "./setPropertyStatusDone.js";
import { getDb } from "./storage/getDb.js";
import { flatten } from "../../util/dot-wild.js";
/**
Sets the value and handles status

TODO:

- For testing purposes, also write to a JSON file, locked, so I can see it. There must be efficient libs for this!

- Implement options. This is crucial for and should be well thought-through before deciding on it.

*/
export const setValue = async (databaseId, dotLocation, schema, data, 
/** Are to be inferred from the schema */
options) => {
    //1) Set new data
    // could be a more direct usage of lmdb
    let db = getDb(databaseId);
    await db.put(dotLocation, data);
    const values = flatten(data);
    //2) Update statuses
    await setPropertyStatusDone(schema, dotLocation, databaseId);
    return { isSuccessful: true, message: "Set the value" };
};
//# sourceMappingURL=setValue.js.map