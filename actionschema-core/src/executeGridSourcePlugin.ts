import { CapableJsonSchemaPlugin } from "capable-json-schema-js";
import { deepEqual } from "fast-equals";
import { StandardContext, StandardFunctionConfig } from "function-types";
import { getFunctionItemWithName } from "function-wrappers";
import { projectRoot } from "get-path";
import { deductCredit } from "person-util";

import { get, makeActionSchemaDb } from "fsorm-lmdb";
import { setSchemaSourcePlugins } from "./setSchemaSourcePlugins.js";
import { getSchema } from "./getSchema.js";
import { oneByOne } from "one-by-one";
import { getOpenapiDetails } from "plugin-util";
import { actionSchemaCreate } from "./crude/actionSchemaCreate.js";

/**
 *
 */
export const executeGridSourcePlugin = async (
  context: StandardContext & {
    projectRelativePath: string;
    plugin: CapableJsonSchemaPlugin;
    shouldExecuteGridEntireRow?: boolean;
    partitionAmount?: number;
  },
) => {
  const {
    projectRelativePath,
    plugin,
    shouldExecuteGridEntireRow,
    partitionAmount,
    ...standardContext
  } = context;

  const realPartitionAmount =
    !partitionAmount || isNaN(partitionAmount) || partitionAmount < 1
      ? 1
      : partitionAmount;

  if (!standardContext.me_personSlug) {
    return { isSuccessful: false, message: "Please login first." };
  }

  const me = (await get("Person", { slug: standardContext.me_personSlug }))
    .result?.[0];

  if (!me) {
    return {
      isSuccessful: false,
      message: "Please login first.",
    };
  }
  // get json and schema
  const { schema, ...jsonResult } = await getSchema({
    ...standardContext,
    projectRelativePath,
  });

  if (!jsonResult.isSuccessful || !schema || !projectRoot) {
    return jsonResult;
  }

  if (!plugin) {
    return {
      isSuccessful: false,
      message: "Couldn't find a plugin/schema for that property.",
    };
  }

  const {
    $openapi,
    partitionContext,
    partitionContextsDone,
    priceCredit,
    propertyDependencies,
  } = plugin;

  const details = await getOpenapiDetails($openapi, me.actionSchemaHeaders);

  if (!details?.apiUrl || !details?.method) {
    return { isSuccessful: false, message: "No api found" };
  }

  if (!$openapi?.url || !$openapi?.operationId) {
    return {
      isSuccessful: false,
      message: "No operationId found.",
    };
  }

  const functionItem = await getFunctionItemWithName($openapi.operationId);
  if (!functionItem || !functionItem.fn) {
    return {
      isSuccessful: false,
      message: "Function not found.",
    };
  }

  const partitionableFunctionName =
    functionItem.config?.partitionableFunctionName;

  const partitionableFunctionItem = partitionableFunctionName
    ? await getFunctionItemWithName(partitionableFunctionName)
    : undefined;
  if (!partitionableFunctionItem || !partitionableFunctionItem.fn) {
    return {
      isSuccessful: false,
      message: "Partitionable Function not found.",
    };
  }

  // Ensure row generations execute the partition function

  const completeContext: { [key: string]: any } = partitionContext
    ? { ...partitionContext, ...standardContext }
    : standardContext;

  const partitionContexts = await functionItem.fn(completeContext);

  if (
    !partitionContexts ||
    !Array.isArray(partitionContexts) ||
    partitionContexts.length === 0
  ) {
    return {
      isSuccessful: false,
      message: "No contexts found for this partition function configuration.",
    };
  }

  //take the first available one that is not found in `partitionContextsDone[]`
  const availablePartitionContexts = partitionContexts.filter((item) => {
    const isAlreadyDone = !!(partitionContextsDone || []).find((x) =>
      deepEqual(item, x),
    );
    return !isAlreadyDone;
  });

  if (availablePartitionContexts.length === 0) {
    return {
      isSuccessful: false,
      message:
        "We have already done all possible values.. Please choose something different.",
    };
  }

  const partitionContextsNow = availablePartitionContexts.slice(
    0,
    realPartitionAmount,
  );

  console.log({ realPartitionAmount, length: partitionContextsNow.length });

  const completePartitionContexts: { [key: string]: any }[] =
    partitionContextsNow.map((item) => ({
      ...item,
      ...standardContext,
    }));

  const db = makeActionSchemaDb(projectRelativePath);
  await db.put("rowGenerationStatus", "busy");

  //and also set the context onto there when starting.
  oneByOne(
    completePartitionContexts,
    async (completePartitionContext, index) => {
      const result = await partitionableFunctionItem.fn(
        completePartitionContext,
      );

      console.log(`partition ${index}`, completePartitionContext);

      const priceCredit = !isNaN(result?.priceCredit) ? result.priceCredit : 0;

      await deductCredit(standardContext.me_personSlug, priceCredit);

      if (!schema.properties?.items.creationPlugins) {
        console.log("WEIRD NO PLUGS");
        return;
      }

      // NB: update the context we have done
      const plugins = schema.properties.items.creationPlugins.map((x) => {
        if (x.$openapi?.operationId === plugin.$openapi?.operationId) {
          return {
            ...x,
            partitionContextsDone: (x.partitionContextsDone || []).concat(
              partitionContextsNow[index],
            ),
          };
        }

        return x;
      });

      await setSchemaSourcePlugins({
        ...standardContext,
        projectRelativePath,
        plugins,
      });

      // Then handle some more stuff
      return actionSchemaCreate({
        ...standardContext,
        items: result?.result,
        projectRelativePath,
        shouldExecuteGridEntireRow,
        totalPriceCredit: priceCredit,
      });
    },
  ).then((result) => {
    // do nothing after... everything already done right?
  });

  return {
    isSuccessful: true,
    message: "Started",
    priceCredit: 0,
  };
};

executeGridSourcePlugin.config = {
  isPublic: true,
  priceCredit: 0.01,
} satisfies StandardFunctionConfig;
