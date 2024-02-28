import jsYaml from "js-yaml";
const { load } = jsYaml;
/**
 * try-catches js-yaml to turn the yamlString into JSON
 */
export const tryParseYamlToJson = <T = any>(yamlString: string): T | null => {
  // Get document, or throw exception on error
  try {
    const document = load(yamlString);
    return document as T;
  } catch (e: any) {
    // console.log("failed parsing yaml", e?.message);
    return null;
  }
};
