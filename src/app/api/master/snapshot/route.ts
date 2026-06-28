import { getMasterSnapshot } from "@/lib/game/snapshots";
import { requireMaster } from "@/lib/server/game-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as { masterToken?: string };

  if (!body.masterToken) {
    return Response.json({ ok: false, error: "Token maitre manquant" }, { status: 400 });
  }

  try {
    const game = requireMaster(body.masterToken);
    return Response.json({ ok: true, snapshot: getMasterSnapshot(game) });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Acces maitre refuse" },
      { status: 401 },
    );
  }
}
