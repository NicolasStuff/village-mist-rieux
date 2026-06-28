"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dice5, Wand2 } from "lucide-react";
import { buttonClass, ghostButtonClass } from "@/lib/ui";

const defaultPlayers = ["Nico", "Lea", "Hugo", "Clara", "Sam", "Ines"];

export function MasterSetupForm() {
  const router = useRouter();
  const [names, setNames] = useState(defaultPlayers.join("\n"));
  const [seed, setSeed] = useState("fete-du-village");
  const [masterCode, setMasterCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError("");
    const playerNames = names.split(/\n|,/).map((name) => name.trim()).filter(Boolean);

    const response = await fetch("/api/master/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        playerNames,
        seed,
        masterCode: masterCode || undefined,
      }),
    });
    const payload = (await response.json()) as { ok: boolean; error?: string; masterToken?: string };
    setBusy(false);

    if (!payload.ok || !payload.masterToken) {
      setError(payload.error ?? "Creation impossible.");
      return;
    }

    localStorage.setItem("village-mysterieux:master-token", payload.masterToken);
    router.push("/master");
  }

  return (
    <div className="panel max-w-3xl p-5">
      <div className="grid gap-4">
        <label className="field-label">
          Joueurs, un par ligne
          <textarea
            value={names}
            onChange={(event) => setNames(event.target.value)}
            className="field min-h-44"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            Seed
            <input value={seed} onChange={(event) => setSeed(event.target.value)} className="field" />
          </label>
          <label className="field-label">
            Code maitre optionnel
            <input
              value={masterCode}
              onChange={(event) => setMasterCode(event.target.value)}
              className="field"
              placeholder="Laisse vide pour generer"
            />
          </label>
        </div>
        {error ? <p className="text-sm font-semibold text-red-300">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button className={buttonClass} onClick={submit} type="button" disabled={busy}>
            <Wand2 size={18} />
            Creer la partie
          </button>
          <button
            className={ghostButtonClass}
            onClick={() => setSeed(Math.random().toString(36).slice(2, 10))}
            type="button"
          >
            <Dice5 size={18} />
            Nouvelle seed
          </button>
        </div>
      </div>
    </div>
  );
}
