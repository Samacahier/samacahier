# Phase 5 — Système de design

Couleurs extraites directement des captures fournies par Binetou (échantillonnage pixel, pas une estimation à l'œil). À appliquer par-dessus les Phases 1 à 4, transversalement, pas module par module.

---

## Palette

| Rôle | Couleur | Usage |
|---|---|---|
| Fond de page | `#E6D6BD` | arrière-plan général, en dehors des cartes |
| Fond carte / champ | `#FFF9EF` | cartes stats, champs de formulaire, modales |
| Carte hero (dégradé) | de `#5A3723` à `#57372A` | carte solde caisse/trésorerie, carte bilan rapport |
| Accent principal | `#D97B1E` | boutons d'action principaux (Nouvelle vente, Enregistrer, bouton flottant +) |
| Bouton secondaire | `#F7E7CE` | boutons d'action secondaires (Dépense, Sortir) |
| Texte principal | `#2D2616` | titres, texte fort |
| Texte secondaire | `#524940` | sous-titres, labels |
| Statut Payé (bordure) | `#4E6350` | badge "Payé" |
| Statut Payé (fond) | `#E4EEE3` | fond du badge "Payé" |

Pour les couleurs des statuts Crédit et Impayé (non capturées précisément dans les échantillons), rester dans la même famille : un ton ambre/orange pour Crédit, un ton rouge/brun pour Impayé, cohérents avec la palette ci-dessus plutôt que des couleurs vives génériques.

---

## Composants transversaux

- **Modales bottom-sheet** : tous les formulaires (Nouvelle vente, Nouvelle dépense, Nouveau produit, Faire entrer/Sortir) remontent depuis le bas de l'écran plutôt que d'être des pages séparées — poignée horizontale en haut de la modale, bouton fermer (X) en haut à droite.
- **Navigation basse** : Accueil / Vente / Dépenses / Stock / Plus, fixe sur toutes les pages commerçant.
- **Cartes stats** : coins arrondis généreux, fond `#FFF9EF`, label en majuscules petit/gris au-dessus de la valeur en grand.
- **Boutons pleine largeur** en bas des modales pour l'action principale (Enregistrer).

---

## Note pour Claude Code

Cette palette est une base fiable, échantillonnée sur l'écran Accueil et le formulaire Ventes. Si un composant précis (badges Crédit/Impayé, dégradé exact de la carte hero) a besoin d'être calé plus finement, redemander les captures d'écran correspondantes plutôt que d'inventer une valeur.
