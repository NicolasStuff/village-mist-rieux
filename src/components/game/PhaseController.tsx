"use client";

import { FastForward } from "lucide-react";
import type { GamePhase } from "@/lib/game/types";
import { ghostButtonClass } from "@/lib/ui";

const phaseLabels: Record<GamePhase, string> = {
  setup: "Preparation",
  joining: "Connexion des joueurs",
  deal: "Distribution des cartes",
  lecture: "Lecture silencieuse",
  rumeurs: "Rumeurs",
  questions: "Questions officielles",
  pouvoirs: "Pouvoirs",
  conseil: "Conseil",
  resolution: "Resolution",
  finished: "Fin de partie",
};

export function PhaseController({
  phase,
  round,
  maxRounds,
  onAdvance,
}: {
  phase: GamePhase;
  round: number;
  maxRounds: number;
  onAdvance?: () => void;
}) {
  const phaseLabel = phaseLabels[phase] ?? phase;

  return (
    <div className="panel flex flex-wrap items-center justify-between gap-3 p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Phase</p>
        <h2 className="text-2xl font-black text-stone-50">{phaseLabel}</h2>
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
