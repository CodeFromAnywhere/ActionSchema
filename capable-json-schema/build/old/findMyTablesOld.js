import path from "path";
import fs from "fs";
import { projectRoot } from "get-path";
import { withoutExtension } from "fs-util-js";
import { notEmpty, sum } from "js-util";
import { readJsonFile } from "read-json-file";
import { getCapableJsonSchemaProperties, } from "capable-json-schema-js";
import { get } from "fsorm-lmdb";
export const findMyTablesOld = async (context) => {
    const { me_personSlug } = context;
    if (!me_personSlug) {
        return { isSuccessful: false, message: "Please login" };
    }
    if (!projectRoot) {
        return { isSuccessful: false, message: "No root" };
    }
    const { result: openFiles } = await get("OpenFile", {
        personSlug: me_personSlug,
    });
    const projectRelativeLocation = ["memory/persons", me_personSlug, "files"];
    const absoluteFilesPath = path.join(projectRoot, ...projectRelativeLocation);
    if (!fs.existsSync(absoluteFilesPath)) {
        console.log(`no existo`, absoluteFilesPath);
        return;
    }
    //console.log({ absoluteFilesPath });
    // NB: doesn't work in bun!
    const files = await fs.promises.readdir(absoluteFilesPath, {
        recursive: true,
        encoding: "utf8",
    });
    // console.log({ absoluteFilesPath, files });
    const jsonFiles = files.filter((x) => path.parse(x).ext === ".json");
    // find the json files that have an accompying .schema.json file
    const jsonFilesWithSchema = jsonFiles.filter((name, index, array) => array.includes(`${withoutExtension(name)}.schema.json`));
    // console.log({ jsonFiles, jsonFilesWithSchema });
    const projectRelativePaths = jsonFilesWithSchema.map((name) => path.join(...projectRelativeLocation, name));
    // console.log(`proje`, projectRelativePaths);
    const tables = (await Promise.all(projectRelativePaths.map(async (projectRelativePath) => {
        if (!projectRoot) {
            console.log("NO projroot");
            return;
        }
        const absoluteJsonPath = path.join(projectRoot, projectRelativePath);
        const json = await readJsonFile(absoluteJsonPath);
        if (!fs.existsSync(absoluteJsonPath)) {
            console.log("no existo", absoluteJsonPath);
            return;
        }
        const stat = await fs.promises.stat(absoluteJsonPath);
        // seems not to be always accurate. let's put it in the array json
        const createdAt = stat.birthtimeMs;
        const updatedAt = stat.mtimeMs;
        const itemsAmount = json?.items?.length || 0;
        const absoluteSchemaPath = path.join(projectRoot, `${withoutExtension(projectRelativePath)}.schema.json`);
        const schema = await readJsonFile(absoluteSchemaPath);
        if (!schema) {
            console.log("NO schema");
            return;
        }
        const schemaDescription = schema.description;
        const properties = getCapableJsonSchemaProperties(schema);
        const propertyPluginsAmount = properties
            ? sum(Object.values(properties).map((x) => x.creationPlugins?.length || 0))
            : 0;
        const pluginsAmount = (schema.properties?.items?.creationPlugins?.length || 0) +
            propertyPluginsAmount;
        const isPinned = !!openFiles?.find((x) => x.file_projectRelativePath === projectRelativePath && x.isPinned);
        return {
            isPinned,
            createdAt,
            updatedAt,
            projectRelativePath,
            schemaDescription,
            pluginsAmount,
            itemsAmount,
        };
    }))).filter(notEmpty);
    return { isSuccessful: true, message: "Found them", tables };
};
// findMyTables({ me_personSlug: "guest3", relation_personSlug: "root" }).then(
//   console.log,
// );
//# sourceMappingURL=findMyTablesOld.js.map