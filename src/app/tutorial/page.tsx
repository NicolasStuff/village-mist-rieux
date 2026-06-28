import Link from "next/link";
import { CardGallery } from "@/components/tutorial/CardGallery";

export default function TutorialPage() {
  return (
    <main className="page-shell">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8">
        <Link href="/" className="text-sm font-semibold text-amber-200">
          Accueil
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Tutoriel</p>
          <h1 className="text-5xl font-black text-stone-50">Cartes du village</h1>
        </div>
        <CardGallery />
      </div>
    </main>
  );
}
