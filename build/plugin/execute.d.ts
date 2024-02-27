import { ActionSchema } from "../types/action-schema.schema.js";
import { EnvironmentConfig, ExecuteContext, ExecuteResult } from "./types.js";
/**
This is the main function to execute things. Please note that the data storage method is abstracted away from this one as every environment implements their own for that.

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
export declare const execute: (context: ExecuteContext & EnvironmentConfig) => Promise<ExecuteResult>;
/**
 * Find dotLocations for each property in the object that we don't have yet
 */
export declare const getNewObjectExposedDotLocations: (schemaHere: ActionSchema, newValue: any, dotLocation: string) => string[] | undefined;
/** Find dotLocations for each property of each item that got created */
export declare const getNewArrayExposedDotLocations: (schemaHere: ActionSchema, newValue: any, dotLocation: string) => string[] | undefined;
//# sourceMappingURL=execute.d.ts.map