import { assertDbReady } from "@/lib/server/db";

export const runtime = "nodejs";

export async function GET() {
  const database = assertDbReady();

  return Response.json({
    ok: true,
    database: database ? "up" : "down",
    service: "village-mysterieux",
  });
}
