import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { getDatabasePath } from "@/lib/server/config";

let database: Database.Database | undefined;

function schemaSql(): string {
  return fs.readFileSync(path.join(process.cwd(), "src", "lib", "server", "schema.sql"), "utf8");
}

export function getDb(): Database.Database {
  if (!database) {
    const databasePath = getDatabasePath();
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    database = new Database(databasePath);
    database.pragma("journal_mode = WAL");
    database.exec(schemaSql());
  }

  return database;
}

export function assertDbReady(): boolean {
  const row = getDb().prepare("select 1 as ok").get() as { ok: number };
  return row.ok === 1;
}
