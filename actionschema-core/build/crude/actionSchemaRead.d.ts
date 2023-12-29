import { ActionSchemaDb, CapableJsonSchema } from "capable-json-schema-js";
import { StandardContext, StandardResponse } from "function-types";
import { ModelItemPartial, ModelKey } from "./types.js";
export type ActionSchemaReadResponse = StandardResponse & {
    /** The data */
    json?: {
        $schema: string;
        items: ModelItemPartial[];
    } & ActionSchemaDb;
    /** The ActionSchema that describes the data in JSON */
    schema?: CapableJsonSchema | null;
    /** Whether or not we can write to the schema */
    canWrite?: boolean;
    /** Whether or not there are more items to be fetched */
    hasMore?: boolean;
};
export declare const actionSchemaRead: {
    (context: StandardContext & {
        projectRelativePath?: string;
        /**
         * search for a specific value
         */
        search?: string;
        /**
         * Coming soon: provide specific ids here to only select these keys (more efficient)
         */
        rowIds?: string[];
        /** Starting index (slices the rest away) */
        startFromIndex?: number;
        /** If provided, slices the rest away after this amount */
        maxRows?: number;
        /** Filters to be applied on the result before sending it back */
        filter?: {
            operator: "equal" | "notEqual" | "endsWith" | "startsWith" | "includes" | "includesLetters" | "greaterThan" | "lessThan" | "greaterThanOrEqual" | "lessThanOrEqual";
            value: string;
            objectParameterKey: ModelKey;
        }[];
        /** Apply sorting (one by one) after data has been fetched */
        sort?: {
            sortDirection: "ascending" | "descending";
            objectParameterKey: ModelKey;
        }[];
        /** If provided, only selects these keys from the table */
        objectParameterKeys?: ModelKey[];
        /** If provided, responds with all keys except these */
        ignoreObjectParameterKeys?: ModelKey[];
    }): Promise<ActionSchemaReadResponse>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=actionSchemaRead.d.ts.map