import { getCapableJsonSchemaProperties, } from "capable-json-schema-js";
import { writeJsonToFile } from "fs-util";
import { projectRoot } from "get-path";
import { mergeObjectsArray, onlyUnique2, setNestedObject } from "js-util";
import { findVariables } from "capable-json-schema-js";
import { getAbsoluteSchemaPath } from "actionschema-core";
import { makeActionSchemaDb } from "fsorm-lmdb";
import { getSchema } from "actionschema-core";
/**
 Sets column schema property config.
 
 When changing the fieldname, ensure to change all values that were under it!
 */
export const setSchemaProperty = async (context) => {
    const { key, projectRelativePath, capableJsonSchema, newKeyName, ...standardContext } = context;
    const { schema, ...result } = await getSchema({
        ...standardContext,
        projectRelativePath,
    });
    if (!result.isSuccessful || !schema || !projectRoot) {
        console.log({ ...standardContext, projectRelativePath }, schema, result);
        return result;
    }
    const properties = getCapableJsonSchemaProperties(schema);
    const propertyKeys = properties ? Object.keys(properties) : undefined;
    if (!properties || !propertyKeys?.includes(key)) {
        return {
            isSuccessful: false,
            message: `${key} is not a column of your table`,
        };
    }
    if (newKeyName !== key &&
        (propertyKeys
            .map((x) => x.toLowerCase())
            .includes(newKeyName.toLowerCase()) ||
            newKeyName === "__actionSchemaId")) {
        return {
            isSuccessful: false,
            message: newKeyName === "__actionSchemaId"
                ? "Forbidden name"
                : `There is already a key with the name ${newKeyName}. Choose another name!`,
        };
    }
    const keyIndex = propertyKeys.findIndex((k) => k === key);
    //replace propertyName if not the same
    propertyKeys[keyIndex] = newKeyName;
    // set it in the right place!
    const newProperties = mergeObjectsArray(propertyKeys.map((key) => {
        if (key !== newKeyName) {
            return { [key]: properties[key] };
        }
        // only set the key if it's the new key name
        const firstCreationPlugin = capableJsonSchema.creationPlugins?.[0];
        if (firstCreationPlugin) {
            // NB: ensure to also set the propertyDependencies
            const allStringsString = firstCreationPlugin.context
                ? Object.values(firstCreationPlugin.context)
                    .filter((x) => typeof x === "string")
                    .map((x) => x)
                    .join("\n")
                : "";
            const variables = findVariables(allStringsString).filter(onlyUnique2());
            firstCreationPlugin.propertyDependencies = propertyKeys.filter((key) => variables.includes(key));
        }
        return {
            [key]: {
                ...capableJsonSchema,
                creationPlugins: firstCreationPlugin
                    ? [firstCreationPlugin]
                    : undefined,
            },
        };
    }));
    const mainSchema = schema;
    const newSchema = setNestedObject(mainSchema, {
        properties: { items: { items: { properties: null } } },
    }, newProperties);
    const schemaPath = getAbsoluteSchemaPath(projectRelativePath);
    await writeJsonToFile(schemaPath, newSchema);
    const db = makeActionSchemaDb(projectRelativePath);
    // rename the key too
    if (key !== newKeyName) {
        await db.renameColumn(key, newKeyName);
    }
    // Reset spending because config can be different
    await db.resetSpending(newKeyName);
    return {
        isSuccessful: true,
        message: `Updated property`,
    };
};
setSchemaProperty.config = { isPublic: true };
//# sourceMappingURL=setSchemaProperty.js.map