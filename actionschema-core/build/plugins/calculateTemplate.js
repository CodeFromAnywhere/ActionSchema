import { replaceVariables } from "capable-json-schema-js";
export const calculateTemplate = (context) => {
    const { description, row } = context;
    const result = replaceVariables(description, row);
    return { isSuccessful: true, result };
};
calculateTemplate.config = {
    isPublic: true,
    plugin: "column",
    emoji: "📄",
    categories: ["util"],
    shortDescription: "Evaluate variables and return the result",
};
//# sourceMappingURL=calculateTemplate.js.map