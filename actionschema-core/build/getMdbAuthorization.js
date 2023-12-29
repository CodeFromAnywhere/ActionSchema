import { getPerson } from "person-util";
import { getExplorableBasePaths } from "fs-authorization";
import { projectRoot } from "get-path";
import { makeActionSchemaDb } from "fsorm-lmdb";
import { get } from "fsorm-lmdb";
export const getMdbAuthorization = async (context) => {
    // 2) get the `projectRelativeFolderPath`
    const { projectRelativePath, isDebug, me_personSlug } = context;
    if (!projectRoot || !projectRelativePath) {
        return { canRead: false, canWrite: false };
    }
    const { person } = await getPerson(context);
    // NB: Should be attached in functionContext for any logged in user.
    const isAdmin = !me_personSlug
        ? false
        : (await get("Group", { slug: "admin" })).result?.[0]?.personSlugs?.includes(me_personSlug);
    if (isAdmin) {
        return { canRead: true, canWrite: true };
    }
    // 1) Get the paths that this user can r/w
    const projectRelativeBasePathArray = await getExplorableBasePaths(context);
    // NB: Find the basefolder path that is applicable
    const projectRelativeBaseFolderPath = projectRelativeBasePathArray.find((p) => 
    // NB: the "/" is super important to ensure it's the end of the folder
    projectRelativePath === p.projectRelativePath ||
        projectRelativePath.startsWith(p.projectRelativePath + "/"))?.projectRelativePath || "";
    if (!projectRelativeBaseFolderPath) {
        // it's not in our base folder, so only if we specify privacy in the object
        // if privacy is public/unlisted, canRead is true
        const db = projectRelativePath.endsWith(".mdb")
            ? makeActionSchemaDb(projectRelativePath)
            : undefined;
        const privacy = db?.get("privacy");
        const canRead = privacy === "unlisted" || privacy === "public";
        return { canRead, canWrite: false };
    }
    // if (!projectRelativeBaseFolderPath) {
    //   return { canRead: false, canWrite: false };
    // }
    const isPersonOrGroupFile = (projectRelativePath.startsWith("memory/persons/") &&
        projectRelativePath.endsWith("/person.json")) ||
        (projectRelativePath.startsWith("memory/groups/") &&
            projectRelativePath.endsWith("/group.json"));
    return { canRead: true, canWrite: !isPersonOrGroupFile };
};
getMdbAuthorization.config = {
    isPublic: true,
};
//# sourceMappingURL=getMdbAuthorization.js.map