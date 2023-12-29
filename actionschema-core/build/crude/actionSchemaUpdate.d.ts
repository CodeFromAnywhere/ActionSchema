import { StandardContext } from "function-types";
import { ModelItemPartial } from "./types.js";
export type ActionSchemaUpdateResponse = {
    isSuccessful: boolean;
    message: string;
};
/**
 *
 */
export declare const actionSchemaUpdate: {
    (context: StandardContext & {
        projectRelativePath: string;
        /** The id (indexed key) of the item to update */
        id: string;
        /** New (partial) value of the item. Will update all keys provided here. Please note that it cannot be set to 'undefined', but "null" is possible.  */
        partialItem: ModelItemPartial;
    }): Promise<ActionSchemaUpdateResponse>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=actionSchemaUpdate.d.ts.map