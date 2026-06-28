"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, RefreshCw } from "lucide-react";
import type { AccusationInput, MasterSnapshot } from "@/lib/game/types";
import { ghostButtonClass } from "@/lib/ui";
import { PhaseController } from "@/components/game/PhaseController";
import { TruthTable } from "@/components/master/TruthTable";
import { AccusationForm } from "@/components/master/AccusationForm";
import { VerdictPanel } from "@/components/master/VerdictPanel";
import { NarratorScript } from "@/components/master/NarratorScript";

export function MasterDashboard() {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<MasterSnapshot | null>(null);
  const [error, setError] = useState("");
  const [origin] = useState(() => (typeof window === "undefined" ? "" : window.location.origin));
  const lastAccusation = useMemo(
    () => snapshot?.publicAccusations.at(-1),
    [snapshot?.publicAccusations],
  );

  const load = useCallback(async () => {
    const masterToken = localStorage.getItem("village-mysterieux:master-token");
    if (!masterToken) {
      router.push("/master/setup");
      return;
    }

    const response = await fetch("/api/master/snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ masterToken }),
    });
    const payload = (await response.json()) as { ok: boolean; snapshot?: MasterSnapshot; error?: string };

    if (!payload.ok || !payload.snapshot) {
      setError(payload.error ?? "Acces maitre invalide.");
      return;
    }

    setSnapshot(payload.snapshot);
  }, [router]);

  const action = useCallback(async (body: Record<string, unknown>) => {
    const masterToken = localStorage.getItem("village-mysterieux:master-token");
    if (!masterToken) return;
    const response = await fetch("/api/master/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ masterToken, ...body }),
    });
    const payload = (await response.json()) as { ok: boolean; error?: string };
    if (!payload.ok) setError(payload.error ?? "Action impossible.");
    await load();
  }, [load]);

  const resolveAccusation = useCallback(
    (accusation: AccusationInput) => action({ action: "accuse", accusation }),
    [action],
  );

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(), 5000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(timer);
    };
  }, [load]);

  if (error && !snapshot) {
    return <div className="panel p-5 text-red-200">{error}</div>;
  }

  if (!snapshot) {
    return <div className="panel p-5 text-stone-200">Chargement du mode maitre...</div>;
  }

  const joinUrl = `${origin}/join`;
  const phase = snapshot.phase ?? "joining";
  const isResolutionPhase = phase === "resolution";
  const showCouncilAccusationForm = phase === "conseil";

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Mode maitre</p>
          <h1 className="text-4xl font-black text-stone-50">Le conseil du village</h1>
          <p className="mt-1 text-stone-300">
            Code partie <span className="font-black text-amber-200">{snapshot.joinCode}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={ghostButtonClass} onClick={() => navigator.clipboard.writeText(joinUrl)} type="button">
            <Copy size={18} />
            Copier /join
          </button>
          <button className={ghostButtonClass} onClick={load} type="button">
            <RefreshCw size={18} />
            Actualiser
          </button>
        </div>
      </div>

      {error ? <p className="rounded-md bg-red-950/50 p-3 text-red-200">{error}</p> : null}

      <PhaseController
        phase={phase}
        round={snapshot.round ?? 1}
        maxRounds={snapshot.maxRounds ?? 1}
        onAdvance={() => action({ action: "advancePhase" })}
      />

      {isResolutionPhase ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <AccusationForm players={snapshot.truth.players} featured onSubmit={resolveAccusation} />
          <div className="grid content-start gap-5">
            <NarratorScript text={lastAccusation?.narratorText} />
            <VerdictPanel accusation={lastAccusation} />
          </div>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
          <div className="grid gap-5">
            <TruthTable players={snapshot.truth.players} />
            {showCouncilAccusationForm ? (
              <AccusationForm players={snapshot.truth.players} featured onSubmit={resolveAccusation} />
            ) : null}
          </div>
          <div className="grid content-start gap-5">
            <NarratorScript text={lastAccusation?.narratorText} />
            <VerdictPanel accusation={lastAccusation} />
          </div>
        </div>
      )}
    </div>
  );
}
