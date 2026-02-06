import fs from "node:fs";
import path from "node:path";

export function findModel(modelName) {
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  if (!fs.existsSync(schemaPath)) {
    throw new Error("prisma/schema.prisma not found");
  }

  const content = fs.readFileSync(schemaPath, "utf-8");
  // Simple regex to find model block. Improved to handle potential whitespace.
  const modelRegex = new RegExp(`model\\s+${modelName}\\s*{[\\s\\S]*?}`, "g");
  const match = content.match(modelRegex);

  return match ? match[0] : null;
}
