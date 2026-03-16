// ============================================================
// Quiz Data — ERP Integrated Business Simulator
// Questions de compréhension pour chaque module
// SAP S/4HANA | Microsoft Dynamics 365 | Odoo ERP
// ============================================================

export interface QuizQuestion {
  id: string;
  question: string;
  questionEn: string;
  options: string[];
  optionsEn: string[];
  correctIndex: number;
  explanation: string;
  explanationEn: string;
  system?: 'sap' | 'dynamics' | 'odoo' | 'general';
}

export interface ModuleQuiz {
  moduleId: string;
  questions: QuizQuestion[];
}

// ─── ERP-ARCH ────────────────────────────────────────────────
const quizERPARCH: ModuleQuiz = {
  moduleId: 'erp-arch',
  questions: [
    {
      id: 'arch-q1',
      question: 'Quel est le principal avantage d\'un système ERP intégré par rapport à des logiciels séparés ?',
      questionEn: 'What is the main advantage of an integrated ERP system over separate software?',
      options: [
        'Il est moins coûteux à acheter',
        'Il partage une base de données unique éliminant les silos d\'information',
        'Il fonctionne sans connexion internet',
        'Il ne nécessite aucune formation'
      ],
      optionsEn: [
        'It is cheaper to purchase',
        'It shares a single database eliminating information silos',
        'It works without internet connection',
        'It requires no training'
      ],
      correctIndex: 1,
      explanation: 'Un ERP intégré utilise une base de données centralisée partagée par tous les modules (MM, SD, FI, etc.), éliminant les doublons et garantissant la cohérence des données en temps réel.',
      explanationEn: 'An integrated ERP uses a centralized database shared by all modules (MM, SD, FI, etc.), eliminating duplicates and ensuring real-time data consistency.',
      system: 'general'
    },
    {
      id: 'arch-q2',
      question: 'Dans SAP S/4HANA, qu\'est-ce qu\'un T-code (Transaction Code) ?',
      questionEn: 'In SAP S/4HANA, what is a T-code (Transaction Code)?',
      options: [
        'Un code de sécurité pour les paiements',
        'Un raccourci clavier pour accéder directement à une transaction ou un écran SAP',
        'Un identifiant de client dans le système',
        'Un code de validation pour les factures'
      ],
      optionsEn: [
        'A security code for payments',
        'A keyboard shortcut to directly access a SAP transaction or screen',
        'A customer identifier in the system',
        'A validation code for invoices'
      ],
      correctIndex: 1,
      explanation: 'Les T-codes SAP (ex: ME21N pour créer un PO, MIGO pour les mouvements de stock) permettent d\'accéder directement à une fonctionnalité sans naviguer dans les menus.',
      explanationEn: 'SAP T-codes (e.g., ME21N to create a PO, MIGO for stock movements) allow direct access to a function without navigating through menus.',
      system: 'sap'
    },
    {
      id: 'arch-q3',
      question: 'Microsoft Dynamics 365 est principalement basé sur quelle infrastructure cloud ?',
      questionEn: 'Microsoft Dynamics 365 is primarily based on which cloud infrastructure?',
      options: [
        'AWS (Amazon Web Services)',
        'Google Cloud Platform',
        'Microsoft Azure',
        'IBM Cloud'
      ],
      optionsEn: [
        'AWS (Amazon Web Services)',
        'Google Cloud Platform',
        'Microsoft Azure',
        'IBM Cloud'
      ],
      correctIndex: 2,
      explanation: 'Dynamics 365 est natif sur Microsoft Azure, ce qui permet l\'intégration avec Power BI, Power Automate, Teams et l\'ensemble de l\'écosystème Microsoft 365.',
      explanationEn: 'Dynamics 365 is native on Microsoft Azure, enabling integration with Power BI, Power Automate, Teams and the entire Microsoft 365 ecosystem.',
      system: 'dynamics'
    },
    {
      id: 'arch-q4',
      question: 'Odoo ERP se distingue des autres ERP par quel aspect fondamental ?',
      questionEn: 'Odoo ERP is distinguished from other ERPs by which fundamental aspect?',
      options: [
        'Il est uniquement disponible en mode SaaS',
        'Il est open source avec une architecture modulaire basée sur Python',
        'Il ne supporte que les PME',
        'Il n\'a pas de module financier'
      ],
      optionsEn: [
        'It is only available in SaaS mode',
        'It is open source with a modular architecture based on Python',
        'It only supports SMEs',
        'It has no financial module'
      ],
      correctIndex: 1,
      explanation: 'Odoo est open source (licence LGPL), développé en Python avec PostgreSQL. Son architecture modulaire permet d\'activer uniquement les modules nécessaires, réduisant les coûts.',
      explanationEn: 'Odoo is open source (LGPL license), developed in Python with PostgreSQL. Its modular architecture allows activating only the necessary modules, reducing costs.',
      system: 'odoo'
    },
    {
      id: 'arch-q5',
      question: 'Qu\'est-ce que la transformation digitale dans le contexte ERP ?',
      questionEn: 'What is digital transformation in the ERP context?',
      options: [
        'Remplacer tous les employés par des robots',
        'Numériser uniquement les factures papier',
        'Réinventer les processus métier grâce aux technologies numériques pour créer de la valeur',
        'Acheter le logiciel ERP le plus cher'
      ],
      optionsEn: [
        'Replacing all employees with robots',
        'Only digitizing paper invoices',
        'Reinventing business processes through digital technologies to create value',
        'Buying the most expensive ERP software'
      ],
      correctIndex: 2,
      explanation: 'La transformation digitale va au-delà de la simple numérisation : elle réinvente les processus métier, les modèles d\'affaires et l\'expérience client grâce aux technologies ERP, IA, cloud et data.',
      explanationEn: 'Digital transformation goes beyond simple digitization: it reinvents business processes, business models and customer experience through ERP, AI, cloud and data technologies.',
      system: 'general'
    }
  ]
};

