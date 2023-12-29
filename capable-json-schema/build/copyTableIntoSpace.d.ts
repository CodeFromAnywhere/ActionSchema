/// <reference types="web" />
import { StandardContext } from "function-types";
import { CapableJsonSchema, JsonArray } from "capable-json-schema-js";
/**

- It will create it in your own space in a new folder in `projects/[filename]`
- uses file names `[filename].json` and `[filename].schema.json`
- Returns the project relative path of the new JSON so you can open it

*/
export declare const copyTableIntoSpace: {
    (context: StandardContext & {
        schema?: CapableJsonSchema | null;
        json?: JsonArray;
        name?: string;
    }): Promise<{
        isSuccessful: boolean;
        message: string;
        projectRelativePath?: undefined;
    } | {
        isSuccessful: boolean;
        message: string;
        projectRelativePath: string;
    }>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=copyTableIntoSpace.d.ts.map