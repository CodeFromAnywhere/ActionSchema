export const isValidJsonArrayFile = (json) => {
    return !!(json &&
        typeof json === "object" &&
        !Array.isArray(json) &&
        json?.items &&
        json?.$schema &&
        typeof json?.$schema === "string" &&
        Array.isArray(json.items));
};
//# sourceMappingURL=isValidJsonArrayFile.js.map