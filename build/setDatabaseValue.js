import { open } from "lmdb";
export const setDatabaseValue = async (databaseId, dotLocation, data) => {
    // could be a more direct usage of lmdb
};
export const getDb = (databaseId) => {
    return open({
        path: `data/${databaseId}/data`,
        // any options go here, we can turn on compression like this:
        compression: true,
    });
};
//# sourceMappingURL=setDatabaseValue.js.map