import { ActionSchemaPlugin } from "../../../types/action-schema-plugin.schema";
export declare const getDb: (databaseId: string) => {
    put: (dotLocation: string, value: any) => void;
};
export declare const getStatusDb: (databaseId: string) => {
    put: (dotLocation: string, status: string) => Promise<void>;
    remove: (dotLocation: string) => Promise<void>;
};
export declare const getPlugins: () => ActionSchemaPlugin[];
//# sourceMappingURL=vercelKv.d.ts.map