// ============================================================
// ERP Integrated Business Simulator — Data Store
// Programme 2 — Collège de la Concorde
// Modules: ERP-ARCH, MM, SD, FI, ERP-SIM
// Systems: SAP S/4HANA | Microsoft Dynamics 365 | Odoo ERP
// ============================================================

export type SystemRef = {
  sap: string;
  dynamics: string;
  odoo: string;
};

export type SlideContent = {
  id: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  content: string;
  contentEn?: string;
  keyPoints?: string[];
  keyPointsEn?: string[];
  systemRef?: SystemRef;
  type: 'concept' | 'process' | 'comparison' | 'diagram' | 'summary';
};

export type TransactionField = {
  id: string;
  label: string;
  labelEn?: string;
  type: 'text' | 'number' | 'select' | 'date';
  placeholder?: string;
  placeholderEn?: string;
  options?: string[];
  optionsEn?: string[];
  required: boolean;
  correctValue?: string;
  hint?: string;
  hintEn?: string;
};

export type ErpImpact = {
  stockChange?: string;
  stockChangeEn?: string;
  accountingEntry?: string;
  accountingEntryEn?: string;
  documentCreated?: string;
  documentCreatedEn?: string;
  documentStatus?: string;
  documentStatusEn?: string;
  note?: string;
  noteEn?: string;
};

export type TransactionStep = {
  id: string;
  stepNumber: number;
  code: string;
  name: string;
  nameEn?: string;
  objective: string;
  objectiveEn?: string;
  sapCode?: string;
  dynamicsName?: string;
  odooName?: string;
  fields: TransactionField[];
  validationMessage: string;
  validationMessageEn?: string;
  errorMessage: string;
  errorMessageEn?: string;
  points: number;
  erpImpact?: ErpImpact;
};

export type ReflectionQuestion = {
  id: string;
  question: string;
  questionEn?: string;
  hint: string;
  hintEn?: string;
  expectedAnswer?: string;
  expectedAnswerEn?: string;
};

