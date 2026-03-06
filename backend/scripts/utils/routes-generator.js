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
import { rateLimitMiddleware } from "@/infra/http/middlewares/rate-limit.middleware";
import { ${schemaName} } from "./${names.schemaFile}";
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

router.get(
  "/:id",
  rateLimitMiddleware({
    max: 60,
    windowInMs: 60000,
    key: "find-by-id-${names.kebab}",
    useEmail: false,
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  ${controllerVar}.findById.bind(${controllerVar}),
);

router.post(
  "/",
  rateLimitMiddleware({
    max: 60,
    windowInMs: 60000,
    key: "create-${names.kebab}",
    useEmail: false,
  }),
  validate(${schemaName}),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  ${controllerVar}.create.bind(${controllerVar}),
);

router.patch(
  "/:id",
  rateLimitMiddleware({
    max: 60,
    windowInMs: 60000,
    key: "update-${names.kebab}",
    useEmail: false,
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  ${controllerVar}.update.bind(${controllerVar}),
);

router.delete(
  "/:id",
  rateLimitMiddleware({
    max: 60,
    windowInMs: 60000,
    key: "delete-${names.kebab}",
    useEmail: false,
  }),
  ensureAuthenticated.authAccess.bind(ensureAuthenticated),
  ${controllerVar}.delete.bind(${controllerVar}),
);

export default router;
`;

  // Write file
  const filePath = path.join(paths.module, `${names.routesFile}.ts`);
  writeFile(filePath, content);
}
