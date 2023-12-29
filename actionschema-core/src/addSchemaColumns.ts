import {
  CapableJsonSchema,
  MainCapableJsonSchema,
  getCapableJsonSchemaProperties,
} from "capable-json-schema-js";
import { writeJsonToFile } from "fs-util";
import { projectRoot } from "get-path";
import { mergeObjectsArray } from "js-util";
import { lockAction } from "lock-util";
import { readJsonFile } from "read-json-file";
import { getAbsoluteSchemaPath } from "./getAbsoluteSchemaPath.js";

/** Ensure we have all columsn from the array result in the schema */
export const addSchemaColumns = async (
  firstItem: object,
  projectRelativePath: string,
) => {
  console.log("updateSchemaColumns", { projectRelativePath });

  if (!projectRoot) {
    return;
  }
  // NB: ensure to
  // for now, take it from the first row
  const newPropertiesKeys = Object.keys(firstItem).filter(
    (key) => key !== "__actionSchemaId",
  );
  const schemaPath = getAbsoluteSchemaPath(projectRelativePath);

  await lockAction(schemaPath, async () => {
    const schema = await readJsonFile<CapableJsonSchema>(schemaPath);
    if (!schema) {
      return;
    }

    const alreadyProperties = getCapableJsonSchemaProperties(schema) || {};
    const alreadyPropertiesKeys = Object.keys(alreadyProperties);
    const newPropertiesNotYet = newPropertiesKeys.filter(
      (key) => !alreadyPropertiesKeys.includes(key),
    );

    if (newPropertiesNotYet.length === 0) {
      return;
    }

    const newPropertiesObject = mergeObjectsArray(
      newPropertiesNotYet.map((key) => ({
        [key]: { type: "string" } as CapableJsonSchema,
      })),
    );
    const newProperties = { ...alreadyProperties, ...newPropertiesObject };
    const newSchema = schema as MainCapableJsonSchema;
    newSchema.properties.items = {
      ...newSchema.properties.items,
      items: {
        ...newSchema.properties.items.items,
        type: "object",
        properties: newProperties,
      },
    };
    return writeJsonToFile(schemaPath, newSchema);
  });
};
