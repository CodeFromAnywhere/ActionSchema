import { StandardContext, StandardPluginContext } from "function-types";
export declare const removeRows: {
    (context: StandardContext & {
        projectRelativePath: string;
        rowIds: string[];
    }): Promise<{
        isSuccessful: boolean;
        message: string;
        removedIds?: undefined;
    } | {
        isSuccessful: boolean;
        message: string;
        removedIds: string[];
    }>;
    config: {
        isPublic: true;
    };
};
/**
 * Plugin that allows a row to delete itself or others.
 */
export declare const removeRowPlugin: (context: StandardContext & StandardPluginContext & {
    /** Optional. If not provided, will remove itself only. If provided, can remove other rows */
    rowIds?: string[];
}) => Promise<void>;
//# sourceMappingURL=removeRows.d.ts.map