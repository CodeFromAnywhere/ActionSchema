import { ExecuteContext, ExecuteResult, UpstashStorageDetails } from "../types/types.js";
/**
Serverless wrapper around `execute`
*/
export declare const executeServerless: (context: ExecuteContext & UpstashStorageDetails, originUrl: string) => Promise<ExecuteResult & {
    /** Returned if the db was just created */
    redisRestToken?: string | undefined;
    redisRestUrl?: string | undefined;
}>;
//# sourceMappingURL=executeServerless.d.ts.map