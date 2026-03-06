/**
 * Use Cases Generator
 * Generates findAll use case class.
 */

import path from "node:path";
import { getModelNames, toCamelCase } from "./shared/naming.js";
import { getModulePaths, writeFile, ensureDir } from "./shared/paths.js";

export function generateUseCases(modelName) {
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);
  const repoVar = `${toCamelCase(modelName)}Repository`;

  ensureDir(paths.useCases);

  // Find All Use Case
  const findAllContent = `import type { ${names.repoInterface} } from "@/domain/repositories/${names.repoFile}";
import { inject, injectable } from "tsyringe";

@injectable()
export class ${names.findAllUseCase} {
  constructor(
    @inject("${names.repoToken}")
    private readonly ${repoVar}: ${names.repoInterface},
  ) {}

  async execute() {
    return await this.${repoVar}.findAll();
  }
}
`;
  writeFile(
    path.join(paths.useCases, `find-all-${names.kebab}.ts`),
    findAllContent,
  );
}
