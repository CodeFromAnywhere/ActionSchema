import { ActionSchema } from "../../types/action-schema.schema.js";
import { ValueOptions } from "../../plugin/execute.js";
/**
Sets the value and handles status

TODO:

- For testing purposes, also write to a JSON file, locked, so I can see it. There must be efficient libs for this!

- Implement options. This is crucial for and should be well thought-through before deciding on it.

*/
export declare const setValue: (databaseId: string, dotLocation: string, schema: ActionSchema, data: any, options?: ValueOptions) => Promise<{
    isSuccessful: boolean;
    message: string;
}>;
//# sourceMappingURL=setValue.d.ts.map