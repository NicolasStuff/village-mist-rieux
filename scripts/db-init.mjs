import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const databasePath =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "village.db");

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.exec(`
create table if not exists active_game (
  id text primary key,
  join_code text not null,
  master_token_hash text not null,
  state_json text not null,
  created_at text not null,
  updated_at text not null
);

create table if not exists player_sessions (
  player_id text primary key,
  token_hash text not null,
  claimed_at text not null,
  last_seen_at text not null
);
`);
db.close();

console.log(`Initialized ${databasePath}`);
