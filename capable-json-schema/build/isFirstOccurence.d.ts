import { StandardContext } from "function-types";
import { O } from "js-util";
export declare const isFirstOccurence: {
    (context: StandardContext & {
        /**
         * Which column should it be the first occurence for?
         */
        columnKey: string;
        /** is provided by default*/
        row: O;
        /** should be provided by default (and overwritten by system if it was given by user). Must be secure. */
        projectRelativeGridPath: string;
    }): {
        isSuccessful: boolean;
        result: boolean;
    };
    config: {
        isPublic: true;
        categories: string[];
        emoji: string;
        plugin: "column";
        shortDescription: string;
    };
};
//# sourceMappingURL=isFirstOccurence.d.ts.map