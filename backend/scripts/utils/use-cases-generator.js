import fs from "node:fs";
import path from "node:path";

export function generateUseCases(modelName, modelDefinition) {
  const kebabCaseName = modelName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
  const className = modelName;
  const modulePath = path.join(process.cwd(), "src", "modules", kebabCaseName);
  const useCasesPath = path.join(modulePath, "use-cases");

  if (!fs.existsSync(useCasesPath)) {
    fs.mkdirSync(useCasesPath, { recursive: true });
  }

  const repoToken = `${className}Repository`; // Token used in container
  const repoInterface = `I${className}Repository`;
  const repoImportPath = `../../../../domain/repositories/${kebabCaseName}.repository`; // Relative path from use-cases

  // 1. Create Use Case
  const createFileName = `create-${kebabCaseName}.ts`;
  const createContent = `import { ${className} } from "@/domain/entities/${kebabCaseName}.entity";
import type { ${repoInterface} } from "@/domain/repositories/${kebabCaseName}.repository";
import type { Create${className}DTO } from "@/modules/${kebabCaseName}/${kebabCaseName}.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class Create${className}UseCase {
  constructor(
    @inject("${repoToken}")
    private readonly ${kebabCaseName}Repository: ${repoInterface},
  ) {}

  async execute(params: Create${className}DTO) {
    const ${className.toLowerCase()} = ${className}.create(params);
    const response = await this.${kebabCaseName}Repository.create(${className.toLowerCase()});
    return response;
  }
}
`;
  fs.writeFileSync(path.join(useCasesPath, createFileName), createContent);
  console.log(`Arquivo gerado: ${path.join(useCasesPath, createFileName)}`);

  // 2. Find All Use Case
  const findAllFileName = `find-all-${kebabCaseName}.ts`;
  const findAllContent = `import type { ${repoInterface} } from "@/domain/repositories/${kebabCaseName}.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindAll${className}UseCase {
  constructor(
    @inject("${repoToken}")
    private readonly ${kebabCaseName}Repository: ${repoInterface},
  ) {}

  async execute() {
    return await this.${kebabCaseName}Repository.findAll();
  }
}
`;
  fs.writeFileSync(path.join(useCasesPath, findAllFileName), findAllContent);
  console.log(`Arquivo gerado: ${path.join(useCasesPath, findAllFileName)}`);

  // 3. Find By Id Use Case
  const findByIdFileName = `find-by-id-${kebabCaseName}.ts`;
  const findByIdContent = `import type { ${repoInterface} } from "@/domain/repositories/${kebabCaseName}.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindById${className}UseCase {
  constructor(
    @inject("${repoToken}")
    private readonly ${kebabCaseName}Repository: ${repoInterface},
  ) {}

  async execute(id: string) {
    return await this.${kebabCaseName}Repository.findById(id);
  }
}
`;
  fs.writeFileSync(path.join(useCasesPath, findByIdFileName), findByIdContent);
  console.log(`Arquivo gerado: ${path.join(useCasesPath, findByIdFileName)}`);

  // 4. Update Use Case
  const updateFileName = `update-${kebabCaseName}.ts`;
  // Assuming a generic approach for update where we pass partial data and ID
  // Since we don't have a specific UpdateDTO yet, we'll use CreateDTO & { id: string } or just 'any' for safety
  // But using CreateDTO is better if we assume it covers most fields.
  // Actually, entity.create(params) creates a NEW entity.
  // Ideally: Retrieve -> Update Props -> Save.
  // Here we will simplistically assume we can create a new entity with the ID and save it (replace).
  // Or assuming the repository 'update' method implementation handles partial updates?
  // Our generated Prisma Repo uses `prisma.update({ data: mapper(user) })`.
  // `mapper` turns Entity into DB object. Entity must be complete.
  // So we need to reconstruct the entity.
  // We'll trust the user has to handle logic details, we provide the scaffold.
  const updateContent = `import { ${className} } from "@/domain/entities/${kebabCaseName}.entity";
import type { ${repoInterface} } from "@/domain/repositories/${kebabCaseName}.repository";
import type { Create${className}DTO } from "@/modules/${kebabCaseName}/${kebabCaseName}.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class Update${className}UseCase {
  constructor(
    @inject("${repoToken}")
    private readonly ${kebabCaseName}Repository: ${repoInterface},
  ) {}

  async execute(params: Create${className}DTO & { id: string }) {
    // This is a simplified update that assumes we can recreate the entity
    // In a real app, you might want to fetch, change, and save.
    const ${className.toLowerCase()} = ${className}.create(params);
    // Be careful, 'create' might generate a new ID if not handled, but our entity static create usually takes props.
    // The generated Entity 'create' static method usually assigns props. If 'id' is in props it uses it?
    // Let's check generated Entity... it puts "props.id" (if optional/default) into the instance.
    // So passing { id: ..., ...props } should technically work if the Entity respects it.
    
    // For now we assume this works as a scaffold.
    const response = await this.${kebabCaseName}Repository.update(${className.toLowerCase()});
    return response;
  }
}
`;
  fs.writeFileSync(path.join(useCasesPath, updateFileName), updateContent);
  console.log(`Arquivo gerado: ${path.join(useCasesPath, updateFileName)}`);

  // 5. Delete Use Case
  const deleteFileName = `delete-${kebabCaseName}.ts`;
  const deleteContent = `import type { ${repoInterface} } from "@/domain/repositories/${kebabCaseName}.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class Delete${className}UseCase {
  constructor(
    @inject("${repoToken}")
    private readonly ${kebabCaseName}Repository: ${repoInterface},
  ) {}

  async execute(id: string) {
    return await this.${kebabCaseName}Repository.delete(id);
  }
}
`;
  fs.writeFileSync(path.join(useCasesPath, deleteFileName), deleteContent);
  console.log(`Arquivo gerado: ${path.join(useCasesPath, deleteFileName)}`);
}
