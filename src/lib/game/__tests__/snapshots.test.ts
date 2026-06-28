import { describe, expect, it } from "vitest";
import { createGame } from "@/lib/game/assign";
import { getMasterSnapshot, getPlayerSnapshot, getPublicSnapshot } from "@/lib/game/snapshots";

const game = createGame({
  playerNames: ["Nico", "Lea", "Hugo", "Clara", "Sam", "Ines"],
  seed: "snapshot",
});

describe("snapshots", () => {
  it("keeps hidden fields out of public snapshot", () => {
    const json = JSON.stringify(getPublicSnapshot(game));
    expect(json).not.toContain("secretCaseId");
    expect(json).not.toContain("roleId");
    expect(json).not.toContain("teamId");
    expect(json).not.toContain("fragmentIndex");
  });

  it("player snapshot exposes only one private card", () => {
    const snapshot = getPlayerSnapshot(game, game.players[0].id);
    const json = JSON.stringify(snapshot);
    expect(snapshot.self.playerId).toBe(game.players[0].id);
    expect(json).toContain("fragmentText");
    expect(json).not.toContain(game.players[1].roleId);
    expect(json).not.toContain(game.players[1].teamId);
  });

  it("master snapshot includes truth", () => {
    const snapshot = getMasterSnapshot(game);
    expect(snapshot.truth.players[0].secretCaseId).toBe(game.players[0].secretCaseId);
  });
});
