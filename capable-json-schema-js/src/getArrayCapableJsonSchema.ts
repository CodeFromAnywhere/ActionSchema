import { takeFirst } from "js-util";
import { CapableJsonSchema } from "./CapableJsonSchema.js";

export const getArrayCapableJsonSchema = (
  schema: CapableJsonSchema | null | undefined,
): CapableJsonSchema | undefined => {
  return schema?.properties?.items as CapableJsonSchema;
};
