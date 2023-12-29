import { fs } from "fs-util";
import { get } from "fsorm-lmdb";
import { projectRoot } from "get-path";
import path from "path";
import { makeActionSchemaDb } from "fsorm-lmdb";
import { makeRelative } from "fs-util-js";
export const resetStatus = async () => {
    const filePaths = (await get("Person")).result
        ?.map((person) => path.join(projectRoot, "memory", "persons", person.slug, "files"))
        .filter(fs.existsSync);
    if (!filePaths) {
        return;
    }
    const existingProjectPaths = filePaths
        .map((absolutePath) => {
        const projects = fs
            .readdirSync(absolutePath)
            .map((name) => path.join(absolutePath, name, `${name}.mdb`))
            .filter(fs.existsSync);
        return projects;
    })
        .flat();
    await Promise.all(existingProjectPaths.map(async (absolutePath) => {
        const db = makeActionSchemaDb(makeRelative(absolutePath, projectRoot));
        db.put("status", undefined);
        db.put("rowGenerationStatus", undefined);
    }));
    console.log("Status reset for ", existingProjectPaths.length, " projects");
};
resetStatus.config = {
    isPublic: false,
    runHook: ["startup"],
};
//# sourceMappingURL=resetStatus.js.map