import { execute } from "../util/execute.js";
import { fetchExecute } from "../util/fetchExecute.js";
import { cleanFetch } from "../util/cleanFetch.js";
import { createUpstashRedisDatabase, deleteUpstashRedisRange, listUpstashRedisDatabases, upstashRedisGetRange, upstashRedisRequest, upstashRedisSetJson, } from "./upstashRedis.js";
import { upstashKeys } from "../util/state.js";
/**
Serverless wrapper around `execute`.

NB: this is executed on a serverless environment and thus has no access to things like IDB or localStorage.
*/
export const executeServerless = async (context, originUrl) => {
    const { actionSchemaPlugins, databaseId, dotLocation, schema, returnDotLocation, skipPlugin, updateCallbackUrl, value, upstashApiKey, upstashEmail, } = context;
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
        const { result: dbs } = await listUpstashRedisDatabases({
            upstashApiKey,
            upstashEmail,
        });
        const foundDb = dbs?.find((x) => x.database_name === databaseId);
        if (foundDb) {
            redisRestToken = foundDb.rest_token;
            redisRestUrl = foundDb.endpoint;
        }
        else {
            const db = await createUpstashRedisDatabase({
                upstashApiKey,
                upstashEmail,
                name: databaseId,
            });
            if (!db.result || !db.isSuccessful) {
                return {
                    isSuccessful: false,
                    message: "Could not find/create database",
                };
            }
            redisRestToken = db.result.rest_token;
            redisRestUrl = db.result.endpoint;
            // console.log(createResult.result);
            if (!redisRestToken || !redisRestUrl) {
                return {
                    isSuccessful: false,
                    message: "Something went wrong creating the db",
                };
            }
            isDbCreated = true;
            console.log("Wait 30s so DNS can resolve");
            await new Promise((resolve) => setTimeout(() => resolve(), 30000));
        }
    }
    const redisInfo = {
        redisRestToken: redisRestToken,
        redisRestUrl: redisRestUrl,
    };
    console.log("Have db", { isDbCreated, redisInfo });
    const executeResult = await execute({
        actionSchemaPlugins,
        databaseId,
        dotLocation,
        schema,
        returnDotLocation,
        skipPlugin,
        updateCallbackUrl,
        value,
        setData: async (dotLocation, value) => {
            if (value === null) {
                const amountRemoved = await deleteUpstashRedisRange({
                    baseKey: upstashKeys.getDataKey(dotLocation),
                    ...redisInfo,
                });
                return { isSuccessful: true, message: `${amountRemoved} keys removed` };
            }
            const OK = await upstashRedisSetJson({
                key: upstashKeys.getDataKey(dotLocation),
                value,
                ...redisInfo,
            });
            return { isSuccessful: true, message: OK };
        },
        setStatus: async (dotLocation, value) => {
            if (value === null) {
                const key = upstashKeys.getStatusKey(dotLocation);
                await deleteUpstashRedisRange({ ...redisInfo, baseKey: key });
            }
            await upstashRedisSetJson({
                ...redisInfo,
                key: upstashKeys.getStatusKey(dotLocation),
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
        getStatus: async (dotLocation) => {
            return upstashRedisRequest({
                ...redisInfo,
                args: [upstashKeys.getStatusKey(dotLocation)],
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
            return fetchExecute({ ...context, ...upstashStorageDetails }, originUrl, 
            // host not needed as it's the same
            // and no headers on serverless for now
            undefined, undefined);
        },
    });
    // return { isSuccessful: false, message: "Not enabled", result: redisInfo };
    return isDbCreated ? { ...executeResult, ...redisInfo } : executeResult;
};
//# sourceMappingURL=executeServerless.js.map