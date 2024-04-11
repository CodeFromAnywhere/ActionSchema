import { ExecuteContext } from "../types/types.js";
/**
 * This thing is executed in another thread everytime, which frees up the load
 *
 * To save the server this should not be used directly.
 */
declare const executeServerWorker: (executeContext: ExecuteContext) => Promise<import("../types/types.js").ExecuteResult>;
export default executeServerWorker;
//# sourceMappingURL=executeServerWorker.d.ts.map