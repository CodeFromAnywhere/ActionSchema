import { ActionSchemaPlugin } from "./types/action-schema-plugin.schema.js";
import { ActionSchema } from "./types/action-schema.schema.js";
export * from "./types/action-schema-plugin.schema.js";
export * from "./types/action-schema.schema.js";
export * from "./types/openapi.schema.js";
export * from "./types/schema-list.schema.js";
export * from "./types/local-storage.schema.js";
import type { OpenapiProxySchema } from "./types/openapi-proxy.schema.js";
export type { OpenapiProxySchema };
/** Should be inferred from x-plugin */
export type ValueOptions = {
    /**
     * If true, will replace the object rather than overwriting it where needed.
     *
     * By default, ActionSchema will overwrite only the given individual properties of an object. In this case, the other properties will be set to stale if needed.
     */
    objectReplace?: boolean;
    /**
      If true, will replace items in the array fully.
      
      By default, ActionSchema will insert into an array with an optional discriminator (see below).
      */
    arrayReplace?: boolean;
    /**
     * If given, must be a key of the object in the array. Will now overwrite/replace object-items where a discriminator matches, while keeping the rest as-is.
     */
    arrayDiscriminatorPropertyKey?: string;
};
/**
  The main 3 environments I want to be supporting are:
  
  - server (Users state is all in the server - can be a homeserver)
  - serverless (Users state is stored in some DB)
  - browser (Users state stays with the user)
  
  The browser is the most scalable one, but is limited as it cannot easily receive callbacks and needs to remain online at all times. On the other hand, the server is the least scalable and hardest to set up, but has no limitations.
  
  The goal is to share as much code as possible between the three environments, and open source at least the browser variant to get some eyeballs.
   */
export type EnvironmentConfig = {
    /** Function to recurse on dependants. */
    recurseFunction: (context: ExecuteContext) => Promise<{
        isSuccessful: boolean;
        message: string;
    }>;
    /** Set or remove a status.  */
    setStatus: (key: string, value: string | null) => Promise<void>;
    /** Get a status */
    getStatus: (key: string) => Promise<string | undefined>;
    /**
     * Sets data for a key to a value.
     *
     * This function is responsible for putting it into the right place of the datastore.
     *
     * A common strategy, for example, could be to flatten objects first to all its components, and then store all these datapoints separately.
     *
     * Also, if value is "null", this function is responsible for deleting that key/value item, but also all key/values that are in that range if it's not a leaf.
     */
    setData: (key: string, value: any) => Promise<SetDataResult>;
    /**
     * Gets data from a key
     *
     * NB: this function is responsible to get all underlying keys as well and put it together.
     */
    getData: (key: string) => Promise<any>;
    /** Can be different in environments */
    fetchPlugin: (details: {
        apiUrl: string;
        method: string;
        headers: any;
    }, completeContext: any) => Promise<any>;
};
export type UpstashStorageDetails = {
    /** For server-based storage, will use this, or create a new database if not given */
    redisRestUrl?: string;
    /** For server-based storage, will use this, or create a new database if not given */
    redisRestToken?: string;
    /** Can be set up for remote storage */
    upstashApiKey?: string;
    /** Can be set up for remote storage */
    upstashEmail?: string;
};
export type ExecuteContext = {
    schema: ActionSchema;
    /** Data dotlocation */
    dotLocation: string;
    databaseId: string;
    /** Set a new value into the db (Optional, if given) */
    value?: any;
    /** If true, skips executing the plugin */
    skipPlugin?: boolean;
    /** If given, must be a dotlocation of the entire schema of the data you want to get back after this one execution. */
    returnDotLocation?: string;
    /** An url to be called back on with updates */
    updateCallbackUrl?: string;
    actionSchemaPlugins: ActionSchemaPlugin[];
};
export type ExecuteResult = {
    isSuccessful: boolean;
    message: string;
    /** Optional result */
    result?: any;
};
export type SetDataResult = {
    isSuccessful: boolean;
    message: string;
};
//# sourceMappingURL=types.d.ts.map