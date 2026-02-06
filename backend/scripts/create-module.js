/**
 * Create Module Script
 * Main entry point for generating all module files from a Prisma model.
 */

import readline from "node:readline";
import { findModel } from "./utils/shared/prisma-parser.js";
import { generateEntity } from "./utils/entity-generator.js";
import { generateModuleFolder } from "./utils/module-generator.js";
import { generateRoutes } from "./utils/routes-generator.js";
import { generateRepository } from "./utils/repository-generator.js";
import { generateSchema } from "./utils/schema-generator.js";
import { generatePrismaRepository } from "./utils/prisma-repository-generator.js";
import { generatePresenter } from "./utils/presenter-generator.js";
import { generateDTO } from "./utils/dto-generator.js";
import { generateController } from "./utils/controller-generator.js";
import { generateContainer } from "./utils/container-generator.js";
import { generateUseCases } from "./utils/use-cases-generator.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n---------------------------------------------------------");
console.log("Bem-vindo ao gerador de módulos!");
console.log(
  "Para funcionar, você deve ter o model criado no prisma/schema.prisma.",
);
console.log("O sistema pegará o model e criará os módulos baseados nele.");
console.log("---------------------------------------------------------\n");

rl.question("Qual o nome do model? ", (modelName) => {
  try {
    const model = findModel(modelName);
    if (model) {
      console.log(`\nÓtimo! Model [${modelName}] encontrado:\n`);
      console.log(model);

      // Generate all files
      generateEntity(modelName, model);
      generateModuleFolder(modelName);
      generateRoutes(modelName);
      generateRepository(modelName);
      generateSchema(modelName, model);
      generatePrismaRepository(modelName, model);
      generateDTO(modelName, model);
      generatePresenter(modelName);
      generateController(modelName);
      generateContainer(modelName);
      generateUseCases(modelName);
    } else {
      console.log(
        `\nErro: Model [${modelName}] não encontrado em prisma/schema.prisma`,
      );
      console.log("Certifique-se de que o nome está correto e o model existe.");
    }
  } catch (error) {
    console.error(`\nErro ao ler o schema: ${error.message}`);
  }
  rl.close();
  process.exit(0);
});
