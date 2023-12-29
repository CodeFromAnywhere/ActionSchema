import { StandardContext } from "function-types";
export declare const getStatusDelta: {
    (context: StandardContext & {
        projectRelativePath?: string;
    }): Promise<{
        isSuccessful: boolean;
        message: string;
        result?: undefined;
        credit?: undefined;
    } | {
        isSuccessful: boolean;
        result: import("capable-json-schema-js").JsonStatusDelta[] | undefined;
        credit: number;
        message?: undefined;
    }>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=getStatusDelta.d.ts.map