/**
 * Schema Generator
 * Generates Zod validation schemas for API requests.
 */

import path from "node:path";
import { parseModel } from "./shared/prisma-parser.js";
import { getModelNames } from "./shared/naming.js";
import { getModulePaths, writeFile } from "./shared/paths.js";

export function generateSchema(modelName, modelDefinition) {
  const fields = parseModel(modelDefinition);
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);

  const schemaName = `create${names.pascal}Schema`;

  let content = `import { z } from "zod";\n\n`;
  content += `export const ${schemaName} = z.object({\n`;
  content += `  body: z.object({\n`;

  for (const field of fields) {
    // Skip system-generated fields
    if (field.isId) continue;
    if (field.isUpdatedAt) continue;
    if (field.hasDefault) continue;
    if (field.name === "createdAt" || field.name === "deletedAt") continue;

    let zodSchema = field.zodType;
    if (field.isOptional) {
      zodSchema += ".optional()";
    }

    content += `    ${field.name}: ${zodSchema},\n`;
  }

  content += `  }),\n`;
  content += "});\n";

  // Write file
  const filePath = path.join(paths.module, `${names.schemaFile}.ts`);
  writeFile(filePath, content);
}
