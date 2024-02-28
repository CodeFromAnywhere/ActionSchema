import { ExecuteContext, ExecuteResult } from "./types.js";
/**
 * Function to call the execute API. This can be both serverless and server apis, but not browser as browser doesn't require a fetch.
 *
 * - Used for traversing through the JSON whenever a new plugin needs executing
 * - Used in any frontend where we want to call execute for server or serverless
 */
export declare const fetchExecute: (context: ExecuteContext & {
    executeApiPath: string;
    executeApiHeaders: {
        [key: string]: string;
    };
}) => Promise<ExecuteResult>;
//# sourceMappingURL=fetchExecute.d.ts.map