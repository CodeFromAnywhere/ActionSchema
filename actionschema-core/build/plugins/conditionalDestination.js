import { getSimpleFsAuthorization } from "fs-authorization";
import { fs } from "fs-util";
import { projectRoot } from "get-path";
import path from "path";
import { actionSchemaCreate } from "../crude/actionSchemaCreate.js";
export const conditionalDestination = async (context) => {
    const { row, destinationTableName, previousResult, ...standardContext } = context;
    if (!row) {
        return { isSuccessful: false, message: "Invalid input" };
    }
    if (!standardContext.me_personSlug) {
        return { isSuccessful: false, message: "Please login" };
    }
    const projectRelativePath = `memory/persons/${standardContext.me_personSlug}/files/${destinationTableName}/${destinationTableName}.mdb`;
    const dbPath = path.join(projectRoot, projectRelativePath);
    // find the table
    if (!fs.existsSync(dbPath) ||
        !(await getSimpleFsAuthorization({
            ...standardContext,
            projectRelativePath,
        })).canWrite) {
        return { isSuccessful: false, message: "Table not found", priceCredit: 0 };
    }
    // insert
    const { result: rowIds } = await actionSchemaCreate({
        ...standardContext,
        // NB: overwrite the id to either undefined or an id of the table it is sent to
        items: [{ ...row, __actionSchemaId: previousResult?.id }],
        projectRelativePath,
        shouldExecuteGridEntireRow: false,
        totalPriceCredit: 0,
    });
    const id = rowIds?.[0];
    if (!id) {
        return {
            isSuccessful: true,
            message: "Condition met, insertion failed",
            priceCredit: 0,
        };
    }
    return {
        isSuccessful: true,
        message: "Condition met and inserted",
        priceCredit: 0,
        result: { id },
    };
};
conditionalDestination.config = {
    isPublic: true,
    emoji: "👉",
    categories: ["util"],
    plugin: "column",
    shortDescription: "Send the row to another table if a condition is met",
    productionStatus: "alpha",
};
//# sourceMappingURL=conditionalDestination.js.map