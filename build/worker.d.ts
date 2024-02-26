import { WorkerContext } from "./types/worker-context.schema.js";
/** This thing is executed in a separate thread everytime */
declare const worker: (context: WorkerContext) => Promise<void>;
export default worker;
//# sourceMappingURL=worker.d.ts.map