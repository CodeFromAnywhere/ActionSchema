import { StandardContext, StandardFunctionConfig } from "function-types";
import { actionSchemaRead } from "actionschema-core";
import { fs, path } from "fs-util";
import { projectRoot } from "get-path";
import { generateTypescriptFile } from "./generateTypescriptFile.js";
import {
  CapableJsonSchema,
  MainCapableJsonSchema,
} from "capable-json-schema-js";

export const generateTypescript = async (
  context: StandardContext & { projectRelativePath: string },
) => {
  const { projectRelativePath } = context;
  const tableName = path.parse(projectRelativePath).name;

  const { schema } = await actionSchemaRead(context);
  if (!schema) {
    return { isSuccessful: false, message: "No schema" };
  }
  const tsPath = projectRelativePath.includes("memory/persons")
    ? path.join(
        projectRoot,
        path.parse(projectRelativePath).dir,
        `${tableName}.ts`,
      )
    : //  Not a person but a code schema (from admin)
      path.join(
        projectRoot,
        "packages/generated/sdk-fsorm-lmdb/src",
        `${tableName}.ts`,
      );

  const objectSchema = (schema as MainCapableJsonSchema).properties.items
    .items as CapableJsonSchema;

  // TODO: install https://www.npmjs.com/package/json-schema-to-typescript
  const tsString = await generateTypescriptFile(objectSchema, tableName);

  await fs.writeFile(tsPath, tsString, "utf8");

  return { isSuccessful: true, message: "Written" };
};

generateTypescript.config = {
  isPublic: true,
} satisfies StandardFunctionConfig;
