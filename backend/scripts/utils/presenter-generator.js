/**
 * Presenter Generator
 * Generates HTTP response transformers.
 */

import path from "node:path";
import { getModelNames } from "./shared/naming.js";
import { getModulePaths, writeFile } from "./shared/paths.js";

export function generatePresenter(modelName) {
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);

  const content = `import type { ${names.pascal} } from "@/domain/entities/${names.entityFile}";
import type { ${names.responseDto} } from "./${names.dtoFile}";

export function ${names.presenterFn}(entity: ${names.pascal}): ${names.responseDto} {
  return {
    id: entity.id,
  };
}
`;

  // Write file
  const filePath = path.join(paths.module, `${names.presenterFile}.ts`);
  writeFile(filePath, content);
}
