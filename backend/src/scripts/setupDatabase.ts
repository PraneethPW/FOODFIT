import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "../config/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationPath = path.resolve(__dirname, "../../prisma/migrations/20260516170000_init/migration.sql");

const statements = fs
  .readFileSync(migrationPath, "utf8")
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  try {
    await prisma.$executeRawUnsafe(statement);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("already exists")) {
      throw error;
    }
  }
}

await prisma.$disconnect();
console.log("Database setup complete");
