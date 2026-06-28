import { Circle, CircleCheck, Eye, UserCheck } from "lucide-react";
import type { PublicPlayer } from "@/lib/game/types";

export function PlayerStatusBoard({ players }: { players: PublicPlayer[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <div key={player.id} className="panel flex items-center justify-between gap-3 p-3">
          <div>
            <p className="font-semibold text-stone-50">{player.name}</p>
            <p className="text-xs text-stone-400">
              {player.revealed ? "Secret revele" : player.claimed ? "Connecte" : "Non reclame"} ·{" "}
              {player.suspicion} soupcon(s)
            </p>
          </div>
          <div className="flex gap-1 text-amber-200">
            {player.claimed ? <UserCheck size={18} /> : <Circle size={18} />}
            {player.cardSeen ? <Eye size={18} /> : null}
            {player.revealed ? <CircleCheck size={18} /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
