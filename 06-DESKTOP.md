# Phase 6 — Desktop

Aucune référence visuelle ici — le prototype de Binetou n'a montré que du mobile (captures dans un cadre téléphone). C'est un vrai ajout de scope, pas un alignement sur un prototype existant.

**Breakpoint :** en dessous de 1024px (`lg`), comportement actuel inchangé (nav basse, colonne centrée, modales bottom-sheet). À partir de 1024px, layout desktop décrit ci-dessous.

---

## Correction immédiate (indépendante du breakpoint) — pages auth

`/login` et `/register` : carte centrée horizontalement **et** verticalement dans le viewport, fond (`var(--bg)`/`bg-page`) qui couvre tout l'écran quelle que soit sa taille. Plus de vide noir, plus de contenu collé à gauche.

---

## Layout commerçant desktop (≥1024px)

Remplace la nav basse par une nav latérale fixe à gauche :
- Wordmark en haut
- Liens à plat, plus besoin d'un menu "Plus" replié (la sidebar a la place) : Accueil, Ventes, Dépenses, Stock, Trésorerie, Clients, Fournisseurs, Rapports
- État actif marqué visuellement (fond ou bordure accent)
- Zone de contenu à droite, max-width ~1200px centré, padding généreux

## Accueil (desktop)

- Grille 2 colonnes : carte hero (solde total + détail des poches) à gauche en grand, bandeau alerte stock + actions rapides à droite
- 4 cartes stats sur une seule ligne (au lieu d'empilées)
- "Dernières opérations" en table pleine largeur en dessous

## Listes (Ventes, Dépenses, Stock, Clients, Fournisseurs, Créances)

Passent d'un empilement de cartes mobile à une vraie table desktop : colonnes alignées, une ligne par entrée. Actions (éditer/supprimer) apparaissent au survol de la ligne plutôt qu'en boutons toujours visibles.

## Modales

Bottom-sheet sur mobile (glissent du bas) → modale centrée classique sur desktop (boîte de dialogue au centre de l'écran, fond assombri). Même contenu de formulaire, juste le conteneur qui change.

## Trésorerie (desktop)

Ma Caisse et Ma Poche gagnent à être visibles côte à côte plutôt qu'en onglets séparés — l'espace le permet, ça évite un clic pour comparer les deux soldes. Créances reste un onglet à part (contenu different, pas un solde).

## Rapport (desktop)

Les 4 chiffres de l'aperçu global sur une seule ligne plutôt qu'en grille 2×2. Tableau "Ventes par statut" pleine largeur.

---

## Vérification

Comportement correct à tester à 375px (mobile, inchangé), 768px (tablette, comportement mobile conservé sous le breakpoint), et 1440px (desktop, nouveau layout).
