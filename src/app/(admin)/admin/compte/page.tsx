import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profiles/queries";
import AdminProfileForm from "@/components/admin/AdminProfileForm";
import AdminNotificationsForm from "@/components/admin/AdminNotificationsForm";
import ChangerMotDePasseForm from "@/components/admin/ChangerMotDePasseForm";

function formaterDerniereConnexion(dateIso: string | null): string {
  if (!dateIso) return "Inconnue";

  const date = new Date(dateIso);
  const maintenant = new Date();
  const heure = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  if (date.toDateString() === maintenant.toDateString()) return `Aujourd'hui à ${heure}`;

  const hier = new Date(maintenant);
  hier.setDate(hier.getDate() - 1);
  if (date.toDateString() === hier.toDateString()) return `Hier à ${heure}`;

  return `${date.toLocaleDateString("fr-FR")} à ${heure}`;
}

export default async function AdminComptePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getProfile(user.id) : null;

  return (
    <main className="px-4 py-8 lg:px-14 lg:py-12">
      <h1 className="mb-6 text-2xl font-semibold text-ink">Mon compte</h1>

      {user && profile ? (
        <div className="flex max-w-[560px] flex-col gap-4">
          <div className="rounded-2xl border border-line bg-card p-6">
            <h2 className="text-base font-semibold text-ink">Informations du compte</h2>
            <p className="mb-4 text-xs text-ink-muted">
              Vos informations personnelles en tant qu&apos;administratrice.
            </p>
            <AdminProfileForm
              profile={profile}
              email={user.email ?? ""}
              derniereConnexion={formaterDerniereConnexion(user.last_sign_in_at ?? null)}
            />
          </div>

          <div className="rounded-2xl border border-line bg-card p-6">
            <h2 className="text-base font-semibold text-ink">Notifications par e-mail</h2>
            <p className="mb-1 text-xs text-ink-muted">
              Être alertée sans devoir se connecter tous les jours.
            </p>
            <AdminNotificationsForm profile={profile} />
          </div>

          <div className="rounded-2xl border border-line bg-card p-6">
            <h2 className="mb-4 text-base font-semibold text-ink">Changer mon mot de passe</h2>
            <ChangerMotDePasseForm />
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink-muted">Session invalide.</p>
      )}
    </main>
  );
}
