import { getRole, roles } from "@/lib/game/catalog/roles";
import { allSecrets, getSecret } from "@/lib/game/catalog/secrets";
import type { Game, MasterSnapshot, PlayerSnapshot, PublicSnapshot } from "@/lib/game/types";

export function getPublicSnapshot(game?: Game | null): PublicSnapshot {
  if (!game) {
    return {
      active: false,
      players: [],
      publicAccusations: [],
    };
  }

  return {
    active: true,
    joinCode: game.joinCode,
    phase: game.phase,
    round: game.round,
    maxRounds: game.maxRounds,
    players: game.players.map(({ id, name, suspicion, revealed, claimed, cardSeen }) => ({
      id,
      name,
      suspicion,
      revealed,
      claimed,
      cardSeen,
    })),
    publicAccusations: game.accusations.map(
      ({ id, round, accuserIds, targetPlayerIds, verdict, narratorText }) => ({
        id,
        round,
        accuserIds,
        targetPlayerIds,
        verdict,
        narratorText,
      }),
    ),
  };
}

export function getPlayerSnapshot(game: Game, playerId: string): PlayerSnapshot {
  const player = game.players.find((item) => item.id === playerId);

  if (!player) {
    throw new Error("Joueur introuvable.");
  }

  const secret = getSecret(player.secretCaseId);
  const fragmentText =
    player.fragmentIndex === "solo"
      ? secret.soloText || secret.fullReveal
      : secret.fragments[player.fragmentIndex];

  return {
    ...getPublicSnapshot(game),
    self: {
      playerId: player.id,
      name: player.name,
      role: getRole(player.roleId),
      secretTitle: secret.title,
      fragmentText,
      isRevealed: player.revealed,
      roleUsed: player.roleUsed,
    },
  };
}

export function getMasterSnapshot(game: Game): MasterSnapshot {
  return {
    ...getPublicSnapshot(game),
    truth: {
      players: game.players,
      roles,
      secrets: allSecrets,
    },
  };
}
