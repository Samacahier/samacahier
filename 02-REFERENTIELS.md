# Phase 2 — Référentiels et onboarding

Dépend de la Phase 1 (schéma). Construit les entités que Ventes/Dépenses/Stock vont consommer en Phase 3.

---

## Onboarding en 2 étapes

Le prototype sépare compte et commerce (actuellement fusionnés en un seul formulaire chez nous — à corriger).

**Étape 1 — Créer le compte**
- Nom et prénom du responsable
- Téléphone
- Adresse e-mail
- Mot de passe + confirmation

**Étape 2 — Configurer le commerce** (nouvelle page, après création du compte)
- Logo du commerce (upload, facultatif)
- Nom du commerce *
- Activité *
- NINEA (facultatif)
- RCCM (facultatif)
- Téléphone du commerce
- E-mail professionnel
- Adresse *
- Ville / Région
- Devise (défaut FCFA)

Bouton "Créer mon espace" à la fin de l'étape 2 → crée la ligne `commercants` avec tous ces champs (le trigger actuel ne gère que `nom_commerce`, à étendre).

Barre de progression 2 segments en haut, comme le prototype.

---

## Module Produits (remplace l'écran Stock actuel)

Formulaire "Nouveau produit" :
- ID produit (généré automatiquement, ex. `PRD004`, lecture seule)
- Nom du produit *
- Catégorie (liste : Alimentaire, etc.)
- Unité (liste)
- Prix d'achat
- Prix de vente
- Stock initial
- Stock minimum (seuil d'alerte)
- Fournisseur (liste déroulante, alimentée par le référentiel `fournisseurs`, facultatif)

La liste des produits reste celle déjà construite (tri, alerte si quantité ≤ seuil), on ajoute juste les nouveaux champs à l'affichage.

---

## Module Clients (nouveau)

CRUD simple : nom, téléphone. Accessible depuis une page dédiée, **et** ajoutable à la volée depuis le formulaire Vente (bouton "+" à côté du sélecteur client — voir Phase 3) sans quitter le formulaire de vente.

## Module Fournisseurs (nouveau)

CRUD simple : nom, contact. Alimente les listes déroulantes "Fournisseur" dans Produits et Dépenses.
