import { generateId } from "js-util";

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
    region: region || "eu-west-1",
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

  const { result } = await fetch(
    `${redisRestUrl}/${command}/${args.join("/")}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${redisRestToken}`,
        "Content-Type": "application/json",
      },
    },
  )
    .then((response) => response.json() as Promise<{ result: any }>)
    .catch((error) => {
      console.error("Error:", error);
      return { result: undefined };
    });

  return result;
};
