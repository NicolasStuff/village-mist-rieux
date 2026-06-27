import Link from "next/link";
import { PublicGameBoard } from "@/components/table/PublicGameBoard";

export default function TablePage() {
  return (
    <main className="page-shell">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
        <Link href="/" className="text-sm font-semibold text-amber-200">
          Accueil
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Place publique</p>
          <h1 className="text-5xl font-black text-stone-50">Table du village</h1>
        </div>
        <PublicGameBoard />
      </div>
    </main>
  );
}
