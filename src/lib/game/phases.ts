import type { Game, GamePhase } from "@/lib/game/types";

export const phaseOrder: GamePhase[] = [
  "joining",
  "deal",
  "lecture",
  "enquete",
  "pouvoirs",
  "conseil",
  "resolution",
];

function normalizePhase(phase: GamePhase | "rumeurs" | "questions"): GamePhase {
  if (phase === "rumeurs" || phase === "questions") {
    return "enquete";
  }

  return phase;
}

export function nextPhase(game: Game, now = new Date().toISOString()): Game {
  const phase = normalizePhase(game.phase);

  if (phase === "finished") {
    return game;
  }

  const index = phaseOrder.indexOf(phase);
  if (index === -1) {
    return { ...game, phase: "joining", updatedAt: now };
  }

  if (phase === "resolution") {
    if (game.round >= game.maxRounds) {
      return { ...game, phase: "finished", updatedAt: now };
    }

    return {
      ...game,
      phase: "enquete",
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
