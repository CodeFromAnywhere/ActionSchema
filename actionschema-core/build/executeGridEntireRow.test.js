import { getObjectKeysArray, sleep, sum } from "js-util";
const functions = {
    wait: async (context) => {
        console.log("executing", context);
        await sleep(1000);
        return { priceCredit: 1 };
    },
};
const json = {
    a: { functionName: "wait", requiredProperties: [] },
    b: { functionName: "wait", requiredProperties: ["a"] },
    c: { functionName: "wait", requiredProperties: ["b"] },
    d: { functionName: "wait", requiredProperties: ["a"] },
    e: { functionName: "wait", requiredProperties: [] },
    // f: { functionName: "wait", requiredProperties: ["c"] },
    // g: { functionName: "wait", requiredProperties: ["c"] },
    // h: { functionName: "wait", requiredProperties: ["a", "b"] },
    // i: { functionName: "wait", requiredProperties: [] },
};
// challenge 2) calculate property x as soon as possible by recursively calculating the dependencies first
/**
challenge 1) calculate all properties as soon as possible:
 */
const generatePropertiesIfPossibleRecursive = async (properties, done, started) => {
    const priceCreditArray = await Promise.all(getObjectKeysArray(properties).map(async (key) => {
        const isStarted = started.includes(key);
        if (isStarted) {
            // base case to skip
            return 0;
        }
        const value = properties[key];
        const areRequirementsMet = value.requiredProperties.every((k) => done.includes(k));
        if (!areRequirementsMet) {
            // base case don't do it, we'll handle in a recursion
            return 0;
        }
        const fnKey = value.functionName;
        const fn = functions[fnKey];
        started.push(key);
        const result = await fn(key);
        done.push(key);
        // recursion case
        const recursion = await generatePropertiesIfPossibleRecursive(properties, done, started);
        const priceCredit = (result.priceCredit || 0) + recursion;
        return priceCredit;
    }));
    const priceCredit = sum(priceCreditArray);
    return priceCredit;
};
/**
 * Generates an entire row as soon as possible and returns the priceCredit of all executions
 *
 * TODO: apply this on the ActionSchema datastructure for updating an entire row
 */
const entireRowGeneration = async () => {
    const done = [];
    const started = [];
    const priceCredit = await generatePropertiesIfPossibleRecursive(json, done, started);
    return { priceCredit };
};
entireRowGeneration();
//# sourceMappingURL=executeGridEntireRow.test.js.map