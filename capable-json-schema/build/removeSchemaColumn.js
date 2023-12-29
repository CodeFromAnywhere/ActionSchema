import { getCapableJsonSchemaProperties, } from "capable-json-schema-js";
import { writeJsonToFile } from "fs-util";
import { projectRoot } from "get-path";
import { setNestedObject } from "js-util";
import { getSchema } from "actionschema-core";
import { getAbsoluteSchemaPath } from "actionschema-core";
import { makeActionSchemaDb } from "fsorm-lmdb";
/**
 * Removes column.
 *
 * Deletion of a column removes all its values but also removes it from the schema
 */
export const removeSchemaColumn = async (context) => {
    const { key, projectRelativePath, ...standardContext } = context;
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
    // nice sugar
    const { [key]: removed, ...newProperties } = properties;
    const mainSchema = schema;
    const newSchema = setNestedObject(mainSchema, {
        properties: { items: { items: { properties: null } } },
    }, newProperties);
    const schemaPath = getAbsoluteSchemaPath(projectRelativePath);
    await writeJsonToFile(schemaPath, newSchema);
    //const jsonPath = path.join(projectRoot, projectRelativePath);
    const db = makeActionSchemaDb(projectRelativePath);
    await db.removeColumn(key);
    await db.resetSpending(key);
    return {
        isSuccessful: true,
        message: `Removed column`,
    };
};
removeSchemaColumn.config = { isPublic: true };
//# sourceMappingURL=removeSchemaColumn.js.map