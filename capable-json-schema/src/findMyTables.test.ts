import { projectRoot } from "get-path";
import { findMyTables } from "./findMyTables.js";
import path from "path";
import { updateSingleNestedJsonFile } from "edit-json-file";
import { JsonArray } from "capable-json-schema-js";

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
