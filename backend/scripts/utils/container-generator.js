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
import { ${names.createUseCase} } from "@/modules/${names.kebab}/use-cases/create-${names.kebab}";
import { ${names.findAllUseCase} } from "@/modules/${names.kebab}/use-cases/find-all-${names.kebab}";
import { ${names.findByIdUseCase} } from "@/modules/${names.kebab}/use-cases/find-by-id-${names.kebab}";
import { ${names.updateUseCase} } from "@/modules/${names.kebab}/use-cases/update-${names.kebab}";
import { ${names.deleteUseCase} } from "@/modules/${names.kebab}/use-cases/delete-${names.kebab}";

// Registra o repositório
container.register("${names.repoToken}", {
  useClass: ${names.repoClass},
});

// Registra os use cases
container.register("${names.createUseCaseToken}", {
  useClass: ${names.createUseCase},
});

container.register("${names.findAllUseCaseToken}", {
  useClass: ${names.findAllUseCase},
});

container.register("${names.findByIdUseCaseToken}", {
  useClass: ${names.findByIdUseCase},
});

container.register("${names.updateUseCaseToken}", {
  useClass: ${names.updateUseCase},
});

container.register("${names.deleteUseCaseToken}", {
  useClass: ${names.deleteUseCase},
});

export const ${controllerVar} = container.resolve(${names.controllerClass});
`;

  // Write file
  const filePath = path.join(paths.module, `${names.containerFile}.ts`);
  writeFile(filePath, content);
}
