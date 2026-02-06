import fs from "node:fs";
import path from "node:path";

function mapPrismaTypeToTs(type) {
  switch (type) {
    case "String":
      return "string";
    case "Int":
    case "Float":
    case "Decimal":
      return "number";
    case "Boolean":
      return "boolean";
    case "DateTime":
      return "Date";
    case "Json":
      return "any";
    default:
      return "string";
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

    // Logic from entity-generator.js regarding optionals/defaults
    const isId = modifiers.includes("@id");
    const isUpdatedAt = modifiers.includes("@updatedAt");
    const hasDefault = modifiers.includes("@default");

    const isSensitive =
      name.toLowerCase().includes("password") ||
      name.toLowerCase().includes("hash");

    fields.push({
      name,
      type: mapPrismaTypeToTs(type),
      isOptional,
      isId,
      isUpdatedAt,
      hasDefault,
      isSensitive,
    });
  }
  return fields;
}

export function generateDTO(modelName, modelDefinition) {
  const fields = parseModel(modelDefinition);
  const kebabCaseName = modelName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  const className = modelName;
  const dtoFileName = `${kebabCaseName}.dto.ts`;
  const modulePath = path.join(process.cwd(), "src", "modules", kebabCaseName);

  if (!fs.existsSync(modulePath)) {
    console.error(`Erro: Pasta do módulo ${kebabCaseName} não encontrada.`);
    return;
  }

  const createDtoName = `Create${className}DTO`;
  const responseDtoName = `${className}ResponseDTO`;

  let dtoContent = `export interface ${createDtoName} {\n`;
  fields.forEach((field) => {
    // Logic: Only include fields that match "entity generator logic" for REQUIRED props essentially,
    // but specialized for DTO creation from API payload.
    // Filter out:
    // - ID (generated)
    // - CreatedAt/UpdatedAt (generated)
    // - DeletedAt (generated/optional)
    // - Optional fields (?) - User said "those that are not mandatory already have standardized value".
    //   So if it has @default, we skip it for CREATE DTO?
    //   User example: "Post" has name, email, passwordHash.
    //   Post model:
    //     name String
    //     email String @unique
    //     passwordHash String @map...
    //     birthDate DateTime? ...
    //     createdAt DateTime @default(now())...
    //
    //   So we skip:
    //   - Optional fields (isOptional)
    //   - Fields with @default (hasDefault)
    //   - ID (isId)
    //   - UpdatedAt (isUpdatedAt)

    if (field.isId) return;
    if (field.isUpdatedAt) return;
    if (field.hasDefault) return;
    if (field.isOptional) return;
    if (field.name === "createdAt" || field.name === "deletedAt") return; // fallback if flags missing

    dtoContent += `  ${field.name}: ${field.type};\n`;
  });
  dtoContent += `}\n\n`;

  // ResponseDTO only ID
  dtoContent += `export interface ${responseDtoName} {\n`;
  dtoContent += `  id: string;\n`;
  dtoContent += `}\n`;

  fs.writeFileSync(path.join(modulePath, dtoFileName), dtoContent);
  console.log(`Arquivo gerado: ${path.join(modulePath, dtoFileName)}`);
}
