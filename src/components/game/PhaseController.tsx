"use client";

import { FastForward } from "lucide-react";
import { ghostButtonClass } from "@/lib/ui";

export function PhaseController({
  phase,
  round,
  maxRounds,
  onAdvance,
}: {
  phase: string;
  round: number;
  maxRounds: number;
  onAdvance?: () => void;
}) {
  return (
    <div className="panel flex flex-wrap items-center justify-between gap-3 p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Phase</p>
        <h2 className="text-2xl font-black text-stone-50">{phase}</h2>
        <p className="text-sm text-stone-400">
          Manche {round} / {maxRounds}
        </p>
      </div>
      {onAdvance ? (
        <button className={ghostButtonClass} onClick={onAdvance} type="button">
          <FastForward size={18} />
          Phase suivante
        </button>
      ) : null}
    </div>
  );
}
