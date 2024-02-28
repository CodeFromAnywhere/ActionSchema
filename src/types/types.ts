import { ActionSchemaPlugin } from "./action-schema-plugin.schema.js";
import { ActionSchema } from "./action-schema.schema.js";

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

  setData: (key: string, value: any) => Promise<SetDataResult>;
  getData: (key: string) => Promise<any>;
  /** Can be different in environments */
  fetchPlugin: (
    details: {
      apiUrl: string;
      method: string;
      headers: any;
    },
    completeContext: any,
  ) => Promise<any>;
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
