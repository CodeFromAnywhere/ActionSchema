import { getObjectKeysArray, sum } from "js-util";
import { executeGridPlugin } from "./executeGridPlugin.js";
/**
 * Recursively, greedily tries to execute a function for a cell calculation for all properties in a row.
 */
export const executeGridEntireRowRecursive = async (context, properties, done, started) => {
    const priceCreditArray = await Promise.all(getObjectKeysArray(properties).map(async (key) => {
        const isStarted = started.includes(key);
        if (isStarted) {
            // base case to skip
            return 0;
        }
        const value = properties[key];
        const firstPlugin = value.creationPlugins?.[0];
        if (!firstPlugin) {
            // base case: no plugin so it's done
            started.push(key);
            done.push(key);
            console.log("no plugin", key);
            return 0;
        }
        const propertyDependencies = firstPlugin.propertyDependencies || [];
        const areRequirementsMet = propertyDependencies.every((k) => done.includes(k));
        // console.log({ key, areRequirementsMet });
        if (!areRequirementsMet) {
            // base case don't do it, we'll handle in a recursion
            return 0;
        }
        started.push(key);
        // NB: we need to wait!
        const result = await executeGridPlugin({
            ...context,
            propertyKey: key,
            waitForResult: true,
        });
        done.push(key);
        // Recursion case
        const recursion = await executeGridEntireRowRecursive(context, properties, done, started);
        const priceCredit = (result.priceCredit || 0) + recursion;
        return priceCredit;
    }));
    const priceCredit = sum(priceCreditArray);
    return priceCredit;
};
//# sourceMappingURL=executeGridEntireRowRecursive.js.map