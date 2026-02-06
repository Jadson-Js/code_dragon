import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { findModel } from "./utils/prisma-parser.js";
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
      console.log(model);

      const entityContent = generateEntity(modelName, model);
      const entityFileName = `${modelName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}.entity.ts`;
      const entityPath = path.join(
        process.cwd(),
        "src",
        "domain",
        "entities",
        entityFileName,
      );

      // Ensure directory exists
      const dir = path.dirname(entityPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(entityPath, entityContent);
      console.log(`\nArquivo gerado com sucesso: ${entityPath}`);

      generateModuleFolder(modelName);
      generateRoutes(modelName);
      generateRepository(modelName);
      generateSchema(modelName, model);
      generatePrismaRepository(modelName, model);
      generateDTO(modelName, model);
      generatePresenter(modelName, model);
      generateController(modelName, model);
      generateController(modelName, model);
      generateContainer(modelName, model);
      generateUseCases(modelName, model);
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
