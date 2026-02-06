/**
 * DTO Generator
 * Generates Data Transfer Objects for API requests/responses.
 */

import path from "node:path";
import { parseModel } from "./shared/prisma-parser.js";
import { getModelNames } from "./shared/naming.js";
import { getModulePaths, writeFile } from "./shared/paths.js";

export function generateDTO(modelName, modelDefinition) {
  const fields = parseModel(modelDefinition);
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);

  // CreateDTO - Only mandatory fields (non-optional, no defaults, not system-generated)
  let content = `export interface ${names.createDto} {\n`;
  for (const field of fields) {
    // Skip system-generated and optional fields
    if (field.isId) continue;
    if (field.isUpdatedAt) continue;
    if (field.hasDefault) continue;
    if (field.isOptional) continue;
    if (field.name === "createdAt" || field.name === "deletedAt") continue;

    content += `  ${field.name}: ${field.tsType};\n`;
  }
  content += "}\n\n";

  // ResponseDTO - Only ID for security
  content += `export interface ${names.responseDto} {\n`;
  content += "  id: string;\n";
  content += "}\n";

  // Write file
  const filePath = path.join(paths.module, `${names.dtoFile}.ts`);
  writeFile(filePath, content);
}
