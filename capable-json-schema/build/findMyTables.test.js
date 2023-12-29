import { findMyTables } from "./findMyTables.js";
const test = async () => {
    const { tables } = await findMyTables({
        me_personSlug: "guest1",
        relation_personSlug: "root",
    });
    if (!tables) {
        return { isSuccessful: false };
    }
    // tables
    //   .map((x) => path.join(projectRoot, x.projectRelativePath))
    //   .map((absoluteJsonPath) => {
    //     updateSingleNestedJsonFile<JsonArray>(absoluteJsonPath, {
    //       privacy: "public",
    //     });
    //   });
};
test();
//# sourceMappingURL=findMyTables.test.js.map