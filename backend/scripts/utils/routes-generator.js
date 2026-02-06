/**
 * Routes Generator
 * Generates Express router with CRUD endpoints.
 */

import path from "node:path";
import { getModelNames, toCamelCase } from "./shared/naming.js";
import { getModulePaths, writeFile } from "./shared/paths.js";

export function generateRoutes(modelName) {
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);
  const controllerVar = `${toCamelCase(modelName)}Controller`;
  const schemaName = `create${names.pascal}Schema`;

  const content = `import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { ${schemaName} } from "./${names.schemaFile}";
import { ${controllerVar} } from "./${names.containerFile}";

const router = Router();

router.post(
  "/",
  validate(${schemaName}),
  ${controllerVar}.create.bind(${controllerVar}),
);

router.get(
  "/",
  ${controllerVar}.findAll.bind(${controllerVar}),
);

router.get(
  "/:id",
  ${controllerVar}.findById.bind(${controllerVar}),
);

router.put(
  "/:id",
  ${controllerVar}.update.bind(${controllerVar}),
);

router.delete(
  "/:id",
  ${controllerVar}.delete.bind(${controllerVar}),
);

export default router;
`;

  // Write file
  const filePath = path.join(paths.module, `${names.routesFile}.ts`);
  writeFile(filePath, content);
}
