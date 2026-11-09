// Traduit une erreur Supabase/Postgres en message compréhensible par un
// commerçant. Avant, le message technique brut était affiché tel quel dans
// les formulaires (ex. « duplicate key value violates unique constraint
// "stocks_code_produit_key" »). Le détail technique reste dans les logs.
type ErreurBase = { code?: string; message: string };

const MESSAGES_PAR_CODE: Record<string, string> = {
  // unique_violation
  "23505": "Cet élément existe déjà. Rechargez la page puis réessayez.",
  // foreign_key_violation
  "23503": "Cet élément est lié à d'autres données et ne peut pas être modifié ainsi.",
  // not_null_violation
  "23502": "Un champ obligatoire est manquant.",
  // check_violation
  "23514": "Une des valeurs saisies n'est pas valide.",
  // insufficient_privilege / RLS
  "42501": "Vous n'avez pas l'autorisation d'effectuer cette action.",
  // numeric_value_out_of_range
  "22003": "Un des montants saisis est trop grand.",
  // invalid_text_representation
  "22P02": "Une des valeurs saisies n'est pas au bon format.",
};

export function messageErreur(erreur: ErreurBase, contexte?: string): string {
  console.error(`[erreur${contexte ? ` ${contexte}` : ""}]`, erreur.code ?? "", erreur.message);

  if (erreur.code && MESSAGES_PAR_CODE[erreur.code]) return MESSAGES_PAR_CODE[erreur.code];
  if (/fetch failed|network|timeout/i.test(erreur.message)) {
    return "Connexion impossible. Vérifiez votre connexion internet puis réessayez.";
  }
  return "Une erreur est survenue. Réessayez ; si le problème persiste, contactez le support.";
}
