/** Function to call the API.
 *
 * - Used for traversing through the JSON whenever a new plugin needs executing
 * - Used in any frontend where we want to call execute for server or serverless
 */
export const fetchExecute = async (context) => {
    const { executeApiPath, headers, ...executeContext } = context;
    const result = await fetch(executeApiPath, {
        method: "POST",
        body: JSON.stringify(executeContext),
        headers,
    });
    return result;
};
//# sourceMappingURL=fetchExecute.js.map