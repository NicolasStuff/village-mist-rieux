import { RotateCcw } from "lucide-react";
import type { Player } from "@/lib/game/types";
import { ghostButtonClass } from "@/lib/ui";

export function ConnectionBoard({
  players,
  onReassign,
}: {
  players: Player[];
  onReassign: (playerId: string) => void;
}) {
  return (
    <section className="panel p-4">
      <h2 className="text-xl font-black text-stone-50">Connexions</h2>
      <div className="mt-3 grid gap-2">
        {players.map((player) => (
          <div key={player.id} className="flex items-center justify-between gap-3 rounded-md bg-stone-950/50 p-3">
            <div>
              <p className="font-semibold text-stone-50">{player.name}</p>
              <p className="text-xs text-stone-400">
                {player.claimed ? "Appareil associe" : "A reclamer"} · {player.cardSeen ? "carte vue" : "carte non vue"}
              </p>
            </div>
            <button className={ghostButtonClass} onClick={() => onReassign(player.id)} type="button">
              <RotateCcw size={16} />
              Liberer
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
