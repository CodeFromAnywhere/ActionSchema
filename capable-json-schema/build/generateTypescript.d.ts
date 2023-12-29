import { StandardContext } from "function-types";
export declare const generateTypescript: {
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
//# sourceMappingURL=generateTypescript.d.ts.map