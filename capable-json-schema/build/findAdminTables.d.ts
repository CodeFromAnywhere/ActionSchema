import { StandardContext } from "function-types";
import { PublicTable } from "capable-json-schema-js";
import { OpenFile } from "asset-type";
export declare const findAdminTables: (context: StandardContext & {
    openFiles?: OpenFile[] | undefined;
}) => Promise<PublicTable[] | undefined>;
//# sourceMappingURL=findAdminTables.d.ts.map