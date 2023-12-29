import { fs } from "fs-util";
import { copyTableIntoSpace } from "../copyTableIntoSpace.js";
import { findMyTablesOld } from "./findMyTablesOld.js";
import { getJsonWithSchemaOld } from "./getJsonWithSchemaOld.js";
import path from "path";
import { projectRoot } from "get-path";
const migrate = async () => {
    const users = ["guest1", "guest3", "guest4"];
    users.map(async (username) => {
        const res = await findMyTablesOld({
            me_personSlug: username,
            relation_personSlug: "root",
        });
        console.log(username, { res });
        res?.tables?.map(async (table) => {
            const { json, schema } = await getJsonWithSchemaOld({
                me_personSlug: username,
                relation_personSlug: "root",
                projectRelativePath: table.projectRelativePath,
            });
            const name = path.parse(table.projectRelativePath).name;
            const { isSuccessful } = await copyTableIntoSpace({
                me_personSlug: username,
                relation_personSlug: "root",
                name,
                json,
                schema,
            });
            if (isSuccessful) {
                const folderPath = path.parse(path.join(projectRoot, table.projectRelativePath)).dir;
                await fs.rm(folderPath, { recursive: true });
            }
        });
    });
};
migrate();
//# sourceMappingURL=migration.test.js.map