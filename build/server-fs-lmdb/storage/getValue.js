import { getDb } from "./getDb.js";
/** Simple kv way of storing JSON efficiently */
export const getValue = (databaseId, 
/** Will find all locations starting with this */
dotLocation) => {
    let db = getDb(databaseId);
    const dotLocations = db
        .getRange({ start: dotLocation })
        .filter((entry) => entry.key.toString().startsWith(dotLocation))
        .map(({ key, value }) => ({ key, value })).asArray;
    // TODO: serialise dotLocations into a JSON.
    return dotLocations;
};
//# sourceMappingURL=getValue.js.map