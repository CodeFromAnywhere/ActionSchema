import {
  StandardContext,
  StandardFunctionConfig,
  StandardResponse,
} from "function-types";
import { executeGridPlugin } from "../executeGridPlugin.js";
import { executeGridEntireRow } from "../executeGridEntireRow.js";
import { ModelKey } from "./types.js";

export type ActionSchemaExecuteResponse = StandardResponse & {
  /** Whether or not the schema can be written to */
  canWrite?: boolean;
};

export const actionSchemaExecute = async (
  context: StandardContext & {
    projectRelativePath: string;
    rowIds: string[];
    mode: "recalculate" | "only-empty";
    /** A single property calculation is done for the specified key */
    propertyKey?: ModelKey;
    /**
     * NB: sometimes needed in case we rely on this result
     */
    waitForResult?: boolean;
  },
): Promise<ActionSchemaExecuteResponse> => {
  if (context.propertyKey !== undefined) {
    return executeGridPlugin(context);
  }

  return executeGridEntireRow(context);
};

actionSchemaExecute.config = {
  isPublic: true,
} satisfies StandardFunctionConfig;
