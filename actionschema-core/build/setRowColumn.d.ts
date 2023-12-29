import { StandardContext } from "function-types";
import { Json } from "model-types";
/**
 */
export declare const setRowColumn: {
    (context: StandardContext & {
        projectRelativePath: string;
        id: string;
        columnKey: string;
        value: Json;
        needStatusUpdate?: boolean;
    }): Promise<{
        isSuccessful: boolean;
        message: string;
    }>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=setRowColumn.d.ts.map