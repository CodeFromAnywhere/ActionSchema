import { StandardContext, StandardResponse } from "function-types";
export type ActionSchemaDeleteResponse = StandardResponse & {
    /** The row ids deleted (if any) */
    removedIds?: string[];
};
export declare const actionSchemaDelete: {
    (context: StandardContext & {
        projectRelativePath: string;
        rowIds: string[];
    }): Promise<ActionSchemaDeleteResponse>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=actionSchemaDelete.d.ts.map