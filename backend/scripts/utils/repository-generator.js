/**
 * Repository Interface Generator
 * Generates repository interfaces for domain layer.
 */

import path from "node:path";
import { getModelNames } from "./shared/naming.js";
import { getModulePaths, writeFile } from "./shared/paths.js";

export function generateRepository(modelName) {
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);

  const content = `import type { ${names.pascal} } from "@/domain/entities/${names.entityFile}";

export interface ${names.repoInterface} {
  create(data: ${names.pascal}): Promise<${names.pascal}>;
  update(data: ${names.pascal}): Promise<${names.pascal}>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<${names.pascal} | null>;
  findAll(): Promise<${names.pascal}[]>;
}
`;

  // Write file
  const filePath = path.join(paths.repositories, `${names.repoFile}.ts`);
  writeFile(filePath, content);
}
