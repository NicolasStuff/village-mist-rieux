import Link from "next/link";
import { JoinGameForm } from "@/components/join/JoinGameForm";

export default function JoinPage() {
  return (
    <main className="page-shell">
      <div className="mx-auto grid min-h-screen max-w-3xl content-center gap-6 px-4 py-10">
        <Link href="/" className="text-sm font-semibold text-amber-200">
          Accueil
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Joueur</p>
          <h1 className="text-5xl font-black text-stone-50">Rejoindre le village</h1>
        </div>
        <JoinGameForm />
      </div>
    </main>
  );
}
