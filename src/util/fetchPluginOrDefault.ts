import { EnvironmentConfig, ExecuteContext } from "./types.js";
import { getOpenapiDetails } from "./getOpenapiDetails.js";
import { notEmpty } from "js-util";

export const fetchPluginOrDefault = async (
  context: ExecuteContext & EnvironmentConfig,
) => {
  const { schema, fetchPlugin, actionSchemaPlugins, getStatus } = context;

  const plugin = schema["x-plugin"];
  const defaultValue = schema.default;

  if (!plugin) {
    // default value needed if there was no plugin
    return {
      value: defaultValue,
      isSuccessful: true,
      message: "No plugin. Returned default value",
    };
  }

  if (plugin.dataDependencies && plugin.dataDependencies.length > 0) {
    const statuses = (
      await Promise.all(
        plugin.dataDependencies.map((dotLocation) => getStatus(dotLocation)),
      )
    ).filter(notEmpty);
    const hasStaleStatus = statuses.length > 0;

    if (hasStaleStatus) {
      return {
        value: undefined,
        hasStaleStatus,
        isSuccessful: true,
        message: "Found one or more stale statuses, can't calculate yet.",
      };
    }
  }

  //===== Looks at the schema and relevant existing data
  const completeContext = {
    ...plugin.context,
  };

  //====== Gathers authorization info

  const $openapi = plugin.$openapi;

  const details = await getOpenapiDetails($openapi, actionSchemaPlugins);

  if (!details) {
    return {
      isSuccessful: false,
      message: "Could not find openapi details",
      value: undefined,
    };
  }

  //===== Executes the plugin
  const newValue = await fetchPlugin(details, completeContext);

  return { value: newValue, isSuccessful: true, message: "Got new value" };
};
