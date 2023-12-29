import { camelCase } from "convert-case";
/** goal would be to visualise the life-cycle of an actionschema */
export const getMermaidVisualisationCode = (schema) => {
    const properties = schema.properties.items.items.properties;
    //1 properties without dependencies: add them to an object and remove them from the list of properties
    const dependencies = Object.keys(properties)
        .map((key) => {
        const value = properties[key];
        const firstPlugin = value.creationPlugins?.[0];
        if (!firstPlugin ||
            !firstPlugin?.propertyDependencies ||
            firstPlugin.propertyDependencies.length === 0) {
            return camelCase(key);
        }
        return firstPlugin.propertyDependencies
            .map((dep) => `${camelCase(dep)} --> |use ${firstPlugin.$openapi
            ?.operationId}| ${camelCase(key)}`)
            .join("\n");
    })
        .join("\n");
    return dependencies;
};
//# sourceMappingURL=getMermaidVisualisationCode.js.map