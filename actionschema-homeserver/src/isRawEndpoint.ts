import { apiConventions } from "api-js";
export const isRawEndpoint = (functionName: string) => {
  return functionName.endsWith(apiConventions.rawFunctionConventionSuffix);
};
