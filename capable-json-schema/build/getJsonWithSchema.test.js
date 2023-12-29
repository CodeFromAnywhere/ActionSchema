import { getJsonWithSchema } from "./getJsonWithSchema.js";
console.time();
getJsonWithSchema({
    host: "actionschema.com",
    me_personSlug: "guest4",
    projectRelativePath: "memory/persons/guest4/files/football-player-test3/football-player-test3.mdb",
    relation_personSlug: "root",
}).then((result) => {
    console.timeEnd();
});
//# sourceMappingURL=getJsonWithSchema.test.js.map