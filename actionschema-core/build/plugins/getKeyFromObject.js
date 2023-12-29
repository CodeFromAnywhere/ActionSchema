/**
If the object is something like this: `{a:{b:{c:"hi"}}}`
The location to get c should be `a.b.c`
Should also support arrays, like in `a.b.c[0].d`

Example:
```
console.log(getKeyFromObject({ a: { b: { c: [1, 2, 3] } } }, "a.b.c[2]"));
```
*/
import { tryParseJson } from "try-parse-json";
export const getKeyFromObject = (object, location) => {
    const chunks = location
        .replaceAll("]", "")
        .split(".")
        .map((x) => x.split("["))
        .flat();
    // console.log(chunks);
    return chunks.reduce((previous, current) => {
        if (previous === undefined) {
            return undefined;
        }
        if (!isNaN(Number(current)) &&
            !Array.isArray(previous) &&
            !previous[current]) {
            // NB: special case: we specified a number on an object but that key doesn't exist on the object
            // Assuming we mean the n-th key of the object, we return that instead.
            const keys = Object.keys(previous);
            const nKeyValue = previous[keys[Number(current)]];
            return nKeyValue;
        }
        return previous[current];
    }, object);
};
export const getKeyFromObjectPlugin = (context) => {
    const { location, objectString } = context;
    //  console.log({ objectString, location });
    const object = tryParseJson(objectString);
    if (object === null || typeof object !== "object") {
        return { isSuccessful: false, message: "No object found" };
    }
    const result = getKeyFromObject(object, location);
    if (result === null || result === undefined) {
        return { isSuccessful: false, message: "Location not found" };
    }
    return { isSuccessful: true, result };
};
getKeyFromObjectPlugin.config = {
    isPublic: true,
    plugin: "column",
    emoji: "📄",
    categories: ["util"],
    descriptionMarkdown: `Use this function to get a certain information on an object in a hardcoded way. You can use array indexes like 'x[n]' and you can use object keys like 'x.y.z'.
    
This function uses simple Javascript which makes it fast and free to use.`,
    shortDescription: "Retreive specific information from JSON of another column",
};
//# sourceMappingURL=getKeyFromObject.js.map