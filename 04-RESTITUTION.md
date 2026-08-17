# Phase 4 — Accueil et Rapport

Dépend des Phases 1 à 3 (a besoin des vraies données Trésorerie/Ventes/Dépenses pour afficher quelque chose de cohérent).

---

## Accueil (dashboard commerçant à refaire entièrement)

- Carte hero "SOLDE DISPONIBLE TOTAL" (Ma Caisse + Ma Poche additionnées), avec le détail des deux poches en dessous
- 4 cartes stats : Chiffre d'affaires, Encaissements, Créances, Dépenses
- Bandeau d'alerte si produit(s) en stock bas ("1 produit(s) en alerte stock — [nom] — pensez à réapprovisionner")
- Deux boutons d'action rapide : "Nouvelle vente" / "Dépense" (ouvrent directement les modales concernées)
- Section "Dernières opérations" avec lien "Tout voir", état vide si aucune opération
- Bouton flottant "+" en bas à droite
- Navigation basse fixe : Accueil / Vente / Dépenses / Stock / Plus

Remplace la grille de 5 cartes actuelle.

---

## Rapport (à enrichir)

Garder le sélecteur de période déjà construit, ajouter :
- Carte "BILAN MENSUEL EXPORTABLE" en haut avec sélecteur de mois + bouton "Générer & exporter le bilan"
- Section "Aperçu global (depuis le début)" : Chiffre d'affaires, Créances, Dépenses, **Marge brute** (nouveau calcul : somme de `(prix_vente − prix_achat) × quantité` sur les ventes payées de la période)
- Section "Ventes par statut" : montant total et nombre de ventes pour chacun des 3 statuts (Payé / Crédit / Impayé)

---

## Admin — vue d'ensemble

Pas de changement de fond nécessaire ici (le prototype ne montre pas l'écran admin). La liste des commerçants avec leurs indicateurs, déjà construite en Phase 6 du build initial, reste valable telle quelle.
