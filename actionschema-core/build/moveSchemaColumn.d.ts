import { StandardContext } from "function-types";
export declare const moveSchemaColumn: {
    (context: StandardContext & {
        key: string;
        projectRelativePath: string;
        toIndex: number;
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
//# sourceMappingURL=moveSchemaColumn.d.ts.map