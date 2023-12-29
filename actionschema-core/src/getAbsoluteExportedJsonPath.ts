import { projectRoot } from "get-path";
import path from "path";

export const getAbsoluteExportedJsonPath = (projectRelativePath: string) => {
  const absoluteFolderPath = path.join(
    projectRoot,
    path.parse(projectRelativePath).dir,
  );

  const projectFolderName = path.parse(absoluteFolderPath).base;

  return path.join(absoluteFolderPath, `${projectFolderName}.json`);
};
