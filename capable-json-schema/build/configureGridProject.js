import { kebabCase } from "convert-case";
import { updateSingleNestedJsonFile } from "edit-json-file";
import { renameFileCollection } from "file-collection-util";
import { fs } from "fs-util";
import { makeRelative } from "fs-util-js";
import { projectRoot } from "get-path";
import path from "path";
import { getSchema } from "actionschema-core";
import { getAbsoluteSchemaPath } from "actionschema-core";
import { makeActionSchemaDb } from "fsorm-lmdb";
export const configureGridProject = async (context) => {
    const { name, description, privacy, projectRelativePath, category, ...standardContext } = context;
    const { schema, ...result } = await getSchema({
        ...standardContext,
        projectRelativePath,
    });
    if (!result.isSuccessful || !schema || !projectRoot) {
        return result;
    }
    // TODO: add once I have this in json.status
    const isBlocked = false;
    if (isBlocked) {
        return {
            isSuccessful: false,
            message: "Can't rename while operations are queued or in progress",
        };
    }
    const absoluteJsonPath = path.join(projectRoot, projectRelativePath);
    const absoluteSchemaPath = getAbsoluteSchemaPath(projectRelativePath);
    const projectRelativeSchemaPath = makeRelative(absoluteSchemaPath, projectRoot);
    const absoluteOldFolderPath = path.parse(absoluteJsonPath).dir;
    const oldName = path.parse(absoluteOldFolderPath).base;
    // set description to schema
    const realName = kebabCase(name);
    const db = makeActionSchemaDb(projectRelativePath);
    await db.put("privacy", privacy);
    await db.put("category", category);
    // set privacy to json array
    await updateSingleNestedJsonFile(absoluteSchemaPath, {
        description,
    });
    if (oldName === realName) {
        // no renaming required
        return {
            isSuccessful: true,
            message: "Updated your project",
        };
    }
    // NB: also rename
    const absoluteNewProjectFolderPath = path.join(path.parse(absoluteOldFolderPath).dir, realName);
    if (fs.existsSync(absoluteNewProjectFolderPath)) {
        return {
            isSuccessful: false,
            message: "You already have another project with that name",
        };
    }
    // remove old json for now
    // rename the folder
    // first rename the file collection
    await renameFileCollection(projectRelativeSchemaPath, realName);
    // then rename the folder
    await fs.rename(absoluteOldFolderPath, absoluteNewProjectFolderPath);
    //rename the schema
    const relativeSchemaPath = `./${realName}.schema.json`;
    const absoluteNewJsonPath = path.join(absoluteNewProjectFolderPath, `${realName}.mdb`);
    const newProjectRelativePath = makeRelative(absoluteNewJsonPath, projectRoot);
    return {
        isSuccessful: true,
        message: "Renamed",
        projectRelativePath: newProjectRelativePath,
    };
};
configureGridProject.config = {
    isPublic: true,
};
//# sourceMappingURL=configureGridProject.js.map