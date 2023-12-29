import { getCapableJsonSchemaProperties, } from "capable-json-schema-js";
import { writeJsonToFile } from "fs-util";
import { projectRoot } from "get-path";
import { setNestedObject } from "js-util";
import { moveObjectKeyToIndex } from "./moveObjectKeyToIndex.js";
import { lockAction } from "lock-util";
import { getAbsoluteSchemaPath } from "./getAbsoluteSchemaPath.js";
import { getSchema } from "./getSchema.js";
export const moveSchemaColumn = async (context) => {
    const { key, projectRelativePath, toIndex, ...standardContext } = context;
    const { schema, ...result } = await getSchema({
        ...standardContext,
        projectRelativePath,
    });
    if (!result.isSuccessful || !schema || !projectRoot) {
        return result;
    }
    const properties = getCapableJsonSchemaProperties(schema);
    if (!properties || !Object.keys(properties).includes(key)) {
        return {
            isSuccessful: false,
            message: `${key} is not a column of your table`,
        };
    }
    const newProperties = moveObjectKeyToIndex(properties, key, toIndex);
    const mainSchema = schema;
    const newSchema = setNestedObject(mainSchema, {
        properties: { items: { items: { properties: null } } },
    }, newProperties);
    // console.dir({ mainSchema, newSchema }, { depth: 99 });
    const schemaPath = getAbsoluteSchemaPath(projectRelativePath);
    await lockAction(schemaPath, () => {
        return writeJsonToFile(schemaPath, newSchema);
    });
    return {
        isSuccessful: true,
        message: `Written JSON`,
    };
};
moveSchemaColumn.config = { isPublic: true };
//# sourceMappingURL=moveSchemaColumn.js.map