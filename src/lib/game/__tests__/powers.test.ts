import { describe, expect, it } from "vitest";
import { createGame } from "@/lib/game/assign";
import { markRoleUsed, removeSuspicion } from "@/lib/game/powers";

describe("powers", () => {
  it("marks a role as used", () => {
    const game = createGame({ playerNames: ["A", "B", "C", "D", "E", "F"], seed: "power" });
    const next = markRoleUsed(game, game.players[0].id);
    expect(next.players[0].roleUsed).toBe(true);
  });

  it("removes suspicion without going below zero", () => {
    const game = createGame({ playerNames: ["A", "B", "C", "D", "E", "F"], seed: "heal" });
    const next = removeSuspicion(game, game.players[0].id);
    expect(next.players[0].suspicion).toBe(0);
    expect(next.players[0].roleUsed).toBe(true);
  });
});
