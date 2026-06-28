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
