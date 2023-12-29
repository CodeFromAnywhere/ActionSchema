import { Json } from "model-types";
import { JsonArray } from "./JsonArray.js";

export const getValidJsonArrayFile = (json: Json | JsonArray) => {
  const isValid = !!(
    json &&
    typeof json === "object" &&
    !Array.isArray(json) &&
    json?.items &&
    json?.$schema &&
    typeof json?.$schema === "string" &&
    Array.isArray(json.items)
  );

  if (!isValid) {
    return;
  }
  return json as unknown as JsonArray;
};
