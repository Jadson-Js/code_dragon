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
      return "string"; // Fallback
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

    // Determine default value logic for validation/creation
    // Determine default value logic for validation/creation
    let defaultValue = null;
    if (modifiers.includes("@default(uuid())"))
      defaultValue = "crypto.randomUUID()";
    else if (modifiers.includes("@default(now())")) defaultValue = "new Date()";
    else if (modifiers.includes("autoincrement()")) {
      defaultValue = null; // Specially handled usuallly
    } else {
      // generic default extraction
      const defaultMatch = modifiers.match(/@default\(([^)]+)\)/);
      if (defaultMatch) {
        defaultValue = defaultMatch[1];
      }
    }

    fields.push({
      name,
      type: mapPrismaTypeToTs(type),
      isOptional,
      isId,
      isUpdatedAt,
      hasDefault,
      defaultValue,
    });
  }
  return fields;
}

export function generateEntity(modelName, modelDefinition) {
  const fields = parseModel(modelDefinition);
  const className = modelName; // Assuming exact match or close enough
  const propsInterfaceName = `Create${className}Props`;

  let propsContent = `interface ${propsInterfaceName} {\n`;
  fields.forEach((field) => {
    // Props are optional if they have a default, are explicitly optional, or are system fields like IDs often are in creation
    // But strictly following User entity:
    // id is optional (generated)
    // createdAt/updatedAt are optional (generated)
    // nullable fields are optional
    const isPropOptional =
      field.isOptional || field.hasDefault || field.isId || field.isUpdatedAt;
    const propType = field.type;
    propsContent += `  ${field.name}${isPropOptional ? "?" : ""}: ${propType};\n`;
  });
  propsContent += "}\n";

  let classContent = `export class ${className} {\n`;

  // Private Constructor
  classContent += "  private constructor(\n";
  fields.forEach((field) => {
    const typeAnnotation = field.isOptional
      ? `${field.type} | null`
      : field.type;
    classContent += `    private readonly _${field.name}: ${typeAnnotation},\n`;
  });
  classContent += "  ) {}\n\n";

  // Static Create
  classContent += `  public static create(props: ${propsInterfaceName}): ${className} {\n`;
  classContent += `    return new ${className}(\n`;
  fields.forEach((field) => {
    let value = `props.${field.name}`;
    if (field.isOptional) {
      // If it's optional in prisma, it's null in class if not provided
      value = `${value} ?? null`;
    } else if (field.defaultValue) {
      // If it has a default, use it if prop is missing
      value = `${value} ?? ${field.defaultValue}`;
    } else if (
      field.type === "Date" &&
      (field.name === "createdAt" || field.name === "updatedAt")
    ) {
      // Fallback for timestamps if not caught by defaultValue (though they usually have @default(now()))
      value = `${value} ?? new Date()`;
    }

    classContent += `      ${value},\n`;
  });
  classContent += "    );\n";
  classContent += "  }\n\n";

  // Getters
  fields.forEach((field) => {
    const returnType = field.isOptional ? `${field.type} | null` : field.type;
    classContent += `  get ${field.name}(): ${returnType} {\n`;
    classContent += `    return this._${field.name};\n`;
    classContent += "  }\n\n";
  });

  classContent += "}\n";

  return propsContent + "\n" + classContent;
}
