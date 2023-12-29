import { StandardContext } from "function-types";
import { O } from "js-util";
import { OpenapiDocument, OpenapiSchemaObject } from "schema-types";
export declare const withoutProperties: (schema: OpenapiSchemaObject, properties: string[]) => import("openapi-types").OpenAPIV3_1.SchemaObject;
export declare const replaceRefs: (schema: OpenapiSchemaObject, refs: O) => any;
/** Renames all refs to #/components/schemas/ instead of #/definitions */
export declare const renameRefs: (schema: OpenapiSchemaObject | undefined) => any;
/**
Should make the openapi from all tables

https://docs.readme.com/main/docs/openapi-compatibility-chart
https://swagger.io/docs/specification/about/
 */
export declare const makeOpenapi: {
    (context: StandardContext): Promise<{
        isSuccessful: boolean;
        message: string;
        openapi?: undefined;
    } | {
        isSuccessful: boolean;
        message: string;
        openapi: OpenapiDocument;
    }>;
    config: {};
};
//# sourceMappingURL=makeOpenapi.d.ts.map