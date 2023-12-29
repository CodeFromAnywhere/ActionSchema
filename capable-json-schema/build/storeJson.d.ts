import { StandardContext } from "function-types";
export declare const storeJson: {
    (context: StandardContext & {
        projectRelativePath: string;
    }): Promise<{
        isSuccessful: boolean;
        message: string;
    }>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=storeJson.d.ts.map