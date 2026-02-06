import fs from "node:fs";
import path from "node:path";

function parseModel(modelDefinition) {
  // Reuse simplified parsing just for field names if needed for create payload
  // Or just use request.body
  const lines = modelDefinition.split("\n");
  const fields = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("model") ||
      trimmed.startsWith("}") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("@@")
    )
      continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) continue;
    fields.push({ name: parts[0] });
  }
  return fields;
}

export function generateController(modelName, modelDefinition) {
  const kebabCaseName = modelName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
  const className = modelName;
  const controllerFileName = `${kebabCaseName}.controller.ts`;
  const modulePath = path.join(process.cwd(), "src", "modules", kebabCaseName);

  if (!fs.existsSync(modulePath)) {
    console.error(`Erro: Pasta do módulo ${kebabCaseName} não encontrada.`);
    return;
  }

  const controllerName = `${className}Controller`;
  const presenterImport = `${modelName.charAt(0).toLowerCase() + modelName.slice(1)}ToHTTP`;

  let content = `import { ${presenterImport} } from "./${kebabCaseName}.presenter";
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { Create${className}UseCase } from "./use-cases/create-${kebabCaseName}";
// import type { FindAll${className}UseCase } from "./use-cases/find-all-${kebabCaseName}";
// import type { FindById${className}UseCase } from "./use-cases/find-by-id-${kebabCaseName}";
// import type { Update${className}UseCase } from "./use-cases/update-${kebabCaseName}";
// import type { Delete${className}UseCase } from "./use-cases/delete-${kebabCaseName}";

// Note: Uncomment other use-cases as they are implemented

@injectable()
export class ${controllerName} {
  constructor(
    @inject("Create${className}UseCase")
    private readonly create${className}UseCase: Create${className}UseCase,

    // @inject("FindAll${className}UseCase")
    // private readonly findAll${className}UseCase: FindAll${className}UseCase,

    // @inject("FindById${className}UseCase")
    // private readonly findById${className}UseCase: FindById${className}UseCase,

    // @inject("Update${className}UseCase")
    // private readonly update${className}UseCase: Update${className}UseCase,

    // @inject("Delete${className}UseCase")
    // private readonly delete${className}UseCase: Delete${className}UseCase,
  ) {}

  async create(request: Request, response: Response) {
    const body = request.body; 
    const result = await this.create${className}UseCase.execute(body);
    const httpResponse = ${presenterImport}(result);
    return response.status(201).json(httpResponse);
  }

  async findAll(request: Request, response: Response) {
    // const result = await this.findAll${className}UseCase.execute();
    // const httpResponse = result.map(${presenterImport});
    // return response.status(200).json(httpResponse);
    return response.status(200).json({ message: "Not implemented yet" });
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;
    // const result = await this.findById${className}UseCase.execute(id);
    // if (!result) return response.status(404).send();
    // const httpResponse = ${presenterImport}(result);
    // return response.status(200).json(httpResponse);
    return response.status(200).json({ message: "Not implemented yet", id });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const body = request.body;
    // const result = await this.update${className}UseCase.execute({ id, ...body });
    // const httpResponse = ${presenterImport}(result);
    // return response.status(200).json(httpResponse);
    return response.status(200).json({ message: "Not implemented yet", id });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    // await this.delete${className}UseCase.execute(id);
    return response.status(204).send();
  }
}
`;
  // I must be careful. If I uncomment UseCases that don't exist, the project won't build.
  // The user demanded "I don't want anything commented".
  // PROCEED WITH CAUTION: If I generate imports for non-existent files, code breaks.
  // I will generate the IMPORTS and CONSTRUCTOR normally.
  // I will rely on generating/mocking the tasks soon.
  // For now, I will generate them assuming I WILL generate use cases next.
  // The prompt said "implement in all".

  content = `import { ${presenterImport} } from "./${kebabCaseName}.presenter";
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { Create${className}UseCase } from "./use-cases/create-${kebabCaseName}";
import type { FindAll${className}UseCase } from "./use-cases/find-all-${kebabCaseName}";
import type { FindById${className}UseCase } from "./use-cases/find-by-id-${kebabCaseName}";
import type { Update${className}UseCase } from "./use-cases/update-${kebabCaseName}";
import type { Delete${className}UseCase } from "./use-cases/delete-${kebabCaseName}";

@injectable()
export class ${controllerName} {
  constructor(
    @inject("Create${className}UseCase")
    private readonly create${className}UseCase: Create${className}UseCase,

    @inject("FindAll${className}UseCase")
    private readonly findAll${className}UseCase: FindAll${className}UseCase,

    @inject("FindById${className}UseCase")
    private readonly findById${className}UseCase: FindById${className}UseCase,

    @inject("Update${className}UseCase")
    private readonly update${className}UseCase: Update${className}UseCase,

    @inject("Delete${className}UseCase")
    private readonly delete${className}UseCase: Delete${className}UseCase,
  ) {}

  async create(request: Request, response: Response) {
    const body = request.body; 
    const result = await this.create${className}UseCase.execute(body);
    const httpResponse = ${presenterImport}(result);
    return response.status(201).json(httpResponse);
  }

  async findAll(request: Request, response: Response) {
    const result = await this.findAll${className}UseCase.execute();
    const httpResponse = result.map(${presenterImport});
    return response.status(200).json(httpResponse);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;
    const result = await this.findById${className}UseCase.execute(id);
    if (!result) return response.status(404).send();
    
    const httpResponse = ${presenterImport}(result);
    return response.status(200).json(httpResponse);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const body = request.body;
    const result = await this.update${className}UseCase.execute({ id, ...body });
    const httpResponse = ${presenterImport}(result);
    return response.status(200).json(httpResponse);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    await this.delete${className}UseCase.execute(id);
    return response.status(204).send();
  }
}
`;

  fs.writeFileSync(path.join(modulePath, controllerFileName), content);
  console.log(`Arquivo gerado: ${path.join(modulePath, controllerFileName)}`);
}
