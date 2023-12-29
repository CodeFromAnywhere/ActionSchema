import {
  CapableJsonSchema,
  JsonArray,
  getValidJsonArrayFile,
} from "capable-json-schema-js";
import { getSimpleFsAuthorization } from "fs-authorization";
import { fs, path } from "fs-util";
import {
  StandardContext,
  StandardFunctionConfig,
  StandardResponse,
} from "function-types";
import { projectRoot } from "get-path";
import { readJsonFile } from "read-json-file";
import { getMdbAuthorization } from "actionschema-core";

export const getJsonWithSchemaOld = async (
  context: StandardContext & { projectRelativePath?: string },
): Promise<
  StandardResponse & {
    json?: JsonArray;
    schema?: CapableJsonSchema | null;
    canWrite?: boolean;
  }
> => {
  const { projectRelativePath } = context;

  if (!projectRelativePath || !projectRoot) {
    return { isSuccessful: false, message: "Invalid file" };
  }

  const jsonPath = path.join(projectRoot, projectRelativePath);

  // ensure we are authorized
  const authorization = await getMdbAuthorization(context);

  if (!authorization.canRead || !fs.existsSync(jsonPath)) {
    console.log({ jsonPath, authorization, context });
    return { isSuccessful: false, message: "Can't get file" };
  }

  const json = await readJsonFile<JsonArray>(jsonPath);

  if (!json || !getValidJsonArrayFile(json)) {
    return { isSuccessful: false, message: "Invalid file" };
  }

  const schemaPath = path.join(path.parse(jsonPath).dir, json.$schema);

  if (!schemaPath || !fs.existsSync(schemaPath)) {
    return { isSuccessful: false, message: "Incorrupt file (no schema)" };
  }

  const schema = await readJsonFile<CapableJsonSchema>(schemaPath);

  if (!schema) {
    return { isSuccessful: false, message: "Couldn't load schema" };
  }

  return {
    isSuccessful: true,
    message: "Found json and schema",
    json: json as JsonArray,
    schema,
    canWrite: authorization.canWrite,
  };
};
