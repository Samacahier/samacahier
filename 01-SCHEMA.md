# Phase 1 — Schéma de données

Base commune à toutes les phases suivantes. Rien d'autre ne peut avancer tant que ce n'est pas fait.

**Règle :** ne pas modifier les migrations existantes. Chaque ajout/changement ci-dessous = une nouvelle migration. Avant d'écrire quoi que ce soit, inspecter `supabase/migrations/` pour connaître les colonnes actuelles exactes de chaque table.

---

## Nouvelles tables

### `clients`
Référentiel clients, réutilisable depuis Ventes et Créances.
- `id`, `commercant_id` (FK)
- `nom`
- `telephone` (facultatif)
- `created_at`

### `fournisseurs`
Référentiel fournisseurs, réutilisable depuis Stock et Dépenses.
- `id`, `commercant_id` (FK)
- `nom`
- `contact` (facultatif)
- `created_at`

---

## Tables existantes à modifier

### `commercants` — étoffer le profil du commerce
Ajouter :
- `logo_url` (nullable)
- `activite`
- `ninea` (nullable)
- `rccm` (nullable)
- `telephone_pro` (nullable)
- `email_pro` (nullable)
- `adresse`
- `ville_region`
- `devise` (défaut `FCFA`)
- `solde_initial_caisse` (numeric, défaut 0)
- `solde_initial_poche` (numeric, défaut 0)

### `stocks` (catalogue produits) — aligner sur le prototype
Ajouter :
- `code_produit` (texte, ex. `PRD004`, généré automatiquement à la création)
- `prix_achat` (numeric)
- `prix_vente` (numeric)
- `fournisseur_id` (FK vers `fournisseurs`, nullable)

Vérifier que `categorie`, `unite`, `quantite` (stock initial/courant) et `seuil_alerte` (stock minimum) existent déjà — sinon les ajouter. `prix_achat`/`prix_vente` remplacent un éventuel champ `prix_unitaire` unique.

### `ventes` — statuts et liaisons
Ajouter :
- `produit_id` (FK vers `stocks`, nullable si vente hors catalogue)
- `client_id` (FK vers `clients`, nullable = "Client comptant")
- `remise` (numeric, défaut 0)
- `statut` (enum ou texte contraint : `paye` / `credit` / `impaye`)
- `montant_encaisse` (numeric)
- `mode_paiement` (texte)

### `depenses` — source et fournisseur
Ajouter :
- `source` (texte contraint : `caisse` / `poche`)
- `mode_paiement` (texte)
- `fournisseur_id` (FK vers `fournisseurs`, nullable)

### `caisse` — deux poches
Ajouter :
- `type_poche` (texte contraint : `caisse` / `poche`)

Le solde affiché par poche = `solde_initial_{caisse|poche}` (sur `commercants`) + somme des entrées − somme des sorties de `caisse` filtrées par `type_poche`.

### `creances`
Ajouter :
- `client_id` (FK vers `clients`)

Garder les champs déjà en place (montant dû, montant remboursé, statut, échéance).

---

## RLS

Toutes les nouvelles tables (`clients`, `fournisseurs`) suivent la même politique que les tables métier existantes : `commercant_id = auth.uid()` pour le commerçant, `is_admin()` pour l'admin. Aucune nouvelle logique à inventer, copier le pattern déjà en place.
