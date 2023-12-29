import { StandardContext } from "function-types";
import { ExecuteGridEntireRowContext } from "./ExecuteGridEntireRowContext.js";
export declare const executeGridEntireRow: {
    (context: StandardContext & ExecuteGridEntireRowContext): Promise<{
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
//# sourceMappingURL=executeGridEntireRow.d.ts.map