import { apiConventions } from "api-js";
export const isRawEndpoint = (functionName) => {
    return functionName.endsWith(apiConventions.rawFunctionConventionSuffix);
};
//# sourceMappingURL=isRawEndpoint.js.map