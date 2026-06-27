import { describe, expect, it } from "vitest";
import { createGame, normalizePlayerNames } from "@/lib/game/assign";

const names = ["Nico", "Lea", "Hugo", "Clara", "Sam", "Ines", "Tom", "Maya", "Noe", "Lina", "Eli", "Zoé"];

describe("createGame", () => {
  it("creates deterministic assignments for the same seed", () => {
    const first = createGame({ playerNames: names.slice(0, 8), seed: "same" });
    const second = createGame({ playerNames: names.slice(0, 8), seed: "same" });

    expect(first.players.map((player) => [player.name, player.roleId, player.secretCaseId, player.fragmentIndex])).toEqual(
      second.players.map((player) => [player.name, player.roleId, player.secretCaseId, player.fragmentIndex]),
    );
  });

  it("creates one solo for odd player counts", () => {
    const game = createGame({ playerNames: names.slice(0, 7), seed: "odd" });
    expect(game.players.filter((player) => player.fragmentIndex === "solo")).toHaveLength(1);
    expect(new Set(game.players.map((player) => player.roleId)).size).toBe(7);
  });

  it("creates six duos for twelve players", () => {
    const game = createGame({ playerNames: names, seed: "twelve" });
    expect(new Set(game.players.map((player) => player.teamId)).size).toBe(6);
    expect(game.players.some((player) => player.fragmentIndex === "solo")).toBe(false);
  });

  it("rejects duplicate names", () => {
    expect(() => normalizePlayerNames(["Nico", "nico", "A", "B", "C", "D"])).toThrow(/double/);
  });
});