export type Scenario = {
  id: string;
  code: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  difficultyEn?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  steps: TransactionStep[];
  totalPoints: number;
  learningObjective: string;
  learningObjectiveEn?: string;
  reflectionQuestions?: ReflectionQuestion[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  questionEn?: string;
  options: string[];
  optionsEn?: string[];
  correctIndex: number;
  explanation: string;
  explanationEn?: string;
};

export type ERPModule = {
  id: string;
  code: string;
  name: string;
  fullName: string;
  fullNameEn?: string;
  process?: string;
  processEn?: string;
  duration: string;
  hours: number;
  color: string;
  colorClass: string;
  icon: string;
  description: string;
  descriptionEn?: string;
  slides: SlideContent[];
  scenarios: Scenario[];
  quiz?: QuizQuestion[];
};

// ============================================================
// MODULE ERP-ARCH — Architecture ERP & Transformation Numérique
// ============================================================
const moduleERPARCH: ERPModule = {
  id: 'erp-arch',
  code: 'ERP-ARCH',
  name: 'Architecture ERP',
  fullName: 'ERP Architecture & Digital Transformation',
  duration: '5 heures',
  hours: 5,
  color: '#8B5CF6',
  colorClass: 'arch',
  icon: 'Layers',
  description: 'Comprendre l\'architecture modulaire ERP et la transformation numérique des entreprises. Comparaison SAP S/4HANA, Microsoft Dynamics 365 et Odoo.',
  slides: [
    {
      id: 'arch-s1',
      title: 'Qu\'est-ce qu\'un ERP ?',
      subtitle: 'Enterprise Resource Planning — Définition fondamentale',
      type: 'concept',
      content: 'Un ERP (Enterprise Resource Planning) est un système d\'information intégré qui unifie l\'ensemble des processus opérationnels d\'une entreprise dans une seule base de données centralisée. Il élimine les silos d\'information entre les départements.',
      keyPoints: [
        'Base de données unique et centralisée pour toute l\'entreprise',
        'Intégration en temps réel entre tous les départements',
        'Automatisation des processus métier répétitifs',
        'Traçabilité complète de toutes les transactions',
        'Reporting consolidé et tableaux de bord décisionnels'
      ],
      systemRef: {
        sap: 'SAP S/4HANA — ERP nouvelle génération en mémoire (HANA DB)',
        dynamics: 'Microsoft Dynamics 365 — Suite cloud intégrée Microsoft',
        odoo: 'Odoo — ERP open source modulaire et flexible'
      }
    },
    {
      id: 'arch-s2',
      title: 'Évolution historique des ERP',
      subtitle: 'De MRP à S/4HANA — 50 ans d\'évolution',
      type: 'process',
      content: 'L\'évolution des ERP reflète la transformation de la gestion d\'entreprise : des systèmes de planification de production vers des plateformes digitales intégrées couvrant l\'ensemble de la chaîne de valeur.',
      keyPoints: [
        '1960s — MRP (Material Requirements Planning) : planification des besoins matières',
        '1980s — MRP II : intégration de la production et des finances',
        '1990s — ERP : intégration complète (SAP R/3, Oracle)',
        '2000s — ERP étendu : CRM, SCM, e-commerce intégrés',
        '2010s — ERP Cloud : SaaS, mobilité, analytics (Dynamics 365, Odoo)',
        '2020s — ERP Intelligent : IA, ML, IoT intégrés (SAP S/4HANA)'
      ]
    },
    {
      id: 'arch-s3',
      title: 'Architecture Modulaire ERP',
      subtitle: 'Les modules fonctionnels et leurs interconnexions',
      type: 'diagram',
      content: 'Un ERP est structuré en modules fonctionnels interconnectés. Chaque module gère un domaine métier spécifique mais partage les données avec tous les autres modules via la base de données centrale.',
      keyPoints: [
        'MM — Materials Management : achats, stocks, fournisseurs',
        'SD — Sales & Distribution : ventes, livraisons, facturation',
        'FI — Financial Accounting : comptabilité, reporting financier',
        'CO — Controlling : contrôle de gestion, centres de coûts',
        'PP — Production Planning : planification de la production',
        'HR — Human Resources : paie, gestion des talents'
      ],
      systemRef: {
        sap: 'SAP : modules MM, SD, FI, CO, PP, HR, QM, PM',
        dynamics: 'Dynamics 365 : Finance, Supply Chain, Sales, HR, Commerce',
        odoo: 'Odoo : Achats, Ventes, Stocks, Comptabilité, Fabrication, RH'
      }
    },
    {
      id: 'arch-s4',
      title: 'Transformation Numérique des Entreprises',
      subtitle: 'Le rôle central de l\'ERP dans la digitalisation',
      type: 'concept',
      content: 'La transformation numérique implique l\'intégration des technologies digitales dans tous les aspects de l\'entreprise. L\'ERP est le système nerveux central de cette transformation, connectant les processus, les données et les personnes.',
      keyPoints: [
        'Digitalisation des processus papier et manuels',
        'Accès en temps réel aux données de l\'entreprise',
        'Collaboration inter-départements facilitée',
        'Prise de décision basée sur les données (data-driven)',
        'Intégration avec les partenaires externes (EDI, API)',
        'Mobilité : accès depuis n\'importe quel appareil'
      ]
    },
    {
      id: 'arch-s5',
      title: 'Intégration des Processus d\'Affaires',
      subtitle: 'Comment les modules ERP communiquent entre eux',
      type: 'process',
      content: 'L\'intégration ERP signifie qu\'une transaction dans un module déclenche automatiquement des mises à jour dans les autres modules. Par exemple, une réception de marchandises (MM) met à jour automatiquement les stocks et génère une écriture comptable (FI).',
      keyPoints: [
        'MM → FI : réception marchandises génère écriture stock/fournisseur',
        'SD → FI : facturation client génère écriture comptable automatique',
        'MM → SD : disponibilité stock vérifiée lors de la commande client',
        'PP → MM : ordre de fabrication génère besoins en matières',
        'Toutes les transactions sont tracées avec horodatage et utilisateur'
      ]
    },
    {
      id: 'arch-s6',
      title: 'SAP S/4HANA vs Dynamics 365 vs Odoo',
      subtitle: 'Comparaison des trois grands systèmes ERP du marché',
      type: 'comparison',
      content: 'Chaque ERP a ses forces selon la taille de l\'entreprise, le secteur d\'activité et le budget. La connaissance de ces trois systèmes est essentielle pour tout professionnel de la logistique et des affaires.',
      keyPoints: [
        'SAP S/4HANA : leader mondial, grandes entreprises, base HANA en mémoire',
        'Microsoft Dynamics 365 : intégration Office 365/Teams, PME et grandes entreprises',
        'Odoo : open source, flexible, accessible aux PME, 30+ modules',
        'Coût : SAP > Dynamics 365 > Odoo',
        'Complexité : SAP > Dynamics 365 > Odoo',
        'Flexibilité : Odoo > Dynamics 365 > SAP'
      ],
      systemRef: {
        sap: 'SAP S/4HANA : T-codes, Fiori apps, ABAP, HANA DB — 400,000+ clients',
        dynamics: 'Dynamics 365 : Power Platform, Azure, Power BI intégré — 220,000+ clients',
        odoo: 'Odoo 17 : Python, PostgreSQL, interface web moderne — 7M+ utilisateurs'
      }
    },
    {
      id: 'arch-s7',
      title: 'Les T-codes SAP — La navigation dans SAP S/4HANA',
      subtitle: 'Comprendre la logique des codes de transaction SAP',
      type: 'concept',
      content: 'Dans SAP S/4HANA, chaque action dans le système est exécutée via un T-code (Transaction Code). C\'est une adresse directe vers une fonction précise. La convention de nommage est logique : les deux premières lettres indiquent le module, la lettre finale indique l\'action (N=Nouveau, 2=Modifier, 3=Afficher). Dans Dynamics 365 et Odoo, la navigation se fait par menus cliquables.',
      keyPoints: [
        'T-code MM (Achats) : ME = Materials Management External — ME51N, ME21N, MIGO, MIRO',
        'T-code SD (Ventes) : VA = Ventes — VA01, VL01N, VL02N, VF01, F-28',
        'T-code FI (Finance) : FB = Financial Booking — FB50, F-53, FS10N, FB03',
        'Convention SAP : N = Nouveau | 2 = Modifier | 3 = Afficher (ex: ME21N = Créer PO, ME22N = Modifier PO)',
        'Dynamics 365 : navigation par modules dans le menu latéral (Procurement, Sales, Finance)',
        'Odoo : barre de navigation supérieure par application (Achats, Ventes, Comptabilité)'
      ],
      systemRef: {
        sap: 'SAP : saisir le T-code dans la barre de commande en haut à gauche → Entrée pour exécuter',
        dynamics: 'Dynamics 365 : Modules > Supply Chain Management > Procurement and sourcing > ...',
        odoo: 'Odoo : Menu principal > Achats / Ventes / Comptabilité > sous-menus'
      }
    },
    {
      id: 'arch-s8',
      title: 'Flux Achats (P2P) dans SAP, Dynamics et Odoo',
      subtitle: 'Le cycle Procure-to-Pay étape par étape dans les 3 systèmes',
      type: 'process',
      content: 'Le département Achats utilise le module MM dans SAP. Voici le flux complet Procure-to-Pay avec les T-codes SAP et leurs équivalents exacts dans Dynamics 365 et Odoo. Mémorisez ce flux — il sera testé dans les scénarios MM.',
      keyPoints: [
        'Étape 1 — Demande d\'achat (PR) : SAP ME51N | Dynamics : Purchase Requisition | Odoo : Demande d\'achat',
        'Étape 2 — Bon de commande (PO) : SAP ME21N | Dynamics : Purchase Order | Odoo : Bon de commande',
        'Étape 3 — Réception marchandises (GR) : SAP MIGO (Mvt 101) | Dynamics : Product Receipt | Odoo : Réception',
        'Étape 4 — Vérification facture (IV) : SAP MIRO | Dynamics : Vendor Invoice | Odoo : Facture fournisseur',
        'Étape 5 — Paiement fournisseur : SAP F-53 (manuel) / F110 (auto) | Dynamics : Payment Journal | Odoo : Paiement',
        'Flux SAP complet : ME51N → ME21N → MIGO → MIRO → F-53'
      ],
      systemRef: {
        sap: 'SAP MM — Flux P2P : ME51N → ME21N → MIGO (101) → MIRO → F-53',
        dynamics: 'Dynamics 365 — Flux P2P : Requisition → Purchase Order → Product Receipt → Vendor Invoice → Payment',
        odoo: 'Odoo — Flux P2P : Demande d\'achat → Bon de commande → Réception → Facture → Paiement'
      }
    },
    {
      id: 'arch-s9',
      title: 'Flux Ventes (O2C) dans SAP, Dynamics et Odoo',
      subtitle: 'Le cycle Order-to-Cash étape par étape dans les 3 systèmes',
      type: 'process',
      content: 'Le département Ventes utilise le module SD dans SAP. Voici le flux complet Order-to-Cash avec les T-codes SAP et leurs équivalents dans Dynamics 365 et Odoo. Ce flux sera pratiqué en détail dans le module SD.',
      keyPoints: [
        'Étape 1 — Commande client (SO) : SAP VA01 | Dynamics : Sales Order | Odoo : Bon de commande client',
        'Étape 2 — Bon de livraison : SAP VL01N | Dynamics : Shipment | Odoo : Bon de livraison',
        'Étape 3 — Sortie de stock (GI) : SAP VL02N (Post Goods Issue) | Dynamics : Ship Products | Odoo : Valider livraison',
        'Étape 4 — Facturation client : SAP VF01 | Dynamics : Customer Invoice | Odoo : Facture client',
        'Étape 5 — Paiement client : SAP F-28 | Dynamics : Customer Payment | Odoo : Paiement reçu',
        'Flux SAP complet : VA01 → VL01N → VL02N → VF01 → F-28'
      ],
      systemRef: {
        sap: 'SAP SD — Flux O2C : VA01 → VL01N → VL02N (PGI) → VF01 → F-28',
        dynamics: 'Dynamics 365 — Flux O2C : Sales Order → Delivery → Ship → Customer Invoice → Payment',
        odoo: 'Odoo — Flux O2C : Commande → Livraison → Validation → Facture → Paiement'
      }
    },
    {
      id: 'arch-s10',
      title: 'Écritures Comptables Automatiques (FI)',
      subtitle: 'Comment chaque transaction génère une écriture dans FI',
      type: 'concept',
      content: 'L\'intégration ERP signifie que chaque transaction opérationnelle génère automatiquement une écriture comptable dans FI — sans saisie manuelle. Comprendre ces écritures est fondamental pour interpréter les états financiers.',
      keyPoints: [
        'Réception GR (MIGO) → Débit : Compte Stock | Crédit : Compte GR-IR (transitoire)',
        'Facture fournisseur IV (MIRO) → Débit : Compte GR-IR | Crédit : Compte Fournisseur (AP)',
        'Paiement fournisseur (F-53) → Débit : Compte Fournisseur | Crédit : Compte Banque',
        'Sortie de stock GI (VL02N) → Débit : COGS (Coût des ventes) | Crédit : Compte Stock',
        'Facture client (VF01) → Débit : Compte Clients (AR) | Crédit : Compte Ventes (CA)',
        'Paiement client (F-28) → Débit : Compte Banque | Crédit : Compte Clients'
      ],
      systemRef: {
        sap: 'SAP FI T-codes : FB50 (écriture manuelle), FS10N (solde compte), FB03 (consulter écriture)',
        dynamics: 'Dynamics 365 Finance : General Ledger alimenté automatiquement par Supply Chain et Sales',
        odoo: 'Odoo Comptabilité : Grand livre alimenté automatiquement par Achats et Ventes'
      }
    }
  ],
  scenarios: [
    {
      id: 'erp-arch-01',
      code: 'ERP-ARCH-01',
      title: 'Identifier les modules ERP',
      description: 'L\'étudiant doit identifier quel module ERP gère chaque processus d\'affaires et comment les modules interagissent entre eux.',
      difficulty: 'Débutant',
      duration: '20 min',
      learningObjective: 'Comprendre la structure modulaire d\'un ERP et associer chaque processus au bon module.',
      totalPoints: 100,
      steps: [
        {
          id: 'arch-01-s1',
          stepNumber: 1,
          code: 'ERP-ARCH-01-A',
          name: 'Identifier le module de gestion des achats',
          objective: 'Associer le processus Procure-to-Pay au bon module ERP',
          sapCode: 'Module MM (Materials Management)',
          dynamicsName: 'Supply Chain Management',
          odooName: 'Module Achats (Purchase)',
          fields: [
            {
              id: 'module_achats',
              label: 'Quel module ERP gère le processus Procure-to-Pay ?',
              type: 'select',
              options: ['Module MM — Materials Management', 'Module SD — Sales & Distribution', 'Module FI — Financial Integration', 'Module HR — Human Resources'],
              required: true,
              correctValue: 'Module MM — Materials Management',
              hint: 'Ce module gère les achats, les stocks et les relations fournisseurs'
            }
          ],
          validationMessage: '✅ Correct ! Le module MM (Materials Management) gère tout le cycle Procure-to-Pay : de la demande d\'achat au paiement fournisseur.',
          errorMessage: '❌ Incorrect. Le module MM (Materials Management) est responsable des achats et de la gestion des stocks.',
          points: 25
        },
        {
          id: 'arch-01-s2',
          stepNumber: 2,
          code: 'ERP-ARCH-01-B',
          name: 'Identifier le module de gestion des ventes',
          objective: 'Associer le processus Order-to-Cash au bon module ERP',
          sapCode: 'Module SD (Sales & Distribution)',
          dynamicsName: 'Sales / Commerce',
          odooName: 'Module Ventes (Sales)',
          fields: [
            {
              id: 'module_ventes',
              label: 'Quel module ERP gère le processus Order-to-Cash ?',
              type: 'select',
              options: ['Module MM — Materials Management', 'Module SD — Sales & Distribution', 'Module FI — Financial Integration', 'Module PP — Production Planning'],
              required: true,
              correctValue: 'Module SD — Sales & Distribution',
              hint: 'Ce module gère les commandes clients, livraisons et facturation'
            }
          ],
          validationMessage: '✅ Correct ! Le module SD (Sales & Distribution) gère tout le cycle Order-to-Cash : de la commande client au paiement reçu.',
          errorMessage: '❌ Incorrect. Le module SD (Sales & Distribution) gère les ventes, livraisons et la facturation client.',
          points: 25
        },
        {
          id: 'arch-01-s3',
          stepNumber: 3,
          code: 'ERP-ARCH-01-C',
          name: 'Identifier l\'impact financier',
          objective: 'Comprendre que toute transaction opérationnelle génère une écriture comptable automatique',
          sapCode: 'Module FI (Financial Accounting)',
          dynamicsName: 'Finance',
          odooName: 'Module Comptabilité (Accounting)',
          fields: [
            {
              id: 'integration_fi',
              label: 'Quand une réception de marchandises est enregistrée dans MM, que se passe-t-il automatiquement dans FI ?',
              type: 'select',
              options: ['Rien — les modules sont indépendants', 'Une écriture comptable est générée automatiquement', 'Le module FI doit être mis à jour manuellement', 'Une facture client est créée'],
              required: true,
              correctValue: 'Une écriture comptable est générée automatiquement',
              hint: 'C\'est le principe fondamental de l\'intégration ERP'
            }
          ],
          validationMessage: '✅ Excellent ! C\'est le cœur de l\'intégration ERP : chaque transaction opérationnelle génère automatiquement les écritures comptables correspondantes dans FI.',
          errorMessage: '❌ Incorrect. L\'intégration ERP signifie que MM et FI sont connectés : toute réception de marchandises génère automatiquement une écriture comptable.',
          points: 25
        },
        {
          id: 'arch-01-s4',
          stepNumber: 4,
          code: 'ERP-ARCH-01-D',
          name: 'Choisir le bon ERP selon le contexte',
          objective: 'Recommander le bon système ERP selon la taille et les besoins de l\'entreprise',
          fields: [
            {
              id: 'choix_erp',
              label: 'Une PME de 50 employés cherche un ERP flexible et abordable. Quelle solution recommandez-vous ?',
              type: 'select',
              options: ['SAP S/4HANA — solution enterprise complète', 'Microsoft Dynamics 365 — intégration Microsoft', 'Odoo — open source flexible et accessible', 'Aucun ERP n\'est adapté aux PME'],
              required: true,
              correctValue: 'Odoo — open source flexible et accessible',
              hint: 'Pensez au rapport coût/flexibilité pour une PME'
            }
          ],
          validationMessage: '✅ Très bien ! Odoo est idéal pour les PME : open source, modulaire, coût accessible et facile à personnaliser. SAP et Dynamics sont mieux adaptés aux grandes entreprises.',
          errorMessage: '❌ Pour une PME de 50 employés, Odoo est la solution la plus adaptée : flexible, abordable et facile à déployer.',
          points: 25
        }
      ]
    },
    {
      id: 'erp-arch-02',
      code: 'ERP-ARCH-02',
      title: 'Cartographier les processus d\'affaires',
      description: 'L\'étudiant doit mapper les départements de l\'entreprise aux modules ERP correspondants et identifier les flux d\'information.',
      difficulty: 'Intermédiaire',
      duration: '25 min',
      learningObjective: 'Associer les fonctions organisationnelles aux modules ERP et comprendre les flux de données inter-départements.',
      totalPoints: 100,
      steps: [
        {
          id: 'arch-02-s1',
          stepNumber: 1,
          code: 'ERP-ARCH-02-A',
          name: 'Mapper le département Achats',
          objective: 'Identifier les modules ERP utilisés par le département Achats',
          sapCode: 'MM — T-codes : ME51N, ME21N, MIGO',
          dynamicsName: 'Supply Chain > Procurement',
          odooName: 'Achats > Demandes > Bons de commande',
          fields: [
            {
              id: 'dept_achats',
              label: 'Quel est le flux correct pour le département Achats dans SAP ?',
              type: 'select',
              options: ['VA01 → VL01N → VF01', 'ME51N → ME21N → MIGO → MIRO', 'FB50 → F-53 → F-28', 'MM01 → MB1A → MI07'],
              required: true,
              correctValue: 'ME51N → ME21N → MIGO → MIRO',
              hint: 'ME = Module MM, ces T-codes correspondent au cycle Procure-to-Pay'
            }
          ],
          validationMessage: '✅ Correct ! Dans SAP : ME51N (Demande d\'achat) → ME21N (Bon de commande) → MIGO (Réception marchandises) → MIRO (Vérification facture).',
          errorMessage: '❌ Le flux Achats dans SAP est : ME51N → ME21N → MIGO → MIRO. Les T-codes VA sont pour les ventes, FB pour la comptabilité.',
          points: 34
        },
        {
          id: 'arch-02-s2',
          stepNumber: 2,
          code: 'ERP-ARCH-02-B',
          name: 'Mapper le département Ventes',
          objective: 'Identifier les modules ERP utilisés par le département Ventes',
          sapCode: 'SD — T-codes : VA01, VL01N, VF01',
          dynamicsName: 'Sales > Orders > Invoices',
          odooName: 'Ventes > Commandes > Livraisons > Factures',
          fields: [
            {
              id: 'dept_ventes',
              label: 'Dans Dynamics 365, quel est le flux Order-to-Cash ?',
              type: 'select',
              options: ['Purchase Order → Receipt → Invoice', 'Sales Order → Delivery → Invoice → Payment', 'Journal Entry → Cost Center → Report', 'Requisition → Approval → PO → GR'],
              required: true,
              correctValue: 'Sales Order → Delivery → Invoice → Payment',
              hint: 'Order-to-Cash commence toujours par une commande client'
            }
          ],
          validationMessage: '✅ Parfait ! Dans Dynamics 365 : Sales Order → Delivery → Invoice → Payment. C\'est le même flux O2C que dans SAP (VA01 → VL01N → VF01) et Odoo.',
          errorMessage: '❌ Le flux Order-to-Cash est : Sales Order → Delivery → Invoice → Payment. C\'est universel dans tous les ERP.',
          points: 33
        },
        {
          id: 'arch-02-s3',
          stepNumber: 3,
          code: 'ERP-ARCH-02-C',
          name: 'Identifier les flux d\'intégration',
          objective: 'Comprendre comment MM, SD et FI s\'intègrent dans un flux complet',
          fields: [
            {
              id: 'flux_integration',
              label: 'Dans Odoo, quand une commande client est confirmée, quel module est automatiquement impliqué ?',
              type: 'select',
              options: ['Seulement le module Ventes', 'Ventes + Stocks (vérification disponibilité)', 'Ventes + Comptabilité uniquement', 'Tous les modules sans exception'],
              required: true,
              correctValue: 'Ventes + Stocks (vérification disponibilité)',
              hint: 'Odoo vérifie automatiquement la disponibilité des articles en stock'
            }
          ],
          validationMessage: '✅ Excellent ! Dans Odoo (et tous les ERP), la confirmation d\'une commande client déclenche automatiquement la vérification des stocks disponibles — c\'est l\'intégration SD-MM.',
          errorMessage: '❌ Quand une commande client est confirmée dans Odoo, le module Stocks est automatiquement consulté pour vérifier la disponibilité.',
          points: 33
        }
      ]
    },
    {
      id: 'erp-arch-03',
      code: 'ERP-ARCH-03',
      title: 'Diagnostiquer un système fragmenté',
      description: 'L\'étudiant analyse une entreprise utilisant des systèmes disparates et propose une solution ERP intégrée.',
      difficulty: 'Avancé',
      duration: '30 min',
      learningObjective: 'Identifier les problèmes causés par les silos d\'information et proposer une architecture ERP intégrée.',
      totalPoints: 100,
      steps: [
        {
          id: 'arch-03-s1',
          stepNumber: 1,
          code: 'ERP-ARCH-03-A',
          name: 'Identifier les silos d\'information',
          objective: 'Reconnaître les symptômes d\'un système d\'information fragmenté',
          fields: [
            {
              id: 'silo_symptome',
              label: 'L\'entreprise Distributions Montréal utilise Excel pour les stocks, QuickBooks pour la comptabilité et un logiciel séparé pour les ventes. Quel est le principal problème ?',
              type: 'select',
              options: ['Les logiciels sont trop chers', 'Les données ne sont pas synchronisées en temps réel entre les systèmes', 'L\'entreprise a trop d\'employés', 'Les systèmes sont trop modernes'],
              required: true,
              correctValue: 'Les données ne sont pas synchronisées en temps réel entre les systèmes',
              hint: 'Pensez à ce qui se passe quand une vente est faite — les stocks sont-ils mis à jour automatiquement ?'
            }
          ],
          validationMessage: '✅ Correct ! Les silos d\'information causent des données désynchronisées, des erreurs manuelles, des délais et une vision fragmentée de l\'entreprise.',
          errorMessage: '❌ Le problème principal est la désynchronisation des données : une vente dans le logiciel commercial ne met pas à jour automatiquement les stocks dans Excel ni la comptabilité dans QuickBooks.',
          points: 34
        },
        {
          id: 'arch-03-s2',
          stepNumber: 2,
          code: 'ERP-ARCH-03-B',
          name: 'Proposer une solution ERP',
          objective: 'Recommander le bon ERP selon le contexte de l\'entreprise',
          fields: [
            {
              id: 'solution_erp',
              label: 'Distributions Montréal a 80 employés, budget limité, besoin de gestion stocks + ventes + comptabilité. Quelle solution ERP recommandez-vous ?',
              type: 'select',
              options: ['SAP S/4HANA — le plus complet', 'Microsoft Dynamics 365 Business Central', 'Odoo Community (open source)', 'Continuer avec Excel et QuickBooks'],
              required: true,
              correctValue: 'Odoo Community (open source)',
              hint: 'Budget limité + PME = solution accessible et flexible'
            }
          ],
          validationMessage: '✅ Excellent choix ! Odoo Community est idéal : gratuit (open source), couvre stocks + ventes + comptabilité, facile à déployer pour une PME de 80 personnes.',
          errorMessage: '❌ Pour une PME avec budget limité, Odoo Community est la meilleure option : open source, gratuit, et couvre tous les besoins mentionnés.',
          points: 33
        },
        {
          id: 'arch-03-s3',
          stepNumber: 3,
          code: 'ERP-ARCH-03-C',
          name: 'Définir les bénéfices de l\'intégration',
          objective: 'Articuler les avantages concrets d\'une migration vers un ERP intégré',
          fields: [
            {
              id: 'benefice_erp',
              label: 'Après migration vers Odoo, quel bénéfice immédiat obtiendra Distributions Montréal ?',
              type: 'select',
              options: ['Réduction du personnel de 50%', 'Mise à jour automatique des stocks lors de chaque vente ou achat', 'Élimination de tous les problèmes d\'entreprise', 'Doublement du chiffre d\'affaires garanti'],
              required: true,
              correctValue: 'Mise à jour automatique des stocks lors de chaque vente ou achat',
              hint: 'L\'intégration ERP signifie que les données se synchronisent automatiquement'
            }
          ],
          validationMessage: '✅ Parfait ! L\'intégration ERP garantit que chaque transaction (vente, achat, réception) met à jour automatiquement les stocks, la comptabilité et tous les modules concernés — en temps réel.',
          errorMessage: '❌ Le bénéfice principal est la synchronisation automatique des données : chaque transaction met à jour tous les modules concernés en temps réel.',
          points: 33
        }
      ]
    }
  ]
};

// ============================================================
// MODULE MM — Materials Management (Procure-to-Pay)
// ============================================================
const moduleMM: ERPModule = {
  id: 'mm',
  code: 'MM',
  name: 'Materials Management',
  fullName: 'MM — Materials Management',
  process: 'Procure-to-Pay (P2P)',
  duration: '7 heures',
  hours: 7,
  color: '#06B6D4',
  colorClass: 'mm',
  icon: 'Package',
  description: 'Maîtriser le cycle Procure-to-Pay complet : de la demande d\'achat au paiement fournisseur. Transactions simulées dans SAP S/4HANA, Dynamics 365 et Odoo.',
  slides: [
    {
      id: 'mm-s1',
      title: 'Le Processus Procure-to-Pay (P2P)',
      subtitle: 'Du besoin au paiement fournisseur',
      type: 'process',
      content: 'Le cycle Procure-to-Pay (P2P) est le processus complet d\'approvisionnement : depuis l\'identification d\'un besoin jusqu\'au paiement du fournisseur. C\'est l\'un des processus les plus critiques dans tout ERP.',
      keyPoints: [
        'PR — Purchase Requisition : demande d\'achat interne',
        'PO — Purchase Order : bon de commande envoyé au fournisseur',
        'GR — Goods Receipt : réception physique des marchandises',
        'IV — Invoice Verification : vérification de la facture fournisseur',
        'Payment — Paiement du fournisseur'
      ],
      systemRef: {
        sap: 'SAP : ME51N (PR) → ME21N (PO) → MIGO (GR) → MIRO (IV) → F-53 (Payment)',
        dynamics: 'Dynamics 365 : Purchase Requisition → PO → Product Receipt → Vendor Invoice → Payment',
        odoo: 'Odoo : Demande d\'achat → Bon de commande → Réception → Facture fournisseur → Paiement'
      }
    },
    {
      id: 'mm-s2',
      title: 'Étape 1 — Purchase Requisition (PR)',
      subtitle: 'La demande d\'achat interne',
      type: 'concept',
      content: 'La Purchase Requisition (PR) est une demande interne formelle pour l\'achat de biens ou services. Elle est créée par le département demandeur et doit être approuvée avant de générer un bon de commande.',
      keyPoints: [
        'Créée par le département qui a le besoin (production, entrepôt, etc.)',
        'Contient : article, quantité, date requise, centre de coûts',
        'Doit être approuvée selon les niveaux d\'autorisation',
        'Peut être convertie automatiquement en PO',
        'Traçabilité complète : qui a demandé, quand, pourquoi'
      ],
      systemRef: {
        sap: 'SAP T-code : ME51N — Créer une demande d\'achat',
        dynamics: 'Dynamics 365 : Procurement > Purchase Requisitions > New',
        odoo: 'Odoo : Achats > Demandes d\'achat > Créer'
      }
    },
    {
      id: 'mm-s3',
      title: 'Étape 2 — Purchase Order (PO)',
      subtitle: 'Le bon de commande fournisseur',
      type: 'concept',
      content: 'Le Purchase Order (PO) est le document contractuel envoyé au fournisseur. Il confirme les conditions d\'achat : prix, quantité, délai de livraison et conditions de paiement. C\'est un engagement légal de l\'entreprise.',
      keyPoints: [
        'Créé à partir de la PR approuvée (conversion automatique)',
        'Contient : fournisseur, articles, prix, délais, conditions paiement',
        'Envoyé au fournisseur par email, EDI ou portail fournisseur',
        'Numéro de PO unique pour le suivi',
        'Peut être modifié avec accord du fournisseur (amendment)'
      ],
      systemRef: {
        sap: 'SAP T-code : ME21N — Créer un bon de commande',
        dynamics: 'Dynamics 365 : Procurement > Purchase Orders > New',
        odoo: 'Odoo : Achats > Bons de commande > Créer'
      }
    },
    {
      id: 'mm-s4',
      title: 'Étape 3 — Goods Receipt (GR)',
      subtitle: 'La réception des marchandises',
      type: 'concept',
      content: 'Le Goods Receipt (GR) est l\'enregistrement de la réception physique des marchandises commandées. C\'est une étape critique : elle met à jour les stocks et génère automatiquement une écriture comptable dans FI.',
      keyPoints: [
        'Vérification physique : quantité et qualité reçues vs commandées',
        'Mise à jour automatique du stock en temps réel',
        'Génération automatique d\'une écriture comptable (Stock/GR-IR)',
        'Création d\'un document de mouvement de stock',
        'Peut être partielle (livraison en plusieurs fois)'
      ],
      systemRef: {
        sap: 'SAP T-code : MIGO — Mouvement de marchandises (type 101)',
        dynamics: 'Dynamics 365 : Purchase Orders > Receive > Product Receipt',
        odoo: 'Odoo : Achats > Réceptions > Valider'
      }
    },
    {
      id: 'mm-s5',
      title: 'Étape 4 — Invoice Verification (IV)',
      subtitle: 'La vérification de la facture fournisseur',
      type: 'concept',
      content: 'L\'Invoice Verification (IV) est le processus de rapprochement à 3 voies : PO (bon de commande) + GR (réception) + Facture fournisseur. Si les trois documents concordent, la facture est approuvée pour paiement.',
      keyPoints: [
        'Rapprochement 3 voies : PO + GR + Facture',
        'Vérification des prix, quantités et conditions',
        'Tolérance configurable pour les écarts mineurs',
        'Blocage automatique si écart significatif',
        'Génération d\'une écriture comptable fournisseur'
      ],
      systemRef: {
        sap: 'SAP T-code : MIRO — Saisie de facture fournisseur',
        dynamics: 'Dynamics 365 : Accounts Payable > Vendor Invoices > New',
        odoo: 'Odoo : Comptabilité > Fournisseurs > Factures'
      }
    },
    {
      id: 'mm-s6',
      title: 'Étape 5 — Vendor Payment',
      subtitle: 'Le paiement du fournisseur',
      type: 'concept',
      content: 'Le paiement fournisseur est la dernière étape du cycle P2P. Il est déclenché à l\'échéance définie dans les conditions de paiement (30, 60, 90 jours). L\'ERP gère automatiquement les échéanciers et les propositions de paiement.',
      keyPoints: [
        'Paiement déclenché selon les conditions négociées (Net 30, 60, 90)',
        'Proposition de paiement automatique par l\'ERP',
        'Modes : virement bancaire, chèque, carte',
        'Mise à jour automatique du compte fournisseur',
        'Clôture du cycle P2P — document comptable final'
      ],
      systemRef: {
        sap: 'SAP T-code : F-53 — Paiement manuel fournisseur / F110 — Paiement automatique',
        dynamics: 'Dynamics 365 : Accounts Payable > Payment Journal > New',
        odoo: 'Odoo : Comptabilité > Fournisseurs > Paiements'
      }
    },
    {
      id: 'mm-s7',
      title: 'Gestion des Fournisseurs (Vendor Management)',
      subtitle: 'La base des relations fournisseurs dans l\'ERP',
      type: 'concept',
      content: 'La gestion des fournisseurs dans l\'ERP centralise toutes les informations : coordonnées, conditions de paiement, historique des commandes, performance de livraison et évaluations qualité.',
      keyPoints: [
        'Fiche fournisseur : coordonnées, IBAN, conditions paiement',
        'Évaluation fournisseur : délais, qualité, prix',
        'Historique complet des transactions',
        'Blocage fournisseur en cas de problème',
        'Comparaison des offres (appels d\'offres)'
      ],
      systemRef: {
        sap: 'SAP : Fiche fournisseur (Vendor Master) — T-code XK01/XK02',
        dynamics: 'Dynamics 365 : Accounts Payable > Vendors > All Vendors',
        odoo: 'Odoo : Achats > Fournisseurs > Contacts'
      }
    },
    {
      id: 'mm-s8',
      title: 'Champs Obligatoires dans chaque étape P2P',
      subtitle: 'Ce que vous devez saisir dans SAP, Dynamics et Odoo',
      type: 'concept',
      content: 'Chaque étape du cycle Procure-to-Pay exige des champs spécifiques. Connaître ces champs est essentiel pour exécuter les transactions correctement dans les scénarios MM. Les champs marqués * sont obligatoires dans les 3 systèmes.',
      keyPoints: [
        'ME51N (PR) : *Matériau/Service, *Quantité, *Date livraison souhaitée, *Centre de coûts, *Société',
        'ME21N (PO) : *Fournisseur, *Matériau, *Quantité, *Prix unitaire, *Devise, *Conditions paiement',
        'MIGO (GR) : *Référence PO, *Quantité reçue, *Dépôt de destination, *Mouvement 101',
        'MIRO (IV) : *Référence PO, *Montant facture, *Date facture, *Numéro facture fournisseur',
        'F-53 (Paiement) : *Compte fournisseur, *Montant, *Date valeur, *Compte bancaire',
        'Conseil : toujours vérifier que la quantité MIGO ≤ quantité PO et montant MIRO ≤ montant PO'
      ],
      systemRef: {
        sap: 'SAP : champs en rouge = obligatoires, champs en jaune = avertissement si vides',
        dynamics: 'Dynamics 365 : champs avec astérisque (*) = obligatoires dans tous les formulaires',
        odoo: 'Odoo : champs en gras = obligatoires, message d\'erreur si incomplets'
      }
    },
    {
      id: 'mm-s9',
      title: 'Impact Comptable du Cycle P2P',
      subtitle: 'Écritures générées automatiquement dans FI',
      type: 'concept',
      content: 'Chaque étape du cycle P2P génère automatiquement une écriture dans le module FI. Comprendre ces écritures vous permet de valider que le cycle est complet et que les comptes sont équilibrés.',
      keyPoints: [
        'MIGO (GR) → Débit : 300000 Stocks | Crédit : 191000 GR/IR Clearing (compte transitoire)',
        'MIRO (IV) → Débit : 191000 GR/IR Clearing | Crédit : 160000 Comptes fournisseurs (AP)',
        'F-53 (Paiement) → Débit : 160000 Comptes fournisseurs | Crédit : 113000 Banque',
        'Impact sur le bilan : Stocks +, Banque -, Fournisseurs = 0 après paiement',
        'Compte GR/IR = compte transitoire qui s\'annule entre MIGO et MIRO',
        'Exemple : PO 10 000 CAD → GR +10 000 stocks → MIRO +10 000 AP → F-53 -10 000 banque'
      ],
      systemRef: {
        sap: 'SAP FI : vérifier écritures avec FB03, solde compte avec FS10N',
        dynamics: 'Dynamics 365 Finance : Accounts Payable > Transactions > Vendor transactions',
        odoo: 'Odoo Comptabilité : Fournisseurs > Factures > Écritures comptables'
      }
    },
    {
      id: 'mm-s10',
      title: '🔑 Le Compte GR/IR — Concept Clé',
      titleEn: '🔑 The GR/IR Clearing Account — Key Concept',
      subtitle: 'Le pont entre la réception physique et la facture fournisseur',
      subtitleEn: 'The bridge between physical receipt and vendor invoice',
      type: 'concept',
      content: 'Le compte GR/IR (Goods Receipt / Invoice Receipt) est un compte transitoire qui sert de pont entre le module MM et le module FI. Il garantit que les stocks et la comptabilité restent synchronisés même si la réception et la facture arrivent à des moments différents.',
      contentEn: 'The GR/IR (Goods Receipt / Invoice Receipt) Clearing Account is a temporary bridge account between MM and FI. It ensures that inventory and accounting remain synchronized even when the physical receipt and the vendor invoice arrive at different times.',
      keyPoints: [
        '📦 À la réception (MIGO) : Dr Stocks 2 500 CAD | Cr GR/IR Clearing 2 500 CAD',
        '🧾 À la facture (MIRO) : Dr GR/IR Clearing 2 500 CAD | Cr Fournisseur AP 2 500 CAD',
        '💰 Au paiement (F-53) : Dr Fournisseur AP 2 500 CAD | Cr Banque 2 500 CAD',
        '✅ Résultat net : GR/IR = 0 (soldé) | Stocks + | Banque - | Fournisseur = 0',
        '⚠️ Si GR/IR n\'est pas soldé en fin de mois → problème : réception sans facture ou facture sans réception',
        '🔍 SAP : FS10N pour vérifier le solde GR/IR | T-code MR11 pour le rapprochement GR/IR'
      ],
      keyPointsEn: [
        '📦 At receipt (MIGO): Dr Inventory 2,500 CAD | Cr GR/IR Clearing 2,500 CAD',
        '🧾 At invoice (MIRO): Dr GR/IR Clearing 2,500 CAD | Cr Accounts Payable 2,500 CAD',
        '💰 At payment (F-53): Dr Accounts Payable 2,500 CAD | Cr Bank 2,500 CAD',
        '✅ Net result: GR/IR = 0 (cleared) | Inventory + | Bank - | Vendor AP = 0',
        '⚠️ If GR/IR is not cleared at month-end → problem: receipt without invoice or invoice without receipt',
        '🔍 SAP: FS10N to check GR/IR balance | T-code MR11 for GR/IR reconciliation'
      ],
      systemRef: {
        sap: 'SAP : Compte GR/IR = 191000 (WRX). Vérifier avec FS10N. Rapprochement avec MR11.',
        dynamics: 'Dynamics 365 : Accrued Purchases account. Accounts Payable > Periodic tasks > Invoice matching.',
        odoo: 'Odoo : Compte de réception de stock (Stock Interim Account). Comptabilité > Fournisseurs > Rapprochement.'
      }
    }
  ],
  scenarios: [
    {
      id: 'mm-01',
      code: 'MM-01',
      title: 'Cycle d\'approvisionnement standard',
      description: 'Exécuter le cycle Procure-to-Pay complet pour l\'achat de 100 unités de produit PROD-001 auprès du fournisseur FOURNISSEUR-MTL.',
      difficulty: 'Débutant',
      duration: '35 min',
      learningObjective: 'Exécuter les 5 étapes du cycle P2P de bout en bout dans un contexte réel.',
      totalPoints: 100,
      reflectionQuestions: [
        { id: 'mm01-r1', question: 'Pourquoi la Demande d\'Achat (PR) ne crée-t-elle pas de dette fournisseur dans la comptabilité ?', hint: 'Pensez à la différence entre une demande interne et un engagement contractuel.' },
        { id: 'mm01-r2', question: 'Qu\'est-ce que le rapprochement à 3 voies (3-way match) et pourquoi est-il obligatoire avant le paiement ?', hint: 'PO + GR + Facture : chaque document confirme une étape différente de la transaction.' },
        { id: 'mm01-r3', question: 'Dans SAP, Dynamics 365 et Odoo, le processus P2P est identique. Qu\'est-ce qui diffère vraiment entre ces systèmes ?', hint: 'Comparez ME21N, Purchase Order et Bon de commande : même action, noms différents.' },
      ],
      steps: [
        {
          id: 'mm-01-s1',
          stepNumber: 1,
          code: 'PR-2026-001',
          name: 'Créer la Demande d\'Achat (PR)',
          objective: 'Créer une demande d\'achat pour 100 unités de PROD-001',
          sapCode: 'ME51N',
          dynamicsName: 'Purchase Requisition',
          odooName: 'Demande d\'achat',
          fields: [
            { id: 'article', label: 'Code article', type: 'text', placeholder: 'Ex: PROD-001', required: true, correctValue: 'PROD-001', hint: 'Code de l\'article à commander' },
            { id: 'quantite', label: 'Quantité demandée', type: 'number', placeholder: 'Ex: 100', required: true, correctValue: '100', hint: 'Quantité requise selon le besoin' },
            { id: 'date_requise', label: 'Date requise', type: 'date', required: true, correctValue: '', hint: 'Date à laquelle les marchandises sont nécessaires' },
            { id: 'centre_cout', label: 'Centre de coûts', type: 'select', options: ['CC-ENTREPOT', 'CC-PRODUCTION', 'CC-ADMIN', 'CC-VENTES'], required: true, correctValue: 'CC-ENTREPOT', hint: 'Département qui supporte le coût' }
          ],
          validationMessage: '✅ Demande d\'achat PR-2026-001 créée avec succès ! SAP : ME51N exécuté. Dynamics : Requisition soumise. Odoo : Demande créée. Statut : En attente d\'approbation.',
          errorMessage: '❌ Vérifiez le code article (PROD-001), la quantité (100) et le centre de coûts (CC-ENTREPOT).',
          points: 20,
          erpImpact: {
            documentCreated: 'Purchase Requisition PR-2026-001',
            documentStatus: 'En attente d\'approbation',
            note: 'La PR n\'engage aucune dépense — c\'est une demande interne. Dans les 3 systèmes, elle déclenche un flux d\'approbation avant de devenir un bon de commande.',
          },
        },
        {
          id: 'mm-01-s2',
          stepNumber: 2,
          code: 'PO-2026-001',
          name: 'Créer le Bon de Commande (PO)',
          objective: 'Convertir la PR approuvée en bon de commande fournisseur',
          sapCode: 'ME21N',
          dynamicsName: 'Purchase Order',
          odooName: 'Bon de commande',
          fields: [
            { id: 'fournisseur', label: 'Fournisseur', type: 'select', options: ['FOURNISSEUR-MTL', 'FOURNISSEUR-QC', 'FOURNISSEUR-ON', 'FOURNISSEUR-BC'], required: true, correctValue: 'FOURNISSEUR-MTL', hint: 'Sélectionner le fournisseur approuvé' },
            { id: 'prix_unitaire', label: 'Prix unitaire (CAD)', type: 'number', placeholder: 'Ex: 25.00', required: true, correctValue: '25.00', hint: 'Prix négocié avec le fournisseur' },
            { id: 'conditions_paiement', label: 'Conditions de paiement', type: 'select', options: ['Net 30 jours', 'Net 60 jours', 'Net 90 jours', '2/10 Net 30'], required: true, correctValue: 'Net 30 jours', hint: 'Délai de paiement convenu' },
            { id: 'date_livraison', label: 'Date de livraison souhaitée', type: 'date', required: true, correctValue: '', hint: 'Date de livraison attendue' }
          ],
          validationMessage: '✅ Bon de commande PO-2026-001 créé ! Montant total : 2 500,00 CAD. SAP : ME21N. Dynamics : PO confirmé. Odoo : BC envoyé au fournisseur FOURNISSEUR-MTL.',
          errorMessage: '❌ Vérifiez le fournisseur (FOURNISSEUR-MTL), le prix (25.00 CAD) et les conditions de paiement (Net 30 jours).',
          points: 20,
          erpImpact: {
            documentCreated: 'Purchase Order PO-2026-001 — 100 × PROD-001 @ 25,00 CAD',
            documentStatus: 'Ouvert — Envoyé au fournisseur FOURNISSEUR-MTL',
            note: 'Le PO engage l\'entreprise pour 2 500 CAD. FI enregistre un engagement budgétaire (commitment).',
          },
        },
        {
          id: 'mm-01-s3',
          stepNumber: 3,
          code: 'GR-2026-001',
          name: 'Enregistrer la Réception (GR)',
          objective: 'Enregistrer la réception physique des 100 unités commandées',
          sapCode: 'MIGO (Mvt 101)',
          dynamicsName: 'Product Receipt',
          odooName: 'Réception / Valider',
          fields: [
            { id: 'quantite_recue', label: 'Quantité reçue', type: 'number', placeholder: 'Ex: 100', required: true, correctValue: '100', hint: 'Quantité physiquement reçue et vérifiée' },
            { id: 'numero_bl', label: 'Numéro de bon de livraison', type: 'text', placeholder: 'Ex: BL-FMTL-2026-001', required: true, correctValue: 'BL-FMTL-2026-001', hint: 'Numéro du document de livraison fournisseur' },
            { id: 'emplacement', label: 'Emplacement de stockage', type: 'select', options: ['ZONE-A1', 'ZONE-B2', 'ZONE-C3', 'ZONE-RECEPTION'], required: true, correctValue: 'ZONE-A1', hint: 'Où les marchandises sont rangées en entrepôt' }
          ],
          validationMessage: '✅ Réception GR-2026-001 enregistrée ! Stock mis à jour : +100 unités PROD-001. Écriture comptable générée automatiquement dans FI. SAP : MIGO Mvt 101 exécuté.',
          errorMessage: '❌ Vérifiez la quantité reçue (100) et le numéro de bon de livraison.',
          points: 20,
          erpImpact: {
            stockChange: '+100 unités PROD-001 → ZONE-A1',
            accountingEntry: 'Dr Stocks marchandises 2 500 CAD / Cr Compte GR/IR 2 500 CAD',
            documentCreated: 'Material Document GR-2026-001',
            documentStatus: 'PO : Livré — Réception enregistrée',
            note: 'Étape clé : le stock augmente et FI est mis à jour automatiquement. C\'est l\'intégration MM→FI.',
          },
        },
        {
          id: 'mm-01-s4',
          stepNumber: 4,
          code: 'IV-2026-001',
          name: 'Vérifier la Facture Fournisseur (IV)',
          objective: 'Rapprochement 3 voies : PO + GR + Facture fournisseur',
          sapCode: 'MIRO',
          dynamicsName: 'Vendor Invoice',
          odooName: 'Facture fournisseur',
          fields: [
            { id: 'numero_facture', label: 'Numéro de facture fournisseur', type: 'text', placeholder: 'Ex: FAC-FMTL-2026-001', required: true, correctValue: 'FAC-FMTL-2026-001', hint: 'Numéro sur la facture reçue du fournisseur' },
            { id: 'montant_facture', label: 'Montant de la facture (CAD)', type: 'number', placeholder: 'Ex: 2500.00', required: true, correctValue: '2500.00', hint: 'Doit correspondre au PO : 100 × 25,00 = 2 500,00' },
            { id: 'date_facture', label: 'Date de la facture', type: 'date', required: true, correctValue: '', hint: 'Date indiquée sur la facture fournisseur' }
          ],
          validationMessage: '✅ Facture IV-2026-001 vérifiée et approuvée ! Rapprochement 3 voies réussi : PO 2 500,00 = GR 2 500,00 = Facture 2 500,00. Prêt pour paiement.',
          errorMessage: '❌ Écart détecté ! Le montant doit correspondre au PO (2 500,00 CAD = 100 unités × 25,00 CAD). Vérifiez la facture.',
          points: 20,
          erpImpact: {
            accountingEntry: 'Dr Compte GR/IR 2 500 CAD / Cr Fournisseur FOURNISSEUR-MTL 2 500 CAD',
            documentCreated: 'Accounting Document IV-2026-001',
            documentStatus: 'Facture approuvée — Paiement à 30 jours',
            note: 'Le compte GR/IR (intermédiaire) est soldé. La dette fournisseur apparaît dans FI.',
          },
        },
        {
          id: 'mm-01-s5',
          stepNumber: 5,
          code: 'PAY-2026-001',
          name: 'Enregistrer le Paiement Fournisseur',
          objective: 'Effectuer le paiement du fournisseur à l\'échéance',
          sapCode: 'F-53',
          dynamicsName: 'Payment Journal',
          odooName: 'Paiement fournisseur',
          fields: [
            { id: 'mode_paiement', label: 'Mode de paiement', type: 'select', options: ['Virement bancaire (EFT)', 'Chèque', 'Carte de crédit corporative', 'Lettre de crédit'], required: true, correctValue: 'Virement bancaire (EFT)', hint: 'Mode de paiement standard pour les fournisseurs B2B' },
            { id: 'montant_paiement', label: 'Montant du paiement (CAD)', type: 'number', placeholder: 'Ex: 2500.00', required: true, correctValue: '2500.00', hint: 'Montant total de la facture approuvée' },
            { id: 'date_paiement', label: 'Date de paiement', type: 'date', required: true, correctValue: '', hint: 'Doit respecter les conditions Net 30 jours' }
          ],
          validationMessage: '✅ Paiement PAY-2026-001 enregistré ! 2 500,00 CAD virés à FOURNISSEUR-MTL. Cycle P2P complété avec succès ! Score : 100/100. Écriture comptable finale générée dans FI.',
          errorMessage: '❌ Vérifiez le montant (2 500,00 CAD) et le mode de paiement (Virement bancaire).',
          points: 20,
          erpImpact: {
            accountingEntry: 'Dr Fournisseur FOURNISSEUR-MTL 2 500 CAD / Cr Banque 2 500 CAD',
            documentCreated: 'Payment Document PAY-2026-001',
            documentStatus: 'Cycle P2P complété',
            note: 'Le cycle P2P est terminé. Dans les 3 systèmes, le paiement solde la dette fournisseur et met à jour la trésorerie automatiquement.',
          },
        }
      ]
    },
    {
      id: 'mm-02',
      code: 'MM-02',
      title: 'Réception de marchandises en retard',
      description: 'Gérer un scénario où la livraison du fournisseur arrive 15 jours après la date prévue, causant une rupture de stock.',
      difficulty: 'Intermédiaire',
      duration: '30 min',
      learningObjective: 'Gérer les exceptions dans le cycle P2P : retards de livraison, relances fournisseur et impact sur la production.',
      totalPoints: 100,
      steps: [
        {
          id: 'mm-02-s1',
          stepNumber: 1,
          code: 'MM-02-A',
          name: 'Identifier le retard de livraison',
          objective: 'Détecter et documenter le retard fournisseur',
          sapCode: 'ME2M / ME2N',
          dynamicsName: 'Purchase Order Inquiry',
          odooName: 'Suivi des commandes',
          fields: [
            { id: 'jours_retard', label: 'Nombre de jours de retard', type: 'number', placeholder: 'Ex: 15', required: true, correctValue: '15', hint: 'Calculé entre date prévue et date actuelle' },
            { id: 'impact', label: 'Impact sur les opérations', type: 'select', options: ['Aucun impact', 'Rupture de stock imminente', 'Arrêt de production', 'Perte client potentielle'], required: true, correctValue: 'Rupture de stock imminente', hint: 'Évaluer l\'impact business du retard' }
          ],
          validationMessage: '✅ Retard identifié : 15 jours. Risque de rupture de stock détecté. Alerte générée dans le système ERP. Action requise : relance fournisseur.',
          errorMessage: '❌ Vérifiez le nombre de jours de retard (15) et l\'impact (Rupture de stock imminente).',
          erpImpact: {
            note: 'A 15-day delay triggers an automatic ERP alert because the system compares the confirmed delivery date against today — this procurement exception management logic is identical in SAP ME2M, D365 Purchase Inquiry, and Odoo Order Tracking.',
          },
          points: 34
        },
        {
          id: 'mm-02-s2',
          stepNumber: 2,
          code: 'MM-02-B',
          name: 'Envoyer une relance fournisseur',
          objective: 'Documenter la relance et obtenir une nouvelle date de livraison',
          sapCode: 'ME92F (Relance)',
          dynamicsName: 'Vendor Communication Log',
          odooName: 'Chatter / Message fournisseur',
          fields: [
            { id: 'nouvelle_date', label: 'Nouvelle date de livraison confirmée', type: 'date', required: true, correctValue: '', hint: 'Date confirmée par le fournisseur après relance' },
            { id: 'penalite', label: 'Pénalité de retard applicable ?', type: 'select', options: ['Oui — selon contrat', 'Non — premier retard', 'À négocier', 'Pas de clause contractuelle'], required: true, correctValue: 'Oui — selon contrat', hint: 'Vérifier les conditions contractuelles' }
          ],
          validationMessage: '✅ Relance envoyée. Nouvelle date confirmée. Pénalité contractuelle documentée. Le PO est mis à jour avec la nouvelle date dans l\'ERP.',
          errorMessage: '❌ Confirmez la nouvelle date de livraison et vérifiez les clauses contractuelles de pénalité.',
          erpImpact: {
            note: 'Updating the PO with a new confirmed date and logging the penalty creates a complete audit trail — the ERP becomes the single source of truth for all supplier communications.',
          },
          points: 33
        },
        {
          id: 'mm-02-s3',
          stepNumber: 3,
          code: 'MM-02-C',
          name: 'Évaluer la performance fournisseur',
          objective: 'Mettre à jour la fiche de performance du fournisseur',
          sapCode: 'ME61 (Évaluation fournisseur)',
          dynamicsName: 'Vendor Performance',
          odooName: 'Évaluation fournisseur',
          fields: [
            { id: 'note_livraison', label: 'Note de performance livraison (1-10)', type: 'number', placeholder: 'Ex: 4', required: true, correctValue: '4', hint: 'Retard de 15 jours = performance insuffisante' },
            { id: 'action_corrective', label: 'Action corrective recommandée', type: 'select', options: ['Aucune action', 'Avertissement formel', 'Diversifier les fournisseurs', 'Changer de fournisseur'], required: true, correctValue: 'Diversifier les fournisseurs', hint: 'Réduire la dépendance à un seul fournisseur' }
          ],
          validationMessage: '✅ Évaluation fournisseur mise à jour. Note livraison : 4/10. Recommandation : diversifier les sources d\'approvisionnement pour réduire le risque.',
          errorMessage: '❌ Un retard de 15 jours mérite une note basse (4/10) et justifie la diversification des fournisseurs.',
          erpImpact: {
            note: 'Supplier performance scores stored in the ERP (SAP ME61, D365 Vendor Analytics, Odoo Supplier Report) feed directly into future sourcing decisions — a score of 4/10 automatically flags the supplier for review.',
          },
          points: 33
        }
      ]
    },
    {
      id: 'mm-03',
      code: 'MM-03',
      title: 'Écart de facture fournisseur',
      description: 'La facture reçue ne correspond pas au bon de commande. Gérer le blocage et la résolution de l\'écart.',
      difficulty: 'Intermédiaire',
      duration: '25 min',
      learningObjective: 'Gérer les écarts de facturation dans le cycle P2P et comprendre le rapprochement 3 voies.',
      totalPoints: 100,
      steps: [
        {
          id: 'mm-03-s1',
          stepNumber: 1,
          code: 'MM-03-A',
          name: 'Détecter l\'écart de facture',
          objective: 'Identifier l\'écart entre le PO et la facture reçue',
          sapCode: 'MIRO (Blocage automatique)',
          dynamicsName: 'Invoice Matching Exception',
          odooName: 'Contrôle de facturation',
          fields: [
            { id: 'montant_po', label: 'Montant du PO (CAD)', type: 'number', placeholder: 'Ex: 2500.00', required: true, correctValue: '2500.00', hint: 'Montant original du bon de commande' },
            { id: 'montant_facture', label: 'Montant de la facture reçue (CAD)', type: 'number', placeholder: 'Ex: 2750.00', required: true, correctValue: '2750.00', hint: 'Montant indiqué sur la facture fournisseur' },
            { id: 'ecart', label: 'Montant de l\'écart (CAD)', type: 'number', placeholder: 'Ex: 250.00', required: true, correctValue: '250.00', hint: 'Différence entre facture et PO' }
          ],
          validationMessage: '✅ Écart détecté : 250,00 CAD (10% au-dessus du PO). Facture bloquée automatiquement par l\'ERP. Rapprochement 3 voies échoué.',
          errorMessage: '❌ L\'écart est de 250,00 CAD (2 750,00 - 2 500,00). La facture doit être bloquée.',
          erpImpact: {
            note: 'Three-way matching (PO = GR = Invoice) is the ERP\'s core control: when the invoice amount exceeds the PO by more than the tolerance, the system blocks payment automatically — this prevents overpayment without any manual intervention.',
          },
          points: 34
        },
        {
          id: 'mm-03-s2',
          stepNumber: 2,
          code: 'MM-03-B',
          name: 'Contacter le fournisseur',
          objective: 'Résoudre l\'écart avec le fournisseur',
          sapCode: 'MR8M (Annulation) / MIRO (Correction)',
          dynamicsName: 'Vendor Invoice Dispute',
          odooName: 'Note de crédit fournisseur',
          fields: [
            { id: 'cause_ecart', label: 'Cause de l\'écart identifiée', type: 'select', options: ['Erreur de prix fournisseur', 'Frais de transport non prévus', 'Quantité supplémentaire livrée', 'Taxe incorrecte'], required: true, correctValue: 'Erreur de prix fournisseur', hint: 'Le prix unitaire facturé ne correspond pas au PO' },
            { id: 'resolution', label: 'Action de résolution', type: 'select', options: ['Accepter la facture telle quelle', 'Demander une note de crédit de 250,00 CAD', 'Annuler la commande', 'Payer partiellement'], required: true, correctValue: 'Demander une note de crédit de 250,00 CAD', hint: 'Le fournisseur doit émettre une correction' }
          ],
          validationMessage: '✅ Note de crédit de 250,00 CAD demandée au fournisseur. Écart documenté dans l\'ERP. Facture reste bloquée jusqu\'à réception de la note de crédit.',
          errorMessage: '❌ La bonne action est de demander une note de crédit de 250,00 CAD au fournisseur pour corriger l\'erreur de prix.',
          erpImpact: {
            note: 'Requesting a credit note keeps the blocked invoice in the ERP until the discrepancy is resolved — this creates a legally traceable correction chain that protects both the buyer and the supplier.',
          },
          points: 33
        },
        {
          id: 'mm-03-s3',
          stepNumber: 3,
          code: 'MM-03-C',
          name: 'Débloquer et valider la facture corrigée',
          objective: 'Valider la facture après réception de la note de crédit',
          sapCode: 'MIRO (Déblocage)',
          dynamicsName: 'Invoice Approval',
          odooName: 'Valider la facture corrigée',
          fields: [
            { id: 'montant_final', label: 'Montant final après note de crédit (CAD)', type: 'number', placeholder: 'Ex: 2500.00', required: true, correctValue: '2500.00', hint: '2 750,00 - 250,00 = 2 500,00 CAD' },
            { id: 'validation', label: 'Rapprochement 3 voies final', type: 'select', options: ['Écart toujours présent', 'PO = GR = Facture corrigée = 2 500,00 CAD', 'Facture annulée', 'En attente d\'approbation'], required: true, correctValue: 'PO = GR = Facture corrigée = 2 500,00 CAD', hint: 'Les trois documents doivent maintenant correspondre' }
          ],
          validationMessage: '✅ Facture débloquée et validée ! Rapprochement 3 voies réussi : PO = GR = Facture = 2 500,00 CAD. Prêt pour paiement. Cycle P2P repris.',
          errorMessage: '❌ Le montant final doit être 2 500,00 CAD et le rapprochement 3 voies doit être validé.',
          erpImpact: {
            note: 'Unblocking the invoice after receiving the credit note completes the three-way match: PO = GR = Corrected Invoice — only then does the ERP allow the payment run to proceed.',
          },
          points: 33
        }
      ]
    },
    {
      id: 'mm-04',
      code: 'MM-04',
      title: 'Problème de performance fournisseur',
      description: 'Analyser les indicateurs de performance d\'un fournisseur récurrent et décider des actions correctives.',
      difficulty: 'Avancé',
      duration: '30 min',
      learningObjective: 'Évaluer la performance fournisseur et prendre des décisions d\'approvisionnement basées sur les données ERP.',
      totalPoints: 100,
      steps: [
        {
          id: 'mm-04-s1',
          stepNumber: 1,
          code: 'MM-04-A',
          name: 'Analyser les KPI fournisseur',
          objective: 'Interpréter les indicateurs de performance fournisseur dans l\'ERP',
          sapCode: 'ME61 / ME6H',
          dynamicsName: 'Vendor Performance Analytics',
          odooName: 'Rapport fournisseur',
          fields: [
            { id: 'taux_livraison', label: 'Taux de livraison à temps (%)', type: 'number', placeholder: 'Ex: 65', required: true, correctValue: '65', hint: 'Données des 6 derniers mois : 65% des livraisons à temps' },
            { id: 'taux_qualite', label: 'Taux de qualité (%)', type: 'number', placeholder: 'Ex: 88', required: true, correctValue: '88', hint: '88% des lots reçus conformes aux spécifications' },
            { id: 'evaluation', label: 'Évaluation globale du fournisseur', type: 'select', options: ['Excellent (90-100%)', 'Bon (75-89%)', 'Acceptable (60-74%)', 'Insuffisant (< 60%)'], required: true, correctValue: 'Acceptable (60-74%)', hint: 'Basé sur le taux de livraison de 65%' }
          ],
          validationMessage: '✅ Analyse complète. Fournisseur classé "Acceptable" : livraison 65%, qualité 88%. Performance insuffisante sur les délais. Action corrective requise.',
          errorMessage: '❌ Avec 65% de livraisons à temps, le fournisseur est classé "Acceptable (60-74%)".',
          erpImpact: {
            note: 'ERP vendor scorecards (SAP ME61, D365 Vendor Performance Analytics, Odoo Supplier Report) aggregate delivery and quality data automatically — a 65% on-time rate places the supplier in the "Acceptable" band, triggering a mandatory corrective action review.',
          },
          points: 34
        },
        {
          id: 'mm-04-s2',
          stepNumber: 2,
          code: 'MM-04-B',
          name: 'Décider l\'action corrective',
          objective: 'Choisir la stratégie d\'approvisionnement adaptée',
          fields: [
            { id: 'action', label: 'Action corrective recommandée', type: 'select', options: ['Continuer sans changement', 'Plan d\'amélioration avec le fournisseur', 'Appel d\'offres pour trouver un fournisseur alternatif', 'Rupture immédiate du contrat'], required: true, correctValue: 'Plan d\'amélioration avec le fournisseur', hint: 'Performance acceptable mais améliorable — dialogue avant rupture' },
            { id: 'delai', label: 'Délai pour amélioration (mois)', type: 'number', placeholder: 'Ex: 3', required: true, correctValue: '3', hint: 'Donner un délai raisonnable pour s\'améliorer' }
          ],
          validationMessage: '✅ Plan d\'amélioration sur 3 mois établi avec le fournisseur. Objectif : taux de livraison à temps > 85%. Suivi mensuel dans l\'ERP.',
          errorMessage: '❌ La bonne approche est un plan d\'amélioration de 3 mois avant d\'envisager un changement de fournisseur.',
          erpImpact: {
            note: 'A 3-month improvement plan is logged as a vendor action item in the ERP — this creates a formal review cycle where the system will automatically re-evaluate the supplier score at the end of the period.',
          },
          points: 33
        },
        {
          id: 'mm-04-s3',
          stepNumber: 3,
          code: 'MM-04-C',
          name: 'Diversifier les sources d\'approvisionnement',
          objective: 'Réduire le risque en identifiant un fournisseur alternatif',
          fields: [
            { id: 'strategie', label: 'Stratégie de sourcing recommandée', type: 'select', options: ['Fournisseur unique (single sourcing)', 'Double sourcing (2 fournisseurs)', 'Multi-sourcing (3+ fournisseurs)', 'Intégration verticale (produire soi-même)'], required: true, correctValue: 'Double sourcing (2 fournisseurs)', hint: 'Équilibre entre coût et réduction du risque' }
          ],
          validationMessage: '✅ Stratégie double sourcing adoptée : 70% chez le fournisseur principal, 30% chez un alternatif. Risque de rupture réduit. Fiche fournisseur mise à jour dans l\'ERP.',
          errorMessage: '❌ Le double sourcing est la meilleure stratégie : maintenir le fournisseur actuel tout en développant une alternative.',
          erpImpact: {
            note: 'Double sourcing (70%/30% split) is recorded in the ERP purchasing info records — the system will automatically split future purchase orders between the two suppliers according to the configured quota arrangement.',
          },
          points: 33
        }
      ]
    }
  ]
};

// ============================================================
// MODULE SD — Sales & Distribution (Order-to-Cash)
// ============================================================
const moduleSD: ERPModule = {
  id: 'sd',
  code: 'SD',
  name: 'Sales & Distribution',
  fullName: 'SD — Sales & Distribution',
  process: 'Order-to-Cash (O2C)',
  duration: '7 heures',
  hours: 7,
  color: '#10B981',
  colorClass: 'sd',
  icon: 'ShoppingCart',
  description: 'Maîtriser le cycle Order-to-Cash complet : de la commande client au paiement reçu. Transactions simulées dans SAP S/4HANA, Dynamics 365 et Odoo.',
  slides: [
    {
      id: 'sd-s1',
      title: 'Le Processus Order-to-Cash (O2C)',
      subtitle: 'De la commande client au paiement reçu',
      type: 'process',
      content: 'Le cycle Order-to-Cash (O2C) couvre l\'ensemble du processus de vente : depuis la réception d\'une commande client jusqu\'à l\'encaissement du paiement. C\'est le processus qui génère le chiffre d\'affaires de l\'entreprise.',
      keyPoints: [
        'SO — Sales Order : commande client confirmée',
        'Delivery — Bon de livraison créé',
        'GI — Goods Issue : sortie de stock enregistrée',
        'Billing — Facture client générée',
        'Payment — Paiement client enregistré'
      ],
      systemRef: {
        sap: 'SAP : VA01 (SO) → VL01N (Delivery) → VL02N (GI) → VF01 (Billing) → F-28 (Payment)',
        dynamics: 'Dynamics 365 : Sales Order → Pick/Pack → Ship → Invoice → Customer Payment',
        odoo: 'Odoo : Commande → Livraison → Bon de sortie → Facture → Paiement client'
      }
    },
    {
      id: 'sd-s2',
      title: 'Étape 1 — Sales Order (SO)',
      subtitle: 'La commande client dans l\'ERP',
      type: 'concept',
      content: 'Le Sales Order (SO) est l\'enregistrement formel d\'une commande client dans l\'ERP. Il déclenche automatiquement la vérification de la disponibilité des stocks et réserve les articles pour ce client.',
      keyPoints: [
        'Créé à partir d\'un devis accepté ou directement',
        'Vérification automatique de la disponibilité stock (ATP check)',
        'Réservation automatique des articles en stock',
        'Calcul automatique du prix selon la liste de prix client',
        'Confirmation de commande envoyée au client'
      ],
      systemRef: {
        sap: 'SAP T-code : VA01 — Créer commande client (type OR)',
        dynamics: 'Dynamics 365 : Sales > Orders > New Sales Order',
        odoo: 'Odoo : Ventes > Commandes > Créer'
      }
    },
    {
      id: 'sd-s3',
      title: 'Étape 2 — Création du Bon de Livraison',
      subtitle: 'Préparer l\'expédition',
      type: 'concept',
      content: 'Le bon de livraison (Delivery) est créé à partir du Sales Order. Il déclenche les opérations d\'entrepôt : picking (prélèvement), packing (emballage) et préparation de l\'expédition.',
      keyPoints: [
        'Créé automatiquement ou manuellement à partir du SO',
        'Déclenche les opérations de picking en entrepôt',
        'Vérification finale de la disponibilité stock',
        'Attribution d\'un transporteur et d\'une route',
        'Génération des documents d\'expédition (bordereau, étiquettes)'
      ],
      systemRef: {
        sap: 'SAP T-code : VL01N — Créer livraison sortante',
        dynamics: 'Dynamics 365 : Warehouse Management > Outbound > Delivery',
        odoo: 'Odoo : Stocks > Livraisons > Créer'
      }
    },
    {
      id: 'sd-s4',
      title: 'Étape 3 — Goods Issue (GI)',
      subtitle: 'La sortie de stock',
      type: 'concept',
      content: 'Le Goods Issue (GI) est l\'enregistrement de la sortie physique des marchandises de l\'entrepôt. C\'est l\'étape qui réduit le stock et génère automatiquement l\'écriture comptable de coût des marchandises vendues (COGS).',
      keyPoints: [
        'Enregistrement de la sortie physique des marchandises',
        'Réduction automatique du stock disponible',
        'Génération automatique de l\'écriture COGS dans FI',
        'Transfert de propriété au client (risque)',
        'Déclenchement de la facturation possible'
      ],
      systemRef: {
        sap: 'SAP T-code : VL02N — Comptabiliser sortie marchandises',
        dynamics: 'Dynamics 365 : Ship > Post Goods Issue',
        odoo: 'Odoo : Valider la livraison (Bon de sortie)'
      }
    },
    {
      id: 'sd-s5',
      title: 'Étape 4 — Facturation Client (Billing)',
      subtitle: 'Générer la facture client',
      type: 'concept',
      content: 'La facturation client est déclenchée après le Goods Issue. La facture est générée automatiquement à partir des données du Sales Order et de la livraison. Elle génère une écriture comptable dans FI (Débit Client / Crédit Ventes).',
      keyPoints: [
        'Générée automatiquement après le Goods Issue',
        'Reprend les prix et conditions du Sales Order',
        'Génère automatiquement l\'écriture comptable dans FI',
        'Envoyée au client par email, EDI ou portail',
        'Crée une créance client (Accounts Receivable)'
      ],
      systemRef: {
        sap: 'SAP T-code : VF01 — Créer facture client',
        dynamics: 'Dynamics 365 : Accounts Receivable > Customer Invoices > New',
        odoo: 'Odoo : Ventes > À facturer > Créer facture'
      }
    },
    {
      id: 'sd-s6',
      title: 'Étape 5 — Paiement Client',
      subtitle: 'Encaissement et clôture du cycle O2C',
      type: 'concept',
      content: 'Le paiement client est la dernière étape du cycle O2C. Il est enregistré dans l\'ERP lors de la réception du virement ou du chèque. L\'ERP rapproche automatiquement le paiement avec la facture ouverte.',
      keyPoints: [
        'Réception du paiement client (virement, chèque, carte)',
        'Rapprochement automatique paiement/facture',
        'Clôture de la créance client',
        'Mise à jour du solde compte client',
        'Fin du cycle O2C — chiffre d\'affaires réalisé'
      ],
      systemRef: {
        sap: 'SAP T-code : F-28 — Paiement client entrant',
        dynamics: 'Dynamics 365 : Accounts Receivable > Customer Payments > New',
        odoo: 'Odoo : Comptabilité > Clients > Paiements'
      }
    },
    {
      id: 'sd-s7',
      title: 'Gestion des Stocks dans le Cycle O2C',
      subtitle: 'L\'intégration SD-MM pour la disponibilité',
      type: 'concept',
      content: 'La vérification de disponibilité (ATP — Available-to-Promise) est une fonctionnalité clé de l\'intégration SD-MM. Avant de confirmer une commande client, l\'ERP vérifie automatiquement si le stock est disponible.',
      keyPoints: [
        'ATP Check : Available-to-Promise — vérification en temps réel',
        'Stock disponible = Stock physique - Réservations existantes',
        'Si insuffisant : date de livraison reportée ou commande partielle',
        'Intégration avec PP : si stock insuffisant, ordre de fabrication créé',
        'Visibilité complète pour le commercial sur la disponibilité'
      ]
    },
    {
      id: 'sd-s8',
      title: 'Champs Obligatoires dans chaque étape O2C',
      subtitle: 'Ce que vous devez saisir dans SAP, Dynamics et Odoo',
      type: 'concept',
      content: 'Chaque étape du cycle Order-to-Cash exige des champs spécifiques. Connaître ces champs est essentiel pour exécuter les transactions correctement dans les scénarios SD.',
      keyPoints: [
        'VA01 (SO) : *Client, *Type commande (OR), *Matériau, *Quantité, *Date livraison souhaitée, *Incoterms',
        'VL01N (Livraison) : *Référence SO, *Date livraison, *Dépôt expédition, *Transporteur',
        'VL02N (PGI) : *Quantité livrée, *Valider sortie de stock (Post Goods Issue)',
        'VF01 (Facture) : *Référence livraison, *Type facturation (F2), *Date facturation',
        'F-28 (Paiement) : *Compte client, *Montant, *Date valeur, *Référence facture',
        'Flux SAP complet : VA01 → VL01N → VL02N (PGI) → VF01 → F-28'
      ],
      systemRef: {
        sap: 'SAP : champs obligatoires en rouge, message d\'erreur si manquants avant sauvegarde',
        dynamics: 'Dynamics 365 : champs avec astérisque (*) dans Sales Order et Customer Invoice',
        odoo: 'Odoo : champs en gras dans Commande client, Livraison et Facture client'
      }
    },
    {
      id: 'sd-s9',
      title: 'Impact Comptable du Cycle O2C',
      subtitle: 'Écritures générées automatiquement dans FI',
      type: 'concept',
      content: 'Chaque étape du cycle O2C génère automatiquement une écriture dans FI. La sortie de stock (PGI) et la facturation sont les deux étapes qui ont le plus grand impact sur les états financiers.',
      keyPoints: [
        'VL02N PGI (Sortie stock) → Débit : 500000 COGS (Coût des ventes) | Crédit : 300000 Stocks',
        'VF01 (Facture client) → Débit : 140000 Clients (AR) | Crédit : 800000 Chiffre d\'affaires',
        'F-28 (Paiement reçu) → Débit : 113000 Banque | Crédit : 140000 Clients (AR)',
        'Marge brute = CA (800000) - COGS (500000) — calculée automatiquement dans FI',
        'Exemple : Vente 15 000 CAD, coût 8 000 CAD → Marge brute = 7 000 CAD (46.7%)',
        'Impact sur le bilan : Stocks -, Clients +, puis Banque + après paiement'
      ],
      systemRef: {
        sap: 'SAP FI : vérifier écritures avec FB03, rapport P&L avec S_ALR_87012284',
        dynamics: 'Dynamics 365 Finance : Accounts Receivable > Transactions > Customer transactions',
        odoo: 'Odoo Comptabilité : Clients > Factures > Écritures comptables'
      }
    }
  ],
  scenarios: [
    {
      id: 'sd-01',
      code: 'SD-01',
      title: 'Cycle de vente standard',
      description: 'Exécuter le cycle Order-to-Cash complet pour une commande de 50 unités de PROD-001 pour le client CLIENT-MTL.',
      difficulty: 'Débutant',
      duration: '35 min',
      learningObjective: 'Exécuter les 5 étapes du cycle O2C de bout en bout.',
      totalPoints: 100,
      reflectionQuestions: [
        { id: 'sd01-r1', question: 'Pourquoi la livraison (GI) est-elle une étape distincte de la facturation dans le cycle O2C ?', hint: 'La livraison est un événement physique, la facturation est un événement financier — ils peuvent se produire à des moments différents.' },
        { id: 'sd01-r2', question: 'Qu\'est-ce que le Goods Issue (GI) déclenche automatiquement dans le module FI ?', hint: 'Pensez au COGS (coût des marchandises vendues) et à la variation de stock.' },
        { id: 'sd01-r3', question: 'Dans SAP, Dynamics 365 et Odoo, la commande client porte des noms différents. Quel est le processus sous-jacent commun à tous ?', hint: 'VA01, Sales Order, Commande de vente : même cycle O2C, même logique métier.' },
      ],
      steps: [
        {
          id: 'sd-01-s1',
          stepNumber: 1,
          code: 'SO-2026-001',
          name: 'Créer la Commande Client (SO)',
          objective: 'Enregistrer la commande de 50 unités pour CLIENT-MTL',
          sapCode: 'VA01',
          dynamicsName: 'Sales Order',
          odooName: 'Commande client',
          fields: [
            { id: 'client', label: 'Client', type: 'select', options: ['CLIENT-MTL', 'CLIENT-QC', 'CLIENT-ON', 'CLIENT-BC'], required: true, correctValue: 'CLIENT-MTL', hint: 'Client de Montréal' },
            { id: 'article_so', label: 'Code article', type: 'text', placeholder: 'Ex: PROD-001', required: true, correctValue: 'PROD-001', hint: 'Article commandé par le client' },
            { id: 'quantite_so', label: 'Quantité commandée', type: 'number', placeholder: 'Ex: 50', required: true, correctValue: '50', hint: 'Quantité selon la commande client' },
            { id: 'prix_vente', label: 'Prix unitaire de vente (CAD)', type: 'number', placeholder: 'Ex: 45.00', required: true, correctValue: '45.00', hint: 'Prix selon la liste de prix client' }
          ],
          validationMessage: '✅ Commande SO-2026-001 créée ! Montant : 2 250,00 CAD. ATP Check : 100 unités disponibles. Confirmation envoyée à CLIENT-MTL. SAP : VA01 exécuté.',
          errorMessage: '❌ Vérifiez le client (CLIENT-MTL), l\'article (PROD-001), la quantité (50) et le prix (45,00 CAD).',
          points: 20,
          erpImpact: {
            documentCreated: 'Sales Order SO-2026-001 — 50 × PROD-001 @ 45,00 CAD',
            documentStatus: 'Ouvert — Confirmation envoyée à CLIENT-MTL',
            note: 'SAP VA01 : réservation automatique du stock. D365 : Sales Order créé dans le module Sales. Odoo : Commande confirmée, stock réservé.',
          },
        },
        {
          id: 'sd-01-s2',
          stepNumber: 2,
          code: 'DEL-2026-001',
          name: 'Créer le Bon de Livraison',
          objective: 'Préparer l\'expédition des 50 unités',
          sapCode: 'VL01N',
          dynamicsName: 'Delivery Order',
          odooName: 'Bon de livraison',
          fields: [
            { id: 'transporteur', label: 'Transporteur', type: 'select', options: ['Purolator', 'FedEx Canada', 'UPS Canada', 'Transport interne'], required: true, correctValue: 'Purolator', hint: 'Transporteur standard pour livraisons Montréal' },
            { id: 'date_expedition', label: 'Date d\'expédition', type: 'date', required: true, correctValue: '', hint: 'Date de départ de l\'entrepôt' },
            { id: 'emplacement_picking', label: 'Zone de picking', type: 'select', options: ['ZONE-A1', 'ZONE-B2', 'ZONE-C3', 'ZONE-RECEPTION'], required: true, correctValue: 'ZONE-A1', hint: 'Zone où PROD-001 est stocké' }
          ],
          validationMessage: '✅ Bon de livraison DEL-2026-001 créé ! Picking assigné à ZONE-A1. Transporteur : Purolator. Documents d\'expédition générés.',
          errorMessage: '❌ Vérifiez le transporteur (Purolator) et la zone de picking (ZONE-A1).',
          points: 20,
          erpImpact: {
            documentCreated: 'Delivery Order DEL-2026-001 — Picking déclenché ZONE-A1',
            documentStatus: 'En préparation — Picking en cours',
            note: 'SAP VL01N : bon de livraison créé, picking list générée. D365 : Outbound Shipment créé. Odoo : Bon de livraison en attente de validation.',
          },
        },
        {
          id: 'sd-01-s3',
          stepNumber: 3,
          code: 'GI-2026-001',
          name: 'Comptabiliser la Sortie de Stock (GI)',
          objective: 'Enregistrer la sortie physique des 50 unités',
          sapCode: 'VL02N (PGI)',
          dynamicsName: 'Post Goods Issue',
          odooName: 'Valider livraison',
          fields: [
            { id: 'quantite_gi', label: 'Quantité expédiée', type: 'number', placeholder: 'Ex: 50', required: true, correctValue: '50', hint: 'Quantité physiquement chargée et expédiée' },
            { id: 'numero_tracking', label: 'Numéro de suivi transporteur', type: 'text', placeholder: 'Ex: PUR-2026-789456', required: true, correctValue: 'PUR-2026-789456', hint: 'Numéro de tracking Purolator' }
          ],
          validationMessage: '✅ Sortie de stock GI-2026-001 comptabilisée ! Stock réduit de 50 unités. COGS enregistré dans FI. Marchandises en transit vers CLIENT-MTL.',
          errorMessage: '❌ Vérifiez la quantité expédiée (50) et le numéro de tracking.',
          points: 20,
          erpImpact: {
            stockChange: '-50 unités PROD-001 (sortie entrepôt)',
            accountingEntry: 'Dr COGS (Coût des ventes) 1 250 CAD / Cr Stocks marchandises 1 250 CAD',
            documentCreated: 'Goods Issue GI-2026-001 — Transfert de propriété au client',
            documentStatus: 'Expédié — En transit Purolator #PUR-2026-789456',
            note: 'Étape clé : le stock diminue et FI enregistre automatiquement le COGS. C\'est l\'intégration SD→FI.',
          },
        },
        {
          id: 'sd-01-s4',
          stepNumber: 4,
          code: 'INV-2026-001',
          name: 'Générer la Facture Client',
          objective: 'Créer et envoyer la facture de 2 250,00 CAD',
          sapCode: 'VF01',
          dynamicsName: 'Customer Invoice',
          odooName: 'Facture client',
          fields: [
            { id: 'montant_facture_sd', label: 'Montant de la facture (CAD)', type: 'number', placeholder: 'Ex: 2250.00', required: true, correctValue: '2250.00', hint: '50 × 45,00 = 2 250,00 CAD' },
            { id: 'echeance', label: 'Date d\'échéance', type: 'date', required: true, correctValue: '', hint: 'Selon conditions de paiement Net 30 jours' },
            { id: 'mode_envoi', label: 'Mode d\'envoi de la facture', type: 'select', options: ['Email PDF', 'Portail client', 'EDI', 'Courrier postal'], required: true, correctValue: 'Email PDF', hint: 'Mode standard pour CLIENT-MTL' }
          ],
          validationMessage: '✅ Facture INV-2026-001 générée et envoyée ! 2 250,00 CAD. Écriture comptable : Débit Clients 2 250,00 / Crédit Ventes 2 250,00. Créance ouverte dans FI.',
          errorMessage: '❌ Le montant doit être 2 250,00 CAD (50 × 45,00).',
          points: 20,
          erpImpact: {
            accountingEntry: 'Dr Clients (AR) 2 250 CAD / Cr Chiffre d\'affaires (Ventes) 2 250 CAD',
            documentCreated: 'Customer Invoice INV-2026-001 — Envoyée à CLIENT-MTL',
            documentStatus: 'Ouverte — Échéance Net 30 jours',
            note: 'SAP VF01 : facture créée, écriture FI automatique. D365 : Customer Invoice postée dans AR. Odoo : Facture client confirmée, créance ouverte.',
          },
        },
        {
          id: 'sd-01-s5',
          stepNumber: 5,
          code: 'PAY-CLI-2026-001',
          name: 'Enregistrer le Paiement Client',
          objective: 'Encaisser le paiement et clôturer la créance',
          sapCode: 'F-28',
          dynamicsName: 'Customer Payment',
          odooName: 'Paiement client',
          fields: [
            { id: 'montant_paiement_sd', label: 'Montant reçu (CAD)', type: 'number', placeholder: 'Ex: 2250.00', required: true, correctValue: '2250.00', hint: 'Montant du virement reçu de CLIENT-MTL' },
            { id: 'mode_reception', label: 'Mode de paiement reçu', type: 'select', options: ['Virement bancaire (EFT)', 'Chèque', 'Carte de crédit', 'Paiement en ligne'], required: true, correctValue: 'Virement bancaire (EFT)', hint: 'Mode de paiement habituel des clients B2B' }
          ],
          validationMessage: '✅ Paiement 2 250,00 CAD reçu et rapproché ! Créance CLIENT-MTL soldée. Cycle O2C complété avec succès ! Score : 100/100. Chiffre d\'affaires réalisé.',
          errorMessage: '❌ Vérifiez le montant reçu (2 250,00 CAD) et le mode de paiement.',
          points: 20,
          erpImpact: {
            accountingEntry: 'Dr Banque 2 250 CAD / Cr Clients (AR) 2 250 CAD',
            documentStatus: 'Cycle O2C clôturé — Créance soldée',
            note: 'SAP F-28 : paiement rapproché automatiquement. D365 : Customer Payment appliqué à la facture. Odoo : Paiement enregistré, facture marquée Payée.',
          },
        }
      ]
    },
    {
      id: 'sd-02',
      code: 'SD-02',
      title: 'Rupture de stock lors d\'une commande',
      description: 'Gérer une commande client pour un article en rupture de stock et proposer des alternatives.',
      difficulty: 'Intermédiaire',
      duration: '25 min',
      learningObjective: 'Gérer les exceptions de disponibilité dans le cycle O2C et comprendre l\'ATP check.',
      totalPoints: 100,
      steps: [
        {
          id: 'sd-02-s1',
          stepNumber: 1,
          code: 'SD-02-A',
          name: 'Détecter la rupture de stock (ATP Check)',
          objective: 'Identifier l\'insuffisance de stock lors de la création du SO',
          sapCode: 'VA01 + CO09 (ATP)',
          dynamicsName: 'Available-to-Promise Check',
          odooName: 'Vérification disponibilité',
          fields: [
            { id: 'stock_disponible', label: 'Stock disponible (unités)', type: 'number', placeholder: 'Ex: 30', required: true, correctValue: '30', hint: 'Stock actuel en entrepôt' },
            { id: 'quantite_demandee', label: 'Quantité demandée par le client', type: 'number', placeholder: 'Ex: 80', required: true, correctValue: '80', hint: 'Quantité commandée par CLIENT-QC' },
            { id: 'ecart_stock', label: 'Écart (manque en unités)', type: 'number', placeholder: 'Ex: 50', required: true, correctValue: '50', hint: '80 - 30 = 50 unités manquantes' }
          ],
          validationMessage: '✅ ATP Check : stock insuffisant ! Disponible : 30 unités. Demandé : 80. Manque : 50 unités. Commande partiellement bloquée. Action requise.',
          errorMessage: '❌ L\'écart est de 50 unités (80 demandées - 30 disponibles).',
          erpImpact: {
            note: 'The ATP (Available-to-Promise) check is the ERP\'s real-time stock availability engine — it compares requested quantity against available stock minus existing reservations, and the result directly determines whether the sales order can be fully confirmed.',
          },
          points: 34
        },
        {
          id: 'sd-02-s2',
          stepNumber: 2,
          code: 'SD-02-B',
          name: 'Proposer une solution au client',
          objective: 'Choisir la meilleure option pour satisfaire le client',
          fields: [
            { id: 'solution_rupture', label: 'Solution proposée au client', type: 'select', options: ['Annuler la commande', 'Livraison partielle (30 unités) + reliquat (50 unités) dans 15 jours', 'Reporter toute la livraison de 15 jours', 'Substituer par un article similaire'], required: true, correctValue: 'Livraison partielle (30 unités) + reliquat (50 unités) dans 15 jours', hint: 'Satisfaire partiellement le client maintenant et compléter dès réapprovisionnement' }
          ],
          validationMessage: '✅ Solution optimale : livraison partielle de 30 unités aujourd\'hui + reliquat de 50 unités dans 15 jours. Client informé et accord obtenu.',
          errorMessage: '❌ La meilleure solution est la livraison partielle : satisfaire le client partiellement maintenant et compléter lors du réapprovisionnement.',
          erpImpact: {
            note: 'Creating a backorder splits the original sales order into two delivery documents — the ERP tracks both, ensuring the remaining 50 units are automatically reserved and shipped as soon as stock is replenished.',
          },
          points: 33
        },
        {
          id: 'sd-02-s3',
          stepNumber: 3,
          code: 'SD-02-C',
          name: 'Créer un ordre de réapprovisionnement',
          objective: 'Déclencher un achat d\'urgence pour couvrir le reliquat',
          sapCode: 'ME51N (PR urgente)',
          dynamicsName: 'Emergency Purchase Requisition',
          odooName: 'Demande d\'achat urgente',
          fields: [
            { id: 'quantite_reappro', label: 'Quantité à réapprovisionner', type: 'number', placeholder: 'Ex: 50', required: true, correctValue: '50', hint: 'Quantité manquante pour compléter la commande' },
            { id: 'priorite', label: 'Priorité de la commande', type: 'select', options: ['Standard', 'Urgente', 'Critique'], required: true, correctValue: 'Urgente', hint: 'Délai de 15 jours pour satisfaire le client' }
          ],
          validationMessage: '✅ Demande d\'achat urgente créée pour 50 unités. Fournisseur FOURNISSEUR-MTL contacté. Délai confirmé : 12 jours. Reliquat client sera livré dans les délais.',
          errorMessage: '❌ Créez une demande urgente pour 50 unités avec priorité Urgente.',
          erpImpact: {
            note: 'An emergency purchase requisition (SAP ME51N, D365 Emergency PR, Odoo Urgent Purchase) triggers the procurement cycle immediately — the ERP links this new PR to the original sales order backorder, ensuring automatic stock allocation when goods arrive.',
          },
          points: 33
        }
      ]
    },
    {
      id: 'sd-03',
      code: 'SD-03',
      title: 'Retard de livraison client',
      description: 'Gérer un retard de livraison causé par un problème de transporteur et communiquer avec le client.',
      difficulty: 'Intermédiaire',
      duration: '25 min',
      learningObjective: 'Gérer les exceptions logistiques dans le cycle O2C et maintenir la satisfaction client.',
      totalPoints: 100,
      steps: [
        {
          id: 'sd-03-s1',
          stepNumber: 1,
          code: 'SD-03-A',
          name: 'Identifier le retard de livraison',
          objective: 'Détecter le retard via le suivi transporteur',
          fields: [
            { id: 'cause_retard', label: 'Cause du retard identifiée', type: 'select', options: ['Problème mécanique transporteur', 'Conditions météo', 'Erreur d\'adresse', 'Douanes (import/export)'], required: true, correctValue: 'Conditions météo', hint: 'Tempête de neige à Montréal — force majeure' },
            { id: 'nouveau_delai', label: 'Nouveau délai estimé (jours supplémentaires)', type: 'number', placeholder: 'Ex: 3', required: true, correctValue: '3', hint: 'Estimation du transporteur' }
          ],
          validationMessage: '✅ Retard identifié : +3 jours pour conditions météo (force majeure). Transporteur Purolator a confirmé la nouvelle date. Client à informer.',
          errorMessage: '❌ La cause est les conditions météo (+3 jours). C\'est un cas de force majeure.',
          erpImpact: {
            note: 'Logging the delay reason (force majeure) in the ERP protects the company legally — it creates a timestamped record that the delay was beyond the company\'s control, which is critical for contract penalty clauses.',
          },
          points: 34
        },
        {
          id: 'sd-03-s2',
          stepNumber: 2,
          code: 'SD-03-B',
          name: 'Communiquer avec le client',
          objective: 'Informer proactivement le client du retard',
          fields: [
            { id: 'communication', label: 'Action de communication', type: 'select', options: ['Attendre que le client appelle', 'Envoyer un email proactif avec nouvelle date', 'Appeler le client et proposer une compensation', 'Ne rien faire — force majeure'], required: true, correctValue: 'Appeler le client et proposer une compensation', hint: 'La proactivité est essentielle pour maintenir la relation client' }
          ],
          validationMessage: '✅ Client contacté proactivement. Nouvelle date confirmée. Compensation proposée : 5% de remise sur la prochaine commande. Relation client préservée.',
          errorMessage: '❌ La meilleure pratique est de contacter proactivement le client et de proposer une compensation pour maintenir la relation.',
          erpImpact: {
            note: 'Proactive customer communication is recorded as a service activity in the ERP CRM module — this interaction history is visible to all customer-facing teams and informs future service level decisions.',
          },
          points: 33
        },
        {
          id: 'sd-03-s3',
          stepNumber: 3,
          code: 'SD-03-C',
          name: 'Mettre à jour le SO dans l\'ERP',
          objective: 'Documenter le retard et la nouvelle date dans le système',
          sapCode: 'VA02 (Modifier SO)',
          dynamicsName: 'Update Sales Order',
          odooName: 'Modifier commande',
          fields: [
            { id: 'note_retard', label: 'Documentation dans l\'ERP', type: 'select', options: ['Aucune documentation requise', 'Mettre à jour la date de livraison + note interne', 'Annuler et recréer le SO', 'Transférer à un autre transporteur'], required: true, correctValue: 'Mettre à jour la date de livraison + note interne', hint: 'Traçabilité complète dans l\'ERP' }
          ],
          validationMessage: '✅ SO mis à jour : nouvelle date de livraison enregistrée. Note interne documentée. Traçabilité complète dans l\'ERP. Suivi client programmé.',
          errorMessage: '❌ Il faut mettre à jour la date de livraison dans le SO et ajouter une note interne pour la traçabilité.',
          erpImpact: {
            note: 'Updating the sales order with the new delivery date and an internal note ensures full traceability — the customer service team, warehouse, and finance all see the same updated information in real time.',
          },
          points: 33
        }
      ]
    },
    {
      id: 'sd-04',
      code: 'SD-04',
      title: 'Écart de facturation client',
      description: 'Le client conteste une facture car le prix facturé ne correspond pas au prix convenu dans le contrat.',
      difficulty: 'Avancé',
      duration: '30 min',
      learningObjective: 'Gérer les litiges de facturation et comprendre le processus de note de crédit client.',
      totalPoints: 100,
      steps: [
        {
          id: 'sd-04-s1',
          stepNumber: 1,
          code: 'SD-04-A',
          name: 'Analyser la contestation client',
          objective: 'Vérifier si la contestation est fondée',
          fields: [
            { id: 'prix_facture', label: 'Prix facturé (CAD/unité)', type: 'number', placeholder: 'Ex: 48.00', required: true, correctValue: '48.00', hint: 'Prix sur la facture envoyée' },
            { id: 'prix_contrat', label: 'Prix contractuel (CAD/unité)', type: 'number', placeholder: 'Ex: 45.00', required: true, correctValue: '45.00', hint: 'Prix négocié dans le contrat client' },
            { id: 'ecart_prix', label: 'Écart de prix (CAD/unité)', type: 'number', placeholder: 'Ex: 3.00', required: true, correctValue: '3.00', hint: '48,00 - 45,00 = 3,00 CAD de trop' }
          ],
          validationMessage: '✅ Contestation fondée ! Prix facturé 48,00 vs prix contractuel 45,00. Écart : 3,00 CAD/unité. Sur 50 unités = 150,00 CAD à rembourser.',
          errorMessage: '❌ L\'écart est de 3,00 CAD/unité (48,00 - 45,00). La contestation est fondée.',
          erpImpact: {
            note: 'When the invoiced price does not match the contract price stored in the ERP, the system should have blocked the invoice at creation — this discrepancy reveals a missing contract record in the customer master pricing conditions.',
          },
          points: 34
        },
        {
          id: 'sd-04-s2',
          stepNumber: 2,
          code: 'SD-04-B',
          name: 'Émettre une note de crédit',
          objective: 'Corriger la facturation par une note de crédit',
          sapCode: 'VF01 (Note de crédit)',
          dynamicsName: 'Credit Note',
          odooName: 'Avoir client',
          fields: [
            { id: 'montant_nc', label: 'Montant de la note de crédit (CAD)', type: 'number', placeholder: 'Ex: 150.00', required: true, correctValue: '150.00', hint: '3,00 × 50 unités = 150,00 CAD' },
            { id: 'raison', label: 'Raison de la note de crédit', type: 'select', options: ['Erreur de quantité', 'Erreur de prix — écart avec contrat', 'Marchandises retournées', 'Remise commerciale'], required: true, correctValue: 'Erreur de prix — écart avec contrat', hint: 'Le prix facturé ne correspondait pas au contrat' }
          ],
          validationMessage: '✅ Note de crédit de 150,00 CAD émise ! Écriture comptable : Débit Ventes 150,00 / Crédit Clients 150,00. Facture corrigée envoyée au client.',
          errorMessage: '❌ La note de crédit doit être de 150,00 CAD (3,00 × 50 unités) pour erreur de prix.',
          erpImpact: {
            note: 'A credit note (SAP VF01, D365 Credit Note, Odoo Credit Note) reverses the revenue and accounts receivable entries for the overbilled amount — the ERP generates the correcting accounting entry automatically.',
          },
          points: 33
        },
        {
          id: 'sd-04-s3',
          stepNumber: 3,
          code: 'SD-04-C',
          name: 'Prévenir les erreurs futures',
          objective: 'Identifier la cause racine et corriger le paramétrage',
          fields: [
            { id: 'cause_erreur', label: 'Cause racine de l\'erreur de prix', type: 'select', options: ['Erreur humaine de saisie', 'Liste de prix non mise à jour dans l\'ERP', 'Contrat non enregistré dans l\'ERP', 'Problème de formation'], required: true, correctValue: 'Contrat non enregistré dans l\'ERP', hint: 'Le prix contractuel n\'était pas dans le système' },
            { id: 'action_preventive', label: 'Action préventive', type: 'select', options: ['Former les vendeurs', 'Enregistrer tous les contrats dans l\'ERP', 'Vérifier manuellement chaque facture', 'Changer de système ERP'], required: true, correctValue: 'Enregistrer tous les contrats dans l\'ERP', hint: 'L\'ERP doit contenir tous les prix contractuels pour éviter les erreurs' }
          ],
          validationMessage: '✅ Cause identifiée : contrat non enregistré dans l\'ERP. Action : saisir tous les accords de prix dans la liste de prix client. Erreur ne se reproduira plus.',
          errorMessage: '❌ La cause est que le contrat n\'était pas enregistré dans l\'ERP. Solution : enregistrer tous les contrats dans le système.',
          erpImpact: {
            note: 'Storing all customer contracts as pricing conditions in the ERP (SAP VK11, D365 Trade Agreements, Odoo Pricelists) enables automatic price validation at order entry — the system prevents billing errors before they reach the customer.',
          },
          points: 33
        }
      ]
    }
  ]
};

// ============================================================
// MODULE FI — Financial Integration
// ============================================================
const moduleFI: ERPModule = {
  id: 'fi',
  code: 'FI',
  name: 'Financial Integration',
  fullName: 'FI — Financial Integration & Reporting',
  duration: '5 heures',
  hours: 5,
  color: '#F59E0B',
  colorClass: 'fi',
  icon: 'DollarSign',
  description: 'Comprendre l\'intégration financière dans l\'ERP : impact des transactions MM et SD sur la comptabilité, grand livre et reporting financier.',
  slides: [
    {
      id: 'fi-s1',
      title: 'L\'Intégration Financière dans l\'ERP',
      subtitle: 'Comment MM et SD alimentent automatiquement FI',
      type: 'concept',
      content: 'Le module FI (Financial Accounting) est le cœur financier de l\'ERP. Il reçoit automatiquement les écritures comptables générées par toutes les transactions opérationnelles : achats (MM), ventes (SD), production (PP) et ressources humaines (HR).',
      keyPoints: [
        'Toute transaction opérationnelle génère une écriture FI automatique',
        'Grand livre (General Ledger) : toutes les écritures centralisées',
        'Comptes fournisseurs (AP) : alimentés par MM',
        'Comptes clients (AR) : alimentés par SD',
        'Reporting financier en temps réel'
      ],
      systemRef: {
        sap: 'SAP FI : FB50, F-53, F-28, FS10N, F.01 (bilan)',
        dynamics: 'Dynamics 365 Finance : General Ledger, AP, AR, Fixed Assets',
        odoo: 'Odoo Comptabilité : Journal entries, AP, AR, rapports financiers'
      }
    },
    {
      id: 'fi-s2',
      title: 'Impact Financier du Cycle P2P (MM → FI)',
      subtitle: 'Les écritures comptables générées par les achats',
      type: 'process',
      content: 'Chaque étape du cycle Procure-to-Pay génère automatiquement des écritures comptables dans FI. L\'étudiant doit comprendre ces flux pour interpréter les états financiers.',
      keyPoints: [
        'Création PO : aucune écriture (engagement hors bilan)',
        'Réception GR : Débit Stock / Crédit GR-IR (compte transitoire)',
        'Réception facture IV : Débit GR-IR / Crédit Fournisseur',
        'Paiement : Débit Fournisseur / Crédit Banque',
        'Impact final : augmentation des stocks + dette fournisseur soldée'
      ],
      systemRef: {
        sap: 'SAP : MIGO génère écriture BSX/WRX, MIRO génère écriture KBS/WRX',
        dynamics: 'Dynamics 365 : Product Receipt → Accrual posting automatique',
        odoo: 'Odoo : Réception → écriture stock automatique, Facture → écriture AP'
      }
    },
    {
      id: 'fi-s3',
      title: 'Impact Financier du Cycle O2C (SD → FI)',
      subtitle: 'Les écritures comptables générées par les ventes',
      type: 'process',
      content: 'De même, chaque étape du cycle Order-to-Cash génère des écritures automatiques dans FI. La sortie de stock génère le coût des marchandises vendues (COGS) et la facturation génère le chiffre d\'affaires.',
      keyPoints: [
        'Goods Issue GI : Débit COGS / Crédit Stock (coût des ventes)',
        'Facturation : Débit Clients / Crédit Ventes (chiffre d\'affaires)',
        'Paiement client : Débit Banque / Crédit Clients',
        'Marge brute = Ventes - COGS (visible dans FI)',
        'Toutes les écritures sont traçables jusqu\'à la transaction source'
      ]
    },
    {
      id: 'fi-s4',
      title: 'Le Grand Livre (General Ledger)',
      subtitle: 'Le registre central de toutes les transactions',
      type: 'concept',
      content: 'Le Grand Livre (GL) est la base de données centrale de toutes les écritures comptables de l\'entreprise. Dans un ERP, il est alimenté automatiquement par toutes les transactions opérationnelles.',
      keyPoints: [
        'Chaque écriture = Débit d\'un compte + Crédit d\'un autre compte',
        'Plan comptable : liste de tous les comptes de l\'entreprise',
        'Exercice fiscal : période comptable (mois, trimestre, année)',
        'Balance de vérification : total débits = total crédits',
        'Clôture mensuelle : arrêté des comptes et reporting'
      ],
      systemRef: {
        sap: 'SAP : FS10N (solde compte GL), FB03 (consulter écriture)',
        dynamics: 'Dynamics 365 : General Ledger > Chart of Accounts > Trial Balance',
        odoo: 'Odoo : Comptabilité > Rapports > Grand livre'
      }
    },
    {
      id: 'fi-s5',
      title: 'Reporting Financier ERP',
      subtitle: 'Les états financiers générés automatiquement',
      type: 'concept',
      content: 'L\'un des grands avantages de l\'ERP est la génération automatique des états financiers en temps réel : bilan, compte de résultat, tableau de flux de trésorerie — tous alimentés par les transactions opérationnelles.',
      keyPoints: [
        'Bilan (Balance Sheet) : actifs, passifs, capitaux propres',
        'Compte de résultat (P&L) : revenus, coûts, bénéfice',
        'Tableau de flux de trésorerie : entrées et sorties de cash',
        'Rapports par centre de coûts, département, produit',
        'Consolidation multi-entités possible'
      ],
      systemRef: {
        sap: 'SAP : F.01 (bilan), S_ALR_87012284 (P&L), S_ALR_87012271',
        dynamics: 'Dynamics 365 : Financial Reporting > Balance Sheet / P&L',
        odoo: 'Odoo : Comptabilité > Rapports > Bilan / Compte de résultat'
      }
    },
    {
      id: 'fi-s6',
      title: 'Les Écritures Comptables — Logique Débit/Crédit',
      subtitle: 'Comprendre la mécanique comptable dans l\'ERP',
      type: 'concept',
      content: 'Dans tout ERP, chaque transaction génère une écriture en partie double : Chaque écriture a un Débit et un Crédit de même montant. La somme des débits = la somme des crédits. C\'est la règle d\'or de la comptabilité.',
      keyPoints: [
        'Règle : Actifs augmentent au Débit | Passifs augmentent au Crédit',
        'Règle : Charges augmentent au Débit | Produits augmentent au Crédit',
        'Achat de stock : Débit Stocks (actif+) | Crédit Fournisseurs (passif+)',
        'Paiement fournisseur : Débit Fournisseurs (passif-) | Crédit Banque (actif-)',
        'Vente : Débit Clients (actif+) | Crédit Chiffre d\'affaires (produit+)',
        'Paiement client : Débit Banque (actif+) | Crédit Clients (actif-)'
      ],
      systemRef: {
        sap: 'SAP FB50 : saisir Débit/Crédit manuellement | FB03 : consulter écritures existantes',
        dynamics: 'Dynamics 365 Finance : General Journal > Journal entries > Debit/Credit columns',
        odoo: 'Odoo Comptabilité : Opérations > Écritures comptables > Colonnes Débit/Crédit'
      }
    },
    {
      id: 'fi-s7',
      title: 'Tableau de Bord Financier ERP',
      subtitle: 'Indicateurs clés et KPIs financiers dans les 3 systèmes',
      type: 'concept',
      content: 'Les KPIs financiers permettent au contrôleur de gestion de surveiller la santé financière de l\'entreprise en temps réel. Ces indicateurs sont calculés automatiquement à partir des transactions saisies dans l\'ERP.',
      keyPoints: [
        'Marge brute = CA - COGS | Marge nette = CA - Toutes charges | Cibles : MB > 30%, MN > 10%',
        'DSO (Days Sales Outstanding) = (Clients / CA) x 365 | Cible : < 45 jours',
        'DPO (Days Payable Outstanding) = (Fournisseurs / Achats) x 365 | Cible : 30-60 jours',
        'Ratio de liquidité = Actifs courants / Passifs courants | Cible : > 1.5',
        'EBITDA = Résultat + Intérêts + Impôts + Amortissements',
        'Rotation des stocks = COGS / Stock moyen | Cible : > 6x par an'
      ],
      systemRef: {
        sap: 'SAP : Tableau de bord Fiori, transactions S_ALR_87012284 (P&L), F.01 (Bilan)',
        dynamics: 'Dynamics 365 Finance : Financial Insights > Key metrics dashboard',
        odoo: 'Odoo Comptabilité : Tableau de bord > KPIs financiers en temps réel'
      }
    },
    {
      id: 'fi-s8',
      title: 'Le Bilan Comptable (Balance Sheet)',
      subtitle: 'Actifs, Passifs et Capitaux Propres — la photographie financière',
      type: 'concept',
      content: 'Le bilan est un état financier qui présente la situation patrimoniale de l\'entreprise à une date donnée. Il répond à la question : "Qu\'est-ce que l\'entreprise possède et comment est-ce financé ?" Dans un ERP, le bilan est généré automatiquement à partir des écritures comptables accumulées dans le Grand Livre.',
      keyPoints: [
        'ACTIFS = ce que l\'entreprise possède : Trésorerie + Clients + Stocks + Immobilisations',
        'PASSIFS = ce que l\'entreprise doit : Fournisseurs + Emprunts + Dettes fiscales',
        'CAPITAUX PROPRES = Actifs - Passifs = richesse des actionnaires',
        'Équation fondamentale : Actifs = Passifs + Capitaux Propres (toujours équilibrée)',
        'Actifs courants (< 1 an) : trésorerie, clients, stocks | Actifs non courants : équipements, brevets',
        'Dans notre simulation : Stocks 14 400 CAD (actif) | Clients 23 920 CAD (actif) | Fournisseur 5 400 CAD (passif)'
      ],
      systemRef: {
        sap: 'SAP : F.01 (Bilan complet) | FS10N (solde par compte GL) | S_ALR_87012284 (Bilan simplifié)',
        dynamics: 'Dynamics 365 Finance : Financial Reporting > Balance Sheet — mise à jour en temps réel',
        odoo: 'Odoo Comptabilité : Rapports > Bilan — filtrable par date, société, journal'
      }
    },
    {
      id: 'fi-s9',
      title: 'Le Tableau des Flux de Trésorerie (Cash Flow)',
      subtitle: 'Suivre les entrées et sorties de liquidités dans l\'ERP',
      type: 'process',
      content: 'Le tableau des flux de trésorerie (Cash Flow Statement) montre comment l\'entreprise génère et utilise ses liquidités sur une période. Un ERP peut être rentable sur le papier (P&L positif) mais en difficulté de trésorerie si les clients paient en retard. C\'est pourquoi le Cash Flow est aussi important que le P&L.',
      keyPoints: [
        'Flux d\'exploitation : encaissements clients - paiements fournisseurs - charges opérationnelles',
        'Flux d\'investissement : achats/ventes d\'équipements, acquisitions d\'entreprises',
        'Flux de financement : emprunts bancaires, remboursements, dividendes versés',
        'Cash Flow net = Flux exploitation + Flux investissement + Flux financement',
        'Règle d\'or : une entreprise peut avoir un P&L positif et faire faillite par manque de cash',
        'Dans notre simulation : encaissement client 23 920 CAD (futur) - paiement fournisseur 5 400 CAD = +18 520 CAD net'
      ],
      systemRef: {
        sap: 'SAP : S_ALR_87012271 (Cash Flow Statement) | FF7A (prévision de trésorerie à court terme)',
        dynamics: 'Dynamics 365 Finance : Cash and bank management > Cash flow forecasts',
        odoo: 'Odoo Comptabilité : Rapports > Flux de trésorerie | Tableau de bord trésorerie'
      }
    }
  ],
  scenarios: [
    {
      id: 'fi-01',
      code: 'FI-01',
      title: 'Impact financier d\'un achat (MM → FI)',
      description: 'Analyser et enregistrer les écritures comptables générées par le cycle Procure-to-Pay.',
      difficulty: 'Intermédiaire',
      duration: '30 min',
      learningObjective: 'Comprendre et enregistrer les écritures comptables générées automatiquement par les transactions MM.',
      totalPoints: 100,
      reflectionQuestions: [
        { id: 'fi01-r1', question: 'Pourquoi le compte GR/IR est-il un compte intermédiaire ? Que se passe-t-il si la facture fournisseur n\'arrive jamais ?', hint: 'GR/IR = Goods Receipt / Invoice Receipt. Il sert de pont entre la réception physique et la réception comptable.' },
        { id: 'fi01-r2', question: 'Quelle est la différence entre une écriture générée automatiquement par l\'ERP et une écriture manuelle ?', hint: 'L\'intégration MM→FI élimine les erreurs humaines et garantit la cohérence entre les modules.' },
        { id: 'fi01-r3', question: 'Dans les 3 systèmes, le principe comptable de la partie double est identique. Qu\'est-ce qui change entre SAP, Dynamics et Odoo pour les écritures de stock ?', hint: 'Les comptes BSX/WRX dans SAP, les Vouchers dans Dynamics, les écritures de stock dans Odoo suivent tous la même logique débit/crédit.' },
      ],
      steps: [
        {
          id: 'fi-01-s1',
          stepNumber: 1,
          code: 'FI-01-A',
          name: 'Écriture de réception marchandises (GR)',
          objective: 'Identifier l\'écriture comptable générée par MIGO dans SAP',
          sapCode: 'FB03 (consulter écriture GR)',
          dynamicsName: 'Product Receipt Voucher',
          odooName: 'Écriture de stock',
          fields: [
            { id: 'debit_gr', label: 'Compte débité lors de la réception GR', type: 'select', options: ['Compte Fournisseur', 'Compte Stock (Inventaire)', 'Compte Banque', 'Compte Ventes'], required: true, correctValue: 'Compte Stock (Inventaire)', hint: 'La réception augmente la valeur du stock' },
            { id: 'credit_gr', label: 'Compte crédité lors de la réception GR', type: 'select', options: ['Compte Stock', 'Compte GR-IR (transitoire)', 'Compte Banque', 'Compte Clients'], required: true, correctValue: 'Compte GR-IR (transitoire)', hint: 'Compte transitoire en attente de la facture fournisseur' },
            { id: 'montant_gr', label: 'Montant de l\'écriture (CAD)', type: 'number', placeholder: 'Ex: 2500.00', required: true, correctValue: '2500.00', hint: '100 unités × 25,00 CAD = 2 500,00 CAD' }
          ],
          validationMessage: '✅ Écriture GR correcte ! Débit Stock 2 500,00 / Crédit GR-IR 2 500,00. Le stock augmente de 2 500,00 CAD. Compte transitoire GR-IR en attente de la facture.',
          errorMessage: '❌ Lors d\'une réception GR : Débit Stock (augmentation) / Crédit GR-IR (compte transitoire). Montant : 2 500,00 CAD.',
          points: 34,
          erpImpact: {
            stockChange: '+100 unités PROD-001 — Stock valorisé à 2 500 CAD',
            accountingEntry: 'Dr Stocks marchandises 2 500 CAD / Cr Compte GR-IR (transitoire) 2 500 CAD',
            documentCreated: 'Material Document GR — Mouvement 101 (SAP)',
            documentStatus: 'GR complété — En attente facture fournisseur',
            note: 'SAP MIGO Mvt 101 : écriture BSX/WRX automatique. D365 : Product Receipt Voucher posté. Odoo : Écriture de stock générée automatiquement.',
          },
        },
        {
          id: 'fi-01-s2',
          stepNumber: 2,
          code: 'FI-01-B',
          name: 'Écriture de vérification facture (IV)',
          objective: 'Identifier l\'écriture comptable générée par MIRO dans SAP',
          sapCode: 'FB03 (consulter écriture IV)',
          dynamicsName: 'Vendor Invoice Posting',
          odooName: 'Écriture facture fournisseur',
          fields: [
            { id: 'debit_iv', label: 'Compte débité lors de la réception facture IV', type: 'select', options: ['Compte Stock', 'Compte GR-IR (transitoire)', 'Compte Banque', 'Compte Ventes'], required: true, correctValue: 'Compte GR-IR (transitoire)', hint: 'Le compte transitoire GR-IR est soldé' },
            { id: 'credit_iv', label: 'Compte crédité lors de la réception facture IV', type: 'select', options: ['Compte Stock', 'Compte GR-IR', 'Compte Fournisseur (AP)', 'Compte Banque'], required: true, correctValue: 'Compte Fournisseur (AP)', hint: 'La dette envers le fournisseur est créée' }
          ],
          validationMessage: '✅ Écriture IV correcte ! Débit GR-IR 2 500,00 / Crédit Fournisseur 2 500,00. Le compte transitoire est soldé. La dette fournisseur est créée dans AP.',
          errorMessage: '❌ Lors de la vérification facture : Débit GR-IR (solde le transitoire) / Crédit Fournisseur (crée la dette).',
          points: 33,
          erpImpact: {
            accountingEntry: 'Dr Compte GR-IR 2 500 CAD / Cr Fournisseur FOURNISSEUR-MTL (AP) 2 500 CAD',
            documentCreated: 'Accounting Document IV — Facture fournisseur enregistrée',
            documentStatus: 'Dette fournisseur créée — Échéance Net 30 jours',
            note: 'SAP MIRO : écriture KBS/WRX, compte transitoire soldé. D365 : Vendor Invoice Posting dans AP. Odoo : Facture fournisseur validée, dette créée.',
          },
        },
        {
          id: 'fi-01-s3',
          stepNumber: 3,
          code: 'FI-01-C',
          name: 'Écriture de paiement fournisseur',
          objective: 'Identifier l\'écriture comptable du paiement fournisseur',
          sapCode: 'F-53 / F110',
          dynamicsName: 'Vendor Payment Posting',
          odooName: 'Écriture paiement fournisseur',
          fields: [
            { id: 'debit_pay', label: 'Compte débité lors du paiement', type: 'select', options: ['Compte Stock', 'Compte Fournisseur (AP)', 'Compte GR-IR', 'Compte Ventes'], required: true, correctValue: 'Compte Fournisseur (AP)', hint: 'La dette fournisseur est soldée' },
            { id: 'credit_pay', label: 'Compte crédité lors du paiement', type: 'select', options: ['Compte Fournisseur', 'Compte GR-IR', 'Compte Banque', 'Compte Stock'], required: true, correctValue: 'Compte Banque', hint: 'Le cash sort de la banque' }
          ],
          validationMessage: '✅ Écriture paiement correcte ! Débit Fournisseur 2 500,00 / Crédit Banque 2 500,00. Dette soldée. Cash réduit. Cycle P2P comptablement complet !',
          errorMessage: '❌ Lors du paiement : Débit Fournisseur (solde la dette) / Crédit Banque (sortie de cash).',
          points: 33,
          erpImpact: {
            accountingEntry: 'Dr Fournisseur FOURNISSEUR-MTL (AP) 2 500 CAD / Cr Banque 2 500 CAD',
            documentStatus: 'Cycle P2P clôturé — Dette soldée, cash sorti',
            note: 'SAP F-53 : paiement manuel, écriture finale. D365 : Vendor Payment Journal posté. Odoo : Paiement fournisseur enregistré, facture marquée Payée.',
          },
        }
      ]
    },
    {
      id: 'fi-02',
      code: 'FI-02',
      title: 'Comptabilisation des revenus de vente (SD → FI)',
      description: 'Analyser et enregistrer les écritures comptables générées par le cycle Order-to-Cash.',
      difficulty: 'Intermédiaire',
      duration: '25 min',
      learningObjective: 'Comprendre la comptabilisation des revenus et du COGS dans le cycle O2C.',
      totalPoints: 100,
      steps: [
        {
          id: 'fi-02-s1',
          stepNumber: 1,
          code: 'FI-02-A',
          name: 'Écriture de sortie de stock (GI)',
          objective: 'Identifier l\'écriture COGS générée par le Goods Issue',
          sapCode: 'VL02N → écriture FI automatique',
          dynamicsName: 'COGS Posting',
          odooName: 'Écriture coût des ventes',
          fields: [
            { id: 'debit_gi', label: 'Compte débité lors du Goods Issue', type: 'select', options: ['Compte Clients (AR)', 'Compte COGS (Coût des ventes)', 'Compte Banque', 'Compte Ventes'], required: true, correctValue: 'Compte COGS (Coût des ventes)', hint: 'Le coût des marchandises vendues est enregistré' },
            { id: 'credit_gi', label: 'Compte crédité lors du Goods Issue', type: 'select', options: ['Compte COGS', 'Compte Clients', 'Compte Stock (Inventaire)', 'Compte Banque'], required: true, correctValue: 'Compte Stock (Inventaire)', hint: 'Le stock diminue' },
            { id: 'montant_gi', label: 'Montant COGS (CAD) — coût d\'achat', type: 'number', placeholder: 'Ex: 1250.00', required: true, correctValue: '1250.00', hint: '50 unités × 25,00 CAD (coût d\'achat) = 1 250,00 CAD' }
          ],
          validationMessage: '✅ Écriture COGS correcte ! Débit COGS 1 250,00 / Crédit Stock 1 250,00. Le coût des ventes est enregistré. Stock réduit de 1 250,00 CAD.',
          errorMessage: '❌ Lors du GI : Débit COGS (coût des ventes) / Crédit Stock (réduction inventaire). Montant : 1 250,00 CAD (coût d\'achat).',
          erpImpact: {
            note: 'The Goods Issue (SAP VL02N, D365 COGS Posting, Odoo Delivery Validation) is the SD→FI integration point that simultaneously reduces inventory and records the cost of goods sold — one click in the warehouse triggers two accounting entries automatically.',
          },
          points: 34
        },
        {
          id: 'fi-02-s2',
          stepNumber: 2,
          code: 'FI-02-B',
          name: 'Écriture de facturation client',
          objective: 'Identifier l\'écriture de revenu générée par la facture client',
          sapCode: 'VF01 → écriture FI automatique',
          dynamicsName: 'Revenue Recognition',
          odooName: 'Écriture facture client',
          fields: [
            { id: 'debit_bill', label: 'Compte débité lors de la facturation', type: 'select', options: ['Compte Stock', 'Compte Clients (AR)', 'Compte Banque', 'Compte COGS'], required: true, correctValue: 'Compte Clients (AR)', hint: 'La créance client est créée' },
            { id: 'credit_bill', label: 'Compte crédité lors de la facturation', type: 'select', options: ['Compte Clients', 'Compte Stock', 'Compte Ventes (Revenus)', 'Compte Banque'], required: true, correctValue: 'Compte Ventes (Revenus)', hint: 'Le chiffre d\'affaires est reconnu' },
            { id: 'montant_bill', label: 'Montant de la facture (CAD)', type: 'number', placeholder: 'Ex: 2250.00', required: true, correctValue: '2250.00', hint: '50 unités × 45,00 CAD = 2 250,00 CAD' }
          ],
          validationMessage: '✅ Écriture facturation correcte ! Débit Clients 2 250,00 / Crédit Ventes 2 250,00. Revenu reconnu. Marge brute = 2 250,00 - 1 250,00 = 1 000,00 CAD.',
          errorMessage: '❌ Lors de la facturation : Débit Clients (créance) / Crédit Ventes (revenu). Montant : 2 250,00 CAD.',
          erpImpact: {
            note: 'Revenue recognition (SAP VF01, D365 Revenue Recognition, Odoo Customer Invoice) is the moment the sale becomes official in the books — the ERP posts Debit AR / Credit Revenue automatically when the invoice is created.',
          },
          points: 33
        },
        {
          id: 'fi-02-s3',
          stepNumber: 3,
          code: 'FI-02-C',
          name: 'Calculer la marge brute',
          objective: 'Interpréter le résultat financier de la transaction',
          fields: [
            { id: 'ventes', label: 'Chiffre d\'affaires (CAD)', type: 'number', placeholder: 'Ex: 2250.00', required: true, correctValue: '2250.00', hint: 'Montant de la facture client' },
            { id: 'cogs', label: 'Coût des marchandises vendues COGS (CAD)', type: 'number', placeholder: 'Ex: 1250.00', required: true, correctValue: '1250.00', hint: 'Coût d\'achat des 50 unités' },
            { id: 'marge', label: 'Marge brute (CAD)', type: 'number', placeholder: 'Ex: 1000.00', required: true, correctValue: '1000.00', hint: 'Ventes - COGS = Marge brute' }
          ],
          validationMessage: '✅ Analyse financière complète ! CA : 2 250,00 | COGS : 1 250,00 | Marge brute : 1 000,00 CAD (44,4%). Ces données alimentent automatiquement le compte de résultat dans FI.',
          errorMessage: '❌ Marge brute = Ventes (2 250,00) - COGS (1 250,00) = 1 000,00 CAD.',
          erpImpact: {
            note: 'The gross margin calculation (Revenue − COGS = 44.4%) is automatically available in the ERP income statement (SAP S_ALR_87012284, D365 P&L Report, Odoo Profit & Loss) — no manual calculation needed, the data flows from every transaction.',
          },
          points: 33
        }
      ]
    },
    {
      id: 'fi-03',
      code: 'FI-03',
      title: 'Analyse de rentabilité',
      description: 'Générer et interpréter un rapport de rentabilité ERP pour prendre des décisions de gestion.',
      difficulty: 'Avancé',
      duration: '30 min',
      learningObjective: 'Interpréter les indicateurs financiers ERP et prendre des décisions basées sur les données.',
      totalPoints: 100,
      steps: [
        {
          id: 'fi-03-s1',
          stepNumber: 1,
          code: 'FI-03-A',
          name: 'Générer le rapport de rentabilité',
          objective: 'Extraire les données financières du module FI',
          sapCode: 'KE30 (CO-PA) / S_ALR_87012284',
          dynamicsName: 'Profitability Report',
          odooName: 'Rapport de rentabilité',
          fields: [
            { id: 'periode', label: 'Période d\'analyse', type: 'select', options: ['Janvier 2026', 'T1 2026 (Jan-Mar)', 'Année 2025', 'YTD 2026'], required: true, correctValue: 'T1 2026 (Jan-Mar)', hint: 'Analyser le premier trimestre 2026' },
            { id: 'dimension', label: 'Dimension d\'analyse', type: 'select', options: ['Par produit', 'Par client', 'Par région', 'Par canal de vente'], required: true, correctValue: 'Par produit', hint: 'Identifier quels produits sont les plus rentables' }
          ],
          validationMessage: '✅ Rapport de rentabilité T1 2026 par produit généré. Données extraites du module FI/CO. Analyse disponible.',
          errorMessage: '❌ Sélectionnez la période T1 2026 et la dimension par produit.',
          erpImpact: {
            note: 'Profitability reports (SAP KE30 CO-PA, D365 Profitability Report, Odoo Profitability) pull data from every posted transaction in the period — the ERP aggregates thousands of entries into a single management view in seconds.',
          },
          points: 34
        },
        {
          id: 'fi-03-s2',
          stepNumber: 2,
          code: 'FI-03-B',
          name: 'Interpréter les indicateurs',
          objective: 'Analyser les KPI financiers du rapport',
          fields: [
            { id: 'produit_rentable', label: 'PROD-001 : Marge brute T1 2026', type: 'select', options: ['Déficitaire (< 0%)', 'Faible (0-20%)', 'Acceptable (20-40%)', 'Excellente (> 40%)'], required: true, correctValue: 'Excellente (> 40%)', hint: 'Marge brute de 44,4% = excellente performance' },
            { id: 'action_fi', label: 'Recommandation basée sur l\'analyse', type: 'select', options: ['Arrêter la production de PROD-001', 'Augmenter les volumes de PROD-001', 'Réduire le prix de vente', 'Changer de fournisseur immédiatement'], required: true, correctValue: 'Augmenter les volumes de PROD-001', hint: 'Un produit à 44% de marge mérite d\'être développé' }
          ],
          validationMessage: '✅ Analyse correcte ! PROD-001 génère 44,4% de marge brute — excellente performance. Recommandation : augmenter les volumes pour maximiser la rentabilité.',
          errorMessage: '❌ Avec 44,4% de marge brute, PROD-001 est excellent. La bonne décision est d\'augmenter les volumes.',
          erpImpact: {
            note: 'A 44.4% gross margin is well above the typical 20-30% target for manufactured goods — the ERP\'s profitability analysis directly informs the production planning module to increase the volume of high-margin products.',
          },
          points: 33
        },
        {
          id: 'fi-03-s3',
          stepNumber: 3,
          code: 'FI-03-C',
          name: 'Présenter les résultats à la direction',
          objective: 'Synthétiser les résultats financiers pour la prise de décision',
          fields: [
            { id: 'synthese', label: 'Conclusion principale du rapport', type: 'select', options: ['L\'entreprise est en perte', 'PROD-001 est rentable et doit être développé', 'Il faut réduire les coûts d\'achat', 'Le module FI est mal paramétré'], required: true, correctValue: 'PROD-001 est rentable et doit être développé', hint: 'La marge de 44,4% confirme la rentabilité du produit' },
            { id: 'outil_reporting', label: 'Outil de reporting recommandé pour la direction', type: 'select', options: ['Excel manuel', 'Power BI connecté à Dynamics 365', 'Rapport SAP standard (F.01)', 'Rapport Odoo natif'], required: true, correctValue: 'Power BI connecté à Dynamics 365', hint: 'Power BI offre des tableaux de bord visuels en temps réel' }
          ],
          validationMessage: '✅ Rapport de direction préparé ! PROD-001 : marge 44,4%, recommandation croissance. Power BI connecté à Dynamics 365 pour tableaux de bord temps réel. Décision prise sur données ERP.',
          errorMessage: '❌ La conclusion est que PROD-001 est rentable. Power BI connecté à Dynamics 365 est l\'outil de reporting le plus adapté pour la direction.',
          erpImpact: {
            note: 'Connecting Power BI to Dynamics 365 (or SAP Analytics Cloud / Odoo Dashboards) creates a live management dashboard — executives see real-time profitability without waiting for month-end reports.',
          },
          points: 33
        }
      ]
    }
  ]
};

// ============================================================
// MODULE ERP-SIM — Integrated ERP Simulation
// ============================================================
const moduleERPSIM: ERPModule = {
  id: 'erp-sim',
  code: 'ERP-SIM',
  name: 'Integrated ERP Simulation',
  fullName: 'ERP-SIM — Integrated ERP Simulation',
  process: 'Procurement → Inventory → Sales → Finance',
  duration: '6 heures',
  hours: 6,
  color: '#EF4444',
  colorClass: 'sim',
  icon: 'Zap',
  description: 'Simulation ERP transversale complète : gérer un cycle d\'affaires de bout en bout dans un environnement simulé intégrant MM, SD et FI simultanément.',
  slides: [
    {
      id: 'sim-s1',
      title: 'La Simulation ERP Intégrée',
      subtitle: 'Mettre en pratique tous les modules dans un cas réel',
      type: 'concept',
      content: 'La simulation intégrée est l\'aboutissement du cours. L\'étudiant gère une entreprise de distribution complète : approvisionnement, réception en entrepôt, commandes clients, livraisons et validation financière — le tout dans un environnement ERP simulé.',
      keyPoints: [
        'Cas d\'entreprise : Distributions La Concorde Inc.',
        'Cycle complet : Fournisseur → Entrepôt → Client → Finance',
        'Tous les modules actifs simultanément : MM + SD + FI',
        'Détection et correction d\'écarts opérationnels',
        'Analyse de rentabilité finale'
      ]
    },
    {
      id: 'sim-s2',
      title: 'Cas d\'Entreprise : Distributions La Concorde Inc.',
      subtitle: 'Contexte de la simulation finale',
      type: 'concept',
      content: 'Distributions La Concorde Inc. est une entreprise de distribution basée à Montréal. Elle utilise un ERP intégré pour gérer ses opérations. Vous êtes le responsable des opérations ERP pour la journée du 15 mars 2026.',
      keyPoints: [
        'Secteur : Distribution de produits électroniques',
        'Fournisseur principal : TechSupply Inc. (Toronto)',
        'Client principal : ElectroMTL (Montréal)',
        'Produit : Tablettes TABLET-PRO-10 (coût : 180 CAD, prix vente : 299 CAD)',
        'Stock initial : 50 unités disponibles'
      ]
    },
    {
      id: 'sim-s3',
      title: 'Flux de la Simulation Intégrée',
      subtitle: 'Les 8 étapes du cycle complet',
      type: 'process',
      content: 'La simulation suit un flux chronologique d\'une journée d\'opérations ERP. Chaque étape est interdépendante : une erreur à l\'étape 3 impacte les étapes 4, 5 et 6.',
      keyPoints: [
        'Étape 1 : Réception commande client (SD)',
        'Étape 2 : Vérification stock disponible (MM-SD)',
        'Étape 3 : Commande fournisseur si stock insuffisant (MM)',
        'Étape 4 : Réception marchandises (MM)',
        'Étape 5 : Préparation et expédition commande client (SD)',
        'Étape 6 : Facturation client (SD-FI)',
        'Étape 7 : Paiement fournisseur (MM-FI)',
        'Étape 8 : Analyse financière finale (FI)'
      ]
    },
    {
      id: 'sim-s4',
      title: 'Révision Consolidée — Checklist avant la Simulation',
      subtitle: 'Tous les T-codes et flux à maîtriser pour ERP-SIM-01',
      type: 'concept',
      content: 'Avant de commencer la simulation intégrée, vérifiez que vous maîtrisez les éléments suivants. Chaque étape de la simulation ERP-SIM-01 fait appel à ces connaissances.',
      keyPoints: [
        '✅ MM — Flux P2P SAP : ME51N → ME21N → MIGO (101) → MIRO → F-53',
        '✅ SD — Flux O2C SAP : VA01 → VL01N → VL02N (PGI) → VF01 → F-28',
        '✅ FI — GR : Débit Stocks / Crédit GR-IR | IV : Débit GR-IR / Crédit AP | Paiement : Débit AP / Crédit Banque',
        '✅ FI — PGI : Débit COGS / Crédit Stocks | Facture : Débit AR / Crédit CA | Paiement : Débit Banque / Crédit AR',
        '✅ Marge brute = Chiffre d\'affaires - COGS | Cas : TABLET-PRO-10 coût 180 CAD, prix 299 CAD → Marge = 119 CAD (39.8%)',
        '✅ ATP Check : si stock < quantité demandée → livraison partielle + réapprovisionnement urgent (ME51N)'
      ],
      systemRef: {
        sap: 'SAP : tous les T-codes utilisés dans ERP-SIM-01 sont couverts dans les modules MM, SD et FI',
        dynamics: 'Dynamics 365 : mêmes flux via menus Supply Chain, Sales et Finance',
        odoo: 'Odoo : mêmes flux via applications Achats, Ventes et Comptabilité'
      }
    },
    {
      id: 'sim-s5',
      title: 'L\'ATP Check — Vérification de Disponibilité',
      subtitle: 'Available-to-Promise : la logique de promesse de livraison',
      type: 'concept',
      content: 'L\'ATP Check (Available-to-Promise) est l\'une des fonctions les plus critiques de l\'intégration MM-SD. Lorsqu\'un client passe une commande, l\'ERP vérifie automatiquement si le stock disponible peut satisfaire la demande à la date souhaitée. Si le stock est insuffisant, l\'ERP propose une date de livraison réaliste ou déclenche un réapprovisionnement automatique.',
      keyPoints: [
        'Stock disponible = Stock physique - Réservations existantes + Entrées prévues',
        'Si stock ≥ quantité commandée → livraison confirmée à la date demandée',
        'Si stock < quantité commandée → livraison partielle + réapprovisionnement urgent',
        'Dans notre cas : commande 80 unités, stock 50 → manque 30 → ME51N automatique',
        'L\'ATP Check protège la promesse client tout en optimisant les stocks',
        'Dynamics 365 et Odoo ont des mécanismes équivalents (Available inventory check)'
      ],
      systemRef: {
        sap: 'SAP : ATP Check déclenché automatiquement lors de VA01 — résultat visible dans l\'onglet Disponibilité',
        dynamics: 'Dynamics 365 : Delivery date control + ATP calculation dans Sales Order',
        odoo: 'Odoo : Règle de réapprovisionnement automatique si stock < seuil minimum'
      }
    },
    {
      id: 'sim-s6',
      title: 'Les Écritures Comptables de la Simulation',
      subtitle: 'Toutes les écritures FI générées par ERP-SIM-01',
      type: 'process',
      content: 'La simulation ERP-SIM-01 génère 6 écritures comptables automatiques dans le module FI. Comprendre ces écritures est essentiel pour l\'analyse financière finale. Chaque écriture respecte la règle de la partie double : total débits = total crédits.',
      keyPoints: [
        'Écriture 1 — Réception GR (MIGO) : Débit Stock 5 400 CAD / Crédit GR-IR 5 400 CAD',
        'Écriture 2 — Facture fournisseur (MIRO) : Débit GR-IR 5 400 CAD / Crédit Fournisseur 5 400 CAD',
        'Écriture 3 — Paiement fournisseur (F-53) : Débit Fournisseur 5 400 CAD / Crédit Banque 5 400 CAD',
        'Écriture 4 — Sortie stock/PGI (VL02N) : Débit COGS 14 400 CAD / Crédit Stock 14 400 CAD',
        'Écriture 5 — Facture client (VF01) : Débit Clients 23 920 CAD / Crédit Ventes 23 920 CAD',
        'Résultat final : CA 23 920 CAD | COGS 14 400 CAD | Marge brute 9 520 CAD (39,8%)'
      ],
      systemRef: {
        sap: 'SAP FI : toutes les écritures consultables via FB03 (par pièce) ou FS10N (par compte)',
        dynamics: 'Dynamics 365 Finance : Voucher transactions — traçabilité complète par transaction source',
        odoo: 'Odoo Comptabilité : Pièces comptables — chaque transaction opérationnelle génère une pièce'
      }
    },
    {
      id: 'sim-s7',
      title: 'Analyse de Rentabilité — Lire un P&L ERP',
      subtitle: 'Interpréter le compte de résultat généré par la simulation',
      type: 'concept',
      content: 'À la fin de la simulation, l\'ERP génère automatiquement un compte de résultat (P&L — Profit & Loss) pour la transaction. C\'est la synthèse financière de toutes les opérations effectuées. Un gestionnaire ERP doit savoir lire et interpréter ce rapport.',
      keyPoints: [
        'Chiffre d\'affaires (CA) = Quantité vendue × Prix de vente = 80 × 299 = 23 920 CAD',
        'Coût des marchandises vendues (COGS) = Quantité × Coût d\'achat = 80 × 180 = 14 400 CAD',
        'Marge brute = CA - COGS = 23 920 - 14 400 = 9 520 CAD',
        'Taux de marge brute = Marge brute / CA = 9 520 / 23 920 = 39,8%',
        'Un taux de marge > 30% est généralement sain pour la distribution',
        'L\'ERP calcule ce P&L en temps réel dès que toutes les transactions sont enregistrées'
      ],
      systemRef: {
        sap: 'SAP : KE30 (Profitability Analysis) ou S_ALR_87012284 (P&L par centre de profit)',
        dynamics: 'Dynamics 365 : Financial Reporting > Income Statement (Profit & Loss)',
        odoo: 'Odoo : Comptabilité > Rapports > Compte de résultat'
      }
    },
    {
      id: 'sim-s8',
      title: 'Comparaison des 3 ERP — Simulation Intégrée',
      subtitle: 'SAP vs Dynamics 365 vs Odoo pour un cycle complet',
      type: 'comparison',
      content: 'Les trois ERP exécutent le même cycle d\'affaires mais avec des interfaces, des terminologies et des niveaux de complexité différents. Cette comparaison vous prépare à travailler dans n\'importe quel environnement ERP professionnel.',
      keyPoints: [
        'SAP S/4HANA : T-codes VA01 → MIGO → MIRO → VL01N → VF01 → F-53 — interface Fiori ou GUI classique',
        'Dynamics 365 : Sales Order → Product Receipt → Vendor Invoice → Ship → Customer Invoice — navigation par menus',
        'Odoo : Commande client → Réception → Facture fournisseur → Livraison → Facture client — interface web intuitive',
        'SAP : plus rigide, plus de contrôles, idéal pour grandes entreprises avec processus standardisés',
        'Dynamics 365 : intégration native avec Excel, Teams, Power BI — idéal pour entreprises Microsoft',
        'Odoo : plus flexible, personnalisable, coût plus bas — idéal pour PME en croissance'
      ],
      systemRef: {
        sap: 'SAP ERP-SIM-01 : VA01 → ME51N → ME21N → MIGO → MIRO → VL01N → VL02N → VF01 → F-53 → KE30',
        dynamics: 'Dynamics 365 : Sales Order → Requisition → PO → Receipt → Invoice → Shipment → Cust. Invoice → Payment → P&L',
        odoo: 'Odoo : Commande client → Demande achat → BC → Réception → Facture fourn. → Livraison → Facture client → Paiement → Rapport'
      }
    },
    {
      id: 'sim-s9',
      title: 'Erreurs Courantes et Comment les Corriger',
      subtitle: 'Les 6 erreurs les plus fréquentes dans ERP-SIM-01',
      type: 'concept',
      content: 'Lors de la simulation intégrée, certaines erreurs reviennent régulièrement. Les identifier et les corriger rapidement est une compétence clé du gestionnaire ERP. Un ERP bien configuré détecte et bloque les erreurs avant qu\'elles ne propagent dans les autres modules.',
      keyPoints: [
        'Erreur 1 — Mauvais client ou fournisseur : vérifier le code exact (ElectroMTL, TechSupply Inc.)',
        'Erreur 2 — Quantité incorrecte : commande 80, stock 50, manque 30 — ne pas confondre les quantités',
        'Erreur 3 — Prix erroné : coût achat 180 CAD ≠ prix vente 299 CAD — deux prix différents',
        'Erreur 4 — Oublier le GR avant MIRO : dans SAP, impossible de valider la facture sans réception',
        'Erreur 5 — Mauvais montant facture client : 80 × 299 = 23 920 CAD (pas 80 × 180)',
        'Erreur 6 — Marge brute mal calculée : 23 920 - 14 400 = 9 520 CAD (pas 23 920 - 5 400)'
      ],
      systemRef: {
        sap: 'SAP : les messages d\'erreur SAP (rouge) bloquent la transaction — lire le message et corriger le champ indiqué',
        dynamics: 'Dynamics 365 : validation en ligne avec messages d\'erreur contextuels dans les formulaires',
        odoo: 'Odoo : alertes visuelles et messages de validation avant confirmation de chaque étape'
      }
    },
    {
      id: 'sim-s10',
      title: 'Bilan du Cours — Compétences ERP Acquises',
      subtitle: 'Ce que vous savez faire après le Programme 2 ERP',
      type: 'summary',
      content: 'Félicitations ! En complétant le Programme 2 ERP du Collège de la Concorde, vous avez acquis des compétences opérationnelles concrètes sur trois systèmes ERP leaders du marché. Ces compétences sont directement valorisables sur le marché du travail québécois et international.',
      keyPoints: [
        '✅ ERP-ARCH : comprendre l\'architecture modulaire et comparer SAP, Dynamics 365, Odoo',
        '✅ MM : exécuter un cycle Procure-to-Pay complet (PR → PO → GR → IV → Paiement)',
        '✅ SD : exécuter un cycle Order-to-Cash complet (SO → Livraison → Facturation → Paiement)',
        '✅ FI : lire et générer des écritures comptables automatiques, analyser un P&L',
        '✅ ERP-SIM : gérer un cycle d\'affaires transversal complet intégrant MM + SD + FI',
        '🎯 Prochaine étape : certifications SAP (SAP Certified Associate), Microsoft (MB-300), Odoo (Odoo Functional)'
      ],
      systemRef: {
        sap: 'SAP Certifications : C_TS410 (Integration), C_TS422 (MM), C_TS460 (SD) — valeur marché : 70 000–120 000 CAD/an',
        dynamics: 'Microsoft Certifications : MB-300 (Finance & Operations), MB-310 (Finance) — valeur marché : 65 000–110 000 CAD/an',
        odoo: 'Odoo Certification : Odoo 17 Functional — valeur marché : 55 000–90 000 CAD/an (PME québécoises)'
      }
    }
  ],
  scenarios: [
    {
      id: 'erp-sim-01',
      code: 'ERP-SIM-01',
      title: 'Cycle ERP complet — Distributions La Concorde',
      description: 'Gérer un cycle d\'affaires complet : réception commande client → approvisionnement → livraison → facturation → analyse financière.',
      difficulty: 'Avancé',
      duration: '60 min',
      learningObjective: 'Exécuter un cycle ERP transversal complet en intégrant MM, SD et FI simultanément.',
      totalPoints: 200,
      steps: [
        {
          id: 'sim-01-s1',
          stepNumber: 1,
          code: 'SIM-SO-001',
          name: 'Réceptionner la commande client',
          objective: 'Enregistrer la commande de 80 tablettes de ElectroMTL',
          sapCode: 'VA01',
          dynamicsName: 'Sales Order',
          odooName: 'Commande client',
          fields: [
            { id: 'client_sim', label: 'Client', type: 'select', options: ['ElectroMTL', 'TechSupply Inc.', 'Distributions La Concorde', 'Client inconnu'], required: true, correctValue: 'ElectroMTL', hint: 'Client principal de Distributions La Concorde' },
            { id: 'produit_sim', label: 'Produit commandé', type: 'text', placeholder: 'Ex: TABLET-PRO-10', required: true, correctValue: 'TABLET-PRO-10', hint: 'Code produit des tablettes' },
            { id: 'quantite_sim', label: 'Quantité commandée', type: 'number', placeholder: 'Ex: 80', required: true, correctValue: '80', hint: 'ElectroMTL commande 80 unités' },
            { id: 'prix_sim', label: 'Prix unitaire (CAD)', type: 'number', placeholder: 'Ex: 299.00', required: true, correctValue: '299.00', hint: 'Prix de vente des tablettes' }
          ],
          validationMessage: '✅ Commande SIM-SO-001 créée ! 80 × 299,00 = 23 920,00 CAD. ATP Check en cours... Stock disponible : 50 unités. Manque : 30 unités. Action requise !',
          errorMessage: '❌ Vérifiez le client (ElectroMTL), le produit (TABLET-PRO-10), la quantité (80) et le prix (299,00 CAD).',
          points: 25,
          erpImpact: {
            document: 'Sales Order SIM-SO-001',
            accountingEntry: null,
            stockMovement: null,
            note: 'L\'ATP Check (Available-to-Promise) est identique dans les 3 systèmes : l\'ERP vérifie le stock disponible avant de confirmer la livraison. Résultat : 50 unités en stock, 30 manquantes — le cycle P2P est déclenché automatiquement.'
          }
        },
        {
          id: 'sim-01-s2',
          stepNumber: 2,
          code: 'SIM-PR-001',
          name: 'Commander les 30 unités manquantes',
          objective: 'Créer une demande d\'achat urgente pour 30 tablettes',
          sapCode: 'ME51N',
          dynamicsName: 'Purchase Requisition',
          odooName: 'Demande d\'achat',
          fields: [
            { id: 'fournisseur_sim', label: 'Fournisseur', type: 'select', options: ['TechSupply Inc.', 'ElectroMTL', 'Distributions La Concorde', 'Fournisseur inconnu'], required: true, correctValue: 'TechSupply Inc.', hint: 'Fournisseur principal de tablettes' },
            { id: 'quantite_pr_sim', label: 'Quantité à commander', type: 'number', placeholder: 'Ex: 30', required: true, correctValue: '30', hint: 'Quantité manquante pour satisfaire ElectroMTL' },
            { id: 'prix_achat_sim', label: 'Prix d\'achat unitaire (CAD)', type: 'number', placeholder: 'Ex: 180.00', required: true, correctValue: '180.00', hint: 'Prix d\'achat des tablettes chez TechSupply' }
          ],
          validationMessage: '✅ PO-SIM-001 créé ! 30 × 180,00 = 5 400,00 CAD. Envoyé à TechSupply Inc. Livraison confirmée : 2 jours. Stock total après réception : 80 unités.',
          errorMessage: '❌ Commandez 30 unités à TechSupply Inc. au prix de 180,00 CAD/unité.',
          points: 25,
          erpImpact: {
            document: 'Purchase Order PO-SIM-001',
            accountingEntry: 'Engagement budgétaire : 5 400,00 CAD (commitment)',
            stockMovement: null,
            note: 'Le cycle ERP intégré se déclenche ici : une commande client insuffisante en stock génère automatiquement un besoin d\'achat. C\'est l\'intégration SD→MM. Dans SAP : ME51N, D365 : Purchase Requisition, Odoo : Demande d\'achat.'
          }
        },
        {
          id: 'sim-01-s3',
          stepNumber: 3,
          code: 'SIM-GR-001',
          name: 'Réceptionner les 30 tablettes de TechSupply',
          objective: 'Enregistrer la réception et mettre à jour le stock',
          sapCode: 'MIGO (101)',
          dynamicsName: 'Product Receipt',
          odooName: 'Réception / Valider',
          fields: [
            { id: 'qte_recue_sim', label: 'Quantité reçue', type: 'number', placeholder: 'Ex: 30', required: true, correctValue: '30', hint: 'Vérifier physiquement les 30 tablettes reçues' },
            { id: 'stock_apres', label: 'Stock total après réception', type: 'number', placeholder: 'Ex: 80', required: true, correctValue: '80', hint: '50 (initial) + 30 (reçus) = 80 unités' }
          ],
          validationMessage: '✅ Réception SIM-GR-001 ! 30 tablettes reçues. Stock mis à jour : 80 unités disponibles. Écriture FI : Débit Stock 5 400,00 / Crédit GR-IR 5 400,00.',
          errorMessage: '❌ Réceptionnez 30 unités. Stock total = 50 + 30 = 80 unités.',
          points: 25,
          erpImpact: {
            document: 'Goods Receipt SIM-GR-001',
            accountingEntry: 'Débit Stock 5 400,00 / Crédit GR-IR 5 400,00',
            stockMovement: '+30 unités (stock : 50 → 80)',
            note: 'Intégration MM→FI : la réception physique génère automatiquement une écriture comptable. Même logique dans les 3 systèmes — seul le nom change : MIGO Mvt 101 / Product Receipt / Réception validée.'
          }
        },
        {
          id: 'sim-01-s4',
          stepNumber: 4,
          code: 'SIM-DEL-001',
          name: 'Expédier les 80 tablettes à ElectroMTL',
          objective: 'Créer la livraison et enregistrer la sortie de stock',
          sapCode: 'VL01N + VL02N (PGI)',
          dynamicsName: 'Delivery + Ship',
          odooName: 'Livraison + Valider',
          fields: [
            { id: 'qte_expediee', label: 'Quantité expédiée', type: 'number', placeholder: 'Ex: 80', required: true, correctValue: '80', hint: 'Toutes les tablettes commandées par ElectroMTL' },
            { id: 'transporteur_sim', label: 'Transporteur', type: 'select', options: ['Purolator Express', 'FedEx Priority', 'Transport interne', 'UPS Standard'], required: true, correctValue: 'Purolator Express', hint: 'Livraison urgente — service express' }
          ],
          validationMessage: '✅ Livraison SIM-DEL-001 ! 80 tablettes expédiées via Purolator Express. Stock réduit à 0. COGS enregistré dans FI : 80 × 180,00 = 14 400,00 CAD.',
          errorMessage: '❌ Expédiez 80 unités via Purolator Express.',
          points: 25,
          erpImpact: {
            document: 'Delivery SIM-DEL-001 + Goods Issue',
            accountingEntry: 'Débit COGS 14 400,00 / Crédit Stock 14 400,00',
            stockMovement: '-80 unités (stock : 80 → 0)',
            note: 'Intégration SD→FI : la sortie de stock (PGI) génère automatiquement l\'écriture COGS. C\'est le même principe dans les 3 systèmes — le coût des marchandises vendues est enregistré au moment de l\'expédition, pas de la facturation.'
          }
        },
        {
          id: 'sim-01-s5',
          stepNumber: 5,
          code: 'SIM-INV-001',
          name: 'Facturer ElectroMTL',
          objective: 'Générer la facture de 23 920,00 CAD',
          sapCode: 'VF01',
          dynamicsName: 'Customer Invoice',
          odooName: 'Facture client',
          fields: [
            { id: 'montant_inv_sim', label: 'Montant de la facture (CAD)', type: 'number', placeholder: 'Ex: 23920.00', required: true, correctValue: '23920.00', hint: '80 × 299,00 = 23 920,00 CAD' },
            { id: 'echeance_sim', label: 'Conditions de paiement', type: 'select', options: ['Net 30 jours', 'Net 60 jours', 'Paiement immédiat', '2/10 Net 30'], required: true, correctValue: 'Net 30 jours', hint: 'Conditions standard ElectroMTL' }
          ],
          validationMessage: '✅ Facture SIM-INV-001 ! 23 920,00 CAD. Écriture FI : Débit Clients 23 920,00 / Crédit Ventes 23 920,00. Créance ouverte. Échéance : 30 jours.',
          errorMessage: '❌ Le montant est 23 920,00 CAD (80 × 299,00).',
          points: 25,
          erpImpact: {
            document: 'Customer Invoice SIM-INV-001',
            accountingEntry: 'Débit Clients 23 920,00 / Crédit Ventes 23 920,00',
            stockMovement: null,
            note: 'La facturation crée la créance client dans FI. SAP : VF01 génère automatiquement l\'écriture AR. D365 : Customer Invoice postée dans Accounts Receivable. Odoo : Facture confirmée, créance ouverte.'
          }
        },
        {
          id: 'sim-01-s6',
          stepNumber: 6,
          code: 'SIM-PAY-001',
          name: 'Payer TechSupply Inc.',
          objective: 'Régler la facture fournisseur de 5 400,00 CAD',
          sapCode: 'F-53',
          dynamicsName: 'Vendor Payment',
          odooName: 'Paiement fournisseur',
          fields: [
            { id: 'montant_pay_sim', label: 'Montant du paiement fournisseur (CAD)', type: 'number', placeholder: 'Ex: 5400.00', required: true, correctValue: '5400.00', hint: '30 × 180,00 = 5 400,00 CAD' }
          ],
          validationMessage: '✅ Paiement SIM-PAY-001 ! 5 400,00 CAD virés à TechSupply Inc. Écriture FI : Débit Fournisseur 5 400,00 / Crédit Banque 5 400,00.',
          errorMessage: '❌ Le paiement fournisseur est de 5 400,00 CAD (30 × 180,00).',
          points: 25,
          erpImpact: {
            document: 'Vendor Payment SIM-PAY-001',
            accountingEntry: 'Débit Fournisseur 5 400,00 / Crédit Banque 5 400,00',
            stockMovement: null,
            note: 'Le cycle P2P est soldé : la dette fournisseur est éteinte et la trésorerie réduite. SAP : F-53, D365 : Vendor Payment Journal, Odoo : Paiement fournisseur. Même logique, noms différents.'
          }
        },
        {
          id: 'sim-01-s7',
          stepNumber: 7,
          code: 'SIM-FI-001',
          name: 'Analyse financière finale',
          objective: 'Calculer la rentabilité de la transaction complète',
          sapCode: 'KE30 / S_ALR_87012284',
          dynamicsName: 'Profitability Analysis',
          odooName: 'Rapport de rentabilité',
          fields: [
            { id: 'ca_total', label: 'Chiffre d\'affaires total (CAD)', type: 'number', placeholder: 'Ex: 23920.00', required: true, correctValue: '23920.00', hint: '80 × 299,00 CAD' },
            { id: 'cogs_total', label: 'Coût total des marchandises vendues (CAD)', type: 'number', placeholder: 'Ex: 14400.00', required: true, correctValue: '14400.00', hint: '80 × 180,00 CAD (coût d\'achat)' },
            { id: 'marge_totale', label: 'Marge brute totale (CAD)', type: 'number', placeholder: 'Ex: 9520.00', required: true, correctValue: '9520.00', hint: '23 920,00 - 14 400,00 = 9 520,00 CAD' }
          ],
          validationMessage: '✅ SIMULATION COMPLÈTE ! CA : 23 920,00 | COGS : 14 400,00 | Marge brute : 9 520,00 CAD (39,8%). Cycle ERP complet réussi ! Tous les modules intégrés avec succès. Score final calculé.',
          errorMessage: '❌ CA = 23 920,00 | COGS = 14 400,00 | Marge = 9 520,00 CAD.',
          points: 50,
          erpImpact: {
            document: 'Profitability Report KE30',
            accountingEntry: null,
            stockMovement: null,
            note: 'L\'analyse de rentabilité est identique dans les 3 systèmes : CA - COGS = Marge brute. SAP KE30, D365 Profitability Analysis, Odoo Rapport de rentabilité — tous lisent les mêmes données FI générées automatiquement pendant le cycle.'
          }
        }
      ]
    },
    {
      id: 'erp-sim-02',
      code: 'ERP-SIM-02',
      title: 'Cycle O2C — InfoTech Solutions',
      description: 'Exécuter un cycle Order-to-Cash complet pour un nouveau client : commande, vérification stock, livraison, facturation et analyse de marge.',
      difficulty: 'Intermédiaire',
      duration: '30 min',
      learningObjective: 'Maîtriser le cycle Order-to-Cash (SD + FI) de façon autonome avant la simulation intégrée complète.',
      totalPoints: 100,
      steps: [
        {
          id: 'sim-02-s1',
          stepNumber: 1,
          code: 'SIM2-SO-001',
          name: 'Créer la commande client InfoTech',
          objective: 'Enregistrer la commande de 40 ordinateurs portables de InfoTech Solutions',
          sapCode: 'VA01',
          dynamicsName: 'Sales Order',
          odooName: 'Commande client',
          fields: [
            { id: 'client_sim2', label: 'Client', type: 'select', options: ['InfoTech Solutions', 'ElectroMTL', 'TechSupply Inc.', 'Client inconnu'], required: true, correctValue: 'InfoTech Solutions', hint: 'Nouveau client de Distributions La Concorde' },
            { id: 'produit_sim2', label: 'Produit commandé', type: 'text', placeholder: 'Ex: LAPTOP-PRO-15', required: true, correctValue: 'LAPTOP-PRO-15', hint: 'Code produit des ordinateurs portables' },
            { id: 'quantite_sim2', label: 'Quantité commandée', type: 'number', placeholder: 'Ex: 40', required: true, correctValue: '40', hint: 'InfoTech Solutions commande 40 unités' },
            { id: 'prix_sim2', label: 'Prix unitaire (CAD)', type: 'number', placeholder: 'Ex: 899.00', required: true, correctValue: '899.00', hint: 'Prix de vente des ordinateurs portables' }
          ],
          validationMessage: '✅ Commande SIM2-SO-001 créée ! 40 × 899,00 = 35 960,00 CAD. ATP Check : Stock disponible = 40 unités. Livraison confirmée — aucun réapprovisionnement nécessaire.',
          errorMessage: '❌ Vérifiez le client (InfoTech Solutions), le produit (LAPTOP-PRO-15), la quantité (40) et le prix (899,00 CAD).',
          points: 25,
          erpImpact: {
            document: 'Sales Order SIM2-SO-001',
            accountingEntry: null,
            stockMovement: null,
            note: 'Contrairement à ERP-SIM-01, l\'ATP Check réussit ici : 40 unités disponibles pour 40 commandées. Aucun cycle P2P nécessaire. L\'ERP passe directement à la livraison — c\'est le cycle O2C pur.'
          }
        },
        {
          id: 'sim-02-s2',
          stepNumber: 2,
          code: 'SIM2-DEL-001',
          name: 'Préparer et expédier la commande',
          objective: 'Créer le bon de livraison et valider l\'expédition des 40 ordinateurs',
          sapCode: 'VL01N + VL02N (PGI)',
          dynamicsName: 'Delivery + Ship',
          odooName: 'Livraison + Valider',
          fields: [
            { id: 'qte_exp_sim2', label: 'Quantité expédiée', type: 'number', placeholder: 'Ex: 40', required: true, correctValue: '40', hint: 'Toute la commande InfoTech Solutions' },
            { id: 'transporteur_sim2', label: 'Transporteur', type: 'select', options: ['FedEx Priority', 'Purolator Express', 'Transport interne', 'UPS Standard'], required: true, correctValue: 'FedEx Priority', hint: 'InfoTech Solutions exige FedEx Priority' }
          ],
          validationMessage: '✅ Livraison SIM2-DEL-001 ! 40 ordinateurs expédiés via FedEx Priority. Écriture FI automatique : Débit COGS 22 000,00 / Crédit Stock 22 000,00 CAD.',
          errorMessage: '❌ Expédiez 40 unités via FedEx Priority.',
          points: 25,
          erpImpact: {
            document: 'Delivery SIM2-DEL-001 + Goods Issue',
            accountingEntry: 'Débit COGS 22 000,00 / Crédit Stock 22 000,00',
            stockMovement: '-40 unités (stock : 40 → 0)',
            note: 'Le PGI (Post Goods Issue) est l\'étape clé du cycle O2C : elle réduit le stock et génère le COGS automatiquement. SAP : VL02N PGI, D365 : Ship, Odoo : Valider la livraison.'
          }
        },
        {
          id: 'sim-02-s3',
          stepNumber: 3,
          code: 'SIM2-INV-001',
          name: 'Facturer InfoTech Solutions',
          objective: 'Générer la facture client de 35 960,00 CAD',
          sapCode: 'VF01',
          dynamicsName: 'Customer Invoice',
          odooName: 'Facture client',
          fields: [
            { id: 'montant_inv_sim2', label: 'Montant de la facture (CAD)', type: 'number', placeholder: 'Ex: 35960.00', required: true, correctValue: '35960.00', hint: '40 × 899,00 = 35 960,00 CAD' },
            { id: 'echeance_sim2', label: 'Conditions de paiement', type: 'select', options: ['Net 30 jours', 'Net 60 jours', '2/10 Net 30', 'Paiement immédiat'], required: true, correctValue: '2/10 Net 30', hint: 'InfoTech Solutions bénéficie d\'un escompte 2% si paiement sous 10 jours' }
          ],
          validationMessage: '✅ Facture SIM2-INV-001 ! 35 960,00 CAD. Écriture FI : Débit Clients 35 960,00 / Crédit Ventes 35 960,00. Escompte possible : 719,20 CAD si paiement sous 10 jours.',
          errorMessage: '❌ Le montant est 35 960,00 CAD (40 × 899,00). Conditions : 2/10 Net 30.',
          points: 25,
          erpImpact: {
            document: 'Customer Invoice SIM2-INV-001',
            accountingEntry: 'Débit Clients 35 960,00 / Crédit Ventes 35 960,00',
            stockMovement: null,
            note: 'La condition 2/10 Net 30 signifie : 2% d\'escompte si paiement sous 10 jours, sinon net à 30 jours. Cette logique est identique dans SAP, D365 et Odoo — seule la configuration des conditions de paiement diffère.'
          }
        },
        {
          id: 'sim-02-s4',
          stepNumber: 4,
          code: 'SIM2-FI-001',
          name: 'Analyse de rentabilité O2C',
          objective: 'Calculer la marge brute et le taux de marge de la transaction',
          sapCode: 'KE30',
          dynamicsName: 'Profitability Analysis',
          odooName: 'Rapport de rentabilité',
          fields: [
            { id: 'ca_sim2', label: 'Chiffre d\'affaires (CAD)', type: 'number', placeholder: 'Ex: 35960.00', required: true, correctValue: '35960.00', hint: '40 × 899,00 CAD' },
            { id: 'cogs_sim2', label: 'Coût des marchandises vendues (CAD)', type: 'number', placeholder: 'Ex: 22000.00', required: true, correctValue: '22000.00', hint: '40 × 550,00 CAD (coût d\'achat LAPTOP-PRO-15)' },
            { id: 'marge_sim2', label: 'Marge brute (CAD)', type: 'number', placeholder: 'Ex: 13960.00', required: true, correctValue: '13960.00', hint: '35 960,00 - 22 000,00 = 13 960,00 CAD' }
          ],
          validationMessage: '✅ Cycle O2C complété ! CA : 35 960,00 | COGS : 22 000,00 | Marge brute : 13 960,00 CAD (38,8%). Excellent résultat ! Vous êtes prêt pour ERP-SIM-01.',
          errorMessage: '❌ CA = 35 960,00 | COGS = 22 000,00 (40 × 550,00) | Marge = 13 960,00 CAD.',
          points: 25,
          erpImpact: {
            document: 'Profitability Report KE30',
            accountingEntry: null,
            stockMovement: null,
            note: 'Marge brute 38,8% : résultat solide. Le taux de marge est calculé de la même façon dans les 3 systèmes : (CA - COGS) / CA. Vous êtes maintenant prêt pour la simulation intégrée ERP-SIM-01 qui combine MM + SD + FI.'
          }
        }
      ]
    }
  ]
};
// ============================================================
// EXPORT — All modules
// ============================================================
export const ERP_MODULES: ERPModule[] = [
  moduleERPARCH,
  moduleMM,
  moduleSD,
  moduleFI,
  moduleERPSIM
];

export const getModuleById = (id: string): ERPModule | undefined =>
  ERP_MODULES.find(m => m.id === id);

export const getModuleByCode = (code: string): ERPModule | undefined =>
  ERP_MODULES.find(m => m.code === code);

export const getScenarioById = (scenarioId: string): { module: ERPModule; scenario: Scenario } | undefined => {
  for (const module of ERP_MODULES) {
    const scenario = module.scenarios.find(s => s.id === scenarioId);
    if (scenario) return { module, scenario };
  }
  return undefined;
};

// ============================================================
// QUIZ DATA — 4-5 MCQ questions per module
// ============================================================
export const MODULE_QUIZZES: Record<string, QuizQuestion[]> = {
  'erp-arch': [
    {
      id: 'arch-q1',
      question: 'Qu\'est-ce qu\'un ERP (Enterprise Resource Planning) ?',
      options: [
        'Un logiciel de comptabilité uniquement',
        'Un système intégré qui unifie tous les processus de l\'entreprise dans une base de données centrale',
        'Un outil de gestion des ressources humaines',
        'Un système de gestion des stocks seulement'
      ],
      correctIndex: 1,
      explanation: 'Un ERP unifie TOUS les processus (achats, ventes, finance, RH, production) dans une seule base de données centralisée, éliminant les silos d\'information entre départements.'
    },
    {
      id: 'arch-q2',
      question: 'Dans SAP S/4HANA, que signifie la convention de nommage des T-codes ? Par exemple : ME21N',
      options: [
        'ME = Materials External, 21 = numéro de version, N = Nouveau',
        'ME = Module ERP, 21 = année 2021, N = Normal',
        'ME = Materials Management External, 21 = code fonction, N = Nouveau (créer)',
        'ME = Menu ERP, 21 = niveau d\'accès, N = Navigation'
      ],
      correctIndex: 2,
      explanation: 'Dans SAP, ME = Materials Management External (module achats), le numéro identifie la fonction, et N = Nouveau (créer). ME22N = Modifier PO, ME23N = Afficher PO.'
    },
    {
      id: 'arch-q3',
      question: 'Quel ERP est le plus adapté pour une PME en croissance avec un budget limité ?',
      options: [
        'SAP S/4HANA',
        'Microsoft Dynamics 365',
        'Odoo',
        'Tous sont équivalents pour une PME'
      ],
      correctIndex: 2,
      explanation: 'Odoo est open source, modulaire et flexible. Son coût est nettement inférieur à SAP et Dynamics 365, ce qui le rend idéal pour les PME. Il compte plus de 7 millions d\'utilisateurs mondiaux.'
    },
    {
      id: 'arch-q4',
      question: 'Qu\'est-ce que l\'intégration ERP signifie concrètement ?',
      options: [
        'Tous les employés utilisent le même ordinateur',
        'Une transaction dans un module met automatiquement à jour les autres modules concernés',
        'Les données sont sauvegardées dans le cloud',
        'L\'ERP remplace tous les autres logiciels de l\'entreprise'
      ],
      correctIndex: 1,
      explanation: 'L\'intégration signifie qu\'une réception de marchandises (MM) met automatiquement à jour les stocks ET génère une écriture comptable (FI) sans saisie manuelle supplémentaire.'
    },
    {
      id: 'arch-q5',
      question: 'Quel événement a marqué le passage des ERP vers le cloud (SaaS) ?',
      options: [
        'Les années 1960 avec MRP',
        'Les années 1990 avec SAP R/3',
        'Les années 2010 avec Dynamics 365 et Odoo Cloud',
        'Les années 2000 avec l\'ERP étendu'
      ],
      correctIndex: 2,
      explanation: 'C\'est dans les années 2010 que les ERP cloud (SaaS) se sont imposés, avec Microsoft Dynamics 365 et Odoo en mode abonnement, permettant l\'accès depuis n\'importe quel appareil.'
    }
  ],
  'mm': [
    {
      id: 'mm-q1',
      question: 'Quel est le bon ordre du cycle Procure-to-Pay (P2P) dans SAP ?',
      options: [
        'ME21N → ME51N → MIGO → MIRO → F-53',
        'ME51N → ME21N → MIGO → MIRO → F-53',
        'MIGO → ME51N → ME21N → MIRO → F-53',
        'ME51N → MIRO → ME21N → MIGO → F-53'
      ],
      correctIndex: 1,
      explanation: 'Le flux P2P correct est : Demande d\'achat (ME51N) → Bon de commande (ME21N) → Réception marchandises (MIGO) → Vérification facture (MIRO) → Paiement (F-53).'
    },
    {
      id: 'mm-q2',
      question: 'Quel mouvement SAP (Mvt) est utilisé pour la réception standard de marchandises ?',
      options: [
        'Mouvement 201 (sortie vers centre de coûts)',
        'Mouvement 101 (réception par rapport au bon de commande)',
        'Mouvement 301 (transfert entre magasins)',
        'Mouvement 601 (sortie pour livraison client)'
      ],
      correctIndex: 1,
      explanation: 'Le mouvement 101 dans MIGO correspond à la réception de marchandises par rapport à un bon de commande. Il augmente le stock et génère l\'écriture : Débit Stock / Crédit GR-IR.'
    },
    {
      id: 'mm-q3',
      question: 'Qu\'est-ce que le compte GR-IR dans SAP ?',
      options: [
        'Un compte bancaire pour les paiements fournisseurs',
        'Un compte de résultat pour les achats',
        'Un compte transitoire entre la réception marchandises et la facture fournisseur',
        'Un compte de stock pour les marchandises en transit'
      ],
      correctIndex: 2,
      explanation: 'GR-IR (Goods Receipt / Invoice Receipt) est un compte transitoire. Il est crédité lors de la réception (MIGO) et débité lors de la facture (MIRO). Il doit être soldé à zéro quand GR = IR.'
    },
    {
      id: 'mm-q4',
      question: 'Dans Odoo, quelle application correspond au module MM de SAP ?',
      options: [
        'Application Ventes',
        'Application Comptabilité',
        'Application Achats + Application Inventaire',
        'Application Fabrication'
      ],
      correctIndex: 2,
      explanation: 'Dans Odoo, le module MM de SAP est couvert par deux applications : Achats (pour les bons de commande et factures fournisseurs) et Inventaire (pour la gestion des stocks et réceptions).'
    }
  ],
  'sd': [
    {
      id: 'sd-q1',
      question: 'Quel est le bon ordre du cycle Order-to-Cash (O2C) dans SAP ?',
      options: [
        'VF01 → VA01 → VL01N → VL02N → F-28',
        'VA01 → VL01N → VL02N → VF01 → F-28',
        'VA01 → VF01 → VL01N → VL02N → F-28',
        'VL01N → VA01 → VF01 → VL02N → F-28'
      ],
      correctIndex: 1,
      explanation: 'Le flux O2C correct est : Commande client (VA01) → Créer livraison (VL01N) → Valider expédition/PGI (VL02N) → Facturation (VF01) → Paiement client (F-28).'
    },
    {
      id: 'sd-q2',
      question: 'Que signifie PGI dans SAP SD ?',
      options: [
        'Plan Général d\'Inventaire',
        'Post Goods Issue — la sortie physique de stock lors de l\'expédition',
        'Processus de Gestion Intégré',
        'Paiement Garanti Immédiat'
      ],
      correctIndex: 1,
      explanation: 'PGI (Post Goods Issue) est l\'enregistrement de la sortie physique de marchandises du stock. Il génère automatiquement l\'écriture FI : Débit COGS / Crédit Stock.'
    },
    {
      id: 'sd-q3',
      question: 'Qu\'est-ce que l\'ATP Check dans le cycle O2C ?',
      options: [
        'Une vérification du crédit client avant d\'accepter la commande',
        'Un contrôle de la qualité des marchandises à expédier',
        'Une vérification de la disponibilité du stock pour promettre une date de livraison',
        'Un audit de la transaction par le service financier'
      ],
      correctIndex: 2,
      explanation: 'L\'ATP (Available-to-Promise) Check vérifie si le stock disponible peut satisfaire la commande à la date demandée. Si insuffisant, l\'ERP propose une date alternative ou déclenche un réapprovisionnement.'
    },
    {
      id: 'sd-q4',
      question: 'Dans Microsoft Dynamics 365, quel équivalent correspond au T-code SAP VF01 (facturation) ?',
      options: [
        'Sales Order',
        'Customer Invoice',
        'Product Receipt',
        'Payment Journal'
      ],
      correctIndex: 1,
      explanation: 'VF01 dans SAP (créer facture client) correspond à Customer Invoice dans Dynamics 365. Dans Odoo, c\'est la Facture client générée depuis la commande de vente.'
    }
  ],
  'fi': [
    {
      id: 'fi-q1',
      question: 'Lors d\'une réception de marchandises (MIGO), quelle écriture comptable est générée automatiquement ?',
      options: [
        'Débit Fournisseur / Crédit Banque',
        'Débit Stock / Crédit GR-IR',
        'Débit COGS / Crédit Stock',
        'Débit Clients / Crédit Ventes'
      ],
      correctIndex: 1,
      explanation: 'La réception GR (MIGO) génère : Débit Stock (augmentation de l\'actif) / Crédit GR-IR (compte transitoire en attente de la facture fournisseur).'
    },
    {
      id: 'fi-q2',
      question: 'Quelle est l\'équation fondamentale du bilan comptable ?',
      options: [
        'Actifs = Passifs - Capitaux Propres',
        'Passifs = Actifs + Capitaux Propres',
        'Actifs = Passifs + Capitaux Propres',
        'Capitaux Propres = Actifs × Passifs'
      ],
      correctIndex: 2,
      explanation: 'L\'équation fondamentale est : Actifs = Passifs + Capitaux Propres. Elle est toujours équilibrée car chaque transaction respecte la partie double (débit = crédit).'
    },
    {
      id: 'fi-q3',
      question: 'Qu\'est-ce que le DSO (Days Sales Outstanding) mesure ?',
      options: [
        'Le nombre de jours de stock disponible',
        'Le nombre moyen de jours pour encaisser les créances clients',
        'Le délai moyen de paiement des fournisseurs',
        'Le nombre de jours pour clôturer les comptes en fin de mois'
      ],
      correctIndex: 1,
      explanation: 'DSO = (Solde Clients / CA) × 365. Il mesure le délai moyen d\'encaissement. Un DSO élevé (> 60 jours) signifie que les clients paient lentement, ce qui crée des problèmes de trésorerie.'
    },
    {
      id: 'fi-q4',
      question: 'Une entreprise peut-elle faire faillite même avec un P&L (compte de résultat) positif ?',
      options: [
        'Non, un P&L positif garantit la solvabilité',
        'Oui, si les clients ne paient pas et que la trésorerie est épuisée',
        'Non, l\'ERP prévient automatiquement ce risque',
        'Oui, mais seulement dans les grandes entreprises'
      ],
      correctIndex: 1,
      explanation: 'C\'est la règle d\'or : une entreprise peut être rentable (P&L positif) mais faire faillite si ses clients ne paient pas et qu\'elle manque de liquidités pour payer ses fournisseurs et employés.'
    }
  ],
  'erp-sim': [
    {
      id: 'sim-q1',
      question: 'Dans ERP-SIM-01, pourquoi faut-il commander 30 unités supplémentaires à TechSupply ?',
      options: [
        'Parce que le stock initial est à zéro',
        'Parce que ElectroMTL commande 80 unités mais le stock disponible n\'est que de 50',
        'Parce que le fournisseur impose un minimum de commande de 30',
        'Parce que 30 unités sont réservées pour un autre client'
      ],
      correctIndex: 1,
      explanation: 'L\'ATP Check détecte : commande 80 unités - stock disponible 50 unités = manque de 30 unités. L\'ERP déclenche automatiquement une demande de réapprovisionnement urgent (ME51N).'
    },
    {
      id: 'sim-q2',
      question: 'Quel est le montant correct de la marge brute dans ERP-SIM-01 ?',
      options: [
        '5 400,00 CAD (paiement fournisseur)',
        '18 520,00 CAD (CA - paiement fournisseur)',
        '9 520,00 CAD (CA 23 920 - COGS 14 400)',
        '23 920,00 CAD (chiffre d\'affaires total)'
      ],
      correctIndex: 2,
      explanation: 'Marge brute = CA - COGS = 23 920,00 - 14 400,00 = 9 520,00 CAD (39,8%). COGS = 80 unités × 180 CAD (coût d\'achat). Attention : ne pas confondre COGS avec le paiement fournisseur (30 × 180 = 5 400 CAD).'
    },
    {
      id: 'sim-q3',
      question: 'Dans quel ordre les écritures comptables FI sont-elles générées dans ERP-SIM-01 ?',
      options: [
        'Facture client → PGI → Réception GR → Facture fourn. → Paiement fourn.',
        'Réception GR → Facture fourn. → Paiement fourn. → PGI → Facture client',
        'PGI → Facture client → Réception GR → Facture fourn. → Paiement fourn.',
        'Réception GR → PGI → Facture fourn. → Facture client → Paiement fourn.'
      ],
      correctIndex: 1,
      explanation: 'L\'ordre chronologique correct est : 1) Réception GR (stock + GR-IR), 2) Facture fournisseur (GR-IR + AP), 3) Paiement fournisseur (AP + Banque), 4) PGI expédition (COGS + Stock), 5) Facture client (AR + Ventes).'
    },
    {
      id: 'sim-q4',
      question: 'Quelle est la différence principale entre ERP-SIM-01 (Avancé) et ERP-SIM-02 (Intermédiaire) ?',
      options: [
        'ERP-SIM-02 utilise un système ERP différent',
        'ERP-SIM-01 intègre MM + SD + FI avec réapprovisionnement, ERP-SIM-02 est un cycle O2C pur sans réapprovisionnement',
        'ERP-SIM-02 est plus long et plus complexe',
        'Il n\'y a pas de différence, ils couvrent les mêmes étapes'
      ],
      correctIndex: 1,
      explanation: 'ERP-SIM-02 est un cycle O2C pur (SD + FI) avec stock suffisant — idéal pour pratiquer avant ERP-SIM-01. ERP-SIM-01 est transversal (MM + SD + FI) avec détection de rupture de stock et réapprovisionnement d\'urgence.'
    }
  ]
};


