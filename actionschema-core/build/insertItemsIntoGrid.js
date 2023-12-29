import { projectRoot } from "get-path";
import { addSchemaColumns } from "./addSchemaColumns.js";
import { executeGridEntireRow } from "./executeGridEntireRow.js";
import { makeActionSchemaDb } from "fsorm-lmdb";
export const insertItemsIntoGrid = async (standardContext, 
/** NB: if items in this array contain `__actionSchemaId` it will be overwriting that id  */
result, projectRelativePath, shouldExecuteGridEntireRow, totalPriceCredit) => {
    console.log("handleRowExecutionResult", { result });
    if (!projectRoot || !result) {
        return {
            isSuccessful: false,
            message: "Executed but no result",
            functionResult: result,
        };
    }
    if (!Array.isArray(result) || result.length === 0) {
        return {
            isSuccessful: false,
            message: "Result must be an array to be a source",
        };
    }
    //NB: if the first item of the array is an object (not an array), its good, otherwise, we need to make them objects to put in the table...
    const realArray = typeof result[0] === "object" && !Array.isArray(result[0])
        ? result
        : result.map((item) => ({ item }));
    const firstItem = realArray[0];
    await addSchemaColumns(firstItem, projectRelativePath);
    // Save to the file!
    const db = makeActionSchemaDb(projectRelativePath);
    const firstKey = Object.keys(firstItem)[0];
    if (totalPriceCredit) {
        await db.addSpending(firstKey, realArray.length, totalPriceCredit);
    }
    const rowIds = await db.insertItems(realArray);
    console.log({ realArray, rowIds });
    await db.put("rowGenerationStatus", undefined);
    if (shouldExecuteGridEntireRow) {
        // also execute the entire row (only empty columns)
        await executeGridEntireRow({
            ...standardContext,
            projectRelativePath,
            rowIds,
            mode: "only-empty",
        });
    }
    return {
        isSuccessful: true,
        message: "Done",
        rowIds,
    };
};
//# sourceMappingURL=insertItemsIntoGrid.js.map