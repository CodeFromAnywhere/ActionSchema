import { projectRoot } from "get-path";
import path from "path";

export const getAbsoluteSchemaPath = (projectRelativePath: string) => {
  const absoluteFolderPath = path.join(
    projectRoot,
    path.parse(projectRelativePath).dir,
  );

  const filename = path.parse(projectRelativePath).name;

  return path.join(absoluteFolderPath, `${filename}.schema.json`);
};
