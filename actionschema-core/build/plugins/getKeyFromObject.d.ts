/**
If the object is something like this: `{a:{b:{c:"hi"}}}`
The location to get c should be `a.b.c`
Should also support arrays, like in `a.b.c[0].d`

Example:
```
console.log(getKeyFromObject({ a: { b: { c: [1, 2, 3] } } }, "a.b.c[2]"));
```
*/
/// <reference types="web" />
export declare const getKeyFromObject: (object: {
    [key: string]: any;
}, location: string) => any;
export declare const getKeyFromObjectPlugin: {
    (context: {
        objectString: string;
        location: string;
    }): {
        isSuccessful: boolean;
        message: string;
        result?: undefined;
    } | {
        isSuccessful: boolean;
        result: any;
        message?: undefined;
    };
    config: {
        isPublic: true;
        plugin: "column";
        emoji: string;
        categories: string[];
        descriptionMarkdown: string;
        shortDescription: string;
    };
};
//# sourceMappingURL=getKeyFromObject.d.ts.map