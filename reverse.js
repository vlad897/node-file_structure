import fs from "node:fs/promises";
import path from "node:path";

const createFSJsonStructure = async (rootFolderPath) => {
  let jsonContent = {
    name: path.basename(rootFolderPath),
    type: "folder",
    children: [],
  };

  const createJSON = async (currentPath, currentChildrenArray) => {
    const children = await fs.readdir(currentPath);
    for (let i = 0; i < children.length; i++) {
      const childPath = path.resolve(currentPath, children[i]);
      const stat = await fs.stat(childPath);

      if (stat.isDirectory()) {
        currentChildrenArray.push({
          name: children[i],
          type: "folder",
          children: [],
        });
        await createJSON(childPath, currentChildrenArray[currentChildrenArray.length - 1].children);
      } else {
        const data = await fs.readFile(childPath, "utf-8");
        currentChildrenArray.push({
          name: children[i],
          type: "file",
          content: data,
        });
      }
    }
  };

  await createJSON(rootFolderPath, jsonContent.children);
  await fs.writeFile(path.resolve("file-structure.json"), JSON.stringify(jsonContent));
};

createFSJsonStructure(path.resolve("homeworks"));
