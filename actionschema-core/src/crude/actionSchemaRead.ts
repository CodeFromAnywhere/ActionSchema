import {
  ActionSchemaDb,
  CapableJsonSchema,
  JsonArray,
} from "capable-json-schema-js";
import { fs, path } from "fs-util";
import {
  StandardContext,
  StandardFunctionConfig,
  StandardResponse,
} from "function-types";
import { projectRoot } from "get-path";
import { readJsonFile } from "read-json-file";
import { makeActionSchemaDb } from "fsorm-lmdb";
import { getMdbAuthorization } from "../getMdbAuthorization.js";
import {
  O,
  getSubsetFromObject,
  hasAllLetters,
  removeOptionalKeysFromObjectStrings,
} from "js-util";
import { ModelItemPartial, ModelKey } from "./types.js";

export type ActionSchemaReadResponse = StandardResponse & {
  /** The data */
  json?: {
    $schema: string;
    items: ModelItemPartial[];
  } & ActionSchemaDb;

  /** The ActionSchema that describes the data in JSON */
  schema?: CapableJsonSchema | null;
  /** Whether or not we can write to the schema */
  canWrite?: boolean;
  /** Whether or not there are more items to be fetched */
  hasMore?: boolean;
};

export const actionSchemaRead = async (
  context: StandardContext & {
    projectRelativePath?: string;

    /**
     * search for a specific value
     */
    search?: string;
    /**
     * Coming soon: provide specific ids here to only select these keys (more efficient)
     */
    rowIds?: string[];

    /** Starting index (slices the rest away) */
    startFromIndex?: number;
    /** If provided, slices the rest away after this amount */
    maxRows?: number;

    /** Filters to be applied on the result before sending it back */
    filter?: {
      operator:
        | "equal"
        | "notEqual"
        | "endsWith"
        | "startsWith"
        | "includes"
        | "includesLetters"
        | "greaterThan"
        | "lessThan"
        | "greaterThanOrEqual"
        | "lessThanOrEqual";
      value: string;
      objectParameterKey: ModelKey;
    }[];

    /** Apply sorting (one by one) after data has been fetched */
    sort?: {
      sortDirection: "ascending" | "descending";
      objectParameterKey: ModelKey;
    }[];

    /** If provided, only selects these keys from the table */
    objectParameterKeys?: ModelKey[];

    /** If provided, responds with all keys except these */
    ignoreObjectParameterKeys?: ModelKey[];
  },
): Promise<ActionSchemaReadResponse> => {
  const {
    projectRelativePath,
    rowIds,
    search,
    startFromIndex,
    maxRows,
    filter,
    sort,
    objectParameterKeys,
    ignoreObjectParameterKeys,
  } = context;

  if (!projectRelativePath || !projectRoot) {
    return { isSuccessful: false, message: "Invalid file" };
  }

  const dbPath = path.join(projectRoot, projectRelativePath);
  const folderPath = path.parse(dbPath).dir;

  const filename = path.parse(dbPath).name;
  const schemaFilename = `./${filename}.schema.json`;
  const absoluteSchemaPath = path.join(folderPath, schemaFilename);
  if (!fs.existsSync(absoluteSchemaPath)) {
    console.log("invalid file", absoluteSchemaPath);
    return { isSuccessful: false, message: "Invalid file" };
  }

  // ensure we are authorized
  const authorization = await getMdbAuthorization(context);

  if (!authorization.canRead || !fs.existsSync(dbPath)) {
    console.log({ dbPath, authorization, context });
    return { isSuccessful: false, message: "Can't get file" };
  }

  const schema = await readJsonFile<CapableJsonSchema>(absoluteSchemaPath);

  const db = makeActionSchemaDb(projectRelativePath);

  const items = db.getAllItems();

  const searchedData =
    search && search.length > 0
      ? items.filter((item) => {
          const searchable = Object.values(item)
            .map((value) => JSON.stringify(value))
            .join(",")
            .toLowerCase();

          return searchable.includes(search.toLowerCase());
        })
      : items;

  // NB: filter the sliced data, if needed
  const filteredData = filter?.length
    ? filter.reduce((filteredData, datasetFilter) => {
        const newFilteredData: O[] = filteredData.filter((item) => {
          const key = datasetFilter.objectParameterKey as keyof typeof item;

          const value = item[key];

          if (datasetFilter.operator === "equal") {
            return String(value) === datasetFilter.value;
          }

          if (datasetFilter.operator === "notEqual") {
            return String(value) === datasetFilter.value;
          }

          const lowercaseValue = String(value).toLowerCase();
          const lowercaseDatasetValue = String(
            datasetFilter.value,
          ).toLowerCase();

          if (datasetFilter.operator === "endsWith") {
            return lowercaseValue.endsWith(lowercaseDatasetValue);
          }
          if (datasetFilter.operator === "startsWith") {
            return lowercaseValue.startsWith(lowercaseDatasetValue);
          }

          if (datasetFilter.operator === "includes") {
            return lowercaseValue.includes(lowercaseDatasetValue);
          }

          if (datasetFilter.operator === "includesLetters") {
            return hasAllLetters(lowercaseValue, lowercaseDatasetValue);
          }

          if (
            datasetFilter.operator === "greaterThan" &&
            datasetFilter.value !== null &&
            datasetFilter.value !== undefined
          ) {
            return Number(value) > Number(datasetFilter.value);
          }

          if (
            datasetFilter.operator === "lessThan" &&
            datasetFilter.value !== null &&
            datasetFilter.value !== undefined
          ) {
            return Number(value) < Number(datasetFilter.value);
          }

          if (
            datasetFilter.operator === "greaterThanOrEqual" &&
            datasetFilter.value !== null &&
            datasetFilter.value !== undefined
          ) {
            return Number(value) >= Number(datasetFilter.value);
          }

          if (
            datasetFilter.operator === "lessThanOrEqual" &&
            datasetFilter.value !== null &&
            datasetFilter.value !== undefined
          ) {
            return Number(value) <= Number(datasetFilter.value);
          }

          return false;
        });

        return newFilteredData;
      }, searchedData)
    : searchedData;

  // NB: sort the filtered data, if needed

  const sortedData = sort
    ? sort.reduce((sortedData, datasetSort) => {
        const newSortedData: O[] = sortedData.sort((a, b) => {
          // @ts-ignore
          const valueA = a[datasetSort.objectParameterKey];
          // @ts-ignore
          const valueB = b[datasetSort.objectParameterKey];

          const directionMultiplier =
            datasetSort.sortDirection === "ascending" ? 1 : -1;

          return Number(valueA) < Number(valueB)
            ? directionMultiplier
            : directionMultiplier * -1;
        });

        return newSortedData;
      }, filteredData)
    : filteredData;

  const subsetData = objectParameterKeys?.length
    ? sortedData.map((item) =>
        getSubsetFromObject(item, objectParameterKeys! as readonly (keyof O)[]),
      )
    : sortedData;

  const ignoredData = ignoreObjectParameterKeys?.length
    ? subsetData.map((item) => {
        return removeOptionalKeysFromObjectStrings(
          item as { [key: string]: any },
          ignoreObjectParameterKeys!,
        );
      })
    : subsetData;

  // NB: slice the data, if needed
  const slicedStartData = ignoredData.slice(startFromIndex);

  const slicedLimitData = maxRows
    ? slicedStartData.slice(0, maxRows)
    : slicedStartData;

  const hasMore = slicedLimitData.length < slicedStartData.length;

  const finalData = slicedLimitData as O[];

  const json: JsonArray = {
    $schema: schemaFilename,
    items: finalData,
    privacy: db.get("privacy"),
    rowGenerationStatus: db.get("rowGenerationStatus"),
    status: db.get("status"),
    totalSpending: db.get("totalSpending"),
    columnSpending: db.get("columnSpending"),
    category: db.get("category"),
  };

  return {
    isSuccessful: true,
    message: "Found json and schema",
    json,
    hasMore,
    schema,
    canWrite: authorization.canWrite,
  };
};

actionSchemaRead.config = { isPublic: true } satisfies StandardFunctionConfig;
