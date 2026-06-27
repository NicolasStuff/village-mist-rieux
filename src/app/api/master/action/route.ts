import {
  advanceActivePhase,
  applyActiveAccusation,
  healSuspicion,
  reassignPlayer,
  replaceActiveGame,
} from "@/lib/server/game-store";
import type { AccusationInput } from "@/lib/game/types";

export const runtime = "nodejs";

type MasterBody =
  | {
      action: "create";
      playerNames: string[];
      seed: string;
      masterCode?: string;
    }
  | {
      action: "advancePhase";
      masterToken: string;
    }
  | {
      action: "accuse";
      masterToken: string;
      accusation: AccusationInput;
    }
  | {
      action: "reassign";
      masterToken: string;
      playerId: string;
    }
  | {
      action: "heal";
      masterToken: string;
      playerId: string;
    };

export async function POST(request: Request) {
  const body = (await request.json()) as MasterBody;

  try {
    if (body.action === "create") {
      const { game, masterToken } = replaceActiveGame(body.playerNames, body.seed, body.masterCode);
      return Response.json({ ok: true, game, masterToken });
    }

    if (body.action === "advancePhase") {
      return Response.json({ ok: true, game: advanceActivePhase(body.masterToken) });
    }

    if (body.action === "accuse") {
      return Response.json({
        ok: true,
        game: applyActiveAccusation(body.masterToken, body.accusation),
      });
    }

    if (body.action === "reassign") {
      return Response.json({ ok: true, game: reassignPlayer(body.playerId, body.masterToken) });
    }

    if (body.action === "heal") {
      return Response.json({ ok: true, game: healSuspicion(body.masterToken, body.playerId) });
    }

    return Response.json({ ok: false, error: "Action inconnue" }, { status: 400 });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Action impossible" },
      { status: 400 },
    );
  }
}
