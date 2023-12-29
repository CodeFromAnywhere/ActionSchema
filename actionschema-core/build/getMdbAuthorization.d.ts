import { StandardContext } from "function-types";
export declare const getMdbAuthorization: {
    (context: StandardContext & {
        projectRelativePath?: string;
        isDebug?: boolean;
    }): Promise<{
        canRead: boolean;
        canWrite: boolean;
    }>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=getMdbAuthorization.d.ts.map