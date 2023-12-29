import { getCapableJsonSchemaProperties, } from "capable-json-schema-js";
import { projectRoot } from "get-path";
import { executeGridEntireRowRecursive } from "./executeGridEntireRowRecursive.js";
import { mergeObjectsArray, sum } from "js-util";
import { isExecuteRequired } from "capable-json-schema-js";
import { makeActionSchemaDb } from "fsorm-lmdb";
import { getSchema } from "./getSchema.js";
import { get } from "fsorm-lmdb";
export const executeGridEntireRow = async (context) => {
    const { projectRelativePath, mode, rowIds, ...standardContext } = context;
    // console.log("Landed in entire row for ", rowIndexes);
    if (!standardContext.me_personSlug) {
        return {
            isSuccessful: false,
            message: "Please login",
        };
    }
    if (!rowIds || !projectRelativePath || !mode) {
        return {
            isSuccessful: false,
            message: "Invalid input",
        };
    }
    // get json and schema
    const { schema, ...result } = await getSchema({
        ...standardContext,
        projectRelativePath,
    });
    if (!result.isSuccessful || !schema || !projectRoot) {
        return result;
    }
    // console.log("Good so far");
    const properties = getCapableJsonSchemaProperties(schema);
    if (!properties) {
        return { isSuccessful: false, message: "No properties" };
    }
    const db = makeActionSchemaDb(projectRelativePath);
    // NB: Estimate spending. not really needed but it will at least withould some stuff from executing beforehand
    const spending = db.get("columnSpending");
    const spendingTotal = spending
        ? sum(Object.values(spending).map((x) => x.priceCreditSinceLastEdit && x.calculationsAmountSinceLastEdit
            ? x.priceCreditSinceLastEdit / x.calculationsAmountSinceLastEdit
            : (x.priceCredit || 0) / (x.calculationsAmount || 1))) * rowIds.length
        : 0;
    const meCredit = (await get("Person", { slug: standardContext.me_personSlug })).result?.[0]
        ?.credit || 0;
    if (meCredit < spendingTotal) {
        return {
            isSuccessful: false,
            message: `It seems you don't have enough credit. Please ensure there's at least €${spendingTotal.toFixed(2)} in your account`,
        };
    }
    ///////////SET THE STATUS////////
    const propertyKeysWithPlugin = Object.keys(properties).filter((x) => !!properties[x].creationPlugins?.[0]);
    const status = mergeObjectsArray(rowIds.map((id) => {
        return {
            [id]: mergeObjectsArray(propertyKeysWithPlugin
                .filter((propertyKey) => {
                const row = db.getItem(id);
                const firstPlugin = properties[propertyKey].creationPlugins?.[0];
                return isExecuteRequired(row, propertyKey, mode, firstPlugin?.propertyDependencies, false, firstPlugin?.condition);
            })
                .map((key) => ({
                [key]: "queued",
            }))),
        };
    }));
    console.log({ queuedStatus: status });
    await db.put("status", status);
    //////////////////////////////
    const resultPromises = rowIds.map(async (id) => {
        console.log("start", { id });
        const priceCredit = await executeGridEntireRowRecursive(
        // NB: very important, doing each row independently, will make it faster for some rows
        { ...context, rowIds: [id] }, properties, [], []);
        console.log("end", { id, priceCredit });
        return priceCredit;
    });
    // NB: this we don't wait for.
    // NB: Let's just deduct credit in the cell for now
    //   Promise.all(resultPromises).then(async (priceCreditArray) => {
    //     const totalPriceCredit = sum(priceCreditArray);
    //     await deductCredit(standardContext.me_personSlug, totalPriceCredit);
    //   });
    return { isSuccessful: true, message: "Started" };
};
executeGridEntireRow.config = {
    isPublic: true,
    priceCredit: 0,
};
//# sourceMappingURL=executeGridEntireRow.js.map