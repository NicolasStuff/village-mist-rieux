import Link from "next/link";
import { BookOpen, Crown, LogIn, Monitor } from "lucide-react";
import { buttonClass, ghostButtonClass } from "@/lib/ui";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl content-center gap-8 px-4 py-10">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-200">Jeu de table connecte</p>
          <h1 className="mt-3 text-balance text-6xl font-black leading-[0.92] text-stone-50 sm:text-7xl">
            Le Village Mysterieux
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-stone-200">
            Une partie unique, des secrets en duo, un narrateur omniscient et un village qui accuse
            sans jamais tout savoir.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link className={buttonClass} href="/master/setup">
            <Crown size={18} />
            Creer
          </Link>
          <Link className={ghostButtonClass} href="/join">
            <LogIn size={18} />
            Rejoindre
          </Link>
          <Link className={ghostButtonClass} href="/table">
            <Monitor size={18} />
            Table
          </Link>
          <Link className={ghostButtonClass} href="/tutorial">
            <BookOpen size={18} />
            Cartes
          </Link>
        </div>
      </section>
    </main>
  );
}
