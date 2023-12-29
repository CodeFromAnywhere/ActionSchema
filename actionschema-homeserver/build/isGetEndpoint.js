import { apiConventions } from "api-js";
export const isGetEndpoint = (functionName) => {
    return functionName.endsWith(apiConventions.getFunctionConventionSuffix);
};
//# sourceMappingURL=isGetEndpoint.js.map