// ─── MM ──────────────────────────────────────────────────────
const quizMM: ModuleQuiz = {
  moduleId: 'mm',
  questions: [
    {
      id: 'mm-q1',
      question: 'Quelle est la séquence correcte du cycle Procure-to-Pay (P2P) ?',
      questionEn: 'What is the correct sequence of the Procure-to-Pay (P2P) cycle?',
      options: [
        'PO → PR → GR → Invoice → Payment',
        'PR → PO → GR → Invoice → Payment',
        'GR → PR → PO → Payment → Invoice',
        'Invoice → PO → PR → GR → Payment'
      ],
      optionsEn: [
        'PO → PR → GR → Invoice → Payment',
        'PR → PO → GR → Invoice → Payment',
        'GR → PR → PO → Payment → Invoice',
        'Invoice → PO → PR → GR → Payment'
      ],
      correctIndex: 1,
      explanation: 'Le cycle P2P commence par la Purchase Requisition (besoin interne), puis Purchase Order (commande fournisseur), Goods Receipt (réception), Invoice Verification et enfin Payment.',
      explanationEn: 'The P2P cycle starts with the Purchase Requisition (internal need), then Purchase Order (supplier order), Goods Receipt (reception), Invoice Verification and finally Payment.',
      system: 'general'
    },
    {
      id: 'mm-q2',
      question: 'Dans SAP, quel T-code est utilisé pour créer un Purchase Order (PO) ?',
      questionEn: 'In SAP, which T-code is used to create a Purchase Order (PO)?',
      options: ['ME51N', 'ME21N', 'MIGO', 'MIRO'],
      optionsEn: ['ME51N', 'ME21N', 'MIGO', 'MIRO'],
      correctIndex: 1,
      explanation: 'ME21N (Create Purchase Order) est le T-code SAP pour créer un bon de commande. ME51N crée une Purchase Requisition, MIGO gère les mouvements de stock, MIRO vérifie les factures.',
      explanationEn: 'ME21N (Create Purchase Order) is the SAP T-code to create a purchase order. ME51N creates a Purchase Requisition, MIGO manages stock movements, MIRO verifies invoices.',
      system: 'sap'
    },
    {
      id: 'mm-q3',
      question: 'Dans Dynamics 365, comment s\'appelle l\'équivalent du "Goods Receipt" SAP ?',
      questionEn: 'In Dynamics 365, what is the equivalent of SAP "Goods Receipt" called?',
      options: [
        'Stock Movement',
        'Product Receipt',
        'Inventory Arrival',
        'Warehouse Entry'
      ],
      optionsEn: [
        'Stock Movement',
        'Product Receipt',
        'Inventory Arrival',
        'Warehouse Entry'
      ],
      correctIndex: 1,
      explanation: 'Dans Dynamics 365 Supply Chain Management, la réception de marchandises s\'appelle "Product Receipt". Elle met à jour le stock et génère automatiquement les écritures comptables.',
      explanationEn: 'In Dynamics 365 Supply Chain Management, goods receipt is called "Product Receipt". It updates stock and automatically generates accounting entries.',
      system: 'dynamics'
    },
    {
      id: 'mm-q4',
      question: 'Quel mouvement de stock SAP correspond à la réception de marchandises sur commande fournisseur ?',
      questionEn: 'Which SAP stock movement corresponds to goods receipt on a supplier order?',
      options: ['Mouvement 101', 'Mouvement 201', 'Mouvement 301', 'Mouvement 601'],
      optionsEn: ['Movement 101', 'Movement 201', 'Movement 301', 'Movement 601'],
      correctIndex: 0,
      explanation: 'Le mouvement 101 (Goods Receipt for Purchase Order) est le mouvement SAP standard pour réceptionner des marchandises contre un PO. Il augmente le stock et génère une écriture débit stock / crédit GR-IR.',
      explanationEn: 'Movement 101 (Goods Receipt for Purchase Order) is the standard SAP movement to receive goods against a PO. It increases stock and generates a debit stock / credit GR-IR entry.',
      system: 'sap'
    },
    {
      id: 'mm-q5',
      question: 'Dans Odoo, où crée-t-on une demande d\'achat (Purchase Requisition) ?',
      questionEn: 'In Odoo, where do you create a purchase request (Purchase Requisition)?',
      options: [
        'Module Ventes → Devis',
        'Module Achats → Demandes d\'achat',
        'Module Comptabilité → Factures',
        'Module Inventaire → Transferts'
      ],
      optionsEn: [
        'Sales Module → Quotations',
        'Purchase Module → Purchase Requests',
        'Accounting Module → Invoices',
        'Inventory Module → Transfers'
      ],
      correctIndex: 1,
      explanation: 'Dans Odoo, les demandes d\'achat se créent dans le module Achats (Purchase) → Demandes d\'achat. Elles peuvent être converties en bons de commande après validation.',
      explanationEn: 'In Odoo, purchase requests are created in the Purchase module → Purchase Requests. They can be converted to purchase orders after validation.',
      system: 'odoo'
    }
  ]
};

