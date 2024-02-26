import { ActionSchema } from "../../types/action-schema.schema.js";
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
export type ExecuteContext = {
    schema: ActionSchema;
    /** Data dotlocation */
    dotLocation: string;
    databaseId: string;
    value?: any;
    /** If true, skips executing the plugin */
    skipPlugin?: boolean;
    /** If given, must be a dotlocation of the entire schema of the data you want to get back after this one execution. */
    returnDotLocation?: string;
    /** An url to be called back on with updates */
    updateCallbackUrl?: string;
};
/**
A: Init
- Set `busy` status (to not conflict with spawner)
- Set a new value into the db (Optional, if given)

B: Plugin
- Looks at the schema and relevant existing data
- Gathers the context
- Gathers authorization info
- Executes the plugin
- Updates the data with the result
- Remove `busy` status

C: Concequences
- Look at other columns that have this dotLocation in `propertyDependencies`
- Set those status to `stale`
- Try to execute `executeGridPlugin` for dependants directly incase available. (No probem if it fails)
 */
export declare const execute: (context: ExecuteContext) => Promise<{
    isSuccessful: boolean;
    message: string;
}>;
//# sourceMappingURL=execute.d.ts.map