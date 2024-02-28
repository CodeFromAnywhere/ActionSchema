import { open } from "lmdb";
export const getDb = (databaseId) => {
    return open({
        path: `data/${databaseId}/data`,
        // any options go here, we can turn on compression like this:
        compression: true,
    });
};
//# sourceMappingURL=getDb.js.map