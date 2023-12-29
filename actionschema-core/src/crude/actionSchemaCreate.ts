import {
  StandardContext,
  StandardFunctionConfig,
  StandardResponse,
} from "function-types";
import { projectRoot } from "get-path";
import { O } from "js-util";
import { makeActionSchemaDb } from "fsorm-lmdb";

import { addSchemaColumns } from "../addSchemaColumns.js";
import { executeGridEntireRow } from "../executeGridEntireRow.js";
import { ModelItemPartial } from "./types.js";

export type ActionSchemaCreateResponse = StandardResponse & {
  /** The rowIds created */
  result?: string[];
};

export const actionSchemaCreate = async (
  context: StandardContext & {
    /** NB: if items in this array contain `__actionSchemaId` it will be overwriting that id  */
    items: ModelItemPartial[];
    projectRelativePath: string;
    shouldExecuteGridEntireRow?: boolean;
    totalPriceCredit?: number;
  },
): Promise<ActionSchemaCreateResponse> => {
  const {
    items,
    projectRelativePath,
    shouldExecuteGridEntireRow,
    totalPriceCredit,
    ...standardContext
  } = context;

  if (!projectRoot || !items || !standardContext.me_personSlug) {
    return {
      isSuccessful: false,
      message: "No items / projectroot / login",
    };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return {
      isSuccessful: false,
      message: "Result must be an array to be a source",
    };
  }

  //NB: if the first item of the array is an object (not an array), its good, otherwise, we need to make them objects to put in the table...

  const firstItem = items[0];

  await addSchemaColumns(firstItem, projectRelativePath);

  // Save to the file!

  const db = makeActionSchemaDb(projectRelativePath);
  const firstKey = Object.keys(firstItem)[0];

  if (totalPriceCredit) {
    await db.addSpending(firstKey, items.length, totalPriceCredit);
  }

  const rowIds = await db.insertItems(items);

  // console.log({ realArray, rowIds });

  await db.put("rowGenerationStatus", undefined);

  if (shouldExecuteGridEntireRow) {
    // also execute the entire row (only empty columns)
    await executeGridEntireRow({
      ...standardContext,
      projectRelativePath,
      rowIds,
      mode: "only-empty",
    });
  }

  return {
    isSuccessful: true,
    message: "Done",
    result: rowIds,
  };
};

actionSchemaCreate.config = { isPublic: true } satisfies StandardFunctionConfig;
