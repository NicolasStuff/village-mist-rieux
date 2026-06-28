import { getSecret } from "@/lib/game/catalog/secrets";
import type { AccusationVerdict, SecretCaseId } from "@/lib/game/types";

const templates: Record<AccusationVerdict, string[]> = {
  pending: ["Le village attend encore que le narrateur tranche."],
  correct: [
    'Le silence tombe sur la place. L\'accusation tient debout: l\'affaire "{secretTitle}" est revelee.',
    'Un murmure traverse les volets. Cette fois, le village a vu juste: "{secretTitle}" eclate au grand jour.',
  ],
  false: [
    "Les regards se croisent, mais la piste s'effondre. Cette accusation ne revele aucun secret.",
    "La cloche sonne faux. Le village s'est trompe et les soupcons changent de mains.",
  ],
  blocked: [
    "Le garde champetre frappe du talon. La procedure est interrompue; il faudra revenir avec une preuve plus solide.",
    "La place se fige. Une protection ancienne bloque la revelation avant qu'elle ne soit prononcee.",
  ],
};

export function narratorText(verdict: AccusationVerdict, secretCaseId: SecretCaseId, index = 0): string {
  const secret = getSecret(secretCaseId);
  const options = templates[verdict];
  const template = options[index % options.length];
  return template.replace("{secretTitle}", secret.title);
}
