import { CapableJsonSchema } from "capable-json-schema-js";
import { StandardContext, StandardResponse } from "function-types";
export declare const getSchema: {
    (context: StandardContext & {
        projectRelativePath?: string;
    }): Promise<StandardResponse & {
        schema?: CapableJsonSchema | null | undefined;
        canWrite?: boolean | undefined;
    }>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=getSchema.d.ts.map