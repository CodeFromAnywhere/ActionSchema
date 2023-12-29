import { CapableJsonSchema, JsonArray } from "capable-json-schema-js";
import { StandardContext, StandardResponse } from "function-types";
export declare const getJsonWithSchema: {
    (context: StandardContext & {
        projectRelativePath?: string;
    }): Promise<StandardResponse & {
        json?: JsonArray | undefined;
        schema?: CapableJsonSchema | null | undefined;
        canWrite?: boolean | undefined;
    }>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=getJsonWithSchema.d.ts.map