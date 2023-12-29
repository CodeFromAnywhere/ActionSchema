import { executeGridPlugin } from "../executeGridPlugin.js";
import { executeGridEntireRow } from "../executeGridEntireRow.js";
export const actionSchemaExecute = async (context) => {
    if (context.propertyKey !== undefined) {
        return executeGridPlugin(context);
    }
    return executeGridEntireRow(context);
};
actionSchemaExecute.config = {
    isPublic: true,
};
//# sourceMappingURL=actionSchemaExecute.js.map