import { ActionSchemaPlugin } from "../types/action-schema-plugin.schema.js";
import { OpenAPIDetails } from "../types/action-schema.schema.js";
/**
 * Determines the openapi url based on the plugins and content of the plugin
 */
export declare const getOpenapiDetails: ($openapi: OpenAPIDetails | undefined, actionSchemaPlugins: ActionSchemaPlugin[] | undefined) => Promise<{
    apiUrl: string;
    method: string;
    headers: any;
} | undefined>;
//# sourceMappingURL=getOpenapiDetails.d.ts.map