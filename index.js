import fs from "node:fs/promises";
import path from "node:path";

const pathOfStrucutureFile = path.resolve("file-structure.json");
const fileStructure = await fs.readFile(pathOfStrucutureFile).then((data) => JSON.parse(data.toString("utf-8")));

const createFilesAndFolders = async (structure, currentPath) => {
  const theCurrentFolderPath = path.join(currentPath, structure.name);
  await fs.mkdir(theCurrentFolderPath);

  for (let i = 0; i < structure.children.length; i++) {
    if (structure.children[i].type === "folder") {
      createFilesAndFolders(structure.children[i], path.join(theCurrentFolderPath));
    } else {
      await fs.writeFile(path.join(theCurrentFolderPath, structure.children[i].name), structure.children[i].content);
    }
  }
};

createFilesAndFolders(fileStructure, path.resolve());
