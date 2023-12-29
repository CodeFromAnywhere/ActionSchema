import { StandardContext } from "function-types";
/**  */
export declare const executeGridPlugin: {
    (context: StandardContext & {
        projectRelativePath: string;
        rowIds: string[];
        mode: "recalculate" | "only-empty";
        /** a single property calculation is done for the specified key */
        propertyKey?: string;
        /**
         * NB: sometimes needed in case we rely on this result
         */
        waitForResult?: boolean;
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
//# sourceMappingURL=executeGridPlugin.d.ts.map