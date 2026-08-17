# Phase 3 — Opérations quotidiennes

Dépend des Phases 1 et 2. Refonte des 3 modules où le commerçant passe le plus de temps.

---

## Trésorerie (remplace le module Caisse actuel)

Nouvelle page avec **3 onglets** : Ma Caisse / Ma Poche / Créances.

**Ma Caisse** et **Ma Poche** (même composant, filtré par `type_poche`) :
- Carte solde : "SOLDE ACTUEL" en gros, puis Initial / Entrées / Sorties sur une ligne
- Deux boutons : "Faire entrer" / "Sortir"
- Liste "Mouvements directs" (mouvements de caisse qui ne viennent pas d'une vente ou d'une dépense)
- Modale "Faire entrer de l'argent — Ma Caisse/Ma Poche" : Montant, Description, Date

**Créances** (onglet) : réutilise le module Créances déjà construit, affiché dans cet onglet plutôt que sur sa propre route.

Le solde de chaque poche = `solde_initial_{caisse|poche}` (Phase 1) + entrées − sorties, y compris les mouvements générés automatiquement par les ventes encaissées et les dépenses (`source` = caisse ou poche).

---

## Ventes (formulaire à enrichir)

Modale "Nouvelle vente", remonte du bas :
- Produit — liste déroulante alimentée par le catalogue Produits (Phase 2)
- Client — liste déroulante alimentée par le référentiel Clients, défaut "Client comptant", bouton "+" pour ajouter un client sans quitter la modale
- Quantité / Prix unitaire (le prix unitaire se pré-remplit depuis le prix de vente du produit choisi, modifiable)
- Remise
- Statut de la vente — 3 boutons : Payé / Crédit / Impayé
- Montant encaissé (actif seulement si Crédit, désactivé/grisé si Payé ou Impayé — cf. capture, le champ est grisé quand Payé est sélectionné)
- Mode de paiement (liste : Espèces, etc.)
- Date
- Total calculé en direct en bas, badge du statut, bouton "Enregistrer la vente"

Si statut = Crédit ou Impayé et client ≠ "Client comptant" → générer/mettre à jour une ligne dans `creances` liée au `client_id`.

---

## Dépenses (formulaire à enrichir)

Modale "Nouvelle dépense" :
- Description
- Montant / Catégorie
- Source — Ma Caisse ou Ma Poche (détermine quelle poche est débitée en Trésorerie)
- Mode de paiement
- Fournisseur (facultatif, liste déroulante du référentiel Fournisseurs)
- Date

Une dépense enregistrée crée automatiquement une sortie dans `caisse` sur la poche choisie.
