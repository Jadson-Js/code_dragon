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
import { rateLimitMiddleware } from "@/infra/http/middlewares/rate-limit.middleware";
import { ${controllerVar} } from "./${names.containerFile}";
import { ensureAuthenticated } from "@/infra/container/providers";

const router = Router();

router.get(
  "/",
  rateLimitMiddleware({
    max: 60,
    windowInMs: 60000,
    key: "find-all-${names.kebab}",
    useEmail: false,
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
