import { getCapableJsonSchemaPluginFunctions } from "./getCapableJsonSchemaPluginFunctions.js";

console.time();

getCapableJsonSchemaPluginFunctions({
  host: "actionschema.com",
  me_personSlug: "guest4",
  relation_personSlug: "root",
}).then((res) => {
  console.timeEnd();
  console.log({ res: res?.map((x) => x.name) });
});
