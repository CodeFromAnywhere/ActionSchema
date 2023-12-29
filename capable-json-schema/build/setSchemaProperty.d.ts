import { CapableJsonSchema } from "capable-json-schema-js";
import { StandardContext } from "function-types";
/**
 Sets column schema property config.
 
 When changing the fieldname, ensure to change all values that were under it!
 */
export declare const setSchemaProperty: {
    (context: StandardContext & {
        key: string;
        projectRelativePath: string;
        newKeyName: string;
        capableJsonSchema: CapableJsonSchema;
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
//# sourceMappingURL=setSchemaProperty.d.ts.map