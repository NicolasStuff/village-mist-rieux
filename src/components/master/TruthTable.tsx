import { getRole } from "@/lib/game/catalog/roles";
import { getSecret } from "@/lib/game/catalog/secrets";
import type { Player } from "@/lib/game/types";

export function TruthTable({ players }: { players: Player[] }) {
  return (
    <section className="panel p-4">
      <h2 className="text-xl font-black text-stone-50">Verite du village</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="text-left text-xs uppercase tracking-[0.16em] text-amber-200">
            <tr>
              <th className="border-b border-stone-800 py-2 pr-3">Joueur</th>
              <th className="border-b border-stone-800 py-2 pr-3">Role</th>
              <th className="border-b border-stone-800 py-2 pr-3">Equipe</th>
              <th className="border-b border-stone-800 py-2 pr-3">Affaire</th>
              <th className="border-b border-stone-800 py-2 pr-3">Fragment</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const secret = getSecret(player.secretCaseId);
              return (
                <tr key={player.id} className="text-stone-200">
                  <td className="border-b border-stone-900 py-2 pr-3 font-semibold">{player.name}</td>
                  <td className="border-b border-stone-900 py-2 pr-3">{getRole(player.roleId).name}</td>
                  <td className="border-b border-stone-900 py-2 pr-3">{player.teamId}</td>
                  <td className="border-b border-stone-900 py-2 pr-3">{secret.title}</td>
                  <td className="border-b border-stone-900 py-2 pr-3">
                    {player.fragmentIndex === "solo" ? "solo" : `fragment ${player.fragmentIndex + 1}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
