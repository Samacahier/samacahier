import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getDernieresOperations } from "@/lib/dashboard/queries";
import { getCommercant } from "@/lib/commercants/queries";
import { listStocks } from "@/lib/stocks/queries";
import { listClients } from "@/lib/clients/queries";
import { listFournisseurs } from "@/lib/fournisseurs/queries";
import type { DashboardStats } from "@/lib/dashboard/queries";
import HeroSoldeCard from "@/components/dashboard/HeroSoldeCard";
import StatCard from "@/components/dashboard/StatCard";
import AlerteStockBanner from "@/components/dashboard/AlerteStockBanner";
import DernieresOperations from "@/components/dashboard/DernieresOperations";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";

const STATS_VIDES: DashboardStats = {
  chiffreAffaires: 0,
  totalVentesNombre: 0,
  encaissements: 0,
  totalDepenses: 0,
  totalCreancesEnCours: 0,
  soldeCaisse: 0,
  soldePoche: 0,
  produitsEnAlerte: [],
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [stats, operations, commercant, produits, clients, fournisseurs] = user
    ? await Promise.all([
        getDashboardStats(user.id),
        getDernieresOperations(user.id, 5),
        getCommercant(user.id),
        listStocks(user.id),
        listClients(user.id),
        listFournisseurs(user.id),
      ])
    : [STATS_VIDES, [], null, [], [], []];

  const devise = commercant?.devise ?? "FCFA";

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 lg:max-w-[1440px] lg:gap-7 lg:px-14 lg:py-12">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-6">
        <HeroSoldeCard
          devise={devise}
          soldeCaisse={stats.soldeCaisse}
          soldePoche={stats.soldePoche}
        />

        <div className="flex flex-col gap-4">
          <AlerteStockBanner produits={stats.produitsEnAlerte} />
          <DashboardQuickActions
            produits={produits}
            clients={clients}
            fournisseurs={fournisseurs}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Chiffre d'affaires"
          value={`${stats.chiffreAffaires.toLocaleString("fr-FR")} ${devise}`}
          hint={`${stats.totalVentesNombre} vente${stats.totalVentesNombre > 1 ? "s" : ""}`}
        />
        <StatCard
          label="Encaissements"
          value={`${stats.encaissements.toLocaleString("fr-FR")} ${devise}`}
        />
        <StatCard
          label="Créances"
          value={`${stats.totalCreancesEnCours.toLocaleString("fr-FR")} ${devise}`}
        />
        <StatCard
          label="Dépenses"
          value={`${stats.totalDepenses.toLocaleString("fr-FR")} ${devise}`}
        />
      </div>

      <DernieresOperations operations={operations} />
    </main>
  );
}
