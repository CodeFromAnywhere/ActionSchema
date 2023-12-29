import { OrmItem } from "fsorm-types";
import { ActionSchemaPrivacy, ActionSchemaStatus, GridSpending, JsonArrayStatus, JsonStatusDelta } from "./JsonArray.js";
/** key values for lmdb */
export interface ActionSchemaDb extends OrmItem {
    projectSlug: string;
    personSlug: string;
    /** Defaults to "unlisted" for new tables and "private" for imported tables */
    privacy?: ActionSchemaPrivacy;
    /** can be filled by user */
    category?: string;
    /** status indicating whether or not rows are being generated */
    rowGenerationStatus?: ActionSchemaStatus;
    /** State concerning the status of (re)calculation behavior */
    status?: JsonArrayStatus;
    lastOperationAt?: number;
    lastSizeCalculatedAt?: number;
    projectSizeBytes?: number;
    delta?: JsonStatusDelta[];
    /** to keep track of spending */
    columnSpending?: {
        [columnKey: string]: GridSpending;
    };
    totalSpending?: GridSpending;
}
export declare const actionSchemaDbConfig: {
    readonly modelName: "ActionSchemaDb";
    readonly storageLocation: "memory/persons/[personSlug]/files/[projectSlug]/[projectSlug].project.json";
    readonly pathIndexKeys: readonly ["personSlug", "projectSlug"];
};
//# sourceMappingURL=ActionSchemaDb.d.ts.map