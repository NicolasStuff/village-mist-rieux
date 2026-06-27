import Link from "next/link";
import { MasterSetupForm } from "@/components/setup/MasterSetupForm";

export default function MasterSetupPage() {
  return (
    <main className="page-shell">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10">
        <Link href="/" className="text-sm font-semibold text-amber-200">
          Retour
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Narrateur</p>
          <h1 className="text-5xl font-black text-stone-50">Creer la partie active</h1>
        </div>
        <MasterSetupForm />
      </div>
    </main>
  );
}
