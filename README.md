# Mini-WMS Concorde — Simulateur pédagogique ERP/WMS

**Collège de la Concorde — Montréal**

> **PROGRAMME 1 — Gestion intégrée des stocks et performance logistique**  
> Durée totale : 30 heures · 5 modules · Standards SAP S/4HANA, Microsoft Dynamics 365 et Odoo

---

## Objectif général

Ce programme vise à développer des compétences opérationnelles en gestion des stocks, exécution d'entrepôt et analyse de performance logistique, en intégrant la logique des systèmes ERP et WMS utilisés sur le marché québécois et nord-américain. La formation s'appuie sur les standards fonctionnels observés dans des environnements tels que SAP S/4HANA, Microsoft Dynamics 365 et Odoo, tout en conservant une neutralité technologique.

---

## Structure du programme (30 heures)

| Module | Titre | Durée | Contenu principal |
|--------|-------|-------|-------------------|
| **M1** | Fondements de la chaîne logistique et intégration ERP/WMS | 4 h | Flux physiques/informationnels, rôle WMS, SAP S/4HANA, Dynamics 365, Odoo |
| **M2** | Exécution d'entrepôt et gestion des emplacements | 8 h | Réception, put-away, gestion des bins, FIFO/LIFO, traçabilité |
| **M3** | Contrôle des stocks et réapprovisionnement | 6 h | Cycle count, écarts, Min/Max, Safety Stock, logique MRP |
| **M4** | Indicateurs de performance logistique | 6 h | Rotation des stocks, taux de service, stock immobilisé, tableaux de bord |
| **M5** | Simulation opérationnelle intégrée | 6 h | Cycle complet réception→expédition, analyse décisionnelle, cas structurés |

---

## Modalités d'évaluation

| Composante | Pondération |
|---|---|
| Travaux pratiques appliqués | 30 % |
| Quiz structuré (Microsoft Teams Forms) | 20 % |
| Simulation finale intégrée | 50 % |

---

## Flux simulé — Module 1 (cycle de base)

| Étape | Transaction SAP | Description |
|-------|----------------|-------------|
| 1 | **ME21N — Purchase Order** | Bon de commande fournisseur |
| 2 | **MIGO 101 — Goods Receipt** | Réception marchandises en stock |
| 3 | **VA01 — Sales Order** | Commande client |
| 4 | **VL02N 601 — Goods Issue** | Sortie de stock |
| 5 | **MI01/MI04 — Cycle Count** | Comptage cyclique de l'inventaire |
| 6 | **MI07 — Adjustment** | Ajustement des écarts d'inventaire |
| 7 | **MB52/MMPV — Compliance** | Vérification de conformité finale |

---

## Fonctionnalités principales

**Interface étudiant**
- 17 scénarios répartis sur 5 modules avec déverrouillage progressif (seuil : 60/100)
- Formulaires transactionnels inspirés SAP Fiori avec validation en temps réel
- Rapport final détaillé : scores par étape, analyse des erreurs, recommandations personnalisées

**Interface enseignant**
- **Mode Évaluation** : score officiel, pénalités, blocage de séquence, rapport final de conformité
- **Mode Démonstration** : progression libre, score pédagogique visible (non officiel), explications approfondies pour l'enseignement en classe
- Tableau de bord avec surveillance en temps réel des simulations actives
- Gestionnaire de cohortes, scénarios et devoirs · Export CSV des résultats

**Moteur de règles**
- Validation des dépendances entre étapes
- Calcul de conformité système (stock positif, transactions postées, écarts résolus)
- Scoring automatique avec bonus cycle parfait
- Authentification OAuth via Manus (JWT session cookie)

---

## Technologies

| Couche | Stack |
|--------|-------|
| Frontend | React 19, Tailwind CSS 4, shadcn/ui |
| Backend | Express 4, tRPC 11, Drizzle ORM |
| Base de données | MySQL / TiDB |
| Auth | Manus OAuth (JWT session cookie) |
| Tests | Vitest (50 tests) |

