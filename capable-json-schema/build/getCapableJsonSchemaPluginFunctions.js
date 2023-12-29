import { swcGet, tryRequireFunctionsWithConfig } from "swc-util";
import { get } from "fsorm-lmdb";
import { notEmpty } from "js-util";
const pluginFunctions = tryRequireFunctionsWithConfig(([name, item]) => !!item.config?.plugin);
export const getCapableJsonSchemaPluginFunctions = async (context) => {
    const functions = await pluginFunctions;
    // console.log(functions?.length);
    if (!functions) {
        return;
    }
    const betaMode = context.me_personSlug
        ? (await get("Person", { slug: context.me_personSlug })).result?.[0]
            ?.betaMode
        : undefined;
    const statements = await swcGet("SwcStatement");
    const swcFunctions = (await Promise.all(functions
        .filter((x) => {
        const productionStatus = x.config?.productionStatus;
        const isPluginAvailable = productionStatus === "alpha"
            ? betaMode === "alpha"
            : productionStatus === "beta"
                ? !!betaMode
                : true;
        return isPluginAvailable;
    })
        .map(async (x) => {
        if (!x.packageCategory || !x.packageName) {
            return;
        }
        const swcFunction = statements?.find((s) => s.packageCategory === x.packageCategory &&
            s.packageName === x.packageName &&
            s.name === x.name);
        return swcFunction;
    }))).filter(notEmpty);
    return swcFunctions;
};
// getCapableJsonSchemaPluginFunctions({
//   me_personSlug: "wijnand",
//   relation_personSlug: "root",
// }).then((x) => console.log(x?.map((x) => x.name)));
getCapableJsonSchemaPluginFunctions.config = {
    isPublic: true,
};
//# sourceMappingURL=getCapableJsonSchemaPluginFunctions.js.map