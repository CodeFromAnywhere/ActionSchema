import { replaceVariables } from "capable-json-schema-js";
export const getCompleteContext = (context) => {
    const { pluginContext, propertyKey, row, projectRelativePath } = context;
    const newPluginContext = pluginContext ? { ...pluginContext } : {};
    Object.keys(newPluginContext).map((key) => {
        if (typeof newPluginContext[key] === "string") {
            newPluginContext[key] = replaceVariables(newPluginContext[key], row);
        }
    });
    const standardPluginContext = {
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
//# sourceMappingURL=getCompleteContext.js.map