import { StandardContext } from "function-types";
import { PublicTable } from "capable-json-schema-js";
export declare const findMyTables: {
    (context: StandardContext): Promise<{
        isSuccessful: boolean;
        message: string;
        tables?: undefined;
    } | {
        isSuccessful: boolean;
        message: string;
        tables: PublicTable[];
    }>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=findMyTables.d.ts.map