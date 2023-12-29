import { CapableJsonSchema, JsonArray } from "capable-json-schema-js";
import { StandardContext, StandardResponse } from "function-types";
export declare const getJsonWithSchemaOld: (context: StandardContext & {
    projectRelativePath?: string;
}) => Promise<StandardResponse & {
    json?: JsonArray | undefined;
    schema?: CapableJsonSchema | null | undefined;
    canWrite?: boolean | undefined;
}>;
//# sourceMappingURL=getJsonWithSchemaOld.d.ts.map