import { modelConfigs } from "fsorm-sdk";
import { getObjectKeysArray } from "js-util";
import { oneByOne } from "one-by-one";
//import { get } from "fsorm";
import { create, get as newGet } from "fsorm-lmdb";
const migrate = async () => {
    await oneByOne(getObjectKeysArray(modelConfigs), async (modelName) => {
        const already = (await newGet(modelName)).result;
        if (already?.length) {
            return;
        }
        // const { result } = await get(modelName);
        const result = undefined;
        if (!result) {
            return;
        }
        const { insertedIds } = await create(modelName, result);
        console.log(`${modelName}: ${insertedIds.length} inserted`);
    });
    console.log("DONE");
};
migrate();
//# sourceMappingURL=migrateFsorm.test.js.map