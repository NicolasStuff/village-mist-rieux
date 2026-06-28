"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import { useState } from "react";
import type { PlayerSnapshot } from "@/lib/game/types";
import { RoleCard } from "@/components/cards/RoleCard";

const CARD_BACK_IMAGE = "/assets/cards/card-back.webp";

export function PrivateCardPanel({ snapshot }: { snapshot: PlayerSnapshot }) {
  const [roleRevealed, setRoleRevealed] = useState(false);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(240px,320px)_1fr]">
      {roleRevealed ? (
        <RoleCard role={snapshot.self.role} />
      ) : (
        <button
          type="button"
          className="card-frame reveal-card"
          onClick={() => setRoleRevealed(true)}
          aria-label="Devoiler ton role"
          title="Devoiler ton role"
        >
          <span className="relative block aspect-[3/4] overflow-hidden rounded-md bg-stone-900">
            <Image
              src={CARD_BACK_IMAGE}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 80vw, 320px"
              className="reveal-card-image object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
            <span className="absolute bottom-0 left-0 right-0 p-4">
              <span className="block text-xs uppercase tracking-[0.22em] text-amber-200">Carte cachee</span>
              <span className="mt-1 block text-2xl font-black text-stone-50">Ton role</span>
            </span>
          </span>
        </button>
      )}
      <div className="panel p-5">
        <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-amber-200">
          <Eye size={16} />
          Fragment secret
        </p>
        <h2 className="text-3xl font-black text-stone-50">{snapshot.self.secretTitle}</h2>
        <p className="mt-4 text-lg leading-8 text-stone-100">{snapshot.self.fragmentText}</p>
        <p className="mt-5 text-sm text-stone-400">
          Cette information est personnelle. Tu peux mentir, eluder ou tendre un piege, mais ne montre pas
          ton ecran.
        </p>
      </div>
    </div>
  );
}
