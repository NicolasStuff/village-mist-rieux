export function NarratorScript({ text }: { text?: string }) {
  return (
    <section className="panel p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Texte narrateur</p>
      <p className="mt-2 text-xl leading-8 text-stone-50">
        {text || "Aucun verdict recent. Le village retient son souffle."}
      </p>
    </section>
  );
}
