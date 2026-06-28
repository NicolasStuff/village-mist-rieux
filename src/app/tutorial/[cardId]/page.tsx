import Link from "next/link";
import { notFound } from "next/navigation";
import { roles } from "@/lib/game/catalog/roles";
import { allSecrets } from "@/lib/game/catalog/secrets";
import { RoleCard } from "@/components/cards/RoleCard";
import { SecretCard } from "@/components/cards/SecretCard";

export default async function CardDetailPage({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params;
  const role = roles.find((item) => item.id === cardId);
  const secret = allSecrets.find((item) => item.id === cardId);

  if (!role && !secret) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8">
        <Link href="/tutorial" className="text-sm font-semibold text-amber-200">
          Cartes
        </Link>
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {role ? <RoleCard role={role} /> : <SecretCard secret={secret!} />}
          <section className="panel p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200">
              {role ? "Role" : "Affaire"}
            </p>
            <h1 className="mt-2 text-5xl font-black text-stone-50">{role?.name ?? secret!.title}</h1>
            {role ? (
              <div className="mt-5 grid gap-4 text-lg leading-8 text-stone-200">
                <p>{role.effect}</p>
                <p>{role.masterInstruction}</p>
                <p className="text-amber-100">{role.playerHint}</p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 text-lg leading-8 text-stone-200">
                <p>{secret!.tutorial}</p>
                <p>{secret!.fullReveal}</p>
                <p className="text-amber-100">
                  Elements: {secret!.elements.lieu}, {secret!.elements.objet},{" "}
                  {secret!.elements.action}, {secret!.elements.mobile}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
