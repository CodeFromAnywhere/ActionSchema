const removeCommentsRegex = /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g;
/**
 * if text isn't json, returns null
 */
export const tryParseJson = (text, logParseError) => {
    try {
        const jsonStringWithoutComments = text.replace(removeCommentsRegex, (m, g) => (g ? "" : m));
        return JSON.parse(jsonStringWithoutComments);
    }
    catch (parseError) {
        if (logParseError)
            console.log("JSON Parse error:", parseError);
        return null;
    }
};
//# sourceMappingURL=tryParseJson.js.map