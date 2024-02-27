import { ExecuteContext, ExecuteResult } from "./execute.js";

/**
 * Function to call the execute API. This can be both serverless and server apis, but not browser as browser doesn't require a fetch.
 *
 * - Used for traversing through the JSON whenever a new plugin needs executing
 * - Used in any frontend where we want to call execute for server or serverless
 */
export const fetchExecute = async (
  context: ExecuteContext & {
    executeApiPath: string;
    executeApiHeaders: { [key: string]: string };
  },
) => {
  const { executeApiPath, executeApiHeaders, ...executeContext } = context;

  const result = await fetch(executeApiPath, {
    method: "POST",
    body: JSON.stringify(executeContext),
    headers: executeApiHeaders,
  }).then((response) => response.json() as Promise<ExecuteResult>);

  return result;
};
