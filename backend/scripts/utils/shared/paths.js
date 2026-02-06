/**
 * Shared Path Utilities
 * Provides consistent path generation across all generators.
 */

import path from "node:path";
import fs from "node:fs";

const ROOT = process.cwd();

/**
 * Gets common paths for a module.
 * @param {string} kebabName - Module name in kebab-case
 * @returns {Object} - Object with all path variants
 */
export function getModulePaths(kebabName) {
  return {
    // Directories
    module: path.join(ROOT, "src", "modules", kebabName),
    useCases: path.join(ROOT, "src", "modules", kebabName, "use-cases"),
    entities: path.join(ROOT, "src", "domain", "entities"),
    repositories: path.join(ROOT, "src", "domain", "repositories"),
    prismaRepo: path.join(ROOT, "src", "infra", "database", "prisma"),
  };
}

/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - Directory path
 */
export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Writes content to a file and logs success.
 * @param {string} filePath - Full file path
 * @param {string} content - File content
 */
export function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(`Arquivo gerado: ${filePath}`);
}

/**
 * Checks if a directory exists.
 * @param {string} dirPath - Directory path
 * @returns {boolean}
 */
export function dirExists(dirPath) {
  return fs.existsSync(dirPath);
}
