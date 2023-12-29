import { get } from "fsorm-lmdb";
import { modelConfigs } from "fsorm-sdk";
import { getObjectKeysArray, sum } from "js-util";
import { getCapableJsonSchemaProperties, } from "capable-json-schema-js";
import { readJsonFile } from "read-json-file";
import { path } from "fs-util";
import { projectRoot } from "get-path";
import { getModelLmdbLocation } from "fsorm-lmdb";
import { makeActionSchemaDb } from "fsorm-lmdb";
export const findAdminTables = async (context) => {
    const { me_personSlug, openFiles } = context;
    const isAdmin = !me_personSlug
        ? false
        : (await get("Group", { slug: "admin" })).result?.[0]?.personSlugs?.includes(me_personSlug);
    if (!isAdmin) {
        console.log("NOT ADMIN", context);
        return;
    }
    const results = getObjectKeysArray(modelConfigs).map((modelName) => {
        const modelConfig = modelConfigs[modelName];
        const { isSingle } = modelConfig;
        const projectRelativeSchemaPath = `memory/${modelConfig.modelName}.schema.json`;
        const projectRelativePath = getModelLmdbLocation(modelName);
        return {
            modelName,
            projectRelativeSchemaPath,
            projectRelativePath,
            isSingle,
        };
    });
    const tables = await Promise.all(results.map(async (result) => {
        const modelConfig = modelConfigs[result.modelName];
        const db = makeActionSchemaDb(result.projectRelativePath);
        const schema = await readJsonFile(path.join(projectRoot, result.projectRelativeSchemaPath));
        const schemaDescription = schema?.description;
        const properties = getCapableJsonSchemaProperties(schema);
        const propertyPluginsAmount = properties
            ? sum(Object.values(properties).map((x) => x.creationPlugins?.length || 0))
            : 0;
        const pluginsAmount = (schema?.properties?.items?.creationPlugins?.length || 0) +
            propertyPluginsAmount;
        const isPinned = !!openFiles?.find((x) => x.file_projectRelativePath === result.projectRelativeSchemaPath &&
            x.isPinned);
        const totalSpending = db.get("totalSpending");
        const columnSpending = db.get("columnSpending");
        const updatedAt = db.get("lastOperationAt");
        const projectSizeBytes = db.get("projectSizeBytes");
        const category = db.get("category");
        const publicTable = {
            projectRelativePath: result.projectRelativePath,
            category,
            schemaDescription,
            createdAt: 0,
            isPinned,
            itemsAmount: db.getItemsAmount(),
            pluginsAmount,
            updatedAt,
            columnSpending,
            projectSizeBytes,
            totalSpending,
        };
        return publicTable;
    }));
    return tables;
};
//# sourceMappingURL=findAdminTables.js.map