import {
  CapableJsonSchema,
  CapableJsonSchemaPlugin,
} from "capable-json-schema-js";
import { StandardContext, StandardFunctionConfig } from "function-types";
import { projectRoot } from "get-path";
import { writeJsonToFile } from "fs-util";
import { lockAction } from "lock-util";
import { getAbsoluteSchemaPath } from "./getAbsoluteSchemaPath.js";
import { getSchema } from "./getSchema.js";

/**
create, update, or delete a source plugin from a schema (a plugin for the array)
*/
export const setSchemaSourcePlugins = async (
  context: StandardContext & {
    projectRelativePath: string;
    plugins: CapableJsonSchemaPlugin[];
  },
) => {
  const { projectRelativePath, plugins, ...standardContext } = context;

  const { schema, ...result } = await getSchema({
    ...standardContext,
    projectRelativePath,
  });

  if (!result.isSuccessful || !schema || !projectRoot) {
    console.log({ ...standardContext, projectRelativePath }, schema, result);
    return result;
  }

  const newSchema: CapableJsonSchema = {
    ...schema,
    properties: {
      ...schema.properties,
      items: { ...schema.properties?.items, creationPlugins: plugins },
    },
  };

  // const newSchema = setNestedObject(
  //   schema,
  //   {
  //     properties: { items: { creationPlugins: null } },
  //   },
  //   plugins,
  // );

  // console.dir({ mainSchema, newSchema }, { depth: 99 });

  const schemaPath = getAbsoluteSchemaPath(projectRelativePath);

  await lockAction(schemaPath, () => {
    return writeJsonToFile(schemaPath, newSchema);
  });

  return { isSuccessful: true, message: "Saved" };
  // set plugins
};

setSchemaSourcePlugins.config = {
  isPublic: true,
} satisfies StandardFunctionConfig;
