import { create, remove, update } from "fsorm-lmdb";

const migrate = async () => {
  await remove("Group", { slug: "admin" });

  await create("Group", {
    slug: "admin",
    name: "Admin",
    personSlugs: ["guest1", "wijnand"],
  });
};

migrate();
