import { O } from "js-util";
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
export declare const createUpstashRedisDatabase: (context: {
    upstashEmail: string;
    upstashApiKey: string;
    region?: "eu-west-1" | "us-east-1" | "us-west-1" | "ap-northeast-1" | "us-central1";
}) => Promise<{
    isSuccessful: boolean;
    message: string;
    result?: undefined;
} | {
    isSuccessful: boolean;
    message: string;
    result: UpstashRedisGetDatabaseResponse;
}>;
/**

 */
export declare const getUpstashRedisDatabase: (context: {
    upstashEmail: string;
    upstashApiKey: string;
    databaseId: string;
}) => Promise<UpstashRedisGetDatabaseResponse | undefined>;
/** see https://upstash.com/docs/redis/features/restapi */
export declare const upstashRedisRequest: (context: {
    redisRestUrl: string;
    redisRestToken: string;
    command: string;
    args: string[];
}) => Promise<any>;
export declare const upstashRedisSetRequest: (context: {
    redisRestUrl: string;
    redisRestToken: string;
    key: string;
    value: any;
}) => Promise<any>;
/** Gets a range of items from redis by first iterating over the keys (in range or all) and then efficiently getting all values */
export declare const upstashRedisGetRange: (context: {
    redisRestUrl: string;
    redisRestToken: string;
    baseKey: string | undefined;
}) => Promise<O>;
export {};
//# sourceMappingURL=upstashRedis.d.ts.map