// ─── SD ──────────────────────────────────────────────────────
const quizSD: ModuleQuiz = {
  moduleId: 'sd',
  questions: [
    {
      id: 'sd-q1',
      question: 'Quelle est la séquence correcte du cycle Order-to-Cash (O2C) ?',
      questionEn: 'What is the correct sequence of the Order-to-Cash (O2C) cycle?',
      options: [
        'Invoice → SO → Delivery → Payment',
        'SO → Delivery → Goods Issue → Billing → Payment',
        'Payment → SO → Billing → Delivery',
        'SO → Invoice → Delivery → Goods Issue → Payment'
      ],
      optionsEn: [
        'Invoice → SO → Delivery → Payment',
        'SO → Delivery → Goods Issue → Billing → Payment',
        'Payment → SO → Billing → Delivery',
        'SO → Invoice → Delivery → Goods Issue → Payment'
      ],
      correctIndex: 1,
      explanation: 'Le cycle O2C : Sales Order (commande client) → Delivery (livraison) → Goods Issue (sortie de stock) → Billing/Invoice (facturation) → Payment (encaissement).',
      explanationEn: 'The O2C cycle: Sales Order (customer order) → Delivery → Goods Issue (stock exit) → Billing/Invoice → Payment (collection).',
      system: 'general'
    },
    {
      id: 'sd-q2',
      question: 'Dans SAP SD, quel T-code crée un Sales Order ?',
      questionEn: 'In SAP SD, which T-code creates a Sales Order?',
      options: ['VA01', 'VL01N', 'VF01', 'F-28'],
      optionsEn: ['VA01', 'VL01N', 'VF01', 'F-28'],
      correctIndex: 0,
      explanation: 'VA01 crée un Sales Order dans SAP SD. VL01N crée une livraison, VF01 crée une facture (Billing Document), F-28 enregistre un paiement client.',
      explanationEn: 'VA01 creates a Sales Order in SAP SD. VL01N creates a delivery, VF01 creates an invoice (Billing Document), F-28 records a customer payment.',
      system: 'sap'
    },
    {
      id: 'sd-q3',
      question: 'Qu\'est-ce que le "Goods Issue" dans le cycle SD ?',
      questionEn: 'What is "Goods Issue" in the SD cycle?',
      options: [
        'La réception de marchandises du fournisseur',
        'La sortie physique de stock lors de la livraison au client',
        'La création de la facture client',
        'Le retour de marchandises défectueuses'
      ],
      optionsEn: [
        'Receipt of goods from the supplier',
        'Physical stock exit when delivering to the customer',
        'Creation of the customer invoice',
        'Return of defective goods'
      ],
      correctIndex: 1,
      explanation: 'Le Goods Issue (mouvement 601 dans SAP) est la sortie physique de stock lors de la livraison au client. Il réduit le stock et génère automatiquement une écriture comptable (débit COGS / crédit Stock).',
      explanationEn: 'Goods Issue (movement 601 in SAP) is the physical stock exit when delivering to the customer. It reduces stock and automatically generates an accounting entry (debit COGS / credit Stock).',
      system: 'general'
    },
    {
      id: 'sd-q4',
      question: 'Dans Dynamics 365, comment s\'appelle l\'équivalent du Sales Order SAP ?',
      questionEn: 'In Dynamics 365, what is the equivalent of SAP Sales Order called?',
      options: ['Customer Invoice', 'Sales Order', 'Customer Quote', 'Sales Agreement'],
      optionsEn: ['Customer Invoice', 'Sales Order', 'Customer Quote', 'Sales Agreement'],
      correctIndex: 1,
      explanation: 'Dans Dynamics 365 Sales/Finance, l\'équivalent du Sales Order SAP s\'appelle également "Sales Order". La terminologie est similaire mais la navigation et les champs diffèrent.',
      explanationEn: 'In Dynamics 365 Sales/Finance, the equivalent of SAP Sales Order is also called "Sales Order". The terminology is similar but navigation and fields differ.',
      system: 'dynamics'
    },
    {
      id: 'sd-q5',
      question: 'Dans Odoo, quelle est la séquence pour facturer un client ?',
      questionEn: 'In Odoo, what is the sequence to invoice a customer?',
      options: [
        'Facture → Devis → Bon de commande',
        'Devis → Bon de commande → Livraison → Facture',
        'Livraison → Devis → Facture → Paiement',
        'Bon de commande → Facture → Devis'
      ],
      optionsEn: [
        'Invoice → Quote → Order',
        'Quote → Sales Order → Delivery → Invoice',
        'Delivery → Quote → Invoice → Payment',
        'Order → Invoice → Quote'
      ],
      correctIndex: 1,
      explanation: 'Dans Odoo Ventes : Devis (Quotation) → Bon de commande (Sales Order) → Livraison (Delivery) → Facture (Invoice). La facture peut être générée automatiquement depuis le bon de commande.',
      explanationEn: 'In Odoo Sales: Quotation → Sales Order → Delivery → Invoice. The invoice can be automatically generated from the sales order.',
      system: 'odoo'
    }
  ]
};

