import { fs, path } from "fs-util";
import { projectRoot } from "get-path";
import { readJsonFile } from "read-json-file";
import { getMdbAuthorization } from "./getMdbAuthorization.js";
export const getSchema = async (context) => {
    const { projectRelativePath } = context;
    if (!projectRelativePath || !projectRoot) {
        return { isSuccessful: false, message: "Invalid file" };
    }
    const dbPath = path.join(projectRoot, projectRelativePath);
    const folderPath = path.parse(dbPath).dir;
    const schemaFilename = `./${path.parse(dbPath).name}.schema.json`;
    const absoluteSchemaPath = path.join(folderPath, schemaFilename);
    if (!fs.existsSync(absoluteSchemaPath)) {
        return { isSuccessful: false, message: "Invalid file" };
    }
    // ensure we are authorized
    const authorization = await getMdbAuthorization(context);
    if (!authorization.canRead) {
        console.log({ dbPath, authorization, context });
        return { isSuccessful: false, message: "Can't get file" };
    }
    const schema = await readJsonFile(absoluteSchemaPath);
    return {
        isSuccessful: true,
        message: "Found schema",
        schema,
        canWrite: authorization.canWrite,
    };
};
getSchema.config = { isPublic: true };
//# sourceMappingURL=getSchema.js.map