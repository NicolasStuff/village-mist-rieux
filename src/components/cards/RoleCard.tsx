import type { RoleCard as RoleCardType } from "@/lib/game/types";
import { CardFrame } from "@/components/cards/CardFrame";

export function RoleCard({ role }: { role: RoleCardType }) {
  return (
    <CardFrame title={role.name} subtitle={`Role · ${role.category}`} image={role.image}>
      <p>{role.effect}</p>
      <p className="mt-2 text-amber-100">{role.limitation}</p>
    </CardFrame>
  );
}
