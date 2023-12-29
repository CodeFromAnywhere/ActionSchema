import { StandardContext } from "function-types";
/**
 * Useful for doing logic in columns
 */
export declare const simpleCondition: {
    (context: StandardContext & {
        value: string | number | boolean;
        /** Nothing is case sensitive */
        operator?: "Equal" | "Less than" | "More than" | "Contains" | "Starts with" | "Ends with";
        compare: string | number | boolean;
    }): {
        isSuccessful: boolean;
        result: boolean;
        message?: undefined;
    } | {
        isSuccessful: boolean;
        message: string;
        result?: undefined;
    };
    config: {
        isPublic: true;
        categories: string[];
        emoji: string;
        plugin: "column";
        shortDescription: string;
    };
};
//# sourceMappingURL=simpleCondition.d.ts.map