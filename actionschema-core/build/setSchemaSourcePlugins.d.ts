import { CapableJsonSchemaPlugin } from "capable-json-schema-js";
import { StandardContext } from "function-types";
/**
create, update, or delete a source plugin from a schema (a plugin for the array)
*/
export declare const setSchemaSourcePlugins: {
    (context: StandardContext & {
        projectRelativePath: string;
        plugins: CapableJsonSchemaPlugin[];
    }): Promise<{
        isSuccessful: boolean;
        message?: string | undefined;
        priceCredit?: number | undefined;
        isQueued?: boolean | undefined;
        canWrite?: boolean | undefined;
    }>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=setSchemaSourcePlugins.d.ts.map