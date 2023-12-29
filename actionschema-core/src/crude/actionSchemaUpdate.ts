import { getSimpleFsAuthorization } from "fs-authorization";
import { fs } from "fs-util";
import { StandardContext, StandardFunctionConfig } from "function-types";
import { projectRoot } from "get-path";
import { Json } from "model-types";
import path from "path";
import { makeActionSchemaDb } from "fsorm-lmdb";
import { ModelItemPartial } from "./types.js";

export type ActionSchemaUpdateResponse = {
  isSuccessful: boolean;
  message: string;
};

/**
 *
 */
export const actionSchemaUpdate = async (
  context: StandardContext & {
    projectRelativePath: string;
    /** The id (indexed key) of the item to update */
    id: string;
    /** New (partial) value of the item. Will update all keys provided here. Please note that it cannot be set to 'undefined', but "null" is possible.  */
    partialItem: ModelItemPartial;
  },
): Promise<ActionSchemaUpdateResponse> => {
  const { id, projectRelativePath, partialItem, ...standardContext } = context;

  if (!projectRoot) {
    return { isSuccessful: false, message: "No root" };
  }
  if (id === undefined || !projectRelativePath || !partialItem) {
    return { isSuccessful: false, message: "Invalid inputs" };
  }

  if (!context.me_personSlug) {
    return { isSuccessful: false, message: "Please login" };
  }

  const authorization = await getSimpleFsAuthorization({
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

  await db.updateItem(id, partialItem);

  return { isSuccessful: true, message: "Updated" };
};

actionSchemaUpdate.config = { isPublic: true } satisfies StandardFunctionConfig;
