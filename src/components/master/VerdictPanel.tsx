import type { PublicAccusation } from "@/lib/game/types";

export function VerdictPanel({ accusation }: { accusation?: PublicAccusation }) {
  return (
    <section className="panel p-4">
      <h2 className="text-xl font-black text-stone-50">Dernier verdict</h2>
      {accusation ? (
        <div className="mt-3">
          <p className="text-sm uppercase tracking-[0.18em] text-amber-200">{accusation.verdict}</p>
          <p className="mt-1 text-stone-100">{accusation.narratorText}</p>
        </div>
      ) : (
        <p className="mt-3 text-stone-400">Aucune accusation resolue.</p>
      )}
    </section>
  );
}
