import {
  ActionSchemaStatus,
  getCapableJsonSchemaProperties,
} from "capable-json-schema-js";
import { StandardContext, StandardFunctionConfig } from "function-types";
import { getFunctionItemWithName } from "function-wrappers";
import { projectRoot } from "get-path";
import { O, mapMany, mergeObjectsArray, notEmpty, sum } from "js-util";
import { deductCredit } from "person-util";
import { getKeyFromObject } from "./plugins/getKeyFromObject.js";
import { getSchema } from "./getSchema.js";
import { isExecuteRequired } from "capable-json-schema-js";
import { get, makeActionSchemaDb } from "fsorm-lmdb";
import { getCompleteContext } from "./getCompleteContext.js";
import { getOpenapiDetails } from "plugin-util";
import { actionSchemaUpdate } from "./crude/actionSchemaUpdate.js";

/**  */
export const executeGridPlugin = async (
  context: StandardContext & {
    projectRelativePath: string;
    rowIds: string[];
    mode: "recalculate" | "only-empty";
    /** a single property calculation is done for the specified key */
    propertyKey?: string;
    /**
     * NB: sometimes needed in case we rely on this result
     */
    waitForResult?: boolean;
  },
) => {
  const {
    projectRelativePath,
    rowIds,
    mode,
    propertyKey,
    waitForResult,
    ...standardContext
  } = context;
  if (
    !propertyKey ||
    !rowIds ||
    !mode ||
    !projectRelativePath ||
    !standardContext.me_personSlug
  ) {
    return {
      isSuccessful: false,
      message: "Invalid input",
    };
  }

  const me = (await get("Person", { slug: standardContext.me_personSlug }))
    .result?.[0];
  if (!me) {
    return {
      isSuccessful: false,
      message: "Please login",
    };
  }

  // get json and schema
  const { schema, ...result } = await getSchema({
    ...standardContext,
    projectRelativePath,
  });

  if (!result.isSuccessful || !schema || !projectRoot) {
    return result;
  }

  const properties = getCapableJsonSchemaProperties(schema);
  const propertySchema = properties?.[propertyKey];
  const firstPlugin = propertySchema?.creationPlugins?.[0];

  if (!propertySchema || !firstPlugin) {
    console.log({ propertySchema, firstPlugin });
    return {
      isSuccessful: false,
      message: "Couldn't find a plugin/schema for that property.",
    };
  }

  if (!rowIds || rowIds.length === 0) {
    return {
      isSuccessful: false,
      message: "No rows requested.",
    };
  }

  const {
    $openapi,
    context: pluginContext,
    priceCredit,
    outputLocation,
    propertyDependencies,
    isVerticalExpandEnabled,
    condition,
  } = firstPlugin;

  // const functionItem = await getFunctionItemWithName($openapi.operationId);

  // if (!functionItem || !functionItem.fn) {
  //   return {
  //     isSuccessful: false,
  //     message: "Function not found.",
  //   };
  // }
  // const getEstimatedPriceCredit = (functionItem.fn as any)
  //   ?.getEstimatedPriceCredit as undefined | ((context: O) => number);

  const db = makeActionSchemaDb(projectRelativePath);

  const rows = await db.getMany(rowIds);
  const requiredRows = rows.filter((row) => {
    // potential leak #1
    //  const row = db.getItem(id);

    return isExecuteRequired(
      row,
      propertyKey,
      mode,
      propertyDependencies,
      isVerticalExpandEnabled,
      condition,
    );
  });

  const requiredRowIds = requiredRows
    .map((x) => x.__actionSchemaId as string | undefined)
    .filter(notEmpty);

  if (requiredRowIds.length === 0) {
    return { isSuccessful: false, message: "No rows require updating" };
  }

  const details = await getOpenapiDetails($openapi, me.actionSchemaHeaders);

  if (!details?.apiUrl || !details?.method) {
    return { isSuccessful: false, message: "No api found" };
  }

  // const estimatedCost = sum(
  //   requiredRows.map((row) => {
  //     // leak potential #2
  //     // const row = db.getItem(id);
  //     if (!row) {
  //       return 0;
  //     }
  //     const completeContext = getCompleteContext({
  //       row,
  //       pluginContext,
  //       propertyKey,
  //       standardContext,
  //       projectRelativePath,
  //     });

  //     const estimatedPriceCredit = getEstimatedPriceCredit
  //       ? getEstimatedPriceCredit(completeContext)
  //       : functionItem.config?.priceCredit || 0;

  //     return estimatedPriceCredit;
  //   }),
  // );

  // const meCredit =
  //   (await get("Person", { slug: standardContext.me_personSlug })).result?.[0]
  //     ?.credit || 0;

  // if (meCredit < estimatedCost) {
  //   return {
  //     isSuccessful: false,
  //     message: `Please get at least €${estimatedCost.toFixed(
  //       2,
  //     )} credit into your account first.`,
  //   };
  // }

  // NB: update the status to busy for each required row/column

  await db.addDelta(
    requiredRowIds.map((rowId) => ({
      newStatus: "busy",
      rowId,
      propertyKey,
    })),
  );

  await db.put(
    "status",
    mergeObjectsArray(
      requiredRowIds.map((id) => ({
        [id]: { [propertyKey]: "busy" as ActionSchemaStatus },
      })),
    ),
  );

  const resultPromise = mapMany(
    requiredRowIds,
    async (id) => {
      const row = db.getItem(id);

      if (!row) {
        return;
      }

      const completeContext = getCompleteContext({
        row,
        pluginContext,
        propertyKey,
        projectRelativePath,
      });

      // console.log({ completeContext });

      // TODO: ensure this function is executed in a separate process.
      let result = undefined;

      const body = JSON.stringify(completeContext);

      //  console.log(`FETCH`, { details, body });

      try {
        result = await fetch(details.apiUrl, {
          method: details.method,
          body,
          headers: {
            ...details.headers,
            // Forced headers
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          // NB: for now, expect it to be inside of result, always
          .then(async (result) => (await result.json()).result)
          .catch((e) => {
            console.log(`fetch catched`, e);
            return { isSuccessful: false, message: "Fetch Failed" };
          });
      } catch (e) {
        console.log(e);
      }

      const locatedResult =
        outputLocation && outputLocation !== ""
          ? getKeyFromObject(result, outputLocation || "result")
          : result;
      console.log({ result, locatedResult });

      const doVerticalExpand =
        isVerticalExpandEnabled && Array.isArray(locatedResult);

      const realLocatedResult = doVerticalExpand
        ? locatedResult[0]
        : locatedResult;

      // set the value of the cell to the result

      const writeResult = await actionSchemaUpdate({
        ...standardContext,
        id,
        projectRelativePath,
        partialItem: { [propertyKey]: realLocatedResult },
      });

      const newRows = doVerticalExpand
        ? locatedResult.slice(1).map((item) => {
            const { __actionSchemaId, ...rowWithoutId } = row;
            return {
              ...rowWithoutId,
              [propertyKey]: item,
            };
          })
        : undefined;

      if (newRows) {
        const newIds = await db.insertItems(newRows);
      }

      // console.log({ outputLocation, locatedResult });
      // if (locatedResult === undefined) {
      //   return {
      //     isSuccessful: false,
      //     message: "Executed but no result",
      //     index,
      //     completeContext,
      //     functionResult: result,
      //     result: undefined,
      //     priceCredit: result.priceCredit,
      //   };
      // }

      return {
        isSuccessful: writeResult.isSuccessful,
        message: writeResult.message,
        id,
        result: result.result,
        completeContext,
        functionResult: result,
        priceCredit: result.priceCredit,
      };
    },
    // NB: A maximum concurrency of 100 here is a simple memory usage reducer for now. It ensures we only go into this loop for maximum 100 rows at once for any column.
    100,
  );

  // NB: we don't wait for this
  const promise = resultPromise.then(async (results) => {
    // total price for the column for all rows

    const priceCreditRows = results.filter(notEmpty);

    const totalPriceCredit = sum(
      priceCreditRows.map((x) => x.priceCredit).filter(notEmpty),
    );
    // NB: ensure to deduct credit and also add it to the db for this table
    await Promise.all([
      db.addSpending(propertyKey, priceCreditRows.length, totalPriceCredit),
      deductCredit(standardContext.me_personSlug, totalPriceCredit),
    ]);
  });

  if (waitForResult) {
    await promise;
  }

  return {
    isSuccessful: true,
    // results,
    message: waitForResult ? "Done" : "Started",
    priceCredit: 0,
  };
};

executeGridPlugin.config = {
  isPublic: true,
  priceCredit: 0,
} satisfies StandardFunctionConfig;
