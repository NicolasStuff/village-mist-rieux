import { getPlayerSnapshot } from "@/lib/game/snapshots";
import { validatePlayer } from "@/lib/server/game-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as { playerId?: string; token?: string };

  if (!body.playerId || !body.token) {
    return Response.json({ ok: false, error: "Session incomplete" }, { status: 400 });
  }

  try {
    const game = validatePlayer(body.playerId, body.token);
    return Response.json({ ok: true, snapshot: getPlayerSnapshot(game, body.playerId) });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Acces refuse" },
      { status: 401 },
    );
  }
}
