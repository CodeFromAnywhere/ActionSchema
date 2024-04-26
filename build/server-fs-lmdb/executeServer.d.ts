import { ExecuteContext, ExecuteResult } from "../types.js";
/**
Server wrapper around `execute` that ensures every execution request is carried out in a worker

NB: This doesn't have any awareness yet of the user. databaseId can be set accordingly
*/
export declare const executeServer: (context: ExecuteContext) => Promise<ExecuteResult>;
//# sourceMappingURL=executeServer.d.ts.map