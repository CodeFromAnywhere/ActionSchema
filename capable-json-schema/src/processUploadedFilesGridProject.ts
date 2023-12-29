import { getSimpleFsAuthorization } from "fs-authorization";
import { getExtension } from "fs-util-js";
import { StandardContext, StandardFunctionConfig } from "function-types";
import { O, isAllTrue, mergeObjectsArray, notEmpty } from "js-util";
import { normalizeFileToUrl } from "normalize-input";
import { getTypeFromUrlOrPath } from "text-or-binary";
import { actionSchemaCreate } from "actionschema-core";
import { getMdbAuthorization } from "actionschema-core";
import path from "path";
import { projectRoot } from "get-path";
import { fs } from "fs-util";
import { tryParseCsv } from "csv-util";
import { readJsonFile } from "read-json-file";
import { Json } from "model-types";
import { splitTextRecursive } from "split-text";
export const getTableItems = async (firstFileProjectRelativePath: string) => {
  const absolutePath = path.join(projectRoot, firstFileProjectRelativePath);

  const firstFileExtension = getExtension(
    firstFileProjectRelativePath,
  ).toLowerCase();

  if (firstFileExtension === "csv") {
    // csv to array
    const array = await tryParseCsv(absolutePath);
    const items = array.map((item) => {
      const newItem: { [key: string]: any } = mergeObjectsArray(
        Object.keys(item).map((key) => {
          const value = item[key];
          if (value === "") {
            return { [key]: undefined };
          }
          return { [key]: value };
        }),
      );

      return newItem;
    });

    return items as O[];
  } else if (firstFileExtension === "xls" || firstFileExtension === "xlsx") {
    // xslx to array
    return [] as O[];
  } else if (firstFileExtension === "json") {
    // json to array
    const json = await readJsonFile<Json>(absolutePath);
    const items = Array.isArray(json)
      ? json
      : typeof json === "object" &&
        json !== null &&
        json.items &&
        Array.isArray(json.items)
      ? json.items
      : undefined;
    return (items as O[]) || [];
  } else {
    return [];
  }
};

export const processUploadedFilesGridProject = async (
  context: StandardContext & {
    projectRelativePath: string;
    projectRelativeFilePaths: string[];
  },
) => {
  const { projectRelativeFilePaths, projectRelativePath, ...standardContext } =
    context;

  const canRead = isAllTrue(
    (
      await Promise.all(
        projectRelativeFilePaths.map((p) => {
          return getMdbAuthorization({
            ...standardContext,
            projectRelativePath: p,
          });
        }),
      )
    ).map((x) => x.canRead),
  );

  const { canWrite } = await getSimpleFsAuthorization({
    ...standardContext,
    projectRelativePath,
  });

  if (!canWrite || !canRead) {
    return {
      isSuccessful: false,
      message: "You are not authorized to do this",
    };
  }

  // If it's one file of type CSV, XLSX or JSON
  const firstFileExtension = projectRelativeFilePaths[0]
    ? getExtension(projectRelativeFilePaths[0]).toLowerCase()
    : undefined;

  const isGridFile =
    projectRelativeFilePaths.length === 1 &&
    firstFileExtension &&
    ["xls", "xlsx", "csv", "json"].includes(firstFileExtension);

  if (isGridFile) {
    const array = await getTableItems(projectRelativeFilePaths[0]);

    const result = await actionSchemaCreate({
      ...standardContext,
      items: array,
      projectRelativePath,
      totalPriceCredit: 0,
      shouldExecuteGridEntireRow: false,
    });

    return { isSuccessful: true, message: `Inserted ${array.length} rows` };
  } else if (
    projectRelativeFilePaths.length === 1 &&
    getTypeFromUrlOrPath(projectRelativeFilePaths[0]) === "text"
  ) {
    // things like markdown
    const absolutePath = path.join(projectRoot, projectRelativeFilePaths[0]);
    const string = fs.readFileSync(absolutePath, "utf8");
    const lines = splitTextRecursive(string, 250);

    const result = await actionSchemaCreate({
      ...standardContext,
      items: lines.map((x) => ({ item: x })),
      projectRelativePath,
      shouldExecuteGridEntireRow: false,
      totalPriceCredit: 0,
    });

    return { isSuccessful: true, message: `Inserted ${lines.length} lines` };
  } else {
    // list files as URL in JsonArray as new rows under the item column
    const items = projectRelativeFilePaths
      .map((p) => {
        if (getTypeFromUrlOrPath(p) === "text") {
          // for text we want the string of the text, no url.
          const absolutePath = path.join(projectRoot, p);
          const string = fs.readFileSync(absolutePath, "utf8");
          return { item: string };
        }
        // for any other asset we want an url to it as it's not utf8
        return { item: normalizeFileToUrl(p) };
      })
      .filter(notEmpty);

    const result = await actionSchemaCreate({
      ...standardContext,
      items,
      projectRelativePath,
      shouldExecuteGridEntireRow: false,
      totalPriceCredit: 0,
    });

    return { isSuccessful: true, message: `Inserted ${items.length} items` };
  }
};

processUploadedFilesGridProject.config = {
  isPublic: true,
} satisfies StandardFunctionConfig;
