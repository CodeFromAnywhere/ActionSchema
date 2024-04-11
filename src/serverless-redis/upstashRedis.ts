import { O, generateId } from "js-util";
import { tryParseJson } from "../util/tryParseJson.js";

import { Redis } from "@upstash/redis";
import { set } from "../util/dot-wild.js";

/**
 * Represents the details of a database including its identification, configuration,
 * ownership, and operational status.
 */
interface UpstashRedisCreateDatabaseResponse {
  /**
   * ID of the created database.
   */
  database_id: string;

  /**
   * Name of the database.
   */
  database_name: string;

  /**
   * Type of the database in terms of pricing model (Free, Pay as You Go, or Enterprise).
   */
  database_type: string;

  /**
   * The region where the database is hosted.
   */
  region: string;

  /**
   * Database port for clients to connect.
   */
  port: number;

  /**
   * Creation time of the database as Unix time.
   */
  creation_time: number;

  /**
   * State of the database (active or deleted).
   */
  state: string;

  /**
   * Password of the database.
   */
  password: string;

  /**
   * Email or team id of the owner of the database.
   */
  user_email: string;

  /**
   * Endpoint URL of the database.
   */
  endpoint: string;

  /**
   * Indicates whether TLS/SSL is enabled or not.
   */
  tls: boolean;
}

/**
 * Response object for creating a database
 */

interface UpstashRedisGetDatabaseResponse {
  /**
   * ID of the created database
   */
  database_id: string;

  /**
   * Name of the database
   */
  database_name: string;

  /**
   * Type of the database in terms of pricing model(Free, Pay as You Go or Enterprise)
   */
  database_type: "Free" | "Pay as You Go" | "Enterprise";

  /**
   * The region where database is hosted
   */
  region: string;

  /**
   * Database port for clients to connect
   */
  port: number;

  /**
   * Creation time of the database as Unix time
   */
  creation_time: number;

  /**
   * State of database (active or deleted)
   */
  state: "active" | "deleted";

  /**
   * Password of the database
   */
  password: string;

  /**
   * Email or team id of the owner of the database
   */
  user_email: string;

  /**
   * Endpoint URL of the database
   */
  endpoint: string;

  /**
   * TLS/SSL is enabled or not
   */
  tls: boolean;

  /**
   * Token for rest based communication with the database
   */
  rest_token: string;

  /**
   * Read only token for rest based communication with the database
   */
  read_only_rest_token: string;

  /**
   * Max number of concurrent clients can be opened on this database currently
   */
  db_max_clients: number;

  /**
   * Max size of a request that will be accepted by the database currently(in bytes)
   */
  db_max_request_size: number;

  /**
   * Total disk size limit that can be used for the database currently(in bytes)
   */
  db_disk_threshold: number;

  /**
   * Max size of an entry that will be accepted by the database currently(in bytes)
   */
  db_max_entry_size: number;

  /**
   * Max size of a memory the database can use(in bytes)
   */
  db_memory_threshold: number;

  /**
   * Max daily bandwidth can be used by the database(in bytes)
   */
  db_daily_bandwidth_limit: number;

  /**
   * Max number of commands can be sent to the database per second
   */
  db_max_commands_per_second: number;

  /**
   * Total number of commands can be sent to the database
   */
  db_request_limit: number;
}

/**
 */
export const createUpstashRedisDatabase = async (context: {
  upstashEmail: string;
  upstashApiKey: string;
  region?:
    | "eu-west-1"
    | "us-east-1"
    | "us-west-1"
    | "ap-northeast-1"
    | "us-central1";
}) => {
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
    .then(
      (response) =>
        response.json() as Promise<UpstashRedisCreateDatabaseResponse>,
    )
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
export const getUpstashRedisDatabase = async (context: {
  upstashEmail: string;
  upstashApiKey: string;
  databaseId: string;
}) => {
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
    .then(
      (response) => response.json() as Promise<UpstashRedisGetDatabaseResponse>,
    )
    .catch((error) => {
      console.error("Error:", error);
      return undefined;
    });

  return result;
};

/** see https://upstash.com/docs/redis/features/restapi */
export const upstashRedisRequest = async (context: {
  redisRestUrl: string;
  redisRestToken: string;
  command: string;
  args: string[];
}) => {
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

        const json = tryParseJson<{ result: any }>(text);

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

export const upstashRedisSetRequest = async (context: {
  redisRestUrl: string;
  redisRestToken: string;
  key: string;
  value: any;
}) => {
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
export const upstashRedisGetRange = async (context: {
  redisRestUrl: string;
  redisRestToken: string;
  baseKey: string | undefined;
}) => {
  const { baseKey, redisRestToken, redisRestUrl } = context;

  const redis = new Redis({
    url: `https://${redisRestUrl}`,
    token: redisRestToken,
  });

  let cursor = 0;
  let allKeys: string[] = [];

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
    value: (await redis.get(baseKey || "")) as string,
  };

  const otherValues =
    allKeys.length > 0
      ? ((await redis.mget(...allKeys)) as string[]).map((value, index) => ({
          key: allKeys[index],
          value,
        }))
      : [];

  const result = [baseValue].concat(otherValues).reduce((previous, item) => {
    const result = set(previous, item.key, item.value);
    return result;
  }, {} as O);

  return result;
};
