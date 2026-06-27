"use client";

import { HeartPulse } from "lucide-react";
import type { Player } from "@/lib/game/types";
import { ghostButtonClass } from "@/lib/ui";

export function PowerResolutionPanel({
  players,
  onHeal,
}: {
  players: Player[];
  onHeal: (playerId: string) => void;
}) {
  return (
    <section className="panel p-4">
      <h2 className="text-xl font-black text-stone-50">Pouvoirs rapides</h2>
      <div className="mt-3 grid gap-2">
        {players.map((player) => (
          <button
            key={player.id}
            className={ghostButtonClass}
            onClick={() => onHeal(player.id)}
            type="button"
            disabled={player.suspicion === 0}
          >
            <HeartPulse size={16} />
            Retirer un soupcon a {player.name}
          </button>
        ))}
      </div>
    </section>
  );
}
