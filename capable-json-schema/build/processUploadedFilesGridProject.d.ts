import { StandardContext } from "function-types";
import { O } from "js-util";
export declare const getTableItems: (firstFileProjectRelativePath: string) => Promise<O[]>;
export declare const processUploadedFilesGridProject: {
    (context: StandardContext & {
        projectRelativePath: string;
        projectRelativeFilePaths: string[];
    }): Promise<{
        isSuccessful: boolean;
        message: string;
    }>;
    config: {
        isPublic: true;
    };
};
//# sourceMappingURL=processUploadedFilesGridProject.d.ts.map