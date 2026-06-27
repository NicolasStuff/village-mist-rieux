"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, RefreshCw } from "lucide-react";
import type { ClaimablePlayer } from "@/lib/game/types";
import { buttonClass, ghostButtonClass } from "@/lib/ui";

type JoinPayload = {
  active: boolean;
  joinCode?: string;
  claimablePlayers: ClaimablePlayer[];
};

export function JoinGameForm() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [players, setPlayers] = useState<ClaimablePlayer[]>([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/player/session");
    const payload = (await response.json()) as JoinPayload;
    setPlayers(payload.claimablePlayers ?? []);
    if (payload.joinCode) setJoinCode(payload.joinCode);
  }, []);

  useEffect(() => {
    const playerId = localStorage.getItem("village-mysterieux:player-id");
    const token = localStorage.getItem("village-mysterieux:player-token");
    if (playerId && token) {
      router.push("/player");
      return;
    }
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load, router]);

  async function claim() {
    setBusy(true);
    setError("");
    const response = await fetch("/api/player/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "claim", joinCode: joinCode.toUpperCase(), playerId: selected }),
    });
    const payload = (await response.json()) as { ok: boolean; token?: string; playerId?: string; error?: string };
    setBusy(false);

    if (!payload.ok || !payload.token || !payload.playerId) {
      setError(payload.error ?? "Connexion impossible.");
      return;
    }

    localStorage.setItem("village-mysterieux:player-id", payload.playerId);
    localStorage.setItem("village-mysterieux:player-token", payload.token);
    router.push("/player");
  }

  return (
    <div className="panel max-w-xl p-5">
      <div className="grid gap-4">
        <label className="field-label">
          Code partie
          <input
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
            className="field uppercase"
          />
        </label>
        <label className="field-label">
          Ton nom
          <select value={selected} onChange={(event) => setSelected(event.target.value)} className="field">
            <option value="">Choisir un joueur</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </label>
        {error ? <p className="text-sm font-semibold text-red-300">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button className={buttonClass} onClick={claim} disabled={!selected || busy} type="button">
            <LogIn size={18} />
            Rejoindre
          </button>
          <button className={ghostButtonClass} onClick={load} type="button">
            <RefreshCw size={18} />
            Actualiser
          </button>
        </div>
      </div>
    </div>
  );
}
