"use client";

import { useMemo, useState } from "react";
import { Gavel } from "lucide-react";
import { allSecrets, getSecret } from "@/lib/game/catalog/secrets";
import type { AccusationInput, Player } from "@/lib/game/types";
import { buttonClass } from "@/lib/ui";

export function AccusationForm({
  players,
  onSubmit,
}: {
  players: Player[];
  onSubmit: (input: AccusationInput) => void;
}) {
  const [accuserId, setAccuserId] = useState("");
  const [targetOne, setTargetOne] = useState("");
  const [targetTwo, setTargetTwo] = useState("");
  const [secretId, setSecretId] = useState(allSecrets[0]?.id ?? "");
  const selectedSecret = useMemo(() => getSecret(secretId), [secretId]);

  function submit() {
    const targetPlayerIds = [targetOne, targetTwo].filter(Boolean);
    onSubmit({
      accuserIds: [accuserId].filter(Boolean),
      targetPlayerIds,
      claimedSecretCaseId: secretId,
      claimedElements: selectedSecret.elements,
      useGardeChampetre: true,
    });
  }

  return (
    <section className="panel p-4">
      <h2 className="text-xl font-black text-stone-50">Accusation</h2>
      <div className="mt-4 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="field-label">
            Accusateur
            <select className="field" value={accuserId} onChange={(event) => setAccuserId(event.target.value)}>
              <option value="">Choisir</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Suspect 1
            <select className="field" value={targetOne} onChange={(event) => setTargetOne(event.target.value)}>
              <option value="">Choisir</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Suspect 2
            <select className="field" value={targetTwo} onChange={(event) => setTargetTwo(event.target.value)}>
              <option value="">Solo / aucun</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="field-label">
          Affaire accusee
          <select className="field" value={secretId} onChange={(event) => setSecretId(event.target.value)}>
            {allSecrets.map((secret) => (
              <option key={secret.id} value={secret.id}>
                {secret.title}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded-md border border-stone-800 bg-stone-950/50 p-3 text-sm text-stone-300">
          Elements envoyes au moteur: {selectedSecret.elements.lieu}, {selectedSecret.elements.objet},{" "}
          {selectedSecret.elements.action}, {selectedSecret.elements.mobile}
        </div>
        <button className={buttonClass} disabled={!accuserId || !targetOne || !secretId} onClick={submit} type="button">
          <Gavel size={18} />
          Resoudre l&apos;accusation
        </button>
      </div>
    </section>
  );
}
