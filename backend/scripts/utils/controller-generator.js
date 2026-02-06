/**
 * Controller Generator
 * Generates HTTP controllers with CRUD methods.
 */

import path from "node:path";
import { getModelNames } from "./shared/naming.js";
import { getModulePaths, writeFile } from "./shared/paths.js";

export function generateController(modelName) {
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);

  const content = `import { ${names.presenterFn} } from "./${names.presenterFile}";
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { ${names.findAllUseCase} } from "./use-cases/find-all-${names.kebab}";
import type { ${names.findByIdUseCase} } from "./use-cases/find-by-id-${names.kebab}";
import type { ${names.createUseCase} } from "./use-cases/create-${names.kebab}";
import type { ${names.updateUseCase} } from "./use-cases/update-${names.kebab}";
import type { ${names.deleteUseCase} } from "./use-cases/delete-${names.kebab}";

@injectable()
export class ${names.controllerClass} {
  constructor(
    @inject("${names.findAllUseCaseToken}")
    private readonly findAll${names.pascal}UseCase: ${names.findAllUseCase},

    @inject("${names.findByIdUseCaseToken}")
    private readonly findById${names.pascal}UseCase: ${names.findByIdUseCase},

    @inject("${names.createUseCaseToken}")
    private readonly create${names.pascal}UseCase: ${names.createUseCase},

    @inject("${names.updateUseCaseToken}")
    private readonly update${names.pascal}UseCase: ${names.updateUseCase},

    @inject("${names.deleteUseCaseToken}")
    private readonly delete${names.pascal}UseCase: ${names.deleteUseCase},
  ) {}

  async findAll(request: Request, response: Response) {
    const result = await this.findAll${names.pascal}UseCase.execute();
    const httpResponse = result.map(${names.presenterFn});
    return response.status(200).json(httpResponse);
  }

  async findById(request: Request, response: Response) {
    const { id } = request.params;
    const result = await this.findById${names.pascal}UseCase.execute(id as string);
    if (!result) return response.status(404).send();

    const httpResponse = ${names.presenterFn}(result);
    return response.status(200).json(httpResponse);
  }

  async create(request: Request, response: Response) {
    const body = request.body;
    const result = await this.create${names.pascal}UseCase.execute(body);
    const httpResponse = ${names.presenterFn}(result);
    return response.status(201).json(httpResponse);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const body = request.body;
    const result = await this.update${names.pascal}UseCase.execute({ id, ...body });
    const httpResponse = ${names.presenterFn}(result);
    return response.status(200).json(httpResponse);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    await this.delete${names.pascal}UseCase.execute(id as string);
    return response.status(204).send();
  }
}
`;

  // Write file
  const filePath = path.join(paths.module, `${names.controllerFile}.ts`);
  writeFile(filePath, content);
}
