import fs from "node:fs";
import path from "node:path";

export function generateContainer(modelName) {
  const kebabCaseName = modelName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  const className = modelName;
  const containerFileName = `${kebabCaseName}.container.ts`;
  const modulePath = path.join(process.cwd(), "src", "modules", kebabCaseName);

  if (!fs.existsSync(modulePath)) {
    console.error(`Erro: Pasta do módulo ${kebabCaseName} não encontrada.`);
    return;
  }

  const controllerName = `${className}Controller`;
  const repoInterfaceName = `I${className}Repository`; // Usually used in token, or just "Repository"
  // User container uses "UserRepository" string token.

  const repoImplementation = `${className}PrismaRepository`;

  const content = `import { container } from "tsyringe";
import { ${controllerName} } from "@/modules/${kebabCaseName}/${kebabCaseName}.controller";
import { ${repoImplementation} } from "@/infra/database/prisma/${kebabCaseName}.prisma.repository";
import { Create${className}UseCase } from "@/modules/${kebabCaseName}/use-cases/create-${kebabCaseName}";
import { FindAll${className}UseCase } from "@/modules/${kebabCaseName}/use-cases/find-all-${kebabCaseName}";
import { FindById${className}UseCase } from "@/modules/${kebabCaseName}/use-cases/find-by-id-${kebabCaseName}";
import { Update${className}UseCase } from "@/modules/${kebabCaseName}/use-cases/update-${kebabCaseName}";
import { Delete${className}UseCase } from "@/modules/${kebabCaseName}/use-cases/delete-${kebabCaseName}";

// Registra o repositório
container.register("${className}Repository", {
  useClass: ${repoImplementation},
});

// Registra os use cases
container.register("Create${className}UseCase", {
  useClass: Create${className}UseCase,
});

container.register("FindAll${className}UseCase", {
  useClass: FindAll${className}UseCase,
});

container.register("FindById${className}UseCase", {
  useClass: FindById${className}UseCase,
});

container.register("Update${className}UseCase", {
  useClass: Update${className}UseCase,
});

container.register("Delete${className}UseCase", {
  useClass: Delete${className}UseCase,
});

export const ${className.charAt(0).toLowerCase() + className.slice(1)}Controller = container.resolve(${controllerName});
`;

  fs.writeFileSync(path.join(modulePath, containerFileName), content);
  console.log(`Arquivo gerado: ${path.join(modulePath, containerFileName)}`);
}
