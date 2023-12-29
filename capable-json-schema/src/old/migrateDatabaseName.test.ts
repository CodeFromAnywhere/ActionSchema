import { get } from "fsorm-lmdb";
import { path } from "fs-util";
import fs from "fs";
import { projectRoot } from "get-path";

const migrateDatabaseNames = async () => {
  const personSlugs = (await get("Person")).result
    ?.filter((x) =>
      fs.existsSync(path.join(projectRoot, "memory/persons", x.slug, "files")),
    )
    .map((x) => {
      const absoluteFilesPath = path.join(
        projectRoot,
        "memory/persons",
        x.slug,
        "files",
      );

      const filenames = fs.readdirSync(absoluteFilesPath, {
        encoding: "utf8",
      });

      filenames.forEach((filename) => {
        const oldName = path.join(absoluteFilesPath, filename, `data.mdb`);
        const newName = path.join(
          absoluteFilesPath,
          filename,
          `${filename}.mdb`,
        );
        if (fs.existsSync(oldName)) {
          fs.renameSync(oldName, newName);
        }
        const oldLockName = path.join(
          absoluteFilesPath,
          filename,
          `data.lock.mdb`,
        );
        const newLockName = path.join(
          absoluteFilesPath,
          filename,
          `${filename}.lock.mdb`,
        );

        if (fs.existsSync(oldLockName)) {
          fs.renameSync(oldLockName, newLockName);
        }
      });

      return filenames.length;
    });

  return personSlugs;
};

migrateDatabaseNames().then(console.log);
