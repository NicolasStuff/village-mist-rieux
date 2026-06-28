import { getPublicSnapshot } from "@/lib/game/snapshots";
import { claimPlayer, getActiveGame, touchPlayer, validatePlayer } from "@/lib/server/game-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const game = getActiveGame();
  const publicSnapshot = getPublicSnapshot(game);

  return Response.json({
    ...publicSnapshot,
    claimablePlayers: game?.players
      .filter((player) => !player.claimed)
      .map(({ id, name, claimed }) => ({ id, name, claimed })) ?? [],
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    action: "claim" | "resume" | "heartbeat";
    joinCode?: string;
    playerId?: string;
    token?: string;
  };

  if (!body.playerId) {
    return Response.json({ ok: false, error: "playerId manquant" }, { status: 400 });
  }

  try {
    if (body.action === "claim") {
      const result = claimPlayer(body.joinCode ?? "", body.playerId);
      return Response.json({ ok: true, playerId: body.playerId, token: result.token });
    }

    if (!body.token) {
      return Response.json({ ok: false, error: "token manquant" }, { status: 400 });
    }

    if (body.action === "heartbeat") {
      touchPlayer(body.playerId, body.token);
    } else {
      validatePlayer(body.playerId, body.token);
    }

    return Response.json({ ok: true, playerId: body.playerId });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Erreur session" },
      { status: 401 },
    );
  }
}
