import { ConditionalDestinationResult, StandardContext, StandardResponse } from "function-types";
import { O } from "js-util";
export declare const conditionalDestination: {
    (context: StandardContext & {
        /** the (case-senstive) name of the table you want to push this row to if the condition is met */
        destinationTableName?: string;
        /** Automatically provided */
        row?: O;
        /** Automatically provided  */
        previousResult?: ConditionalDestinationResult | undefined;
    }): Promise<StandardResponse & {
        result?: ConditionalDestinationResult;
    }>;
    config: {
        isPublic: true;
        emoji: string;
        categories: string[];
        plugin: "column";
        shortDescription: string;
        productionStatus: "alpha";
    };
};
//# sourceMappingURL=conditionalDestination.d.ts.map