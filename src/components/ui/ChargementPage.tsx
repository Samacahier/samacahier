// Squelette affiché pendant le chargement d'une page (loading.tsx) : évite
// l'écran figé sur connexion lente — fréquent en 3G/4G — le temps que le
// serveur récupère les données.
export default function ChargementPage() {
  return (
    <main
      aria-busy="true"
      aria-label="Chargement"
      className="mx-auto flex max-w-3xl animate-pulse flex-col gap-4 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12"
    >
      <div className="h-8 w-48 rounded-xl bg-line/60" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 rounded-2xl border border-line bg-card" />
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-card p-5">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-10 rounded-lg bg-secondary" />
        ))}
      </div>
      <span className="sr-only">Chargement…</span>
    </main>
  );
}
