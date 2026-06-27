import Link from "next/link";
import { MasterDashboard } from "@/components/master/MasterDashboard";

export default function MasterPage() {
  return (
    <main className="page-shell">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8">
        <Link href="/" className="text-sm font-semibold text-amber-200">
          Accueil
        </Link>
        <MasterDashboard />
      </div>
    </main>
  );
}
