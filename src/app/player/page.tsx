import Link from "next/link";
import { PlayerDashboard } from "@/components/player/PlayerDashboard";

export default function PlayerPage() {
  return (
    <main className="page-shell">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
        <Link href="/" className="text-sm font-semibold text-amber-200">
          Accueil
        </Link>
        <PlayerDashboard />
      </div>
    </main>
  );
}
