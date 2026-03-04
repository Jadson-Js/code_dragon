import { prisma } from "./client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🌱 Seeding database...");

  const sqlFile = path.join(__dirname, "seed.sql");
  const sql = fs.readFileSync(sqlFile, "utf8");

  try {
    // Executa o SQL bruto do arquivo seed.sql
    await prisma.$executeRawUnsafe(sql);
    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
