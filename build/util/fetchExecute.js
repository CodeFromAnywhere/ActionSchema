/**
 * Function to call the execute API. This can be both serverless and server apis, but not browser as browser doesn't require a fetch.
 *
 * - Used for traversing through the JSON whenever a new plugin needs executing
 * - Used in any frontend where we want to call execute for server or serverless
 */
export const fetchExecute = async (context, originUrl, actionSchemaOpenApiPath, actionSchemaOpenApiHeaders) => {
    const apiPath = "/api/execute";
    const executeApiUrl = actionSchemaOpenApiPath
        ? new URL(actionSchemaOpenApiPath).origin + apiPath
        : originUrl + apiPath;
    console.log({ executeApiUrl });
    if (apiPath === executeApiUrl) {
        console.log("WTF WTF same saem");
        return { isSuccessful: false, message: "Errsdame" };
    }
    const result = await fetch(executeApiUrl, {
        method: "POST",
        body: JSON.stringify(context),
        headers: actionSchemaOpenApiHeaders,
    }).then((response) => response.json());
    return result;
};
//# sourceMappingURL=fetchExecute.js.map