import type { Game, GamePhase } from "@/lib/game/types";

export const phaseOrder: GamePhase[] = [
  "joining",
  "deal",
  "lecture",
  "rumeurs",
  "questions",
  "pouvoirs",
  "conseil",
  "resolution",
];

export function nextPhase(game: Game, now = new Date().toISOString()): Game {
  if (game.phase === "finished") {
    return game;
  }

  const index = phaseOrder.indexOf(game.phase);
  if (index === -1) {
    return { ...game, phase: "joining", updatedAt: now };
  }

  if (game.phase === "resolution") {
    if (game.round >= game.maxRounds) {
      return { ...game, phase: "finished", updatedAt: now };
    }

    return {
      ...game,
      phase: "rumeurs",
      round: game.round + 1,
      updatedAt: now,
    };
  }

  return {
    ...game,
    phase: phaseOrder[index + 1] ?? "finished",
    updatedAt: now,
  };
}
