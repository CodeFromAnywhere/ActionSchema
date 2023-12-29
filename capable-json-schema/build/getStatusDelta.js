import { getSimpleFsAuthorization } from "fs-authorization";
import { get } from "fsorm-lmdb";
import { projectRoot } from "get-path";
import { makeActionSchemaDb } from "fsorm-lmdb";
export const getStatusDelta = async (context) => {
    const { me_personSlug, projectRelativePath } = context;
    if (!me_personSlug || !projectRelativePath || !projectRoot) {
        return { isSuccessful: false, message: "Please login" };
    }
    const me = (await get("Person", { slug: me_personSlug })).result?.[0];
    if (!me) {
        return { isSuccessful: false, message: "Please login..." };
    }
    // ensure we are authorized
    const authorization = await getSimpleFsAuthorization(context);
    if (!authorization.canRead) {
        return { isSuccessful: true, result: [], credit: me.credit || 0 };
    }
    // NB: Reset the data and return what it was
    const db = makeActionSchemaDb(projectRelativePath);
    const delta = db.get("delta");
    await db.put("delta", []);
    return { isSuccessful: true, result: delta, credit: me.credit || 0 };
};
getStatusDelta.config = { isPublic: true };
//# sourceMappingURL=getStatusDelta.js.map