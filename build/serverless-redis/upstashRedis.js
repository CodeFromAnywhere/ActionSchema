import { generateId } from "js-util";
import { tryParseJson } from "../util/tryParseJson.js";
import { Redis } from "@upstash/redis";
import { set } from "../util/dot-wild.js";
/**
 */
export const createUpstashRedisDatabase = async (context) => {
    const { upstashApiKey, upstashEmail, region } = context;
    const url = "https://api.upstash.com/v2/redis/database";
    const auth = `Basic ${btoa(`${upstashEmail}:${upstashApiKey}`)}`; // Encode credentials
    const data = {
        name: generateId(),
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
export const upstashRedisSetRequest = async (context) => {
    const { key, value, redisRestToken, redisRestUrl } = context;
    const redis = new Redis({
        url: `https://${redisRestUrl}`,
        token: redisRestToken,
    });
    console.log(`Set`, { key, value });
    const data = await redis.set(key, value);
    console.log(`Set`, { key, value, data });
    // const url = `https://${redisRestUrl}/set/${key}`;
    // const result = await fetch(url, {
    //   method: "POST",
    //   body: JSON.stringify(value),
    //   headers: {
    //     Authorization: `Bearer ${redisRestToken}`,
    //     // "Content-Type": "application/json",
    //   },
    // })
    //   .then(async (response) => {
    //     console.log(" status", response.status);
    //     if (response.ok) {
    //       const text = await response.text();
    //       const json = tryParseJson<any>(text);
    //       if (!json) {
    //         return { result: text };
    //       }
    //       return json;
    //     }
    //     console.log("NO JSON! status", response.status);
    //     return { result: response.statusText };
    //   })
    //   .catch((error) => {
    //     console.error("Upstash Redis Error:", error.message);
    //     return { error: error.message };
    //   });
    return data;
};
/** Gets a range of items from redis by first iterating over the keys (in range or all) and then efficiently getting all values */
export const upstashRedisGetRange = async (context) => {
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
    const baseValue = {
        key: baseKey || "",
        value: (await redis.get(baseKey || "")),
    };
    const otherValues = allKeys.length > 0
        ? (await redis.mget(...allKeys)).map((value, index) => ({
            key: allKeys[index],
            value,
        }))
        : [];
    const result = [baseValue].concat(otherValues).reduce((previous, item) => {
        const result = set(previous, item.key, item.value);
        return result;
    }, {});
    return result;
};
//# sourceMappingURL=upstashRedis.js.map