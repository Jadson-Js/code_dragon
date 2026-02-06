/**
 * Shared Prisma Schema Parser
 * Extracts field information from Prisma model definitions.
 */

import fs from "node:fs";
import path from "node:path";

/**
 * Maps Prisma types to TypeScript types.
 * @param {string} type - Prisma type name
 * @returns {string} - TypeScript type
 */
export function mapPrismaTypeToTs(type) {
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

/**
 * Maps Prisma types to Zod schema types.
 * @param {string} type - Prisma type name
 * @returns {string} - Zod schema call
 */
export function mapPrismaTypeToZod(type) {
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

/**
 * Parses a Prisma model definition and extracts field metadata.
 * @param {string} modelDefinition - Raw Prisma model block
 * @returns {Array<Object>} - Array of field objects with metadata
 */
export function parseModel(modelDefinition) {
  const lines = modelDefinition.split("\n");
  const fields = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip non-field lines
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
    const isArray = typeRaw.endsWith("[]");
    const type = isOptional
      ? typeRaw.slice(0, -1)
      : isArray
        ? typeRaw.slice(0, -2)
        : typeRaw;
    const modifiers = parts.slice(2).join(" ");

    // Extract modifiers
    const isId = modifiers.includes("@id");
    const isUpdatedAt = modifiers.includes("@updatedAt");
    const hasDefault = modifiers.includes("@default");
    const isUnique = modifiers.includes("@unique");

    // Check for sensitive fields
    const isSensitive =
      name.toLowerCase().includes("password") ||
      name.toLowerCase().includes("hash");

    // Extract default value if present
    let defaultValue = null;
    if (modifiers.includes("@default(uuid())")) {
      defaultValue = "crypto.randomUUID()";
    } else if (modifiers.includes("@default(now())")) {
      defaultValue = "new Date()";
    } else if (modifiers.includes("autoincrement()")) {
      defaultValue = null; // Handled by DB
    } else {
      const defaultMatch = modifiers.match(/@default\(([^)]+)\)/);
      if (defaultMatch) {
        defaultValue = defaultMatch[1];
      }
    }

    fields.push({
      name,
      prismaType: type,
      tsType: mapPrismaTypeToTs(type),
      zodType: mapPrismaTypeToZod(type),
      isOptional,
      isArray,
      isId,
      isUpdatedAt,
      hasDefault,
      isUnique,
      isSensitive,
      defaultValue,
    });
  }

  return fields;
}

/**
 * Returns a simplified field list (just names) for basic operations.
 * @param {string} modelDefinition - Raw Prisma model block
 * @returns {Array<{name: string}>} - Array of field name objects
 */
export function parseModelSimple(modelDefinition) {
  return parseModel(modelDefinition).map((f) => ({ name: f.name }));
}

/**
 * Finds a model definition in the Prisma schema file.
 * @param {string} modelName - Name of the model to find
 * @returns {string|null} - Model definition block or null if not found
 */
export function findModel(modelName) {
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  const content = fs.readFileSync(schemaPath, "utf-8");

  const regex = new RegExp(`model\\s+${modelName}\\s*\\{[^}]+\\}`, "g");
  const match = content.match(regex);

  return match ? match[0] : null;
}
