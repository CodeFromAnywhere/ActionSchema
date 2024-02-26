import { ActionSchema } from "../../types/action-schema.schema.js";
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
export type ValueOptions = {
    /**
     * If true, will replace the object rather than overwriting it where needed.
     *
     * By default, ActionSchema will overwrite only the given individual properties of an object. In this case, the other properties will be set to stale if needed.
     */
    objectReplace?: boolean;
    /**
      If true, will replace items in the array fully.
      
      By default, ActionSchema will insert into an array with an optional discriminator (see below).
       */
    arrayReplace?: boolean;
    /**
     * If given, must be a key of the object in the array. Will now overwrite/replace object-items where a discriminator matches, while keeping the rest as-is.
     */
    arrayDiscriminatorPropertyKey?: string;
};
//# sourceMappingURL=setValue.d.ts.map