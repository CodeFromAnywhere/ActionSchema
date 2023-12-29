import { replaceVariables } from "capable-json-schema-js";
import { StandardContext, StandardPluginContext } from "function-types";
import { O } from "js-util";

export const getCompleteContext = (context: {
  row: O;
  pluginContext: O | undefined;
  propertyKey: string;
  projectRelativePath: string;
}) => {
  const { pluginContext, propertyKey, row, projectRelativePath } = context;

  const newPluginContext = pluginContext ? { ...pluginContext } : {};

  Object.keys(newPluginContext).map((key) => {
    if (typeof newPluginContext[key] === "string") {
      newPluginContext[key] = replaceVariables(newPluginContext[key], row);
    }
  });

  const standardPluginContext: StandardPluginContext = {
    row,
    previousResult: row[propertyKey],
    // NB: always overwrites this
    projectRelativeGridPath: projectRelativePath,
  };

  // NB: Here it always provides certain default keys for context.
  const completeContext = {
    ...newPluginContext,
    // ...standardContext,
    ...standardPluginContext,
  };

  return completeContext;
};
