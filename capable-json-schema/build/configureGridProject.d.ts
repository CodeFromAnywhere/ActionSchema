/// <reference types="web" />
import { StandardContext, StandardResponse } from "function-types";
export declare const configureGridProject: {
    (context: StandardContext & {
        projectRelativePath: string;
        name: string;
        description: string;
        privacy: "unlisted" | "public" | "private";
        category?: string;
    }): Promise<StandardResponse & {
        projectRelativePath?: string | undefined;
    }>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=configureGridProject.d.ts.map