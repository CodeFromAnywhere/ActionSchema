import { CapableJsonSchema } from "capable-json-schema-js";
import { fs, path } from "fs-util";
import {
  StandardContext,
  StandardFunctionConfig,
  StandardResponse,
} from "function-types";
import { projectRoot } from "get-path";
import { readJsonFile } from "read-json-file";
import { getMdbAuthorization } from "./getMdbAuthorization.js";

export const getSchema = async (
  context: StandardContext & { projectRelativePath?: string },
): Promise<
  StandardResponse & {
    schema?: CapableJsonSchema | null;
    canWrite?: boolean;
  }
> => {
  const { projectRelativePath } = context;

  if (!projectRelativePath || !projectRoot) {
    return { isSuccessful: false, message: "Invalid file" };
  }

  const dbPath = path.join(projectRoot, projectRelativePath);
  const folderPath = path.parse(dbPath).dir;
  const schemaFilename = `./${path.parse(dbPath).name}.schema.json`;

  const absoluteSchemaPath = path.join(folderPath, schemaFilename);

  if (!fs.existsSync(absoluteSchemaPath)) {
    return { isSuccessful: false, message: "Invalid file" };
  }

  // ensure we are authorized
  const authorization = await getMdbAuthorization(context);

  if (!authorization.canRead) {
    console.log({ dbPath, authorization, context });
    return { isSuccessful: false, message: "Can't get file" };
  }

  const schema = await readJsonFile<CapableJsonSchema>(absoluteSchemaPath);

  return {
    isSuccessful: true,
    message: "Found schema",
    schema,
    canWrite: authorization.canWrite,
  };
};

getSchema.config = { isPublic: true } satisfies StandardFunctionConfig;
