import { ExecuteContext } from "../../plugin/execute.js";
/** Function to call the API.
 *
 * - Used for traversing through the JSON whenever a new plugin needs executing
 * - Used in any frontend where we want to call execute for server or serverless
 */
export declare const fetchExecute: (context: ExecuteContext & {
    executeApiPath: string;
    headers: {
        [key: string]: string;
    };
}) => Promise<Response>;
//# sourceMappingURL=fetchExecute.d.ts.map