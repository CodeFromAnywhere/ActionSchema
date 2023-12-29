import { StandardContext, StandardFunctionConfig } from "function-types";
import { getAvailableFolderPath } from "get-available-folder-path";
import path from "path";
import { projectRoot } from "get-path";
import { fs, writeJsonToFile } from "fs-util";
import { makeRelative } from "fs-util-js";
import { jsonToJsonSchema } from "./jsonToJsonSchema.js";
import { CapableJsonSchema, JsonArray } from "capable-json-schema-js";
import { makeActionSchemaDb, closeDb } from "fsorm-lmdb";
import { getActionSchemaDbPath } from "actionschema-core";
import { getAbsoluteSchemaPath } from "actionschema-core";
/**

- It will create it in your own space in a new folder in `projects/[filename]` 
- uses file names `[filename].json` and `[filename].schema.json`
- Returns the project relative path of the new JSON so you can open it

*/
export const copyTableIntoSpace = async (
  context: StandardContext & {
    schema?: CapableJsonSchema | null;
    json?: JsonArray;
    name?: string;
  },
) => {
  if (!context.me_personSlug || !projectRoot) {
    return { isSuccessful: false, message: "Please login" };
  }

  const { json, schema } = context;

  if (
    !json?.items ||
    typeof json !== "object" ||
    (schema && typeof schema !== "object")
  ) {
    return { isSuccessful: false, message: "Invalid input" };
  }

  // use name or "untitled"
  const realName = context.name || "untitled";

  // get the first folder available
  const firstAvailableFolderPath = getAvailableFolderPath(
    // this is the authorized location
    path.join(projectRoot, "memory/persons", context.me_personSlug, "files"),
    realName,
  );

  const absoluteDbPath = getActionSchemaDbPath(firstAvailableFolderPath);
  const projectRelativeDbPath = makeRelative(absoluteDbPath, projectRoot);

  // need to close if it was already there!
  await closeDb(projectRelativeDbPath);

  // make the folder
  await fs.mkdir(firstAvailableFolderPath, { recursive: true });

  // put all items into db
  const db = makeActionSchemaDb(projectRelativeDbPath);
  await db.insertItems(json.items);
  await db.put("status", json.status);
  await db.put("privacy", json.privacy);
  await db.put("rowGenerationStatus", json.rowGenerationStatus);

  const absoluteSchemaPath = getAbsoluteSchemaPath(projectRelativeDbPath);

  // If schema isn't given, estimate schema based on JSON
  const realSchema = schema || jsonToJsonSchema(json);
  await writeJsonToFile(absoluteSchemaPath, realSchema);

  return {
    isSuccessful: true,
    message: "Copied",
    projectRelativePath: projectRelativeDbPath,
  };
};

copyTableIntoSpace.config = {
  isPublic: true,
} satisfies StandardFunctionConfig;
