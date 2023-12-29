import { StandardContext } from "function-types";
export declare const findMyTablesOld: (context: StandardContext) => Promise<{
    isSuccessful: boolean;
    message: string;
    tables?: undefined;
} | {
    isSuccessful: boolean;
    message: string;
    tables: {
        isPinned: boolean;
        createdAt: number;
        updatedAt: number;
        projectRelativePath: string;
        schemaDescription: string | undefined;
        pluginsAmount: number;
        itemsAmount: number;
    }[];
} | undefined>;
//# sourceMappingURL=findMyTablesOld.d.ts.map