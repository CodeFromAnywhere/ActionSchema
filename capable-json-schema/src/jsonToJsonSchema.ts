import { Json, JsonWithUndefined } from "model-types";
import { JSONSchema7 } from "json-schema";
import toJsonSchema from "to-json-schema";

/**calculates an estimated JSON schema based on the current values of the JSON */
export const jsonToJsonSchema = (json: any): JSONSchema7 => {
  console.log({ json });
  const schema = toJsonSchema(json, {
    arrays: { mode: "first" },
    objects: {},
    required: false,
    strings: { detectFormat: false },
  }) as JSONSchema7;

  return { $schema: "http://json-schema.org/draft-07/schema#", ...schema };
};
/*
works fine:

console.log(
  jsonToJsonSchema({
    $schema: "./s.schema.json",
    items: [
      { name: "wijnand", age: "30" },
      { name: "bruna", age: "unknown" },
    ],
  }),
);
*/
