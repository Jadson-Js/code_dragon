/**
 * Routes Generator
 * Generates Express router with a single read (findAll) endpoint.
 */

import path from "node:path";
import { getModelNames, toCamelCase } from "./shared/naming.js";
import { getModulePaths, writeFile } from "./shared/paths.js";

export function generateRoutes(modelName) {
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);
  const controllerVar = `${toCamelCase(modelName)}Controller`;

  const content = `import { Router } from "express";
import { simpleRateLimitMiddleware } from "@/infra/container/providers";
import { ${controllerVar} } from "./${names.containerFile}";
import { ensureAuthenticated } from "@/infra/container/providers";

const router = Router();

router.get(
  "/",
  simpleRateLimitMiddleware.handle({
    max: 60,
    windowInMs: 60000,
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  ${controllerVar}.findAll.bind(${controllerVar}),
);

export default router;
`;

  // Write file
  const filePath = path.join(paths.module, `${names.routesFile}.ts`);
  writeFile(filePath, content);
}
