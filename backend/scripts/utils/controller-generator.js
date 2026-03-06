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

  const content = `import { ${names.presenterFn} } from "./${names.presenterFile}";
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { ${names.findAllUseCase} } from "./use-cases/find-all-${names.kebab}";

@injectable()
export class ${names.controllerClass} {
  constructor(
    @inject("${names.findAllUseCaseToken}")
    private readonly findAll${names.pascal}UseCase: ${names.findAllUseCase},
  ) {}

  async findAll(request: Request, response: Response) {
    const result = await this.findAll${names.pascal}UseCase.execute();
    const httpResponse = result.map(${names.presenterFn});
    return response.status(200).json(httpResponse);
  }
}
`;

  // Write file
  const filePath = path.join(paths.module, `${names.controllerFile}.ts`);
  writeFile(filePath, content);
}
