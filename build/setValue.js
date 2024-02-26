import { setPropertyStatusDone } from "./setPropertyStatusDone.js";
import { setDatabaseValue } from "./setDatabaseValue.js";
/** sets value and handles status */
export const setValue = async (databaseId, dotLocation, schema, data) => {
    //1) Set new data
    await setDatabaseValue(databaseId, dotLocation, data);
    //2) Update statuses
    await setPropertyStatusDone(schema, dotLocation, databaseId);
};
//# sourceMappingURL=setValue.js.map