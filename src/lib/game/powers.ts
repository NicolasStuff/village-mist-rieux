import type { Game, PlayerId } from "@/lib/game/types";

export function markRoleUsed(game: Game, playerId: PlayerId, now = new Date().toISOString()): Game {
  return {
    ...game,
    players: game.players.map((player) =>
      player.id === playerId ? { ...player, roleUsed: true } : player,
    ),
    updatedAt: now,
  };
}

export function removeSuspicion(game: Game, playerId: PlayerId, now = new Date().toISOString()): Game {
  return {
    ...game,
    players: game.players.map((player) =>
      player.id === playerId
        ? { ...player, suspicion: Math.max(0, player.suspicion - 1), roleUsed: true }
        : player,
    ),
    updatedAt: now,
  };
}
