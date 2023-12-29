export const getValidJsonArrayFile = (json) => {
    const isValid = !!(json &&
        typeof json === "object" &&
        !Array.isArray(json) &&
        json?.items &&
        json?.$schema &&
        typeof json?.$schema === "string" &&
        Array.isArray(json.items));
    if (!isValid) {
        return;
    }
    return json;
};
//# sourceMappingURL=getValidJsonArrayFile.js.map