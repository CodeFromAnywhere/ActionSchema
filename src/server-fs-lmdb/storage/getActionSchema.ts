import fs from "fs/promises";
import path from "path";
import { ActionSchema } from "../../types/action-schema.schema.js";

export const getActionSchema = async (databaseId: string) => {
  const schemaPath = path.join(
    new URL(import.meta.url).pathname,
    "../../schemas",
    databaseId + ".schema.json",
  );

  const schemaString = await fs.readFile(schemaPath, "utf8");
  const schema = JSON.parse(schemaString) as ActionSchema;
  return schema;
};
