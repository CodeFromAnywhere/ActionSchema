import { WorkerContext } from "../types/worker-context.schema.js";
/** This thing is executed in another thread everytime, which frees up the load */
declare const executeGridPluginWorker: (context: WorkerContext) => Promise<void>;
export default executeGridPluginWorker;
//# sourceMappingURL=executeGridPluginWorker.d.ts.map