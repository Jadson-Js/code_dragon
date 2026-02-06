import fs from "node:fs";
import path from "node:path";

function mapPrismaTypeToZod(type) {
  switch (type) {
    case "String":
      return "z.string()";
    case "Int":
    case "Float":
    case "Decimal":
      return "z.number()";
    case "Boolean":
      return "z.boolean()";
    case "DateTime":
      return "z.string()"; // Dates usually come as strings in JSON body
    default:
      return "z.any()";
  }
}

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
    const typeRaw = parts[1];
    const isOptional = typeRaw.endsWith("?");
    const type = isOptional ? typeRaw.slice(0, -1) : typeRaw;
    const modifiers = parts.slice(2).join(" ");

    const isId = modifiers.includes("@id");
    const isUpdatedAt = modifiers.includes("@updatedAt");
    const hasDefault = modifiers.includes("@default");

    fields.push({
      name,
      type: mapPrismaTypeToZod(type),
      isOptional,
      isId,
      isUpdatedAt,
      hasDefault,
    });
  }
  return fields;
}

export function generateSchema(modelName, modelDefinition) {
  const fields = parseModel(modelDefinition);
  const kebabCaseName = modelName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  const schemaName = `create${modelName}Schema`;
  const typeName = `Create${modelName}Schema`;

  let content = `import { z } from "zod";

export const ${schemaName} = z.object({
  body: z.object({
`;

  fields.forEach((field) => {
    // Skip ID, createdAt, updatedAt, deletedAt for creation usually, unless strictly needed.
    // User logic: "basear no model, o que for necessario para criacao".
    // IDs are usually auto-generated.
    // created/updated are auto.
    if (
      field.isId ||
      field.name === "createdAt" ||
      field.name === "updatedAt" ||
      field.name === "deletedAt"
    ) {
      return;
    }

    let fieldSchema = field.type;

    // Logic for optional: if optional in Prisma OR has default -> optional in schema (or just optional)
    if (field.isOptional || field.hasDefault) {
      fieldSchema += ".optional()";
    }

    content += `    ${field.name}: ${fieldSchema},\n`;
  });

  content += `  }),
});

export type ${typeName} = z.infer<typeof ${schemaName}>;
`;

  const modulePath = path.join(process.cwd(), "src", "modules", kebabCaseName);
  const schemaPath = path.join(modulePath, `${kebabCaseName}.schema.ts`);

  if (fs.existsSync(modulePath)) {
    fs.writeFileSync(schemaPath, content);
    console.log(`Arquivo gerado: ${schemaPath}`);
  } else {
    console.error(`Erro: Pasta do módulo ${kebabCaseName} não encontrada.`);
  }
}
