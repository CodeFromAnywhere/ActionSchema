import { apiConventions } from "api-js";
export const isGetEndpoint = (functionName: string) => {
  return functionName.endsWith(apiConventions.getFunctionConventionSuffix);
};
