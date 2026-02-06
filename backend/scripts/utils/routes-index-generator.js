/**
 * Routes Index Generator
 * Scans all modules and generates a centralized routes file.
 * This file is auto-generated and can be safely overwritten.
 */

import fs from "node:fs";
import path from "node:path";
import { writeFile, ensureDir } from "./shared/paths.js";
import { toKebabCase } from "./shared/naming.js";

export function generateRoutesIndex() {
  const modulesPath = path.join(process.cwd(), "src", "modules");
  const routesPath = path.join(process.cwd(), "src", "infra", "http");
  const indexPath = path.join(routesPath, "routes.ts");

  // Ensure routes directory exists
  ensureDir(routesPath);

  // Scan all module directories
  const modules = [];

  if (fs.existsSync(modulesPath)) {
    const entries = fs.readdirSync(modulesPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const moduleName = entry.name;
        const routesFile = path.join(
          modulesPath,
          moduleName,
          `${moduleName}.routes.ts`,
        );

        // Only include if routes file exists
        if (fs.existsSync(routesFile)) {
          modules.push({
            name: moduleName,
            importName: `${toCamelCase(moduleName)}Routes`,
            endpoint: `/${toPlural(moduleName)}`,
          });
        }
      }
    }
  }

  // Generate content
  let content = `/**
 * Routes Index
 * Auto-generated file - DO NOT EDIT MANUALLY
 * This file is regenerated every time a new module is created.
 */

import { Router } from "express";
`;

  // Generate imports
  for (const mod of modules) {
    content += `import ${mod.importName} from "@/modules/${mod.name}/${mod.name}.routes";\n`;
  }

  content += `
const router = Router();

`;

  // Generate route registrations
  for (const mod of modules) {
    content += `router.use("${mod.endpoint}", ${mod.importName});\n`;
  }

  content += `
export default router;
`;

  writeFile(indexPath, content);
}

/**
 * Convert kebab-case to camelCase
 */
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Simple pluralization (adds 's' to the end)
 * For more complex cases, consider using a library
 */
function toPlural(str) {
  // Handle common cases
  if (str.endsWith("y")) {
    return str.slice(0, -1) + "ies";
  }
  if (
    str.endsWith("s") ||
    str.endsWith("x") ||
    str.endsWith("ch") ||
    str.endsWith("sh")
  ) {
    return str + "es";
  }
  return str + "s";
}
