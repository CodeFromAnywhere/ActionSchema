import { execute } from "../util/execute.js";
import { fetchExecute } from "../util/fetchExecute.js";
import { cleanFetch } from "../util/cleanFetch.js";
import { ExecuteContext, ExecuteResult } from "../types/types.js";
import {
  createUpstashRedisDatabase,
  upstashRedisRequest,
} from "./upstashRedis.js";

/**
Serverless wrapper around `execute`


TODO:

- Add layer of authentication with the storage engine here as the sole authentication
- Use it in the `execute` api

*/
export const executeServerless = async (
  context: ExecuteContext,
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
  } = context;

  let { redisRestToken, redisRestUrl } = context;

  let isDbCreated = false;
  if (!redisRestToken || !redisRestUrl) {
    // initiate a db with upstash!
    const upstashApiKey = process.env.UPSTASH_API_KEY;
    const upstashEmail = process.env.UPSTASH_EMAIL;
    if (!upstashApiKey || !upstashEmail) {
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

    if (!redisRestToken || !redisRestUrl) {
      return {
        isSuccessful: false,
        message: "Something went wrong creating the db",
      };
    }
    isDbCreated = true;
  }

  const redisInfo = {
    redisRestToken: redisRestToken!,
    redisRestUrl: redisRestUrl!,
  };

  const executeResult = await execute({
    actionSchemaPlugins,
    databaseId,
    dotLocation,
    schema,
    returnDotLocation,
    skipPlugin,
    updateCallbackUrl,
    value,

    setData: async (key, value) => {
      if (value === null) {
        return upstashRedisRequest({
          ...redisInfo,
          args: [key],
          command: "del",
        });
      }
      return upstashRedisRequest({
        ...redisInfo,
        args: [key, value],
        command: "set",
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
      return upstashRedisRequest({
        ...redisInfo,
        args: [`__status__:${key}`, value],
        command: "set",
      });
    },

    fetchPlugin: cleanFetch,

    getData: async (key) => {
      return upstashRedisRequest({
        ...redisInfo,
        args: [key],
        command: "get",
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
      const host = `http://localhost:3000`;
      return fetchExecute({
        ...context,
        executeApiPath: `${host}/api/execute`,
        executeApiHeaders: {},
      });
    },
  });

  return isDbCreated ? { ...executeResult, ...redisInfo } : executeResult;
};
