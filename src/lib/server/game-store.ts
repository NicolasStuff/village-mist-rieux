import { createGame } from "@/lib/game/assign";
import { nextPhase } from "@/lib/game/phases";
import { removeSuspicion } from "@/lib/game/powers";
import { resolveAccusation } from "@/lib/game/accusations";
import type { AccusationInput, Game, PlayerId } from "@/lib/game/types";
import { getDb } from "@/lib/server/db";
import { createToken, hashToken, validateToken } from "@/lib/server/session";

type ActiveGameRow = {
  id: string;
  join_code: string;
  master_token_hash: string;
  state_json: string;
  created_at: string;
  updated_at: string;
};

type PlayerSessionRow = {
  player_id: string;
  token_hash: string;
  claimed_at: string;
  last_seen_at: string;
};

export function getActiveGame(): Game | null {
  const row = getDb().prepare("select * from active_game limit 1").get() as ActiveGameRow | undefined;
  return row ? (JSON.parse(row.state_json) as Game) : null;
}

function getActiveRow(): ActiveGameRow | null {
  return (getDb().prepare("select * from active_game limit 1").get() as ActiveGameRow | undefined) ?? null;
}

export function saveActiveGame(game: Game, masterTokenHash?: string): void {
  const now = new Date().toISOString();
  const existing = getActiveRow();
  const hash = masterTokenHash || existing?.master_token_hash;

  if (!hash) {
    throw new Error("Master token hash missing.");
  }

  getDb()
    .prepare(
      `insert into active_game (id, join_code, master_token_hash, state_json, created_at, updated_at)
       values (@id, @joinCode, @masterTokenHash, @stateJson, @createdAt, @updatedAt)
       on conflict(id) do update set
         join_code = excluded.join_code,
         master_token_hash = excluded.master_token_hash,
         state_json = excluded.state_json,
         updated_at = excluded.updated_at`,
    )
    .run({
      id: game.id,
      joinCode: game.joinCode,
      masterTokenHash: hash,
      stateJson: JSON.stringify({ ...game, updatedAt: now }),
      createdAt: game.startedAt,
      updatedAt: now,
    });
}

export function replaceActiveGame(playerNames: string[], seed: string, masterCode?: string) {
  const masterToken = masterCode?.trim() || createToken();
  const game = createGame({ playerNames, seed });
  const db = getDb();

  const transaction = db.transaction(() => {
    db.prepare("delete from player_sessions").run();
    db.prepare("delete from active_game").run();
    saveActiveGame(game, hashToken(masterToken));
  });

  transaction();

  return { game, masterToken };
}

export function validateMasterToken(masterToken: string): boolean {
  const row = getActiveRow();
  return Boolean(row && validateToken(masterToken, row.master_token_hash));
}

export function requireMaster(masterToken: string): Game {
  if (!validateMasterToken(masterToken)) {
    throw new Error("Acces maitre invalide.");
  }

  const game = getActiveGame();
  if (!game) {
    throw new Error("Aucune partie active.");
  }

  return game;
}

export function claimPlayer(joinCode: string, playerId: PlayerId) {
  const game = getActiveGame();
  if (!game) {
    throw new Error("Aucune partie active.");
  }

  if (game.joinCode !== joinCode.trim().toUpperCase()) {
    throw new Error("Code partie invalide.");
  }

  const player = game.players.find((item) => item.id === playerId);
  if (!player) {
    throw new Error("Joueur introuvable.");
  }

  if (player.claimed) {
    throw new Error("Ce joueur est deja associe a un appareil.");
  }

  const token = createToken();
  const now = new Date().toISOString();
  const nextGame: Game = {
    ...game,
    players: game.players.map((item) =>
      item.id === playerId ? { ...item, claimed: true, lastSeenAt: now } : item,
    ),
    updatedAt: now,
  };

  const db = getDb();
  const transaction = db.transaction(() => {
    db.prepare(
      `insert or replace into player_sessions (player_id, token_hash, claimed_at, last_seen_at)
       values (?, ?, ?, ?)`,
    ).run(playerId, hashToken(token), now, now);
    saveActiveGame(nextGame);
  });
  transaction();

  return { token, game: nextGame };
}

export function validatePlayer(playerId: PlayerId, token: string): Game {
  const row = getDb()
    .prepare("select * from player_sessions where player_id = ?")
    .get(playerId) as PlayerSessionRow | undefined;

  if (!row || !validateToken(token, row.token_hash)) {
    throw new Error("Session joueur invalide.");
  }

  const game = getActiveGame();
  if (!game) {
    throw new Error("Aucune partie active.");
  }

  return game;
}

export function touchPlayer(playerId: PlayerId, token: string): Game {
  const game = validatePlayer(playerId, token);
  const now = new Date().toISOString();
  getDb()
    .prepare("update player_sessions set last_seen_at = ? where player_id = ?")
    .run(now, playerId);

  const nextGame: Game = {
    ...game,
    players: game.players.map((player) =>
      player.id === playerId ? { ...player, lastSeenAt: now, cardSeen: true } : player,
    ),
    updatedAt: now,
  };
  saveActiveGame(nextGame);
  return nextGame;
}

export function reassignPlayer(playerId: PlayerId, masterToken: string): Game {
  const game = requireMaster(masterToken);
  const now = new Date().toISOString();
  getDb().prepare("delete from player_sessions where player_id = ?").run(playerId);
  const nextGame: Game = {
    ...game,
    players: game.players.map((player) =>
      player.id === playerId
        ? { ...player, claimed: false, cardSeen: false, lastSeenAt: undefined }
        : player,
    ),
    updatedAt: now,
  };
  saveActiveGame(nextGame);
  return nextGame;
}

export function advanceActivePhase(masterToken: string): Game {
  const game = requireMaster(masterToken);
  const nextGame = nextPhase(game);
  saveActiveGame(nextGame);
  return nextGame;
}

export function applyActiveAccusation(masterToken: string, input: AccusationInput): Game {
  const game = requireMaster(masterToken);
  const nextGame = resolveAccusation(game, input);
  saveActiveGame(nextGame);
  return nextGame;
}

export function healSuspicion(masterToken: string, playerId: PlayerId): Game {
  const game = requireMaster(masterToken);
  const nextGame = removeSuspicion(game, playerId);
  saveActiveGame(nextGame);
  return nextGame;
}
