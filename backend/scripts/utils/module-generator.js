/**
 * Module Folder Generator
 * Creates the module directory structure.
 */

import { getModelNames } from "./shared/naming.js";
import { getModulePaths, ensureDir, dirExists } from "./shared/paths.js";

export function generateModuleFolder(modelName) {
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);

  if (dirExists(paths.module)) {
    console.log(`Folder já existe: ${paths.module}`);
  } else {
    ensureDir(paths.module);
    console.log(`Folder criado: ${paths.module}`);
  }

  if (dirExists(paths.useCases)) {
    console.log(`Folder já existe: ${paths.useCases}`);
  } else {
    ensureDir(paths.useCases);
    console.log(`Folder criado: ${paths.useCases}`);
  }
}
