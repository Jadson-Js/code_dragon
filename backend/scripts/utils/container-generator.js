/**
 * Container Generator
 * Generates dependency injection container configuration.
 */

import path from "node:path";
import { getModelNames, toCamelCase } from "./shared/naming.js";
import { getModulePaths, writeFile } from "./shared/paths.js";

export function generateContainer(modelName) {
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);
  const controllerVar = `${toCamelCase(modelName)}Controller`;

  const content = `import { container } from "tsyringe";
import { ${names.controllerClass} } from "@/modules/${names.kebab}/${names.controllerFile}";
import { ${names.repoClass} } from "@/infra/database/prisma/${names.prismaRepoFile}";
import { ${names.findAllUseCase} } from "@/modules/${names.kebab}/use-cases/find-all-${names.kebab}";

// Registra o repositório
container.register("${names.repoToken}", {
  useClass: ${names.repoClass},
});

// Registra os use cases
container.register("${names.findAllUseCaseToken}", {
  useClass: ${names.findAllUseCase},
});

export const ${controllerVar} = container.resolve(${names.controllerClass});
`;

  // Write file
  const filePath = path.join(paths.module, `${names.containerFile}.ts`);
  writeFile(filePath, content);
}
