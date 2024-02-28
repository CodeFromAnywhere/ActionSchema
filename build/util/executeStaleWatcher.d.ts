/**
This one contains the main logic independent of environment.

- Can be a cronjob running every minute, or in some cases a watcher!
- Look at stale statuses in the status document
- Sees the ones that can immediately execute (without dependencies that are stale as well)
- Runs `execute` for them
*/
export declare const executeStaleWatcher: () => void;
//# sourceMappingURL=executeStaleWatcher.d.ts.map