# SAMA CAHIER — Brief projet

Plateforme de gestion quotidienne pour petits commerces et activités indépendantes au Sénégal (ventes, dépenses, stocks, créances, caisse, tableaux de bord, génération de documents).

**Client :** Binetou Soumaré (Sicap Foire)
**Prestataire :** Abdourahime SY — Solvix
**Contrat :** SOLVIX-SC-2026-001 — 125 000 FCFA (acompte 62 500 FCFA reçu le 17/08/2026)
**Livraison :** dimanche 23 août 2026, en soirée

---

## Stack technique

- **Framework :** Next.js 15
- **Base de données :** Supabase
- **Hébergement :** Vercel (offre gratuite)
- **Nom de domaine :** Hostinger
- **Code :** GitHub (dépôt à créer)

## Architecture des comptes

Modèle **multi-commerçants** :
- Chaque commerçant a son propre compte indépendant (création de compte + connexion), avec ses données isolées : ventes, dépenses, stocks, créances, caisse.
- Binetou dispose d'un **compte administrateur** avec vue d'ensemble et gestion de tous les comptes commerçants inscrits.

## Fonctionnalités validées avec la cliente

1. Création de compte et connexion (commerçants)
2. Compte administrateur (vue d'ensemble + gestion des comptes)
3. Gestion des ventes
4. Gestion des dépenses
5. Gestion des stocks
6. Gestion des créances
7. Gestion de caisse
8. Tableaux de bord et indicateurs de suivi d'activité
9. Génération de documents (reçus, rapports)

---

## Setup initial

```bash
npx create-next-app@latest sama-cahier --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

## Structure des dossiers

```
sama-cahier/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (commercant)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── ventes/page.tsx
│   │   │   ├── depenses/page.tsx
│   │   │   ├── stocks/page.tsx
│   │   │   ├── creances/page.tsx
│   │   │   └── caisse/page.tsx
│   │   ├── (admin)/
│   │   │   └── admin/dashboard/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── ventes/
│   │   ├── depenses/
│   │   ├── stocks/
│   │   ├── creances/
│   │   ├── caisse/
│   │   └── dashboard/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   └── utils/
│   ├── types/
│   │   └── database.ts
│   └── hooks/
├── supabase/
│   └── migrations/
├── .env.local
└── CLAUDE.md
```

Un dossier par module métier (ventes, dépenses, stocks, créances, caisse), aussi bien dans `app/(commercant)/` que dans `components/`. Chaque fichier reste sur sa responsabilité unique — pas de `page.tsx` qui mélange logique métier, requêtes Supabase et affichage.

---

## Standards de code (identiques à tous les projets Rahime)

- **Fichier = une responsabilité.** Jamais de fichiers monolithiques. ~100–150 lignes indicatif par fichier.
- **Lisibilité maximale** avant tout — code propre, pas encombré, pas de sur-ingénierie.
- **Commits Git :** `<emoji> <Zone> : <description claire FR>`, verbe d'action français, < 80 caractères.
  Emojis : 🐛 bug · ✨ feature · 🎨 design · 🔧 config · ⚡ perf · 🔒 sécu · 📝 docs · ♻️ refacto · 🚨 hotfix
- **Pas de format Conventional Commits anglais.**

## Consignes de process (important)

- **Éviter les longues sessions de vérification automatisée** (Playwright/Chromium ou équivalent) pour valider chaque point un par un — c'est lent et apporte peu de valeur réelle sur ce projet.
- Privilégier une vérification rapide et ciblée (build qui passe, lecture du code, test manuel ponctuel) plutôt qu'une checklist exhaustive automatisée par navigateur.
- Avancer par blocs fonctionnels clairs, pas par micro-validations successives.
