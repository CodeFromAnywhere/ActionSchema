import { path, writeJsonToFile } from "fs-util";
import { projectRoot } from "get-path";
import { withoutSubExtensions } from "fs-util-js";
import { actionSchemaRead } from "actionschema-core";
export const storeJson = async (context) => {
    const { projectRelativePath } = context;
    const absolutePath = path.join(projectRoot, projectRelativePath);
    const jsonPath = withoutSubExtensions(absolutePath) + ".json";
    const { json } = await actionSchemaRead(context);
    if (!json) {
        return {
            isSuccessful: false,
            message: "No JSON",
        };
    }
    // NB: this consumes much mem for large ones
    const isSuccessful = await writeJsonToFile(jsonPath, json);
    console.log({ jsonPath, hasJson: !!json });
    return { isSuccessful, message: "Saved" };
};
storeJson.config = { isPublic: true };
//# sourceMappingURL=storeJson.js.map