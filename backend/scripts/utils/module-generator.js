import fs from "node:fs";
import path from "node:path";

export function generateModuleFolder(modelName) {
  // Convert module name to kebab-case
  const folderName = modelName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  const modulePath = path.join(process.cwd(), "src", "modules", folderName);

  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
    console.log(`\nFolder criado: ${modulePath}`);
  } else {
    console.log(`\nFolder já existe: ${modulePath}`);
  }

  const useCasesPath = path.join(modulePath, "use-cases");
  if (!fs.existsSync(useCasesPath)) {
    fs.mkdirSync(useCasesPath, { recursive: true });
    console.log(`Folder criado: ${useCasesPath}`);
  } else {
    console.log(`Folder já existe: ${useCasesPath}`);
  }
}
