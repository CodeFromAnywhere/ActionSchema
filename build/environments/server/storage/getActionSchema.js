import fs from "fs/promises";
import path from "path";
export const getActionSchema = async (databaseId) => {
    const schemaPath = path.join(new URL(import.meta.url).pathname, "../../schemas", databaseId + ".schema.json");
    const schemaString = await fs.readFile(schemaPath, "utf8");
    const schema = JSON.parse(schemaString);
    return schema;
};
//# sourceMappingURL=getActionSchema.js.map