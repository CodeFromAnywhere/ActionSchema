import { actionSchemaRead } from "actionschema-core";
import { fs, path } from "fs-util";
import { projectRoot } from "get-path";
import { generateTypescriptFile } from "./generateTypescriptFile.js";
export const generateTypescript = async (context) => {
    const { projectRelativePath } = context;
    const tableName = path.parse(projectRelativePath).name;
    const { schema } = await actionSchemaRead(context);
    if (!schema) {
        return { isSuccessful: false, message: "No schema" };
    }
    const tsPath = projectRelativePath.includes("memory/persons")
        ? path.join(projectRoot, path.parse(projectRelativePath).dir, `${tableName}.ts`)
        : //  Not a person but a code schema (from admin)
            path.join(projectRoot, "packages/generated/sdk-fsorm-lmdb/src", `${tableName}.ts`);
    const objectSchema = schema.properties.items
        .items;
    // TODO: install https://www.npmjs.com/package/json-schema-to-typescript
    const tsString = await generateTypescriptFile(objectSchema, tableName);
    await fs.writeFile(tsPath, tsString, "utf8");
    return { isSuccessful: true, message: "Written" };
};
generateTypescript.config = {
    isPublic: true,
};
//# sourceMappingURL=generateTypescript.js.map