import { StandardContext, StandardResponse } from "function-types";
import { ModelItemPartial } from "./types.js";
export type ActionSchemaCreateResponse = StandardResponse & {
    /** The rowIds created */
    result?: string[];
};
export declare const actionSchemaCreate: {
    (context: StandardContext & {
        /** NB: if items in this array contain `__actionSchemaId` it will be overwriting that id  */
        items: ModelItemPartial[];
        projectRelativePath: string;
        shouldExecuteGridEntireRow?: boolean;
        totalPriceCredit?: number;
    }): Promise<ActionSchemaCreateResponse>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=actionSchemaCreate.d.ts.map