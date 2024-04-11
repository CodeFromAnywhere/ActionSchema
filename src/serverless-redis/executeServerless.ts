import { execute } from "../util/execute.js";
import { fetchExecute } from "../util/fetchExecute.js";
import { cleanFetch } from "../util/cleanFetch.js";
import {
  ExecuteContext,
  ExecuteResult,
  UpstashStorageDetails,
} from "../types/types.js";
import {
  createUpstashRedisDatabase,
  upstashRedisGetRange,
  upstashRedisRequest,
  upstashRedisSetRequest,
} from "./upstashRedis.js";

/**
Serverless wrapper around `execute`
*/
export const executeServerless = async (
  context: ExecuteContext & UpstashStorageDetails,
  originUrl: string,
): Promise<
  ExecuteResult & {
    /** Returned if the db was just created */
    redisRestToken?: string;
    redisRestUrl?: string;
  }
> => {
  const {
    actionSchemaPlugins,
    databaseId,
    dotLocation,
    schema,
    returnDotLocation,
    skipPlugin,
    updateCallbackUrl,
    value,
    upstashApiKey,
    upstashEmail,
  } = context;

  let { redisRestToken, redisRestUrl } = context;

  let isDbCreated = false;
  if (!redisRestToken || !redisRestUrl) {
    // initiate a db with upstash!
    if (!upstashApiKey || !upstashEmail) {
      console.log({ upstashApiKey, upstashEmail });
      return {
        isSuccessful: false,
        message: "No upstash credentials and no database given",
      };
    }

    const createResult = await createUpstashRedisDatabase({
      upstashApiKey,
      upstashEmail,
    });

    if (!createResult.result || !createResult.isSuccessful) {
      return { isSuccessful: false, message: "Could not create database" };
    }

    redisRestToken = createResult.result.rest_token;
    redisRestUrl = createResult.result.endpoint;

    // console.log(createResult.result);

    if (!redisRestToken || !redisRestUrl) {
      return {
        isSuccessful: false,
        message: "Something went wrong creating the db",
      };
    }
    isDbCreated = true;

    console.log("Wait 30s so DNS can resolve");
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 30000));
  }

  const redisInfo = {
    redisRestToken: redisRestToken!,
    redisRestUrl: redisRestUrl!,
  };

  console.log("CREATED", redisInfo);

  // console.log(`Testing connection`);

  // const res = await fetch(`https://${redisRestUrl}/echo/hihihi`, {
  //   cache: "no-cache",
  //   verbose: true,
  //   headers: { Authorization: `Bearer ${redisRestToken}` },
  // })
  //   .then((res) => res.json())
  //   .catch((e) => {
  //     console.log("ERROR", e);
  //   });

  // console.log({ res });

  const executeResult = await execute({
    actionSchemaPlugins,
    databaseId,
    dotLocation,
    schema,
    returnDotLocation,
    skipPlugin,
    updateCallbackUrl,
    value,

    setData: async (baseKey, value) => {
      if (value === null) {
        // todo: should delete all keys in range of baseKey
        return upstashRedisRequest({
          ...redisInfo,
          args: [baseKey],
          command: "del",
        });
      }
      return upstashRedisSetRequest({
        ...redisInfo,
        key: baseKey,
        value,
      });
    },

    setStatus: async (key, value) => {
      if (value === null) {
        return upstashRedisRequest({
          ...redisInfo,
          args: [`__status__:${key}`],
          command: "del",
        });
      }
      return upstashRedisSetRequest({
        ...redisInfo,
        key: `__status__:${key}`,
        value,
      });
    },

    fetchPlugin: cleanFetch,

    getData: async (key) => {
      return upstashRedisGetRange({
        ...redisInfo,
        baseKey: key,
      });
    },

    getStatus: async (key) => {
      return upstashRedisRequest({
        ...redisInfo,
        args: [`__status__:${key}`],
        command: "get",
      });
    },

    recurseFunction: (context) => {
      // NB: add the redis info for this particular recursive operation
      const upstashStorageDetails = {
        redisRestToken,
        redisRestUrl,
        upstashApiKey,
        upstashEmail,
      };
      return fetchExecute(
        { ...context, ...upstashStorageDetails },
        originUrl,
        // host not needed as it's the same
        // and no headers on serverless for now
        undefined,
        undefined,
      );
    },
  });

  // return { isSuccessful: false, message: "Not enabled", result: redisInfo };
  return isDbCreated ? { ...executeResult, ...redisInfo } : executeResult;
};
