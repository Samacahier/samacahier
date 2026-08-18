import { listCommercantsOverview } from "@/lib/dashboard/admin-queries";
import CommercantsTable from "@/components/admin/CommercantsTable";

export default async function AdminDashboardPage() {
  const overviews = await listCommercantsOverview();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <h1 className="text-2xl font-semibold text-ink">Commerçants</h1>
      <CommercantsTable overviews={overviews} />
    </main>
  );
}
