import { StandardContext } from "function-types";
/**
 * Removes column.
 *
 * Deletion of a column removes all its values but also removes it from the schema
 */
export declare const removeSchemaColumn: {
    (context: StandardContext & {
        key: string;
        projectRelativePath: string;
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
//# sourceMappingURL=removeSchemaColumn.d.ts.map