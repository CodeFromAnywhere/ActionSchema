import { mergeObjectsArray, notEmpty } from "from-anywhere";
import { tryParseJson } from "../util/tryParseJson.js";
import { Redis } from "@upstash/redis";
import { set } from "../util/dot-wild.js";
import { spreadValue } from "../util/spreadValue.js";
import { upstashKeys } from "../util/state.js";
export const listUpstashRedisDatabases = async (context) => {
    const { upstashApiKey, upstashEmail } = context;
    const url = "https://api.upstash.com/v2/redis/databases";
    const auth = `Basic ${btoa(`${upstashEmail}:${upstashApiKey}`)}`; // Encode credentials
    const result = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: auth,
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .catch((error) => {
        console.error("Error:", error);
        return undefined;
    });
    return { isSuccessful: true, message: "Listed db", result };
};
/**
 */
export const createUpstashRedisDatabase = async (context) => {
    const { upstashApiKey, upstashEmail, region, name } = context;
    const url = "https://api.upstash.com/v2/redis/database";
    const auth = `Basic ${btoa(`${upstashEmail}:${upstashApiKey}`)}`; // Encode credentials
    console.log("NEED TO CREATE NEW DB");
    const data = {
        name,
        region: region || "us-central1",
        tls: true,
    };
    const result = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: auth,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .catch((error) => {
        console.error("Error:", error);
        return undefined;
    });
    if (!result?.database_id) {
        console.log({ result });
        return { isSuccessful: false, message: "No database created" };
    }
    const dbInfo = await getUpstashRedisDatabase({
        upstashApiKey,
        upstashEmail,
        databaseId: result.database_id,
    });
    if (!dbInfo) {
        return { isSuccessful: false, message: "Couldn't get info" };
    }
    return { isSuccessful: true, message: "Made db", result: dbInfo };
};
/**

 */
export const getUpstashRedisDatabase = async (context) => {
    const { upstashApiKey, upstashEmail, databaseId } = context;
    const url = `https://api.upstash.com/v2/redis/database/${databaseId}`;
    const auth = `Basic ${btoa(`${upstashEmail}:${upstashApiKey}`)}`; // Encode credentials
    const result = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: auth,
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .catch((error) => {
        console.error("Error:", error);
        return undefined;
    });
    return result;
};
/** see https://upstash.com/docs/redis/features/restapi */
export const upstashRedisRequest = async (context) => {
    const { args, command, redisRestToken, redisRestUrl } = context;
    const url = `https://${redisRestUrl}/${command}/${args.join("/")}`;
    console.log({ url, redisRestToken });
    const result = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${redisRestToken}`,
            "Content-Type": "application/json",
        },
    })
        .then(async (response) => {
        console.log(" status", response.status);
        if (response.ok) {
            const text = await response.text();
            const json = tryParseJson(text);
            if (!json) {
                return { result: text };
            }
            return json;
        }
        console.log("NO JSON! status", response.status);
        return { result: response.statusText };
    })
        .catch((error) => {
        console.error("Upstash Redis Error:", error.message);
        return { result: undefined };
    });
    return result.result;
};
export const getUpstashRedisRangeKeys = async (context) => {
    const { baseKey, redisRestToken, redisRestUrl } = context;
    const redis = new Redis({
        url: `https://${redisRestUrl}`,
        token: redisRestToken,
    });
    let cursor = 0;
    let allKeys = [];
    while (true) {
        const [newCursor, newKeys] = await redis.scan(cursor, {
            match: baseKey ? `${baseKey}.*` : "*",
        });
        allKeys = allKeys.concat(newKeys);
        console.log({ newCursor });
        if (cursor === newCursor || !newCursor) {
            break;
        }
        cursor = newCursor;
    }
    return allKeys.concat(baseKey || "");
};
export const deleteUpstashRedisRange = async (context) => {
    const { redisRestToken, redisRestUrl, baseKey } = context;
    const keys = await getUpstashRedisRangeKeys(context);
    const redis = new Redis({
        url: `https://${redisRestUrl}`,
        token: redisRestToken,
    });
    const amountRemoved = await redis.del(...keys);
    if (upstashKeys.isDataKey(baseKey)) {
        await redis.set(upstashKeys.dataUpdatedAt, Date.now());
    }
    return amountRemoved;
};
export const upstashRedisSetJson = async (context) => {
    const { redisRestToken, redisRestUrl, key, value } = context;
    const pairs = spreadValue(key, value);
    const redis = new Redis({
        url: `https://${redisRestUrl}`,
        token: redisRestToken,
    });
    const obj = mergeObjectsArray(pairs.map((x) => ({ [x.key]: x.value })));
    const isDataKey = upstashKeys.isDataKey(key);
    if (isDataKey) {
        //NB: if data was edited, note that
        obj[upstashKeys.dataUpdatedAt] = Date.now();
    }
    const result = await redis.mset(obj);
    return result;
};
/** Gets a range of items from redis by first iterating over the keys (in range or all) and then efficiently getting all values */
export const upstashRedisGetRange = async (context) => {
    const { redisRestToken, redisRestUrl } = context;
    const redis = new Redis({
        url: `https://${redisRestUrl}`,
        token: redisRestToken,
    });
    const allKeys = await getUpstashRedisRangeKeys(context);
    const allValues = allKeys.length > 0
        ? (await redis.mget(...allKeys))
            .map((value, index) => value
            ? {
                key: allKeys[index],
                value,
            }
            : null)
            .filter(notEmpty)
        : [];
    const json = allValues.reduce((previous, item) => {
        const result = set(previous, item.key, item.value);
        return result;
    }, {});
    return { json, array: allValues };
};
//# sourceMappingURL=upstashRedis.js.map