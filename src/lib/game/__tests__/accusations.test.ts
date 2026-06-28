import { describe, expect, it } from "vitest";
import { createGame } from "@/lib/game/assign";
import { getSecret } from "@/lib/game/catalog/secrets";
import { resolveAccusation } from "@/lib/game/accusations";

const names = ["Nico", "Lea", "Hugo", "Clara", "Sam", "Ines"];

function firstTeamGame() {
  const game = createGame({ playerNames: names, seed: "accusation" });
  const first = game.players[0];
  const team = game.players.filter((player) => player.teamId === first.teamId);
  const secret = getSecret(first.secretCaseId);
  return { game, team, secret };
}

describe("resolveAccusation", () => {
  it("reveals a duo on correct accusation", () => {
    const { game, team, secret } = firstTeamGame();
    const next = resolveAccusation(game, {
      accuserIds: [game.players[2].id],
      targetPlayerIds: team.map((player) => player.id),
      claimedSecretCaseId: secret.id,
      claimedElements: secret.elements,
    });

    expect(next.revealedSecretCaseIds).toContain(secret.id);
    expect(next.players.filter((player) => team.some((mate) => mate.id === player.id)).every((player) => player.revealed)).toBe(true);
    expect(next.accusations.at(-1)?.verdict).toBe("correct");
  });

  it("adds suspicion on false accusation", () => {
    const { game, team, secret } = firstTeamGame();
    const accuser = game.players[2];
    const wrongTarget = [team[0].id, game.players.find((player) => player.teamId !== team[0].teamId && player.id !== accuser.id)!.id];
    const next = resolveAccusation(game, {
      accuserIds: [accuser.id],
      targetPlayerIds: wrongTarget,
      claimedSecretCaseId: secret.id,
      claimedElements: secret.elements,
    });

    expect(next.players.find((player) => player.id === accuser.id)?.suspicion).toBe(1);
    expect(next.accusations.at(-1)?.verdict).toBe("false");
  });

  it("blocks once with garde champetre", () => {
    const { game, team, secret } = firstTeamGame();
    const protectedGame = {
      ...game,
      players: game.players.map((player) =>
        player.id === team[0].id ? { ...player, roleId: "garde-champetre" } : player,
      ),
    };
    const next = resolveAccusation(protectedGame, {
      accuserIds: [game.players[2].id],
      targetPlayerIds: team.map((player) => player.id),
      claimedSecretCaseId: secret.id,
      claimedElements: secret.elements,
      useGardeChampetre: true,
    });

    expect(next.accusations.at(-1)?.verdict).toBe("blocked");
    expect(next.revealedSecretCaseIds).not.toContain(secret.id);
    expect(next.players.find((player) => player.id === team[0].id)?.roleUsed).toBe(true);
  });
});