// ─── FI ──────────────────────────────────────────────────────
const quizFI: ModuleQuiz = {
  moduleId: 'fi',
  questions: [
    {
      id: 'fi-q1',
      question: 'Lors d\'une réception de marchandises (GR) dans SAP, quelle écriture comptable est générée ?',
      questionEn: 'When a Goods Receipt (GR) occurs in SAP, which accounting entry is generated?',
      options: [
        'Débit Fournisseur / Crédit Banque',
        'Débit Stock / Crédit Compte GR-IR (attente)',
        'Débit Charges / Crédit Stock',
        'Débit Banque / Crédit Client'
      ],
      optionsEn: [
        'Debit Supplier / Credit Bank',
        'Debit Stock / Credit GR-IR Account (clearing)',
        'Debit Expenses / Credit Stock',
        'Debit Bank / Credit Customer'
      ],
      correctIndex: 1,
      explanation: 'Lors du GR : Débit Compte Stock (augmentation) / Crédit Compte GR-IR (Goods Receipt/Invoice Receipt — compte d\'attente). Ce compte est soldé lors de la réception de la facture fournisseur (MIRO).',
      explanationEn: 'On GR: Debit Stock Account (increase) / Credit GR-IR Account (Goods Receipt/Invoice Receipt — clearing account). This account is cleared when the supplier invoice is received (MIRO).',
      system: 'sap'
    },
    {
      id: 'fi-q2',
      question: 'Qu\'est-ce que le principe de la comptabilité en partie double ?',
      questionEn: 'What is the principle of double-entry bookkeeping?',
      options: [
        'Chaque transaction est enregistrée deux fois dans le même compte',
        'Chaque transaction affecte au moins deux comptes : un débit et un crédit de montant égal',
        'Les factures sont toujours enregistrées en double pour vérification',
        'Les paiements nécessitent deux signatures'
      ],
      optionsEn: [
        'Each transaction is recorded twice in the same account',
        'Each transaction affects at least two accounts: a debit and a credit of equal amount',
        'Invoices are always recorded twice for verification',
        'Payments require two signatures'
      ],
      correctIndex: 1,
      explanation: 'La comptabilité en partie double (principe de Luca Pacioli, 1494) : chaque transaction affecte au moins deux comptes avec Débit = Crédit. C\'est le fondement de tous les ERP financiers.',
      explanationEn: 'Double-entry bookkeeping (Luca Pacioli principle, 1494): each transaction affects at least two accounts with Debit = Credit. This is the foundation of all financial ERPs.',
      system: 'general'
    },
    {
      id: 'fi-q3',
      question: 'Dans SAP FI, qu\'est-ce qu\'un "Document Comptable" (Accounting Document) ?',
      questionEn: 'In SAP FI, what is an "Accounting Document"?',
      options: [
        'Un fichier PDF de la facture',
        'L\'enregistrement permanent d\'une transaction avec numéro unique, date et lignes débit/crédit',
        'Un rapport mensuel de comptabilité',
        'Un contrat avec un fournisseur'
      ],
      optionsEn: [
        'A PDF file of the invoice',
        'The permanent record of a transaction with unique number, date and debit/credit lines',
        'A monthly accounting report',
        'A contract with a supplier'
      ],
      correctIndex: 1,
      explanation: 'Un Document Comptable SAP FI est l\'enregistrement immuable d\'une transaction : numéro de document unique, date de comptabilisation, société, et lignes d\'écriture (débit/crédit par compte GL).',
      explanationEn: 'A SAP FI Accounting Document is the immutable record of a transaction: unique document number, posting date, company code, and posting lines (debit/credit by GL account).',
      system: 'sap'
    },
    {
      id: 'fi-q4',
      question: 'Lors d\'une vente (Goods Issue SD), quelle écriture comptable est générée ?',
      questionEn: 'During a sale (Goods Issue SD), which accounting entry is generated?',
      options: [
        'Débit Client / Crédit Ventes',
        'Débit COGS (Coût des marchandises vendues) / Crédit Stock',
        'Débit Stock / Crédit Fournisseur',
        'Débit Banque / Crédit Client'
      ],
      optionsEn: [
        'Debit Customer / Credit Sales',
        'Debit COGS (Cost of Goods Sold) / Credit Stock',
        'Debit Stock / Credit Supplier',
        'Debit Bank / Credit Customer'
      ],
      correctIndex: 1,
      explanation: 'Lors du Goods Issue (sortie de stock pour livraison client) : Débit COGS (charge) / Crédit Stock (réduction d\'actif). La facturation génère séparément : Débit Client / Crédit Produit des ventes.',
      explanationEn: 'On Goods Issue (stock exit for customer delivery): Debit COGS (expense) / Credit Stock (asset reduction). Billing separately generates: Debit Customer / Credit Sales Revenue.',
      system: 'general'
    },
    {
      id: 'fi-q5',
      question: 'Dans Dynamics 365 Finance, comment s\'appelle l\'équivalent du Grand Livre SAP (General Ledger) ?',
      questionEn: 'In Dynamics 365 Finance, what is the equivalent of SAP General Ledger called?',
      options: [
        'Main Account',
        'General Ledger',
        'Chart of Accounts',
        'Financial Journal'
      ],
      optionsEn: [
        'Main Account',
        'General Ledger',
        'Chart of Accounts',
        'Financial Journal'
      ],
      correctIndex: 1,
      explanation: 'Dans Dynamics 365 Finance, le module "General Ledger" (Grand Livre) contient le plan comptable (Chart of Accounts), les journaux (Journals) et les états financiers. Terminologie identique à SAP.',
      explanationEn: 'In Dynamics 365 Finance, the "General Ledger" module contains the Chart of Accounts, Journals and financial statements. Terminology identical to SAP.',
      system: 'dynamics'
    }
  ]
};

