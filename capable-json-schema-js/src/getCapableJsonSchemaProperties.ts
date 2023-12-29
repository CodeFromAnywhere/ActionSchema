import { takeFirst } from "js-util";
import { CapableJsonSchema } from "./CapableJsonSchema.js";

export const getCapableJsonSchemaProperties = (
  schema: CapableJsonSchema | null | undefined,
):
  | {
      [key: string]: CapableJsonSchema;
    }
  | undefined => {
  if (schema?.type !== "object") {
    return;
  }

  if (!schema.properties?.items) {
    return;
  }

  if (
    typeof schema.properties.items === "boolean" ||
    schema.properties.items.type !== "array" ||
    !schema.properties.items.items ||
    typeof schema.properties.items.items === "boolean"
  ) {
    return;
  }

  const firstItem = takeFirst(schema.properties.items.items);

  if (typeof firstItem === "boolean") {
    return;
  }

  if (firstItem.type !== "object" || !firstItem.properties) {
    return;
  }

  return firstItem.properties as
    | {
        [key: string]: CapableJsonSchema;
      }
    | undefined;
};
