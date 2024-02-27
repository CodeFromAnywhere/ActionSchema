import { ActionSchema } from "../types/action-schema.schema.js";
import { buildPath, tokenize } from "./dot-wild.js";

export const getSchemaAtDotLocation = (
  schema: ActionSchema,
  dotLocation: string,
): ActionSchema | undefined => {
  const tokens = tokenize(dotLocation);
  const first = tokens.shift();
  const rest = buildPath(tokens);
  if (first === undefined) {
    // tokens should be empty array. No locations.
    return schema;
  }

  const schemaAtLocation =
    schema.type === "array"
      ? schema.items
      : schema.type === "object"
      ? schema.properties?.[first]
      : undefined;

  if (!schemaAtLocation || schemaAtLocation === true) {
    //shouldn't happen right?
    return;
  }

  const finalSchema = !Array.isArray(schemaAtLocation)
    ? // Regular schemas can be returned
      schemaAtLocation
    : // Wildcards take the first one
    first === "*"
    ? schemaAtLocation[0]
    : // If we have multiple, take the number token or first if not possible
    schemaAtLocation.length < Number(first)
    ? schemaAtLocation[0]
    : schemaAtLocation[Number(first)];

  // Recurse on this non-basecase (rest has 1 token less)
  return getSchemaAtDotLocation(finalSchema, rest);
};
