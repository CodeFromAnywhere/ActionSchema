import { compile } from "json-schema-to-typescript";
import { pascalCase } from "convert-case";
import { CapableJsonSchema } from "capable-json-schema-js";

export const generateTypescriptFile = async (
  schema: CapableJsonSchema,
  tableName: string,
) => {
  const typescriptCode = await compile(schema as any, pascalCase(tableName));

  return typescriptCode;
};
