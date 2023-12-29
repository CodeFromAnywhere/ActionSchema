import { fs, getFolderSize, getFolderSizeObject } from "fs-util";
import { get } from "fsorm-lmdb";
import { projectRoot } from "get-path";
import path from "path";
import { makeActionSchemaDb } from "fsorm-lmdb";
import { makeRelative } from "fs-util-js";
import { notEmpty } from "js-util";
import { StandardFunctionConfig } from "function-types";

export const calculateProjectSizes = async () => {
  const filePaths = (await get("Person")).result
    ?.map((person) =>
      path.join(projectRoot, "memory", "persons", person.slug, "files"),
    )
    .filter(fs.existsSync);

  if (!filePaths) {
    return;
  }

  const existingProjectPaths = filePaths
    .map((absolutePath) => {
      const projects = fs
        .readdirSync(absolutePath)
        .map((name) => path.join(absolutePath, name, `${name}.mdb`))
        .filter(fs.existsSync);

      return projects;
    })
    .flat();

  const calculatedProjectSizes = await Promise.all(
    (
      await Promise.all(
        existingProjectPaths.map(async (absolutePath) => {
          const db = makeActionSchemaDb(
            makeRelative(absolutePath, projectRoot),
          );

          const lastCalculationAt = db.get("lastSizeCalculatedAt");
          const lastOperationAt = db.get("lastOperationAt");

          const isUpdateNeeded =
            !!lastOperationAt &&
            (!lastCalculationAt || lastCalculationAt < lastOperationAt);

          //   console.log({
          //     absolutePath,
          //     lastOperationAt,
          //     lastCalculationAt,
          //     isUpdateNeeded,
          //   });

          if (!isUpdateNeeded) {
            // no recalculation needed
            return;
          }

          return db;
        }),
      )
    )
      .filter(notEmpty)
      .map(async (db) => {
        // calculate size
        const absoluteFolderPath = path.join(
          projectRoot,
          path.parse(db.projectRelativePath).dir,
        );

        const projectSizeBytes = await getFolderSize(absoluteFolderPath);
        console.log(`${db.projectRelativePath} size: ${projectSizeBytes}`);
        await db.put("projectSizeBytes", projectSizeBytes);
        await db.put("lastSizeCalculatedAt", Date.now());

        return { absoluteFolderPath, projectSizeBytes };
      }),
  );

  return calculateProjectSizes;
};

calculateProjectSizes.config = {
  runEveryPeriod: "midnight",
  runHook: ["startup"],
} satisfies StandardFunctionConfig;
