import { fs, path, writeJsonToFile } from "fs-util";
import { get } from "fsorm-lmdb";
import { projectRoot } from "get-path";
import { objectMapSync } from "js-util";
import { oneByOne } from "one-by-one";
import { readJsonFile } from "read-json-file";
const updateCreationPlugin = (url) => (x) => {
    if (!x.$openapi) {
        return x;
    }
    const $openapi = {
        ...x.$openapi,
        url,
    };
    return { ...x, $openapi };
};
const migrateActionSchemaUrls = async () => {
    // Migrate all existing `persons/[x]/files/[y]/y.schema.json` so all plugins point to `api.actionschema.com/openapi.json` or `localhost:42000/openapi.json`
    const personSlugs = (await get("Person")).result?.map((x) => x.slug) || [];
    const projectSchemaPaths = personSlugs
        .map((slug) => {
        const filesFolder = path.join(projectRoot, "memory", "persons", slug, "files");
        if (!fs.existsSync(filesFolder)) {
            return [];
        }
        const projectSchemaPaths = fs
            .readdirSync(filesFolder)
            .map((name) => path.join(filesFolder, name, `${name}.schema.json`))
            .filter((p) => fs.existsSync(p));
        return projectSchemaPaths;
    })
        .flat();
    // for each project, go into the schema and update the $openapi
    oneByOne(projectSchemaPaths, async (p, i) => {
        console.log(`${i + 1}/${projectSchemaPaths.length}`);
        const schema = await readJsonFile(p);
        if (!schema ||
            !schema.properties ||
            !schema.properties.items ||
            !schema.properties.items.items) {
            return;
        }
        const url = !!argument
            ? "http://api.actionschema.com/openapi.json"
            : "http://localhost:42000/openapi.json";
        schema.properties.items.creationPlugins =
            schema.properties.items.creationPlugins?.map(updateCreationPlugin(url));
        schema.properties.items.items.properties = objectMapSync(schema.properties.items.items.properties, (key, value) => {
            const newCreationPlugins = value.creationPlugins?.map(updateCreationPlugin(url));
            return { ...value, creationPlugins: newCreationPlugins };
        });
        // if there, ensure to replace openapi of all of them
        await writeJsonToFile(p, schema);
        // console.dir({ schema }, { depth: 99 });
    });
};
const [argument] = process.argv.slice(2);
migrateActionSchemaUrls();
//# sourceMappingURL=migrateActionSchemaUrls.test.js.map