import { compile } from "json-schema-to-typescript";
import { pascalCase } from "convert-case";
export const generateTypescriptFile = async (schema, tableName) => {
    const typescriptCode = await compile(schema, pascalCase(tableName));
    return typescriptCode;
};
//# sourceMappingURL=generateTypescriptFile.js.map