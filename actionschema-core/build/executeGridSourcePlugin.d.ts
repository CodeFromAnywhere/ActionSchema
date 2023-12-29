import { CapableJsonSchemaPlugin } from "capable-json-schema-js";
import { StandardContext } from "function-types";
/**
 *
 */
export declare const executeGridSourcePlugin: {
    (context: StandardContext & {
        projectRelativePath: string;
        plugin: CapableJsonSchemaPlugin;
        shouldExecuteGridEntireRow?: boolean;
        partitionAmount?: number;
    }): Promise<{
        isSuccessful: boolean;
        message?: string | undefined;
        priceCredit?: number | undefined;
        isQueued?: boolean | undefined;
        canWrite?: boolean | undefined;
    }>;
    config: {
        isPublic: true;
        priceCredit: number;
    };
};
//# sourceMappingURL=executeGridSourcePlugin.d.ts.map