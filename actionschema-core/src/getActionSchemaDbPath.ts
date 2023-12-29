import path from "path";

export const getActionSchemaDbPath = (absoluteFolderPath: string) => {
  const folderName = path.parse(absoluteFolderPath).name;
  return path.join(absoluteFolderPath, `${folderName}.mdb`);
};
