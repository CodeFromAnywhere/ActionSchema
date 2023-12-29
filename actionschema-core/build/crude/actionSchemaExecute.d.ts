import { StandardContext, StandardResponse } from "function-types";
import { ModelKey } from "./types.js";
export type ActionSchemaExecuteResponse = StandardResponse & {
    /** Whether or not the schema can be written to */
    canWrite?: boolean;
};
export declare const actionSchemaExecute: {
    (context: StandardContext & {
        projectRelativePath: string;
        rowIds: string[];
        mode: "recalculate" | "only-empty";
        /** A single property calculation is done for the specified key */
        propertyKey?: ModelKey;
        /**
         * NB: sometimes needed in case we rely on this result
         */
        waitForResult?: boolean;
    }): Promise<ActionSchemaExecuteResponse>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=actionSchemaExecute.d.ts.map