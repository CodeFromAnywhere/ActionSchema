import { oneByOne } from "one-by-one";
import { findMyTables } from "../findMyTables.js";
import { makeActionSchemaDb } from "fsorm-lmdb";
import { generateActionSchemaId } from "capable-json-schema-js";

const migrateIds = async () => {
  const users = [
    "guest1",
    "guest2",
    "guest3",
    "guest4",
    "guest5",
    "guest6",
    "guest7",
    "guest8",
    "guest9",
    "guest10",
    "guest11",
    "guest12",
    "guest13",
    "guest14",
  ];

  await oneByOne(users, async (username) => {
    const res = await findMyTables({
      me_personSlug: username,
      relation_personSlug: "root",
    });
    if (!res.tables) {
      return;
    }

    await oneByOne(
      res.tables,
      async (table, index) => {
        let db = makeActionSchemaDb(table.projectRelativePath);

        console.log(table.projectRelativePath);
        const allItems = db.getAllItems();

        const ids = allItems.map((x) => x.__actionSchemaId as string);

        const hasAlready = ids[0]?.includes("0000");
        if (hasAlready) {
          console.log("already done: ", { p: table.projectRelativePath });
          await db.db.close();
          return;
        }

        console.log("NOT DONE", table.projectRelativePath);
        const newItems = allItems.map((item, index) => ({
          ...item,
          __actionSchemaId: generateActionSchemaId(0, index),
        }));
        console.log({
          table: table.projectRelativePath,
          ids,
          itemsWithoutId: newItems[0],
        });
        await db.removeItems(ids);
        await db.insertItems(newItems);

        await db.db.close();
      },
      50,
    );
  });
};

migrateIds();
