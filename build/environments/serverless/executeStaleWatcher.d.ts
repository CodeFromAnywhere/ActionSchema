/**
- Can be a cronjob running every minute
- Look at stale statuses in the status document
- Sees the ones that can immediately execute (without dependencies that are stale as well)
- Runs `execute` for them
*/
export declare const executeStaleWatcher: () => void;
//# sourceMappingURL=executeStaleWatcher.d.ts.map