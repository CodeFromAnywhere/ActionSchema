import { CapableJsonSchema } from "capable-json-schema-js";
import { ExecuteGridEntireRowContext } from "./ExecuteGridEntireRowContext.js";
import { StandardContext } from "function-types";
/**
 * Recursively, greedily tries to execute a function for a cell calculation for all properties in a row.
 */
export declare const executeGridEntireRowRecursive: (context: StandardContext & ExecuteGridEntireRowContext, properties: {
    [key: string]: CapableJsonSchema;
}, done: string[], started: string[]) => Promise<number>;
//# sourceMappingURL=executeGridEntireRowRecursive.d.ts.map