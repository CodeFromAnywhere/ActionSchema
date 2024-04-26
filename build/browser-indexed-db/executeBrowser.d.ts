import { ExecuteContext } from "../types.js";
/**
Local offline IndexedDb store wrapper around `execute`
 */
export declare const executeBrowser: (context: ExecuteContext) => Promise<{
    isSuccessful: boolean;
    message: string;
}>;
//# sourceMappingURL=executeBrowser.d.ts.map