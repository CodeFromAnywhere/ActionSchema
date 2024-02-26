import { tokenize, buildPath } from "./dot-wild.js";
/** Go up one level or replace it*/
export const getDotLocationBase = (dotLocation, replaceDotLocation) => {
    const tokenized = tokenize(dotLocation);
    tokenized.pop();
    const final = replaceDotLocation
        ? tokenized.concat(tokenize(replaceDotLocation))
        : tokenized;
    return buildPath(final);
    // const chunks = dotLocation.split(".");
    // chunks.pop();
    // const dotLocationBase = chunks.join(".");
    // return replace ? `${dotLocationBase}.${replace}` : dotLocationBase;
};
//# sourceMappingURL=getDotlocationBase.js.map