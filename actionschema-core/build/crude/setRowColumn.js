import { getSimpleFsAuthorization } from "fs-authorization";
import { fs } from "fs-util";
import { projectRoot } from "get-path";
import path from "path";
import { makeActionSchemaDb } from "fsorm-lmdb";
/**
 */
export const setRowColumn = async (context) => {
    const { id, projectRelativePath, columnKey, value, needStatusUpdate, ...standardContext } = context;
    if (!projectRoot) {
        return { isSuccessful: false, message: "No root" };
    }
    if (id === undefined || !projectRelativePath || !columnKey) {
        return { isSuccessful: false, message: "Invalid inputs" };
    }
    if (!context.me_personSlug) {
        return { isSuccessful: false, message: "Please login" };
    }
    const authorization = await getSimpleFsAuthorization({
        ...standardContext,
        projectRelativePath,
    });
    if (!authorization.canWrite) {
        return { isSuccessful: false, message: "Not authorized" };
    }
    const absolutePath = path.join(projectRoot, projectRelativePath);
    if (!fs.existsSync(absolutePath)) {
        return { isSuccessful: false, message: "File doesn't exist" };
    }
    const db = makeActionSchemaDb(projectRelativePath);
    await db.updateItem(id, columnKey, value);
    return { isSuccessful: true, message: "Updated" };
};
setRowColumn.config = { isPublic: true };
//# sourceMappingURL=setRowColumn.js.map