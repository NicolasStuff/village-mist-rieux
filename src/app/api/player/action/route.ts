import { touchPlayer } from "@/lib/server/game-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { playerId?: string; token?: string; action?: "cardSeen" };

  if (!body.playerId || !body.token) {
    return Response.json({ ok: false, error: "Session incomplete" }, { status: 400 });
  }

  try {
    touchPlayer(body.playerId, body.token);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Action impossible" },
      { status: 401 },
    );
  }
}
