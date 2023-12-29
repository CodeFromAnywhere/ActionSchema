import { makeActionSchemaDb } from "fsorm-lmdb";
export const isFirstOccurence = (context) => {
    const { projectRelativeGridPath, columnKey, row } = context;
    // 1) Get all values of `projectRelativeGridPath` of 0-[rowIndex] from the db
    const db = makeActionSchemaDb(projectRelativeGridPath);
    // NB: This might be inefficient if it's used on big tables, but getting just a single property does make it a bit better. If this ends up being a slowdown, it only happens when this plugin is used at least. But if we want to improve it, we could try to make this a cached thing or so. Not sure if that's easy...
    const list = db.getAllItemsForKey(columnKey);
    const firstOccurenceId = list.find((x) => {
        const isSame = x.__keyValue === row[columnKey];
        if (!isSame) {
            return false;
        }
        // Same value.
        return true;
    })?.__actionSchemaId;
    ///////////////////////////////////////////
    const isSameId = firstOccurenceId === row.__actionSchemaId;
    return { isSuccessful: true, result: isSameId };
};
isFirstOccurence.config = {
    isPublic: true,
    categories: ["util"],
    emoji: "❄️",
    plugin: "column",
    shortDescription: "Only get unique values by taking the first occurence of unique values.",
};
//# sourceMappingURL=isFirstOccurence.js.map