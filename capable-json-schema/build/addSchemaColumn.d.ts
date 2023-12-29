import { CapableJsonSchema } from "capable-json-schema-js";
import { StandardContext, StandardResponse } from "function-types";
export declare const getSchemaSuggestion: (description: string, properties: {
    [key: string]: CapableJsonSchema;
}, schema: CapableJsonSchema | null | undefined, standardContext: StandardContext) => Promise<{
    priceCredit: number;
    pluginName: string | undefined;
    key: string | undefined;
} | undefined>;
export declare const addSchemaColumn: {
    (context: StandardContext & {
        description: string;
        projectRelativePath: string;
    }): Promise<StandardResponse & {
        key?: string | undefined;
    }>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=addSchemaColumn.d.ts.map