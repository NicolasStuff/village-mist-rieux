import { duoSecrets, soloSecrets } from "@/lib/game/catalog/secrets";
import { roles } from "@/lib/game/catalog/roles";
import { createRng, pickCode, shuffle } from "@/lib/game/rng";
import type { Game, Player } from "@/lib/game/types";

export function maxRoundsForPlayerCount(playerCount: number): number {
  if (playerCount <= 7) {
    return 3;
  }

  if (playerCount <= 9) {
    return 4;
  }

  return 5;
}

export function normalizePlayerNames(playerNames: string[]): string[] {
  const normalized = playerNames.map((name) => name.trim()).filter(Boolean);
  const seen = new Set<string>();

  for (const name of normalized) {
    const key = name.toLocaleLowerCase("fr-FR");
    if (seen.has(key)) {
      throw new Error(`Nom de joueur en double: ${name}`);
    }
    seen.add(key);
  }

  if (normalized.length < 6 || normalized.length > 12) {
    throw new Error("Le Village Mysterieux se joue de 6 a 12 joueurs.");
  }

  return normalized;
}

type CreateGameOptions = {
  playerNames: string[];
  seed: string;
  joinCode?: string;
  now?: string;
};

export function createGame({
  playerNames,
  seed,
  joinCode,
  now = new Date().toISOString(),
}: CreateGameOptions): Game {
  const names = normalizePlayerNames(playerNames);
  const rng = createRng(seed);
  const shuffledNames = shuffle(names, rng);
  const shuffledRoles = shuffle(roles, rng);
  const shuffledDuoSecrets = shuffle(duoSecrets, rng);
  const shuffledSoloSecrets = shuffle(soloSecrets, rng);
  const hasSolo = shuffledNames.length % 2 === 1;
  const soloName = hasSolo ? shuffledNames.at(-1) : undefined;
  const pairedNames = hasSolo ? shuffledNames.slice(0, -1) : shuffledNames;

  const players: Player[] = [];

  for (let index = 0; index < pairedNames.length; index += 2) {
    const secret = shuffledDuoSecrets[index / 2];
    const teamId = `team-${index / 2 + 1}`;
    const firstFragment = rng() > 0.5 ? 0 : 1;
    const secondFragment = firstFragment === 0 ? 1 : 0;
    const pair = [pairedNames[index], pairedNames[index + 1]];

    pair.forEach((name, pairIndex) => {
      const role = shuffledRoles[players.length];
      players.push({
        id: `player-${players.length + 1}`,
        name,
        roleId: role.id,
        secretCaseId: secret.id,
        fragmentIndex: pairIndex === 0 ? firstFragment : secondFragment,
        teamId,
        suspicion: 0,
        revealed: false,
        roleUsed: false,
        claimed: false,
        cardSeen: false,
      });
    });
  }

  if (soloName) {
    const secret = shuffledSoloSecrets[0];
    const role = shuffledRoles[players.length];
    players.push({
      id: `player-${players.length + 1}`,
      name: soloName,
      roleId: role.id,
      secretCaseId: secret.id,
      fragmentIndex: "solo",
      teamId: `solo-${players.length + 1}`,
      suspicion: 0,
      revealed: false,
      roleUsed: false,
      claimed: false,
      cardSeen: false,
    });
  }

  return {
    schemaVersion: 1,
    id: crypto.randomUUID(),
    joinCode: joinCode || pickCode(rng),
    seed,
    players,
    phase: "joining",
    round: 1,
    maxRounds: maxRoundsForPlayerCount(names.length),
    accusations: [],
    revealedSecretCaseIds: [],
    startedAt: now,
    updatedAt: now,
  };
}
