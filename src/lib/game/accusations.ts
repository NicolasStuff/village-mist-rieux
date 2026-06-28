import { getRole } from "@/lib/game/catalog/roles";
import { getSecret } from "@/lib/game/catalog/secrets";
import { narratorText } from "@/lib/game/narration";
import type { Accusation, AccusationInput, Game, Player } from "@/lib/game/types";

const ELEMENT_KEYS = ["lieu", "objet", "action", "mobile"] as const;

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort();
}

function sameMembers(left: string[], right: string[]) {
  const a = uniqueSorted(left);
  const b = uniqueSorted(right);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function playersForSecret(game: Game, secretCaseId: string): Player[] {
  return game.players.filter((player) => player.secretCaseId === secretCaseId);
}

export function countMatchingElements(input: AccusationInput): number {
  const secret = getSecret(input.claimedSecretCaseId);

  return ELEMENT_KEYS.reduce((count, key) => {
    const claimed = input.claimedElements[key]?.trim().toLocaleLowerCase("fr-FR");
    const actual = secret.elements[key].trim().toLocaleLowerCase("fr-FR");
    return claimed && claimed === actual ? count + 1 : count;
  }, 0);
}

export function validateAccusation(game: Game, input: AccusationInput): string[] {
  const errors: string[] = [];
  const targetPlayers = input.targetPlayerIds.map((id) => game.players.find((player) => player.id === id));

  if (input.accuserIds.length === 0) {
    errors.push("Choisis au moins un accusateur.");
  }

  if (targetPlayers.some((player) => !player)) {
    errors.push("Un joueur cible est introuvable.");
  }

  if (playersForSecret(game, input.claimedSecretCaseId).length === 0) {
    errors.push("Cette affaire n'est portee par aucun joueur dans la partie.");
  }

  const elementCount = ELEMENT_KEYS.filter((key) => input.claimedElements[key]).length;
  if (elementCount < 2) {
    errors.push("Une accusation doit contenir au moins deux elements.");
  }

  const secretPlayers = playersForSecret(game, input.claimedSecretCaseId);
  const expectedTargets = secretPlayers.length === 1 ? 1 : 2;
  if (input.targetPlayerIds.length !== expectedTargets) {
    errors.push(`Cette accusation doit viser ${expectedTargets} joueur(s).`);
  }

  if (targetPlayers.some((player) => player?.revealed)) {
    errors.push("Un joueur deja revele ne peut pas etre une cible principale.");
  }

  return errors;
}

export function resolveAccusation(game: Game, input: AccusationInput, now = new Date().toISOString()): Game {
  const errors = validateAccusation(game, input);
  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }

  const secretPlayers = playersForSecret(game, input.claimedSecretCaseId);
  const targetTeamMatches = sameMembers(
    input.targetPlayerIds,
    secretPlayers.map((player) => player.id),
  );
  const elementMatchCount = countMatchingElements(input);
  const wouldBeCorrect = targetTeamMatches && elementMatchCount >= 2;
  const garde = game.players.find(
    (player) =>
      input.targetPlayerIds.includes(player.id) &&
      player.roleId === "garde-champetre" &&
      !player.roleUsed &&
      !player.revealed,
  );
  const blocked = Boolean(wouldBeCorrect && input.useGardeChampetre && garde);
  const verdict = blocked ? "blocked" : wouldBeCorrect ? "correct" : "false";
  const accusation: Accusation = {
    id: crypto.randomUUID(),
    round: game.round,
    accuserIds: input.accuserIds,
    targetPlayerIds: input.targetPlayerIds,
    claimedSecretCaseId: input.claimedSecretCaseId,
    claimedElements: input.claimedElements,
    verdict,
    appliedRoleIds: blocked ? ["garde-champetre"] : [],
    createdAt: now,
    narratorText: narratorText(verdict, input.claimedSecretCaseId, game.accusations.length),
  };

  const targetIds = new Set(input.targetPlayerIds);
  const accuserIds = new Set(input.accuserIds);
  const nextPlayers = game.players.map((player) => {
    if (blocked && player.id === garde?.id) {
      return { ...player, roleUsed: true };
    }

    if (verdict === "correct" && targetIds.has(player.id)) {
      return { ...player, revealed: true };
    }

    if (verdict === "false" && accuserIds.has(player.id)) {
      return { ...player, suspicion: player.suspicion + 1 };
    }

    return player;
  });

  const newlyRevealed =
    verdict === "correct" && !game.revealedSecretCaseIds.includes(input.claimedSecretCaseId)
      ? [input.claimedSecretCaseId]
      : [];

  const unrevealedTeams = new Set(
    nextPlayers
      .filter((player) => !player.revealed)
      .map((player) => player.teamId),
  );

  return {
    ...game,
    players: nextPlayers,
    phase: unrevealedTeams.size <= 1 ? "finished" : game.phase,
    accusations: [...game.accusations, accusation],
    revealedSecretCaseIds: [...game.revealedSecretCaseIds, ...newlyRevealed],
    updatedAt: now,
  };
}

export function roleCanBlock(playerRoleId: string): boolean {
  return getRole(playerRoleId).id === "garde-champetre";
}
