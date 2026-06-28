"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { roles } from "@/lib/game/catalog/roles";
import { allSecrets } from "@/lib/game/catalog/secrets";
import { RoleCard } from "@/components/cards/RoleCard";
import { SecretCard } from "@/components/cards/SecretCard";

type Filter = "all" | "roles" | "secrets" | "solo";

export function CardGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const cards = useMemo(() => {
    const roleCards = roles.map((role) => ({ type: "role" as const, id: role.id, data: role }));
    const secretCards = allSecrets.map((secret) => ({
      type: secret.id.startsWith("solitaire") ? ("solo" as const) : ("secret" as const),
      id: secret.id,
      data: secret,
    }));
    return [...roleCards, ...secretCards].filter((card) => {
      if (filter === "all") return true;
      if (filter === "roles") return card.type === "role";
      if (filter === "secrets") return card.type === "secret";
      return card.type === "solo";
    });
  }, [filter]);

  return (
    <section>
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ["all", "Tous"],
          ["roles", "Roles"],
          ["secrets", "Secrets"],
          ["solo", "Solitaire"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value as Filter)}
            className={filter === value ? "tab-active" : "tab"}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={`${card.type}-${card.id}`} href={`/tutorial/${card.id}`} className="block">
            {card.type === "role" ? (
              <RoleCard role={card.data} />
            ) : (
              <SecretCard secret={card.data} />
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
