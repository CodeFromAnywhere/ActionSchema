import { getValidJsonArrayFile, } from "capable-json-schema-js";
import { fs, path } from "fs-util";
import { projectRoot } from "get-path";
import { readJsonFile } from "read-json-file";
import { getMdbAuthorization } from "actionschema-core";
export const getJsonWithSchemaOld = async (context) => {
    const { projectRelativePath } = context;
    if (!projectRelativePath || !projectRoot) {
        return { isSuccessful: false, message: "Invalid file" };
    }
    const jsonPath = path.join(projectRoot, projectRelativePath);
    // ensure we are authorized
    const authorization = await getMdbAuthorization(context);
    if (!authorization.canRead || !fs.existsSync(jsonPath)) {
        console.log({ jsonPath, authorization, context });
        return { isSuccessful: false, message: "Can't get file" };
    }
    const json = await readJsonFile(jsonPath);
    if (!json || !getValidJsonArrayFile(json)) {
        return { isSuccessful: false, message: "Invalid file" };
    }
    const schemaPath = path.join(path.parse(jsonPath).dir, json.$schema);
    if (!schemaPath || !fs.existsSync(schemaPath)) {
        return { isSuccessful: false, message: "Incorrupt file (no schema)" };
    }
    const schema = await readJsonFile(schemaPath);
    if (!schema) {
        return { isSuccessful: false, message: "Couldn't load schema" };
    }
    return {
        isSuccessful: true,
        message: "Found json and schema",
        json: json,
        schema,
        canWrite: authorization.canWrite,
    };
};
//# sourceMappingURL=getJsonWithSchemaOld.js.map