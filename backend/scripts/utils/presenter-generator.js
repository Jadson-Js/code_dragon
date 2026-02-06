import fs from "node:fs";
import path from "node:path";

function parseModel(modelDefinition) {
  const lines = modelDefinition.split("\n");
  const fields = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("model") ||
      trimmed.startsWith("}") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("@@")
    ) {
      continue;
    }

    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) continue;

    const name = parts[0];
    fields.push({ name });
  }
  return fields;
}

export function generatePresenter(modelName, modelDefinition) {
  const fields = parseModel(modelDefinition);
  const kebabCaseName = modelName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  const className = modelName;
  const presenterFileName = `${kebabCaseName}.presenter.ts`;
  const modulePath = path.join(process.cwd(), "src", "modules", kebabCaseName);

  if (!fs.existsSync(modulePath)) {
    console.error(`Erro: Pasta do módulo ${kebabCaseName} não encontrada.`);
    return;
  }

  const responseDtoName = `${className}ResponseDTO`;
  const presenterFunctionName = `${modelName.charAt(0).toLowerCase() + modelName.slice(1)}ToHTTP`;

  let presenterContent = `import { ${className} } from "@/domain/entities/${kebabCaseName}.entity";\n`;
  presenterContent += `import type { ${responseDtoName} } from "./${kebabCaseName}.dto";\n\n`;
  presenterContent += `export function ${presenterFunctionName}(${modelName.toLowerCase()}: ${className}): ${responseDtoName} {\n`;
  presenterContent += `  return {\n`;
  presenterContent += `    id: ${modelName.toLowerCase()}.id,\n`;
  presenterContent += `  };\n`;
  presenterContent += `}\n`;

  fs.writeFileSync(path.join(modulePath, presenterFileName), presenterContent);
  console.log(`Arquivo gerado: ${path.join(modulePath, presenterFileName)}`);
}
