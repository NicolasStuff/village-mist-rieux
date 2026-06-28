"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, ShieldAlert } from "lucide-react";
import type { PlayerSnapshot } from "@/lib/game/types";
import { PrivateCardPanel } from "@/components/player/PrivateCardPanel";
import { PlayerStatusBoard } from "@/components/game/PlayerStatusBoard";
import { PhaseController } from "@/components/game/PhaseController";
import { ghostButtonClass } from "@/lib/ui";

export function PlayerDashboard() {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<PlayerSnapshot | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const playerId = localStorage.getItem("village-mysterieux:player-id");
    const token = localStorage.getItem("village-mysterieux:player-token");

    if (!playerId || !token) {
      router.push("/join");
      return;
    }

    const response = await fetch("/api/player/snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, token }),
    });
    const payload = (await response.json()) as { ok: boolean; snapshot?: PlayerSnapshot; error?: string };

    if (!payload.ok || !payload.snapshot) {
      localStorage.removeItem("village-mysterieux:player-id");
      localStorage.removeItem("village-mysterieux:player-token");
      setError(payload.error ?? "Session expiree.");
      router.push("/join");
      return;
    }

    setSnapshot(payload.snapshot);
    await fetch("/api/player/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, token, action: "cardSeen" }),
    });
  }, [router]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(), 5000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(timer);
    };
  }, [load]);

  if (error) {
    return <div className="panel p-5 text-red-200">{error}</div>;
  }

  if (!snapshot) {
    return <div className="panel p-5 text-stone-200">Chargement de ta carte...</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Vue joueur</p>
          <h1 className="text-4xl font-black text-stone-50">{snapshot.self.name}</h1>
        </div>
        <button className={ghostButtonClass} onClick={load} type="button">
          <RefreshCw size={18} />
          Actualiser
        </button>
      </div>
      <PrivateCardPanel snapshot={snapshot} />
      <PhaseController
        phase={snapshot.phase ?? "joining"}
        round={snapshot.round ?? 1}
        maxRounds={snapshot.maxRounds ?? 1}
      />
      <section className="grid gap-3">
        <h2 className="flex items-center gap-2 text-xl font-black text-stone-50">
          <ShieldAlert size={20} />
          Village public
        </h2>
        <PlayerStatusBoard players={snapshot.players} />
      </section>
    </div>
  );
}
