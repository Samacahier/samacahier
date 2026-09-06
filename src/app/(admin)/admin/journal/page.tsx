import { listAdminLogsPage } from "@/lib/admin/logs-queries";
import SectionTable from "@/components/admin/SectionTable";
import Pagination from "@/components/admin/Pagination";

const PAR_PAGE = 20;

const LIBELLES_ACTION: Record<string, string> = {
  activation: "Activation",
  desactivation: "Désactivation",
  reinitialisation_mot_de_passe: "Réinitialisation mot de passe",
  correction_infos: "Correction d'infos",
};

export default async function AdminJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { logs, total } = await listAdminLogsPage(page, PAR_PAGE);
  const totalPages = Math.max(1, Math.ceil(total / PAR_PAGE));

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <h1 className="text-2xl font-semibold text-ink">Journal d&apos;activité</h1>

      <SectionTable
        titre={`${total} action${total > 1 ? "s" : ""}`}
        colonnes={["Date", "Admin", "Action", "Commerçant", "Détail"]}
        lignes={logs.map((log) => [
          new Date(log.created_at).toLocaleString("fr-FR"),
          log.adminNom,
          LIBELLES_ACTION[log.action] ?? log.action,
          log.commercantNom ?? "—",
          log.detail ?? "—",
        ])}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        makeHref={(p) => (p <= 1 ? "/admin/journal" : `/admin/journal?page=${p}`)}
      />
    </main>
  );
}
