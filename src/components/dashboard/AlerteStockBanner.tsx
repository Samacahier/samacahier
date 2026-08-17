type AlerteStockBannerProps = {
  produits: { id: string; nomArticle: string }[];
};

export default function AlerteStockBanner({ produits }: AlerteStockBannerProps) {
  if (produits.length === 0) return null;

  const noms = produits.map((produit) => produit.nomArticle).join(", ");

  return (
    <div className="rounded-2xl border border-status-credit bg-status-credit-bg px-4 py-3 text-sm text-status-credit">
      {produits.length} produit{produits.length > 1 ? "s" : ""} en alerte stock — {noms} —
      pensez à réapprovisionner
    </div>
  );
}
