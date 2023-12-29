import { fs } from "fs-util";
import {
  StandardContext,
  StandardFunctionConfig,
  StandardPluginContext,
  StandardResponse,
} from "function-types";
import { projectRoot } from "get-path";
import { path } from "fs-util";
import { makeActionSchemaDb } from "fsorm-lmdb";
import { getMdbAuthorization } from "../getMdbAuthorization.js";

export type ActionSchemaDeleteResponse = StandardResponse & {
  /** The row ids deleted (if any) */
  removedIds?: string[];
};

export const actionSchemaDelete = async (
  context: StandardContext & {
    projectRelativePath: string;
    rowIds: string[];
  },
): Promise<ActionSchemaDeleteResponse> => {
  const { rowIds, projectRelativePath, ...standardContext } = context;

  if (!projectRoot) {
    return { isSuccessful: false, message: "No root" };
  }
  if (rowIds === undefined || rowIds.length === 0 || !projectRelativePath) {
    return { isSuccessful: false, message: "Invalid inputs" };
  }

  if (!context.me_personSlug) {
    return { isSuccessful: false, message: "Please login" };
  }

  const authorization = await getMdbAuthorization({
    ...standardContext,
    projectRelativePath,
  });

  if (!authorization.canWrite) {
    return { isSuccessful: false, message: "Not authorized" };
  }

  const absolutePath = path.join(projectRoot, projectRelativePath);

  if (!fs.existsSync(absolutePath)) {
    return { isSuccessful: false, message: "File doesn't exist" };
  }

  const db = makeActionSchemaDb(projectRelativePath);
  const removedIds = await db.removeItems(rowIds);

  return { isSuccessful: true, message: "Row(s) deleted", removedIds };
};

actionSchemaDelete.config = { isPublic: true } satisfies StandardFunctionConfig;
