import path from "path";
export const getActionSchemaDbPath = (absoluteFolderPath) => {
    const folderName = path.parse(absoluteFolderPath).name;
    return path.join(absoluteFolderPath, `${folderName}.mdb`);
};
//# sourceMappingURL=getActionSchemaDbPath.js.map