import path from "path";
import fs from "fs";
import { StandardContext, StandardFunctionConfig } from "function-types";
import { projectRoot } from "get-path";
import { makeRelative } from "fs-util-js";
import { getObjectKeysArray, notEmpty, sum } from "js-util";
import {
  CapableJsonSchema,
  PublicTable,
  getCapableJsonSchemaProperties,
} from "capable-json-schema-js";
import { get } from "fsorm-lmdb";
import { makeActionSchemaDb } from "fsorm-lmdb";
import { readJsonFile } from "read-json-file";
import { modelConfigs } from "fsorm-sdk";
import { findAdminTables } from "./findAdminTables.js";

export const findMyTables = async (context: StandardContext) => {
  const { me_personSlug } = context;

  if (!me_personSlug) {
    return { isSuccessful: false, message: "Please login" };
  }

  if (!projectRoot) {
    return { isSuccessful: false, message: "No root" };
  }

  const { result: openFiles } = await get("OpenFile", {
    personSlug: me_personSlug,
  });

  const adminTables = await findAdminTables({ ...context, openFiles });

  const projectRelativeLocation = ["memory/persons", me_personSlug, "files"];
  const absoluteFilesPath = path.join(projectRoot, ...projectRelativeLocation);

  if (!fs.existsSync(absoluteFilesPath)) {
    return { isSuccessful: false, message: "Couldn't find" };
  }

  const absolutedbFilePaths = (
    await fs.promises.readdir(absoluteFilesPath, {
      encoding: "utf8",
    })
  )
    .map((filename) =>
      path.join(absoluteFilesPath, filename, `${filename}.mdb`),
    )
    .filter(fs.existsSync);

  const tables = (
    await Promise.all(
      absolutedbFilePaths.map(async (absolutePath) => {
        if (!projectRoot) {
          return;
        }

        const folderPath = path.parse(absolutePath).dir;
        const projectFolderName = path.parse(folderPath).base;

        const projectRelativePath = makeRelative(absolutePath, projectRoot);
        const stat = await fs.promises.stat(absolutePath);
        // seems not to be always accurate. let's put it in the array json
        const createdAt = stat.birthtimeMs;

        const db = makeActionSchemaDb(projectRelativePath);

        const totalSpending = db.get("totalSpending");
        const columnSpending = db.get("columnSpending");

        const updatedAt = db.get("lastOperationAt");
        const projectSizeBytes = db.get("projectSizeBytes");
        const category = db.get("category");
        const schemaFilename = `./${path.parse(absolutePath).name}.schema.json`;
        const absoluteSchemaPath = path.join(folderPath, schemaFilename);
        const schema =
          await readJsonFile<CapableJsonSchema>(absoluteSchemaPath);

        const itemsAmount = db.getItemsAmount();

        const schemaDescription = schema?.description;
        const properties = getCapableJsonSchemaProperties(schema);

        const propertyPluginsAmount = properties
          ? sum(
              Object.values(properties).map(
                (x) => x.creationPlugins?.length || 0,
                // (x.destinationPlugins?.length || 0) +
                // (x.validationPlugins?.length || 0),
              ),
            )
          : 0;

        const pluginsAmount =
          (schema?.properties?.items?.creationPlugins?.length || 0) +
          propertyPluginsAmount;

        const isPinned = !!openFiles?.find(
          (x) =>
            x.file_projectRelativePath === projectRelativePath && x.isPinned,
        );

        const item: PublicTable = {
          isPinned,
          createdAt,
          category,
          updatedAt,
          projectRelativePath,
          schemaDescription,
          pluginsAmount,
          itemsAmount,
          projectSizeBytes,
          totalSpending,
          columnSpending,
        };
        return item;
      }),
    )
  ).filter(notEmpty);

  return {
    isSuccessful: true,
    message: "Found them",
    tables: tables.concat(adminTables || []),
  };
};

findMyTables.config = { isPublic: true } satisfies StandardFunctionConfig;
