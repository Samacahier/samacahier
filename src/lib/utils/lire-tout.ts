// L'API Supabase (PostgREST) ne renvoie jamais plus de 1000 lignes par
// requête : tout calcul fait côté Next.js sur une requête non bornée
// (solde de caisse, totaux d'un rapport, CA…) était silencieusement faux
// dès 1000 lignes. lireTout() enchaîne les pages de 1000 jusqu'à la fin.
//
// La requête construite DOIT avoir un ordre stable (ex. .order("id")) pour
// que les pages successives ne se chevauchent pas.
const TAILLE_PAGE = 1000;

type ResultatPage<T> = PromiseLike<{
  data: T[] | null;
  error: { message: string; code?: string } | null;
}>;

export async function lireTout<T>(
  page: (debut: number, fin: number) => ResultatPage<T>,
): Promise<{ data: T[]; error: { message: string; code?: string } | null }> {
  const lignes: T[] = [];
  for (let debut = 0; ; debut += TAILLE_PAGE) {
    const { data, error } = await page(debut, debut + TAILLE_PAGE - 1);
    if (error) return { data: lignes, error };
    lignes.push(...(data ?? []));
    if (!data || data.length < TAILLE_PAGE) return { data: lignes, error: null };
  }
}
