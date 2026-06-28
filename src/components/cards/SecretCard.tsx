import type { SecretCase } from "@/lib/game/types";
import { CardFrame } from "@/components/cards/CardFrame";

export function SecretCard({ secret }: { secret: SecretCase }) {
  return (
    <CardFrame title={secret.title} subtitle={`Affaire · ${secret.difficulty}`} image={secret.image}>
      <dl className="grid gap-1 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-stone-400">Lieu</dt>
          <dd className="text-right text-stone-100">{secret.elements.lieu}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone-400">Objet</dt>
          <dd className="text-right text-stone-100">{secret.elements.objet}</dd>
        </div>
      </dl>
    </CardFrame>
  );
}
