//NB: tried some things here, but it's all unsafe or hard to work with.
// Custom "user-submitted" malicious script...
const maliciousScriptExample = `
let ref_to_global = (function(){
  return this;
}).call(null);

// UserContent-scope.
print(this);

// Prohibited...
print(globalThis);
print(window);
print(console);
print(navigator);

// require("fs")

// Attempt to access the "fetch" function from the global scope.
// This will result in the ERROR you see here ----------------->>>
print(ref_to_global?.['fetch']);

"hi"
`;
// Create a "global context" for our script. We wouldn't
// want people to access the global scope now would we...
const context = {
    // Prints something to the console, since the user-submitted
    // script has no access to the "console"-object.
    print: (arg0) => console.log(arg0),
    // Overwrite the global scope variables you want to prohibit.
    globalThis: null,
    window: null,
    document: null,
    fetch: null,
    console: null,
    navigator: null,
};
// This function wraps and encapuslates the user-submitted code
// in a class whilst also providing a custom global context/scope.
function makeEvaluator(src) {
    // Wrap the user-submitted content in a class constructor.
    src = `class UserContent { constructor() { ${src}; return "hi"; } }`;
    // Now wrap everything in our "context" object to create our
    // own "global scope".
    src = `with (context) {'use strict'; ${src}; \n return UserContent;}`; //
    const fn = new Function("context", src);
    return function (context) {
        // You could optionally create a Proxy of the context object
        // here to secure things further.
        return fn.bind(null)(context);
    };
}
const runEvaluator = (src) => {
    // "Compile" (for the lack of a better term) the user-submitted
    // content to a factory function to which we can pass our custom
    // "global scope" object. Note that we're using "print()" instead
    // of "print" in the script above.
    const func = makeEvaluator(src);
    // userFunc will return a class declaration.
    const userFunc = func(context);
    try {
        // The following will _actually_ run the user-submitted content
        // in its only little tiny sandbox.
        const result = new userFunc();
        return result;
    }
    catch (e) {
        console.log(e.message);
        return undefined;
    }
};
console.log({ result: runEvaluator(`1+2`) });
export {};
// /**
// Example
// ```
// print(
//   evaluateOutputMapFunction("response.thing[0].title", {
//     result: "hi",
//     thing: [{ title: "wow" }],
//   }),
// );
// ```
//  */
// export const evaluateOutputMapFunction = (
//   outputMapFunction: string,
//   response: any,
// ) => {
//   /**NB: in nodejs, we can do this:
//    *
//    * ```
//    * mapFunction(response);
//    * ```
//    *
//    * inside the eval.
//    *
//    * the variables outside of eval are available in its scope.
//    *
//    * however, in bun, we can't. seems safer. so we use JSON.stringify.
//    */
//   const result = safeEval(`
// "use strict";
// const mapFunction = (response) => ${outputMapFunction};
// mapFunction(${JSON.stringify(response)});
// `);
//   return result;
// };
// evaluateOutputMapFunction(
//   `{
//     const file = import("fs").then(fs => {
//         const value =fs.readFileSync("/Users/king/os/packages/user-facing/capable-json-schema/src/evaluateOutputMapFunction.ts","utf8");
//         print({value})
//     });
//     return response.thing[0].title
// }`,
//   {
//     result: "hi",
//     thing: [{ title: "wow" }],
//   },
// );
// function Date(n: number) {
//   return [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ][n % 7 || 0];
// }
// function runCodeWithDateFunction(obj: string) {
//   return Function("Date", `"use strict";return (${obj});`)(Date);
// }
// console.log(runCodeWithDateFunction("Date(5)")); // Saturday
// console.log(runCodeWithDateFunction("globalThis")); // Saturday
//# sourceMappingURL=evaluateOutputMapFunction.js.map