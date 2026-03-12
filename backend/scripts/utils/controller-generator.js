/**
 * Controller Generator
 * Generates HTTP controller with a single findAll method.
 */

import path from "node:path";
import { getModelNames } from "./shared/naming.js";
import { getModulePaths, writeFile } from "./shared/paths.js";

export function generateController(modelName) {
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);

  const content = `import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { ${names.findAllUseCase} } from "./use-cases/find-all-${names.kebab}";
import type { ${names.responseDto} } from "./${names.dtoFile}";

@injectable()
export class ${names.controllerClass} {
  constructor(
    @inject("${names.findAllUseCaseToken}")
    private readonly findAll${names.pascal}UseCase: ${names.findAllUseCase},
  ) {}

  async findAll(
    request: Request,
    response: Response,
  ): Promise<Response<${names.responseDto}[]>> {
    const result = await this.findAll${names.pascal}UseCase.execute();
    return response.status(200).json(result);
  }
}
`;

  // Write file
  const filePath = path.join(paths.module, `${names.controllerFile}.ts`);
  writeFile(filePath, content);
}