---

## Installation locale

### Prérequis

- Node.js ≥ 22
- pnpm ≥ 9
- MySQL ou TiDB (local ou cloud)

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/Gibran-T/wms-simulatorV2.git
cd wms-simulatorV2

# 2. Installer les dépendances
pnpm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Pousser le schéma de base de données
pnpm db:push

# 5. Lancer le serveur de développement
pnpm dev
```

L'application sera disponible sur `http://localhost:3000`.

---

## Variables d'environnement

Copiez `.env.example` vers `.env` et remplissez les valeurs suivantes :

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Chaîne de connexion MySQL/TiDB |
| `JWT_SECRET` | Secret de signature des cookies de session |
| `VITE_APP_ID` | ID de l'application OAuth Manus |
| `OAUTH_SERVER_URL` | URL du backend OAuth Manus |
| `VITE_OAUTH_PORTAL_URL` | URL du portail de connexion Manus |
| `BUILT_IN_FORGE_API_KEY` | Clé API Manus (serveur) |
| `VITE_FRONTEND_FORGE_API_KEY` | Clé API Manus (frontend) |

> **Sécurité** : Ne jamais exposer les clés serveur (`BUILT_IN_FORGE_API_KEY`) côté client. Ne jamais committer le fichier `.env`.

---

## Tests

```bash
# Lancer tous les tests
pnpm test
```

| Fichier de test | Couverture | Tests |
|---|---|---|
| `server/wms.test.ts` | Moteur de règles + scoring | 15 |
| `server/demo.mode.test.ts` | Isolation du mode démonstration | 15 |
| `server/module2.rules.test.ts` | Règles Module 2 | 19 |
| `server/auth.logout.test.ts` | Déconnexion OAuth | 1 |
| **Total** | | **50** |

---

## Structure du projet

```
client/src/
  pages/
    student/          ← ScenarioList, MissionControl, StepForm, RunReport
    teacher/          ← TeacherDashboard, CohortManager, ScenarioManager,
                         AssignmentManager, MonitorDashboard
    admin/            ← AdminPanel
    Legal.tsx         ← Page /legal (mentions légales)
  components/
    FioriShell.tsx    ← Layout global (header + footer institutionnel)
drizzle/
  schema.ts           ← Schéma de base de données (13 tables)
server/
  routers.ts          ← Procédures tRPC (auth, runs, transactions, monitor...)
  db.ts               ← Helpers de requêtes Drizzle
```

---

## Déploiement

### Manus (recommandé)

Ce projet est optimisé pour la plateforme Manus. Après avoir créé un checkpoint, cliquez sur **Publish** dans l'interface Manus.

### Autre hébergement (Railway, Render)

Ce projet utilise un serveur Express persistant et une base de données MySQL. Il n'est **pas compatible avec Vercel** sans refactorisation significative. Pour un hébergement externe :

1. Connecter le dépôt GitHub à Railway ou Render
2. Ajouter toutes les variables d'environnement dans le tableau de bord
3. Commande de build : `pnpm build`
4. Point d'entrée : `server/index.ts`

> **Note** : Les clés OAuth Manus (`OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`) sont liées à la plateforme Manus et ne fonctionneront pas en dehors de celle-ci sans adaptation.

---

## Sécurité

- Les clés API serveur ne sont jamais exposées au client
- Les sessions sont signées avec JWT et transmises via cookie `HttpOnly`
- Les procédures protégées (`protectedProcedure`) vérifient l'authentification à chaque requête
- Les opérations admin sont protégées par vérification du rôle (`role === 'admin'`)

---

## Mentions légales

Usage pédagogique uniquement — Collège de la Concorde, Montréal.  
© 2026 Collège de la Concorde. Tous droits réservés.  
Voir [/legal](/legal) pour les mentions légales complètes.
