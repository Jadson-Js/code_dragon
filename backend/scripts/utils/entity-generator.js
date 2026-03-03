/**
 * Entity Generator
 * Generates domain entity classes from Prisma models.
 */

import path from "node:path";
import { parseModel, mapPrismaTypeToTs } from "./shared/prisma-parser.js";
import { getModelNames } from "./shared/naming.js";
import { getModulePaths, writeFile } from "./shared/paths.js";

export function generateEntity(modelName, modelDefinition) {
  const fields = parseModel(modelDefinition);
  const names = getModelNames(modelName);
  const paths = getModulePaths(names.kebab);

  // Build Props interface
  let propsInterface = `interface Create${names.pascal}Props {\n`;
  for (const field of fields) {
    const isOptionalInProps =
      field.isId || field.hasDefault || field.isOptional || field.isUpdatedAt;
    const optionalMark = isOptionalInProps ? "?" : "";
    propsInterface += `  ${field.name}${optionalMark}: ${field.tsType}${field.isOptional ? " | null" : ""};\n`;
  }
  propsInterface += "}\n";

  // Build class
  let classContent = `export class ${names.pascal} {\n`;

  // Private constructor with parameter properties
  classContent += "  private constructor(\n";
  for (const field of fields) {
    const nullSuffix = field.isOptional ? " | null" : "";
    classContent += `    public readonly ${field.name}: ${field.tsType}${nullSuffix},\n`;
  }
  classContent += "  ) {}\n\n";

  // Static create method
  classContent += `  static create(props: Create${names.pascal}Props): ${names.pascal} {\n`;
  classContent += `    return new ${names.pascal}(\n`;
  for (const field of fields) {
    if (field.defaultValue) {
      classContent += `      props.${field.name} ?? ${field.defaultValue},\n`;
    } else if (field.isOptional) {
      classContent += `      props.${field.name} ?? null,\n`;
    } else {
      classContent += `      props.${field.name},\n`;
    }
  }
  classContent += "    );\n";
  classContent += "  }\n";

  classContent += "}\n";

  // Combine content
  const content = `${propsInterface}\n${classContent}`;

  // Write file
  const filePath = path.join(paths.entities, `${names.entityFile}.ts`);
  writeFile(filePath, content);
}
