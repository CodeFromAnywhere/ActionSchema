import jsYaml from "js-yaml";
const { load } = jsYaml;
/**
 * try-catches js-yaml to turn the yamlString into JSON
 */
export const tryParseYamlToJson = (yamlString) => {
    // Get document, or throw exception on error
    try {
        const document = load(yamlString);
        return document;
    }
    catch (e) {
        // console.log("failed parsing yaml", e?.message);
        return null;
    }
};
//# sourceMappingURL=tryParseYamlToJson.js.map