// ─── ERP-SIM ─────────────────────────────────────────────────
const quizERPSIM: ModuleQuiz = {
  moduleId: 'erp-sim',
  questions: [
    {
      id: 'sim-q1',
      question: 'Dans une simulation ERP intégrée, quel module est déclenché EN PREMIER lors d\'une commande client ?',
      questionEn: 'In an integrated ERP simulation, which module is triggered FIRST when a customer order is placed?',
      options: [
        'FI (Financial Integration)',
        'MM (Materials Management)',
        'SD (Sales & Distribution)',
        'ERP-ARCH'
      ],
      optionsEn: [
        'FI (Financial Integration)',
        'MM (Materials Management)',
        'SD (Sales & Distribution)',
        'ERP-ARCH'
      ],
      correctIndex: 2,
      explanation: 'Le cycle O2C commence dans SD avec la création du Sales Order. SD vérifie ensuite le stock (MM), génère la livraison et le Goods Issue, puis crée la facture qui déclenche les écritures FI.',
      explanationEn: 'The O2C cycle starts in SD with Sales Order creation. SD then checks stock (MM), generates delivery and Goods Issue, then creates the invoice which triggers FI entries.',
      system: 'general'
    },
    {
      id: 'sim-q2',
      question: 'Comment les modules MM et FI sont-ils intégrés dans SAP S/4HANA ?',
      questionEn: 'How are MM and FI modules integrated in SAP S/4HANA?',
      options: [
        'Ils ne sont pas intégrés, chaque module fonctionne indépendamment',
        'Chaque mouvement de stock MM génère automatiquement des écritures comptables FI',
        'FI doit saisir manuellement les données de MM',
        'L\'intégration nécessite un middleware externe'
      ],
      optionsEn: [
        'They are not integrated, each module works independently',
        'Every MM stock movement automatically generates FI accounting entries',
        'FI must manually enter MM data',
        'Integration requires external middleware'
      ],
      correctIndex: 1,
      explanation: 'Dans SAP S/4HANA, MM et FI sont nativement intégrés. Chaque GR (mouvement 101) génère automatiquement un document comptable FI. Chaque GI (mouvement 601) génère une écriture COGS. Aucune saisie manuelle.',
      explanationEn: 'In SAP S/4HANA, MM and FI are natively integrated. Every GR (movement 101) automatically generates an FI accounting document. Every GI (movement 601) generates a COGS entry. No manual entry.',
      system: 'sap'
    },
    {
      id: 'sim-q3',
      question: 'Qu\'est-ce que le "Three-Way Match" dans le processus P2P ?',
      questionEn: 'What is "Three-Way Match" in the P2P process?',
      options: [
        'La comparaison entre 3 fournisseurs concurrents',
        'La vérification que PO, GR et Facture correspondent en quantité et montant',
        'L\'approbation par 3 niveaux hiérarchiques',
        'La réconciliation de 3 comptes bancaires'
      ],
      optionsEn: [
        'Comparison between 3 competing suppliers',
        'Verification that PO, GR and Invoice match in quantity and amount',
        'Approval by 3 hierarchical levels',
        'Reconciliation of 3 bank accounts'
      ],
      correctIndex: 1,
      explanation: 'Le Three-Way Match est un contrôle de conformité : PO (commande) = GR (réception) = Invoice (facture). SAP MIRO effectue ce contrôle automatiquement. Toute divergence bloque le paiement.',
      explanationEn: 'Three-Way Match is a compliance check: PO (order) = GR (receipt) = Invoice. SAP MIRO performs this check automatically. Any discrepancy blocks payment.',
      system: 'general'
    },
    {
      id: 'sim-q4',
      question: 'Dans une simulation intégrée, quel est l\'impact d\'un Sales Order sur le module MM ?',
      questionEn: 'In an integrated simulation, what is the impact of a Sales Order on the MM module?',
      options: [
        'Aucun impact sur MM',
        'Il crée automatiquement une Purchase Requisition si le stock est insuffisant',
        'Il bloque tous les achats MM',
        'Il crée un fournisseur automatiquement'
      ],
      optionsEn: [
        'No impact on MM',
        'It automatically creates a Purchase Requisition if stock is insufficient',
        'It blocks all MM purchases',
        'It automatically creates a supplier'
      ],
      correctIndex: 1,
      explanation: 'Dans SAP MRP (Material Requirements Planning), un Sales Order peut déclencher automatiquement une Purchase Requisition MM si le stock disponible est insuffisant pour satisfaire la demande client.',
      explanationEn: 'In SAP MRP (Material Requirements Planning), a Sales Order can automatically trigger an MM Purchase Requisition if available stock is insufficient to meet customer demand.',
      system: 'sap'
    },
    {
      id: 'sim-q5',
      question: 'Quel est le principal avantage de simuler un cycle ERP complet (P2P + O2C + FI) ?',
      questionEn: 'What is the main advantage of simulating a complete ERP cycle (P2P + O2C + FI)?',
      options: [
        'Cela permet d\'éviter d\'apprendre les T-codes SAP',
        'Cela montre comment chaque transaction dans un module impacte les autres modules en temps réel',
        'Cela remplace la formation pratique sur un vrai système ERP',
        'Cela simplifie la comptabilité en éliminant les écritures'
      ],
      optionsEn: [
        'It allows avoiding learning SAP T-codes',
        'It shows how each transaction in one module impacts other modules in real time',
        'It replaces hands-on training on a real ERP system',
        'It simplifies accounting by eliminating entries'
      ],
      correctIndex: 1,
      explanation: 'La simulation intégrée démontre l\'interdépendance des modules ERP : un GR MM génère des écritures FI, un SO SD consomme du stock MM et génère du chiffre d\'affaires FI. C\'est l\'essence de l\'ERP.',
      explanationEn: 'Integrated simulation demonstrates ERP module interdependence: an MM GR generates FI entries, an SD SO consumes MM stock and generates FI revenue. This is the essence of ERP.',
      system: 'general'
    }
  ]
};

// ─── All quizzes ─────────────────────────────────────────────
export const ALL_QUIZZES: ModuleQuiz[] = [
  quizERPARCH,
  quizMM,
  quizSD,
  quizFI,
  quizERPSIM
];

export const getQuizByModuleId = (moduleId: string): ModuleQuiz | undefined =>
  ALL_QUIZZES.find(q => q.moduleId === moduleId);
