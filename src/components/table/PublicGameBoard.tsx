"use client";

import { useCallback, useEffect, useState } from "react";
import type { PublicSnapshot } from "@/lib/game/types";
import { PhaseController } from "@/components/game/PhaseController";
import { PlayerStatusBoard } from "@/components/game/PlayerStatusBoard";

export function PublicGameBoard() {
  const [snapshot, setSnapshot] = useState<PublicSnapshot | null>(null);

  const load = useCallback(async () => {
    const response = await fetch("/api/active-game");
    setSnapshot((await response.json()) as PublicSnapshot);
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(), 4000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(timer);
    };
  }, [load]);

  if (!snapshot) {
    return <div className="panel p-5 text-stone-200">Chargement de la place du village...</div>;
  }

  if (!snapshot.active) {
    return <div className="panel p-5 text-stone-200">Aucune partie active.</div>;
  }

  return (
    <div className="grid gap-6">
      <PhaseController
        phase={snapshot.phase ?? "joining"}
        round={snapshot.round ?? 1}
        maxRounds={snapshot.maxRounds ?? 1}
      />
      <PlayerStatusBoard players={snapshot.players} />
      <section className="panel p-5">
        <h2 className="text-2xl font-black text-stone-50">Historique public</h2>
        <div className="mt-4 grid gap-3">
          {snapshot.publicAccusations.length === 0 ? (
            <p className="text-stone-400">Aucune accusation pour le moment.</p>
          ) : (
            snapshot.publicAccusations.map((accusation) => (
              <div key={accusation.id} className="rounded-md border border-stone-800 p-3">
                <p className="text-sm uppercase tracking-[0.18em] text-amber-200">
                  Manche {accusation.round} · {accusation.verdict}
                </p>
                <p className="mt-1 text-stone-100">{accusation.narratorText}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
