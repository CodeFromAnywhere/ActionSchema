import { StandardContext } from "function-types";
export declare const insertItemsIntoGrid: (standardContext: StandardContext, result: any[], projectRelativePath: string, shouldExecuteGridEntireRow: boolean | undefined, totalPriceCredit: number) => Promise<{
    isSuccessful: boolean;
    message: string;
    functionResult: any[];
    rowIds?: undefined;
} | {
    isSuccessful: boolean;
    message: string;
    functionResult?: undefined;
    rowIds?: undefined;
} | {
    isSuccessful: boolean;
    message: string;
    rowIds: string[];
    functionResult?: undefined;
}>;
//# sourceMappingURL=insertItemsIntoGrid.d.ts.map