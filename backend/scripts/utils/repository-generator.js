/**
 * Repository Interface Generator
 * Generates repository interface for domain layer with findAll only.
 */

import path from "node:path";
import { getModelNames } from "./shared/naming.js";
import { getModulePaths, writeFile } from "./shared/paths.js";

export function generateRepository(modelName) {
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);

  const content = `import type { ${names.pascal} } from "@/domain/entities/${names.entityFile}";

export interface ${names.repoInterface} {
  findAll(): Promise<${names.pascal}[]>;
}
`;

  // Write file
  const filePath = path.join(paths.repositories, `${names.repoFile}.ts`);
  writeFile(filePath, content);
}
