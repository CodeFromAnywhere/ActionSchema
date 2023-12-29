import { fs, path } from "fs-util";
import { projectRoot } from "get-path";
import { readJsonFile } from "read-json-file";
import { makeActionSchemaDb } from "fsorm-lmdb";
import { getMdbAuthorization } from "actionschema-core";
export const getJsonWithSchema = async (context) => {
    const { projectRelativePath } = context;
    if (!projectRelativePath || !projectRoot) {
        return { isSuccessful: false, message: "Invalid file" };
    }
    const dbPath = path.join(projectRoot, projectRelativePath);
    const folderPath = path.parse(dbPath).dir;
    const filename = path.parse(dbPath).name;
    const schemaFilename = `./${filename}.schema.json`;
    const absoluteSchemaPath = path.join(folderPath, schemaFilename);
    if (!fs.existsSync(absoluteSchemaPath)) {
        console.log("invalid file", absoluteSchemaPath);
        return { isSuccessful: false, message: "Invalid file" };
    }
    // ensure we are authorized
    const authorization = await getMdbAuthorization(context);
    if (!authorization.canRead || !fs.existsSync(dbPath)) {
        console.log({ dbPath, authorization, context });
        return { isSuccessful: false, message: "Can't get file" };
    }
    const schema = await readJsonFile(absoluteSchemaPath);
    const db = makeActionSchemaDb(projectRelativePath);
    const json = {
        $schema: schemaFilename,
        items: db.getAllItems(),
        privacy: db.get("privacy"),
        rowGenerationStatus: db.get("rowGenerationStatus"),
        status: db.get("status"),
        totalSpending: db.get("totalSpending"),
        columnSpending: db.get("columnSpending"),
        category: db.get("category"),
    };
    return {
        isSuccessful: true,
        message: "Found json and schema",
        json,
        schema,
        canWrite: authorization.canWrite,
    };
};
getJsonWithSchema.config = { isPublic: true };
//# sourceMappingURL=getJsonWithSchema.js.map