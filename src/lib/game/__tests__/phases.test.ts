import { describe, expect, it } from "vitest";
import { createGame } from "@/lib/game/assign";
import { nextPhase } from "@/lib/game/phases";
import type { Game } from "@/lib/game/types";

describe("nextPhase", () => {
  it("uses a single investigation phase between reading and powers", () => {
    const game = createGame({ playerNames: ["A", "B", "C", "D", "E", "F"], seed: "phases" });

    const deal = nextPhase(game);
    const lecture = nextPhase(deal);
    const enquete = nextPhase(lecture);
    const pouvoirs = nextPhase(enquete);

    expect(deal.phase).toBe("deal");
    expect(lecture.phase).toBe("lecture");
    expect(enquete.phase).toBe("enquete");
    expect(pouvoirs.phase).toBe("pouvoirs");
  });

  it("keeps old saved question phases moving to powers", () => {
    const game = createGame({ playerNames: ["A", "B", "C", "D", "E", "F"], seed: "legacy" });
    const legacyGame = { ...game, phase: "questions" as Game["phase"] };

    expect(nextPhase(legacyGame).phase).toBe("pouvoirs");
  });
});
