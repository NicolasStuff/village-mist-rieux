import { getPublicSnapshot } from "@/lib/game/snapshots";
import { getActiveGame } from "@/lib/server/game-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(getPublicSnapshot(getActiveGame()));
}
