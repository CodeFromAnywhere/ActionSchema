import toJsonSchema from "to-json-schema";
/**calculates an estimated JSON schema based on the current values of the JSON */
export const jsonToJsonSchema = (json) => {
    console.log({ json });
    const schema = toJsonSchema(json, {
        arrays: { mode: "first" },
        objects: {},
        required: false,
        strings: { detectFormat: false },
    });
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
//# sourceMappingURL=jsonToJsonSchema.js.map