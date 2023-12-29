import { makeActionSchemaDb } from "fsorm-lmdb";
import path from "path";
import { writeJsonToFile } from "fs-util";
import { getAbsoluteExportedJsonPath } from "./getAbsoluteExportedJsonPath.js";
export const exportLmdbToJson = async (projectRelativePath) => {
    const db = makeActionSchemaDb(projectRelativePath);
    const folderPath = path.parse(projectRelativePath).dir;
    const filename = path.parse(projectRelativePath).name;
    const schemaFilename = `./${filename}.schema.json`;
    const json = {
        $schema: schemaFilename,
        items: db.getAllItems(),
        privacy: db.get("privacy"),
        rowGenerationStatus: db.get("rowGenerationStatus"),
        status: db.get("status"),
    };
    await writeJsonToFile(getAbsoluteExportedJsonPath(projectRelativePath), json);
};
//# sourceMappingURL=exportLmdbToJson.js.map