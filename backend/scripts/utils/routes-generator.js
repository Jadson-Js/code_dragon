import fs from "node:fs";
import path from "node:path";

export function generateRoutes(modelName) {
  const kebabCaseName = modelName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  const camelCaseName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  const controllerName = `${camelCaseName}Controller`;
  const schemaName = `create${modelName}Schema`; // Following user pattern

  const content = `import { Router } from "express";
import { validate } from "@/infra/http/middlewares/validate.middleware";
import { ${schemaName} } from "./${kebabCaseName}.schema";
import { ${controllerName} } from "./${kebabCaseName}.container";

const router = Router();

router.post(
  "/",
  validate(${schemaName}),
  ${controllerName}.create.bind(${controllerName}),
);

router.get(
  "/",
  ${controllerName}.findAll.bind(${controllerName}),
);

router.get(
  "/:id",
  ${controllerName}.findById.bind(${controllerName}),
);

router.put(
  "/:id",
  ${controllerName}.update.bind(${controllerName}),
);

router.delete(
  "/:id",
  ${controllerName}.delete.bind(${controllerName}),
);

export default router;
`;

  const modulePath = path.join(process.cwd(), "src", "modules", kebabCaseName);
  const routesPath = path.join(modulePath, `${kebabCaseName}.routes.ts`);

  if (fs.existsSync(modulePath)) {
    fs.writeFileSync(routesPath, content);
    console.log(`Arquivo gerado: ${routesPath}`);
  } else {
    console.error(`Erro: Pasta do módulo ${kebabCaseName} não encontrada.`);
  }
}
