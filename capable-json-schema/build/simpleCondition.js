/**
 * Useful for doing logic in columns
 */
export const simpleCondition = (context) => {
    const { operator, value, compare } = context;
    if (!operator || operator === "Equal") {
        return {
            isSuccessful: true,
            result: String(value).toLowerCase() === String(compare).toLowerCase(),
        };
    }
    if (operator === "Contains") {
        return {
            isSuccessful: true,
            result: String(value)
                .toLowerCase()
                .includes(String(compare).toLowerCase()),
        };
    }
    if (operator === "Starts with") {
        return {
            isSuccessful: true,
            result: String(value)
                .toLowerCase()
                .startsWith(String(compare).toLowerCase()),
        };
    }
    if (operator === "Ends with") {
        return {
            isSuccessful: true,
            result: String(value)
                .toLowerCase()
                .endsWith(String(compare).toLowerCase()),
        };
    }
    if (operator === "Less than") {
        return { isSuccessful: true, result: value < compare };
    }
    if (operator === "More than") {
        return { isSuccessful: true, result: value > compare };
    }
    return { isSuccessful: false, message: "Unknown operator" };
};
simpleCondition.config = {
    isPublic: true,
    categories: ["util"],
    emoji: "☝️",
    plugin: "column",
    shortDescription: "Do conditional logic",
};
//# sourceMappingURL=simpleCondition.js.map