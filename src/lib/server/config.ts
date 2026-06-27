import path from "node:path";

export function getDatabasePath(): string {
  return process.env.DATABASE_PATH || path.join(process.cwd(), "data", "village.db");
}
