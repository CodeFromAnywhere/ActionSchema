import { ActionSchema } from "../types/action-schema.schema.js";
import { fetchPlugin } from "./fetchPlugin.js";
import { getOpenapiDetails } from "./getOpenapiDetails.js";
import { WorkerContext } from "../types/worker-context.schema.js";
import { getSchemaAtDotLocation } from "../util/getSchemaAtDotLocation.js";
import { getDotLocationBase } from "../util/getDotlocationBase.js";
import { ActionSchemaPlugin } from "../types/action-schema-plugin.schema.js";

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
  recurseFunction: (context: ExecuteContext) => any;
  /** Set or remove a status.  */
  setStatus: (key: string, value: string | null) => Promise<void>;
  /** Get a status */
  getStatus: (key: string, value: string) => Promise<string>;
  setData: (key: string, value: any) => Promise<void>;
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
  value?: any;
  /** If true, skips executing the plugin */
  skipPlugin?: boolean;
  /** If given, must be a dotlocation of the entire schema of the data you want to get back after this one execution. */
  returnDotLocation?: string;
  /** An url to be called back on with updates */
  updateCallbackUrl?: string;
  actionSchemaPlugins: ActionSchemaPlugin[];
};
/**
This is the main function to execute things. Please note that the data storage method is abstracted away from this one as every environment implements their own for that.

A: Init
- Set `busy` status (to not conflict with spawner)
- Set a new value into the db (Optional, if given)

B: Plugin
- Looks at the schema and relevant existing data
- Gathers the context
- Gathers authorization info
- Executes the plugin
- Updates the data with the result
- Remove `busy` status

C: Concequences
- Look at other columns that have this dotLocation in `propertyDependencies`
- Set those status to `stale`
- Try to execute `executeGridPlugin` for dependants directly incase available. (No probem if it fails)

 */
export const execute = async (context: ExecuteContext & EnvironmentConfig) => {
  const {
    dotLocation,
    schema,
    databaseId,
    value,
    skipPlugin,
    returnDotLocation,
    recurseFunction,
    getData,
    getStatus,
    setData,
    setStatus,
    updateCallbackUrl,
    actionSchemaPlugins,
  } = context;

  // Set `busy` status (to not conflict with spawner)
  await setStatus(dotLocation, "busy");
  let setValueResult: undefined | { isSuccessful: boolean; message: string } =
    undefined;

  if (value !== undefined) {
    //===== Set a new value into the db (Optional, if given)
    await setData(dotLocation, value);
  }

  //===== Looks at the schema and relevant existing data
  const completeContext = {};

  //===== Gathers the context
  const workerContext: WorkerContext = {
    completeContext,
    dotLocation,
    schema,
    databaseId,
  };

  //====== Executes the plugin
  const plugins = getSchemaAtDotLocation(schema, dotLocation)["x-plugin"];

  // NB: for now, always the first
  const plugin = Array.isArray(plugins) ? plugins[0] : plugins;

  if (!plugin || skipPlugin) {
    return (
      setValueResult || {
        isSuccessful: true,
        message: "Did not set any value, did not execute any plugin",
      }
    );
  }
  //====== Gathers authorization info

  const $openapi = plugin.$openapi;

  const details = await getOpenapiDetails($openapi, actionSchemaPlugins);

  if (!details) {
    await setStatus(dotLocation, null);

    return {
      isSuccessful: false,
      message: "Could not find openapi details",
    };
  }

  //===== Executes the plugin

  const newValue = await fetchPlugin(details, completeContext);

  //===== Updates the data with the result
  // const values = flatten(newValue);
  await setData(dotLocation, newValue);
  const setNewValueResult = { isSuccessful: true, message: "Set the value" };

  //======= Remove `busy` status
  await setStatus(dotLocation, null);

  //=== Look at other columns that have this dotLocation in `propertyDependencies`, Set those status to `stale`

  // This would be one level up, so the entire object
  const baseDotLocation = getDotLocationBase(dotLocation);

  // Look at other columns that have this datapoint in `propertyDependencies`
  const properties =
    getSchemaAtDotLocation(schema, baseDotLocation).properties || {};

  const dependantKeys = Object.keys(properties).filter((key) => {
    const schema = properties[key];
    const plugin = Array.isArray(schema["x-plugin"])
      ? schema["x-plugin"][0]
      : schema["x-plugin"];

    const isDependant = plugin?.propertyDependencies?.includes(dotLocation);
    return isDependant;
  });

  // Set those status to `stale`
  const dependantDotLocations = dependantKeys.map((k) =>
    getDotLocationBase(dotLocation, k),
  );

  await Promise.all(
    dependantDotLocations.map(async (dotLocation) => {
      await setStatus(dotLocation, "stale");
    }),
  );

  //====== Try to execute `executeGridPlugin` for dependants directly incase available. (No probem if it fails)
  dependantDotLocations.map((dotLocation) => {
    // NB: Don't wait for this
    recurseFunction({ ...context, dotLocation });
  });

  return setNewValueResult;
};
