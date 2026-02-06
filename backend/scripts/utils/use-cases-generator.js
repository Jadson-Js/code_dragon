/**
 * Use Cases Generator
 * Generates CRUD use case classes.
 */

import path from "node:path";
import { getModelNames, toCamelCase } from "./shared/naming.js";
import { getModulePaths, writeFile, ensureDir } from "./shared/paths.js";

export function generateUseCases(modelName) {
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);
  const repoVar = `${toCamelCase(modelName)}Repository`;

  ensureDir(paths.useCases);

  // Create Use Case
  const createContent = `import { ${names.pascal} } from "@/domain/entities/${names.entityFile}";
import type { ${names.repoInterface} } from "@/domain/repositories/${names.repoFile}";
import type { ${names.createDto} } from "@/modules/${names.kebab}/${names.dtoFile}";
import { inject, injectable } from "tsyringe";

@injectable()
export class ${names.createUseCase} {
  constructor(
    @inject("${names.repoToken}")
    private readonly ${repoVar}: ${names.repoInterface},
  ) {}

  async execute(params: ${names.createDto}) {
    const ${toCamelCase(modelName)} = ${names.pascal}.create(params);
    const response = await this.${repoVar}.create(${toCamelCase(modelName)});
    return response;
  }
}
`;
  writeFile(
    path.join(paths.useCases, `create-${names.kebab}.ts`),
    createContent,
  );

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

  // Find By Id Use Case
  const findByIdContent = `import type { ${names.repoInterface} } from "@/domain/repositories/${names.repoFile}";
import { inject, injectable } from "tsyringe";

@injectable()
export class ${names.findByIdUseCase} {
  constructor(
    @inject("${names.repoToken}")
    private readonly ${repoVar}: ${names.repoInterface},
  ) {}

  async execute(id: string) {
    return await this.${repoVar}.findById(id);
  }
}
`;
  writeFile(
    path.join(paths.useCases, `find-by-id-${names.kebab}.ts`),
    findByIdContent,
  );

  // Update Use Case
  const updateContent = `import { ${names.pascal} } from "@/domain/entities/${names.entityFile}";
import type { ${names.repoInterface} } from "@/domain/repositories/${names.repoFile}";
import type { ${names.createDto} } from "@/modules/${names.kebab}/${names.dtoFile}";
import { inject, injectable } from "tsyringe";

@injectable()
export class ${names.updateUseCase} {
  constructor(
    @inject("${names.repoToken}")
    private readonly ${repoVar}: ${names.repoInterface},
  ) {}

  async execute(params: ${names.createDto} & { id: string }) {
    const ${toCamelCase(modelName)} = ${names.pascal}.create(params);
    const response = await this.${repoVar}.update(${toCamelCase(modelName)});
    return response;
  }
}
`;
  writeFile(
    path.join(paths.useCases, `update-${names.kebab}.ts`),
    updateContent,
  );

  // Delete Use Case
  const deleteContent = `import type { ${names.repoInterface} } from "@/domain/repositories/${names.repoFile}";
import { inject, injectable } from "tsyringe";

@injectable()
export class ${names.deleteUseCase} {
  constructor(
    @inject("${names.repoToken}")
    private readonly ${repoVar}: ${names.repoInterface},
  ) {}

  async execute(id: string) {
    return await this.${repoVar}.delete(id);
  }
}
`;
  writeFile(
    path.join(paths.useCases, `delete-${names.kebab}.ts`),
    deleteContent,
  );
}
