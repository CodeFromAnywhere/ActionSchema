import { takeFirst } from "js-util";
export const getCapableJsonSchemaProperties = (schema) => {
    if (schema?.type !== "object") {
        return;
    }
    if (!schema.properties?.items) {
        return;
    }
    if (typeof schema.properties.items === "boolean" ||
        schema.properties.items.type !== "array" ||
        !schema.properties.items.items ||
        typeof schema.properties.items.items === "boolean") {
        return;
    }
    const firstItem = takeFirst(schema.properties.items.items);
    if (typeof firstItem === "boolean") {
        return;
    }
    if (firstItem.type !== "object" || !firstItem.properties) {
        return;
    }
    return firstItem.properties;
};
//# sourceMappingURL=getCapableJsonSchemaProperties.js.map