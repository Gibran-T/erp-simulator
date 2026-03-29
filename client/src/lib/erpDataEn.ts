// ============================================================
// ERP Integrated Business Simulator — English Translations Overlay
// All content translations keyed by ID
// Applied at runtime when lang === 'en'
// ============================================================

// ---- MODULE-LEVEL TRANSLATIONS ----
export const moduleTranslationsEn: Record<string, {
  fullName?: string;
  process?: string;
  description?: string;
}> = {
  'erp-arch': {
    fullName: 'ERP Architecture & Digital Transformation',
    description: 'Understand ERP modular architecture and enterprise digital transformation. Comparison of SAP S/4HANA, Microsoft Dynamics 365, and Odoo.',
  },
  'mm': {
    fullName: 'MM — Materials Management',
    process: 'Procure-to-Pay (P2P)',
    description: 'Master the complete Procure-to-Pay cycle: from purchase requisition to vendor payment. Transactions simulated in SAP S/4HANA, Dynamics 365, and Odoo.',
  },
  'sd': {
    fullName: 'SD — Sales & Distribution',
    process: 'Order-to-Cash (O2C)',
    description: 'Master the complete Order-to-Cash cycle: from customer order to cash collection. Transactions simulated in SAP S/4HANA, Dynamics 365, and Odoo.',
  },
  'fi': {
    fullName: 'FI — Financial Accounting',
    process: 'Financial Accounting & Reporting',
    description: 'Understand financial accounting in ERP: general ledger, accounts payable/receivable, and financial reporting across SAP, Dynamics 365, and Odoo.',
  },
  'erp-sim': {
    fullName: 'ERP-SIM — Integrated Business Simulation',
    process: 'End-to-End P2P + O2C + FI',
    description: 'Integrated simulation combining P2P, O2C, and FI processes. Execute a complete business cycle from procurement to customer payment in a single scenario.',
  },
};

// ---- SCENARIO-LEVEL TRANSLATIONS ----
export const scenarioTranslationsEn: Record<string, {
  title?: string;
  description?: string;
  difficultyEn?: 'Beginner' | 'Intermediate' | 'Advanced';
  learningObjective?: string;
}> = {
  // ERP-ARCH
  'erp-arch-01': {
    title: 'Identify ERP Modules',
    description: 'Identify the correct ERP module for each business function at Distribution Montréal.',
    difficultyEn: 'Beginner',
    learningObjective: 'Map business functions to their corresponding ERP modules in SAP, Dynamics 365, and Odoo.',
  },
  'erp-arch-02': {
    title: 'Map Departmental Flows',
    description: 'Map the information flows between departments and identify the ERP modules that support each flow.',
    difficultyEn: 'Intermediate',
    learningObjective: 'Understand how ERP modules communicate and share data across departments.',
  },
  'erp-arch-03': {
    title: 'Justify an ERP Migration',
    description: 'Analyze the problems caused by isolated systems and justify the migration to an integrated ERP.',
    difficultyEn: 'Intermediate',
    learningObjective: 'Articulate the business case for ERP integration versus siloed systems.',
  },
  // MM
  'mm-01': {
    title: 'Standard Procurement Cycle',
    description: 'Execute the complete Procure-to-Pay cycle for the purchase of 100 units of PROD-001 from vendor FOURNISSEUR-MTL.',
    difficultyEn: 'Beginner',
    learningObjective: 'Execute all 5 steps of the P2P cycle end-to-end in a real business context.',
  },
  'mm-02': {
    title: 'Late Goods Receipt',
    description: 'Manage a scenario where the vendor delivery arrives 15 days late, causing a stock shortage.',
    difficultyEn: 'Intermediate',
    learningObjective: 'Handle exceptions in the P2P cycle: delivery delays, vendor follow-up, and production impact.',
  },
  'mm-03': {
    title: 'Invoice Discrepancy',
    description: 'Detect and resolve a price discrepancy between the purchase order and the vendor invoice.',
    difficultyEn: 'Intermediate',
    learningObjective: 'Apply the 3-way match (PO + GR + Invoice) to detect and resolve billing errors.',
  },
  'mm-04': {
    title: 'Emergency Purchase',
    description: 'Process an urgent purchase order bypassing the standard approval workflow.',
    difficultyEn: 'Advanced',
    learningObjective: 'Understand exception workflows and their accounting and audit implications.',
  },
  // SD
  'sd-01': {
    title: 'Standard Sales Cycle',
    description: 'Execute the complete Order-to-Cash cycle for a customer order of 50 units of PROD-001.',
    difficultyEn: 'Beginner',
    learningObjective: 'Execute all 5 steps of the O2C cycle end-to-end in a real business context.',
  },
  'sd-02': {
    title: 'Customer Credit Check',
    description: 'Process a sales order that triggers a credit limit block and resolve it.',
    difficultyEn: 'Intermediate',
    learningObjective: 'Understand credit management in ERP and the impact of credit blocks on order processing.',
  },
  'sd-03': {
    title: 'Partial Delivery',
    description: 'Manage a sales order with partial delivery due to insufficient stock.',
    difficultyEn: 'Intermediate',
    learningObjective: 'Handle partial fulfillment scenarios and their impact on customer invoicing.',
  },
  'sd-04': {
    title: 'Sales Return',
    description: 'Process a customer return and credit note for defective goods.',
    difficultyEn: 'Advanced',
    learningObjective: 'Execute the reverse O2C process: returns, credit notes, and stock adjustments.',
  },
  // FI
  'fi-01': {
    title: 'General Ledger Posting',
    description: 'Post manual journal entries to the general ledger and verify account balances.',
    difficultyEn: 'Beginner',
    learningObjective: 'Understand double-entry bookkeeping and how ERP automates journal entries.',
  },
  'fi-02': {
    title: 'Month-End Closing',
    description: 'Execute the month-end closing process: accruals, reconciliation, and financial statements.',
    difficultyEn: 'Advanced',
    learningObjective: 'Apply month-end closing procedures and understand their impact on financial reporting.',
  },
  'fi-03': {
    title: 'Financial Reporting',
    description: 'Generate and analyze the balance sheet, income statement, and cash flow report.',
    difficultyEn: 'Intermediate',
    learningObjective: 'Read and interpret ERP-generated financial statements and identify key indicators.',
  },
  // ERP-SIM
  'erp-sim-01': {
    title: 'Integrated P2P + O2C Simulation',
    description: 'Execute a complete business cycle: purchase raw materials (P2P), manufacture, and sell to a customer (O2C).',
    difficultyEn: 'Advanced',
    learningObjective: 'Demonstrate end-to-end ERP integration: how a purchase triggers accounting, stock, and sales processes simultaneously.',
  },
  'erp-sim-02': {
    title: 'Financial Close Simulation',
    description: 'Close the accounting period after the integrated P2P + O2C cycle and generate financial statements.',
    difficultyEn: 'Advanced',
    learningObjective: 'Connect operational transactions (P2P, O2C) to their financial reporting outcomes.',
  },
};

// ---- STEP-LEVEL TRANSLATIONS ----
export const stepTranslationsEn: Record<string, {
  name?: string;
  objective?: string;
  validationMessage?: string;
  errorMessage?: string;
  erpImpact?: {
    stockChange?: string;
    accountingEntry?: string;
    documentCreated?: string;
    documentStatus?: string;
    note?: string;
  };
}> = {
  // MM-01 Steps
  'mm-01-s1': {
    name: 'Create Purchase Requisition (PR)',
    objective: 'Create a purchase requisition for 100 units of PROD-001',
    validationMessage: '✅ Purchase Requisition PR-2026-001 created successfully! SAP: ME51N executed. Dynamics: Requisition submitted. Odoo: Request created. Status: Pending approval.',
    errorMessage: '❌ Check the item code (PROD-001), quantity (100), and cost center (CC-ENTREPOT).',
    erpImpact: {
      documentCreated: 'Purchase Requisition PR-2026-001',
      documentStatus: 'Pending approval',
      note: 'The PR does not create any financial commitment — it is an internal request. In all 3 systems, it triggers an approval workflow before becoming a purchase order.',
    },
  },
  'mm-01-s2': {
    name: 'Create Purchase Order (PO)',
    objective: 'Convert the approved PR into a vendor purchase order',
    validationMessage: '✅ Purchase Order PO-2026-001 created! Total amount: CAD 2,500.00. SAP: ME21N. Dynamics: PO confirmed. Odoo: PO sent to vendor FOURNISSEUR-MTL.',
    errorMessage: '❌ Check the vendor (FOURNISSEUR-MTL), price (25.00 CAD), and payment terms (Net 30 days).',
    erpImpact: {
      documentCreated: 'Purchase Order PO-2026-001 — 100 × PROD-001 @ CAD 25.00',
      documentStatus: 'Open — Sent to vendor FOURNISSEUR-MTL',
      note: 'The PO commits the company to CAD 2,500. FI records a budget commitment. This is a legal obligation to the vendor.',
    },
  },
  'mm-01-s3': {
    name: 'Record Goods Receipt (GR)',
    objective: 'Record the physical receipt of the 100 ordered units',
    validationMessage: '✅ Goods Receipt GR-2026-001 recorded! Stock updated: +100 units PROD-001. Accounting entry automatically generated in FI. SAP: MIGO Movement 101 executed.',
    errorMessage: '❌ Check the received quantity (100) and the delivery note number.',
    erpImpact: {
      stockChange: '+100 units PROD-001 → ZONE-A1',
      accountingEntry: 'Dr Inventory 2,500 CAD / Cr GR/IR Clearing Account 2,500 CAD',
      documentCreated: 'Material Document GR-2026-001',
      documentStatus: 'PO: Delivered — Receipt recorded',
      note: '🔑 GR-IR Key Concept: When goods are received, stock increases but the vendor is NOT yet paid. The GR/IR Clearing Account is a temporary "bridge" account. It will be cleared when the invoice arrives (MIRO). This is the MM→FI integration in action.',
    },
  },
  'mm-01-s4': {
    name: 'Verify Vendor Invoice (IV)',
    objective: '3-way match: PO + GR + Vendor Invoice',
    validationMessage: '✅ Invoice IV-2026-001 verified and approved! 3-way match successful: PO 2,500.00 = GR 2,500.00 = Invoice 2,500.00. Ready for payment.',
    errorMessage: '❌ Discrepancy detected! The amount must match the PO (CAD 2,500.00 = 100 units × CAD 25.00). Check the invoice.',
    erpImpact: {
      accountingEntry: 'Dr GR/IR Clearing Account 2,500 CAD / Cr Vendor FOURNISSEUR-MTL 2,500 CAD',
      documentCreated: 'Accounting Document IV-2026-001',
      documentStatus: 'Invoice approved — Payment due in 30 days',
      note: '🔑 GR-IR Cleared: The GR/IR Clearing Account (bridge) is now zeroed out. The vendor liability now appears in FI. The 3-way match (PO + GR + Invoice) is the core control that prevents overpayment.',
    },
  },
  'mm-01-s5': {
    name: 'Record Vendor Payment',
    objective: 'Process the vendor payment at the due date',
    validationMessage: '✅ Payment PAY-2026-001 recorded! CAD 2,500.00 transferred to FOURNISSEUR-MTL. P2P cycle completed successfully! Score: 100/100. Final accounting entry generated in FI.',
    errorMessage: '❌ Check the amount (CAD 2,500.00) and payment method (Bank Transfer).',
    erpImpact: {
      accountingEntry: 'Dr Vendor FOURNISSEUR-MTL 2,500 CAD / Cr Bank 2,500 CAD',
      documentCreated: 'Payment Document PAY-2026-001',
      documentStatus: 'P2P Cycle Complete',
      note: 'P2P cycle complete. In all 3 systems, payment clears the vendor liability and updates cash automatically. Net result: Inventory +2,500 CAD, Bank -2,500 CAD, Vendor = 0.',
    },
  },
  // MM-02 Steps
  'mm-02-s1': {
    name: 'Identify Delivery Delay',
    objective: 'Detect and document the vendor delay',
    validationMessage: '✅ Delay identified: 15 days. Stock shortage risk detected. Alert generated in ERP. Action required: vendor follow-up.',
    errorMessage: '❌ Check the number of delay days (15) and the impact (Imminent stock shortage).',
  },
  'mm-02-s2': {
    name: 'Send Vendor Follow-Up',
    objective: 'Document the follow-up and obtain a new delivery date',
    validationMessage: '✅ Follow-up sent. New date confirmed. Contractual penalty documented. PO updated with new date in ERP.',
    errorMessage: '❌ Confirm the new delivery date and check the contractual penalty clauses.',
  },
  'mm-02-s3': {
    name: 'Evaluate Vendor Performance',
    objective: 'Update the vendor performance scorecard',
    validationMessage: '✅ Vendor performance updated. Score recorded. Procurement team notified.',
    errorMessage: '❌ Check the delivery performance score and the recommended action.',
  },
  // MM-03 Steps
  'mm-03-s1': {
    name: 'Detect Invoice Discrepancy',
    objective: 'Compare the vendor invoice against the purchase order',
    validationMessage: '✅ Discrepancy detected: invoice amount does not match PO. 3-way match failed. Invoice blocked for payment.',
    errorMessage: '❌ Check the discrepancy amount and the blocking reason.',
  },
  'mm-03-s2': {
    name: 'Contact Vendor for Correction',
    objective: 'Request a corrected invoice from the vendor',
    validationMessage: '✅ Vendor contacted. Correction request sent. Invoice on hold pending revised document.',
    errorMessage: '❌ Confirm the contact method and the correction requested.',
  },
  'mm-03-s3': {
    name: 'Approve Corrected Invoice',
    objective: 'Validate the corrected invoice and release for payment',
    validationMessage: '✅ Corrected invoice approved. 3-way match successful. Released for payment.',
    errorMessage: '❌ The corrected amount must match the PO exactly.',
  },
  // SD-01 Steps
  'sd-01-s1': {
    name: 'Create Sales Order (SO)',
    objective: 'Create a customer sales order for 50 units of PROD-001',
    validationMessage: '✅ Sales Order SO-2026-001 created! SAP: VA01 executed. Dynamics: Sales Order confirmed. Odoo: Customer order created. ATP check: Stock available.',
    errorMessage: '❌ Check the customer (CLIENT-MTL), product (PROD-001), quantity (50), and unit price (45.00 CAD).',
    erpImpact: {
      documentCreated: 'Sales Order SO-2026-001 — 50 × PROD-001 @ CAD 45.00',
      documentStatus: 'Open — Pending delivery',
      note: 'The SO triggers an ATP (Available-to-Promise) check. If stock is available, the order is confirmed. The same logic applies in SAP (VA01), Dynamics 365 (Sales Order), and Odoo (Customer Order).',
    },
  },
  'sd-01-s2': {
    name: 'Create Delivery Order',
    objective: 'Create the outbound delivery document for the sales order',
    validationMessage: '✅ Delivery Order DO-2026-001 created! Warehouse notified. Picking list generated. SAP: VL01N. Dynamics: Shipment created. Odoo: Delivery order created.',
    errorMessage: '❌ Check the shipping warehouse (ENTREPOT-MTL) and the requested delivery date.',
    erpImpact: {
      documentCreated: 'Delivery Order DO-2026-001',
      documentStatus: 'Picking in progress',
      note: 'The delivery order triggers warehouse operations: pick, pack, and ship. Stock is reserved but NOT yet reduced — that happens at Post Goods Issue (PGI).',
    },
  },
  'sd-01-s3': {
    name: 'Post Goods Issue (PGI)',
    objective: 'Confirm physical shipment and reduce inventory',
    validationMessage: '✅ Goods Issue posted! Stock reduced: -50 units PROD-001. Accounting entry generated in FI. SAP: VL02N (PGI). Dynamics: Shipment confirmed. Odoo: Delivery validated.',
    errorMessage: '❌ Check the shipped quantity (50) and the carrier (TRANSPORTEUR-EXPRESS).',
    erpImpact: {
      stockChange: '-50 units PROD-001 (shipped to CLIENT-MTL)',
      accountingEntry: 'Dr Cost of Goods Sold 1,250 CAD / Cr Inventory 1,250 CAD',
      documentCreated: 'Goods Issue Document GI-2026-001',
      documentStatus: 'Shipped — In transit',
      note: 'PGI is the moment stock physically leaves the warehouse. This triggers the SD→FI integration: COGS is recorded automatically. The same logic applies in all 3 ERP systems.',
    },
  },
  'sd-01-s4': {
    name: 'Create Customer Invoice',
    objective: 'Generate and send the customer invoice',
    validationMessage: '✅ Invoice INV-2026-001 created! Amount: CAD 2,250.00 (50 × 45.00). SAP: VF01. Dynamics: Customer Invoice. Odoo: Customer Invoice. Revenue recognized.',
    errorMessage: '❌ Check the invoice amount (CAD 2,250.00 = 50 × 45.00) and the payment terms.',
    erpImpact: {
      accountingEntry: 'Dr Accounts Receivable CLIENT-MTL 2,250 CAD / Cr Revenue 2,250 CAD',
      documentCreated: 'Customer Invoice INV-2026-001',
      documentStatus: 'Sent — Payment due in 30 days',
      note: 'Revenue is recognized at invoicing. The customer now owes CAD 2,250. This entry is automatic in all 3 ERP systems — no manual posting required.',
    },
  },
  'sd-01-s5': {
    name: 'Record Customer Payment',
    objective: 'Apply the customer payment to the open invoice',
    validationMessage: '✅ Payment REC-2026-001 recorded! CAD 2,250.00 received from CLIENT-MTL. O2C cycle completed! Invoice cleared. Cash updated.',
    errorMessage: '❌ Check the payment amount (CAD 2,250.00) and the bank account.',
    erpImpact: {
      accountingEntry: 'Dr Bank 2,250 CAD / Cr Accounts Receivable CLIENT-MTL 2,250 CAD',
      documentCreated: 'Payment Receipt REC-2026-001',
      documentStatus: 'O2C Cycle Complete',
      note: 'O2C cycle complete. Net result: Inventory -50 units, Revenue +2,250 CAD, Cash +2,250 CAD, Accounts Receivable = 0. The same financial outcome in SAP, Dynamics 365, and Odoo.',
    },
  },
  // FI-01 Steps
  'fi-01-s1': {
    name: 'Identify Accounts to Post',
    objective: 'Determine the correct debit and credit accounts for the transaction',
    validationMessage: '✅ Correct! Debit: Expense account. Credit: Bank account. Double-entry principle respected.',
    errorMessage: '❌ Remember: every transaction has a debit AND a credit. What increases? What decreases?',
    erpImpact: {
      note: '🔑 Double-Entry Rule: Every transaction affects at least 2 accounts. Assets increase with Debit. Liabilities and Equity increase with Credit. The equation always balances: Assets = Liabilities + Equity.',
    },
  },
  'fi-01-s2': {
    name: 'Post Journal Entry',
    objective: 'Enter the journal entry in the general ledger',
    validationMessage: '✅ Journal entry posted successfully! Debit = Credit. General ledger updated. SAP: FB50. Dynamics: Journal Entry. Odoo: Journal Entry.',
    errorMessage: '❌ Debit must equal Credit. Check your amounts.',
    erpImpact: {
      accountingEntry: 'Posted to General Ledger',
      documentStatus: 'Posted',
      note: 'In ERP, most journal entries are posted automatically by operational transactions (MIGO, VF01, etc.). Manual journal entries (FB50 in SAP) are used for adjustments and accruals.',
    },
  },
  'fi-01-s3': {
    name: 'Verify Account Balance',
    objective: 'Confirm the account balance reflects the posted entry',
    validationMessage: '✅ Balance verified. Account updated correctly. Audit trail complete.',
    errorMessage: '❌ The balance should reflect the posted entry. Check the account number.',
    erpImpact: {
      note: 'SAP: FS10N (Account balance). Dynamics 365: General Ledger > Account Inquiries. Odoo: Accounting > Chart of Accounts. All 3 systems provide real-time balance visibility.',
    },
  },
  // ERP-SIM-01 Steps
  'erp-sim-01-s1': {
    name: 'Create Purchase Order (P2P Start)',
    objective: 'Initiate the integrated cycle with a vendor purchase order',
    validationMessage: '✅ PO created. P2P cycle initiated. This purchase will flow through GR, Invoice, and Payment — all automatically linked.',
    errorMessage: '❌ Check vendor, quantity, and price.',
    erpImpact: {
      documentCreated: 'Purchase Order — P2P initiated',
      note: 'This PO starts a chain reaction: GR will update stock, MIRO will create vendor liability, F-53 will clear it. The same chain exists in Dynamics 365 and Odoo.',
    },
  },
  'erp-sim-01-s2': {
    name: 'Record Goods Receipt',
    objective: 'Receive the purchased goods and update inventory',
    validationMessage: '✅ GR posted. Stock increased. GR/IR Clearing Account credited. MM→FI integration confirmed.',
    errorMessage: '❌ Check quantity and storage location.',
    erpImpact: {
      accountingEntry: 'Dr Inventory / Cr GR/IR Clearing',
      note: 'GR/IR Clearing Account is the bridge between MM and FI. It will be cleared when the invoice is posted.',
    },
  },
  'erp-sim-01-s3': {
    name: 'Create Sales Order (O2C Start)',
    objective: 'Accept a customer order for the purchased goods',
    validationMessage: '✅ Sales Order created. ATP check passed. O2C cycle initiated.',
    errorMessage: '❌ Check customer, product, and quantity.',
    erpImpact: {
      note: 'The same goods purchased in P2P are now being sold in O2C. This is the integrated business cycle: buy → stock → sell.',
    },
  },
  'erp-sim-01-s4': {
    name: 'Post Goods Issue (Ship to Customer)',
    objective: 'Ship the goods and reduce inventory',
    validationMessage: '✅ PGI posted. Stock reduced. COGS recorded. SD→FI integration confirmed.',
    errorMessage: '❌ Check shipped quantity.',
    erpImpact: {
      accountingEntry: 'Dr COGS / Cr Inventory',
      note: 'Stock purchased in P2P is now leaving in O2C. The integrated ERP tracks this seamlessly — no manual reconciliation needed.',
    },
  },
  'erp-sim-01-s5': {
    name: 'Post Vendor Invoice',
    objective: 'Verify and post the vendor invoice (3-way match)',
    validationMessage: '✅ Vendor invoice posted. GR/IR Clearing Account cleared. Vendor liability recorded.',
    errorMessage: '❌ Amount must match PO and GR.',
    erpImpact: {
      accountingEntry: 'Dr GR/IR Clearing / Cr Accounts Payable',
      note: 'GR/IR Clearing Account is now zero. The 3-way match (PO + GR + Invoice) is complete.',
    },
  },
  'erp-sim-01-s6': {
    name: 'Create Customer Invoice',
    objective: 'Invoice the customer for the delivered goods',
    validationMessage: '✅ Customer invoice created. Revenue recognized. Accounts Receivable updated.',
    errorMessage: '❌ Check invoice amount.',
    erpImpact: {
      accountingEntry: 'Dr Accounts Receivable / Cr Revenue',
      note: 'Revenue is recognized. The O2C financial cycle is nearly complete.',
    },
  },
  'erp-sim-01-s7': {
    name: 'Reconcile P2P + O2C Results',
    objective: 'Verify the net financial impact of the integrated cycle',
    validationMessage: '✅ Integrated cycle complete! P2P cost: -CAD 2,500. O2C revenue: +CAD 2,250. Gross margin: -CAD 250 (cost > revenue — review pricing).',
    errorMessage: '❌ Check the net margin calculation.',
    erpImpact: {
      note: 'This is the power of integrated ERP: one screen shows the complete P2P + O2C financial result. No spreadsheets, no manual reconciliation.',
    },
  },
};

// ---- FIELD-LEVEL TRANSLATIONS ----
export const fieldTranslationsEn: Record<string, {
  label?: string;
  placeholder?: string;
  hint?: string;
  optionsEn?: string[];
}> = {
  // MM-01 fields
  'article': { label: 'Item Code', placeholder: 'e.g., PROD-001', hint: 'Code of the item to order' },
  'quantite': { label: 'Requested Quantity', placeholder: 'e.g., 100', hint: 'Required quantity based on the need' },
  'date_requise': { label: 'Required Date', hint: 'Date by which the goods are needed' },
  'centre_cout': {
    label: 'Cost Center',
    hint: 'Department bearing the cost',
    // ERP system codes — keep original codes (not translated), same in FR and EN
    optionsEn: ['CC-ENTREPOT', 'CC-PRODUCTION', 'CC-ADMIN', 'CC-VENTES'],
  },
  'fournisseur': {
    label: 'Vendor',
    hint: 'Select the approved vendor',
    // ERP vendor codes — keep original codes (not translated)
    optionsEn: ['FOURNISSEUR-MTL', 'FOURNISSEUR-QC', 'FOURNISSEUR-ON', 'FOURNISSEUR-BC'],
  },
  'prix_unitaire': { label: 'Unit Price (CAD)', placeholder: 'e.g., 25.00', hint: 'Price negotiated with the vendor' },
  'conditions_paiement': {
    label: 'Payment Terms',
    hint: 'Agreed payment deadline',
    optionsEn: ['Net 30 days', 'Net 60 days', 'Net 90 days', '2/10 Net 30'],
  },
  'date_livraison': { label: 'Requested Delivery Date', hint: 'Expected delivery date' },
  'quantite_recue': { label: 'Received Quantity', placeholder: 'e.g., 100', hint: 'Quantity physically received and verified' },
  'numero_bl': { label: 'Delivery Note Number', placeholder: 'e.g., BL-FMTL-2026-001', hint: 'Number on the vendor delivery document' },
  'emplacement': {
    label: 'Storage Location',
    hint: 'Where goods are stored in the warehouse',
    optionsEn: ['ZONE-A1', 'ZONE-B2', 'ZONE-C3', 'ZONE-RECEPTION'],
  },
  'numero_facture': { label: 'Vendor Invoice Number', placeholder: 'e.g., FAC-FMTL-2026-001', hint: 'Number on the invoice received from the vendor' },
  'montant_facture': { label: 'Invoice Amount (CAD)', placeholder: 'e.g., 2500.00', hint: 'Must match PO: 100 × 25.00 = 2,500.00' },
  'date_facture': { label: 'Invoice Date', hint: 'Date shown on the vendor invoice' },
  'mode_paiement': {
    label: 'Payment Method',
    hint: 'Standard payment method for B2B vendors',
    optionsEn: ['Bank Transfer (EFT)', 'Cheque', 'Corporate Credit Card', 'Letter of Credit'],
  },
  'montant_paiement': { label: 'Payment Amount (CAD)', placeholder: 'e.g., 2500.00', hint: 'Total amount of the approved invoice' },
  'date_paiement': { label: 'Payment Date', hint: 'Must respect Net 30 days terms' },
  // SD-01 fields
  'client': { label: 'Customer', hint: 'Select the customer placing the order' },
  'produit': { label: 'Product', hint: 'Product being ordered' },
  'quantite_commande': { label: 'Order Quantity', placeholder: 'e.g., 50', hint: 'Quantity ordered by the customer' },
  'prix_vente': { label: 'Unit Selling Price (CAD)', placeholder: 'e.g., 45.00', hint: 'Price agreed with the customer' },
  'entrepot': { label: 'Shipping Warehouse', hint: 'Warehouse from which goods will be shipped' },
  'date_expedition': { label: 'Requested Shipment Date', hint: 'Date customer expects delivery' },
  'quantite_expediee': { label: 'Shipped Quantity', placeholder: 'e.g., 50', hint: 'Quantity physically shipped' },
  'transporteur': { label: 'Carrier', hint: 'Logistics company handling the shipment' },
  'montant_facture_client': { label: 'Invoice Amount (CAD)', placeholder: 'e.g., 2250.00', hint: 'Must match SO: 50 × 45.00 = 2,250.00' },
  'conditions_paiement_client': {
    label: 'Payment Terms',
    hint: 'Payment deadline agreed with the customer',
    optionsEn: ['Net 30 days', 'Net 60 days', 'Net 90 days', 'Immediate'],
  },
  'montant_recu': { label: 'Amount Received (CAD)', placeholder: 'e.g., 2250.00', hint: 'Amount received from the customer' },
  'compte_bancaire': { label: 'Bank Account', hint: 'Company bank account receiving the payment' },
  // FI-01 fields
  'compte_debit': { label: 'Debit Account', hint: 'Account that increases (assets, expenses)' },
  'compte_credit': { label: 'Credit Account', hint: 'Account that decreases or liability that increases' },
  'montant': { label: 'Amount (CAD)', hint: 'Transaction amount — must be identical for debit and credit' },
  'description': { label: 'Description', hint: 'Brief description of the transaction purpose' },
  // Common fields
  'jours_retard': { label: 'Number of Delay Days', placeholder: 'e.g., 15', hint: 'Calculated between expected and actual date' },
  'impact': {
    label: 'Operational Impact',
    hint: 'Assess the business impact of the delay',
    optionsEn: ['No impact', 'Imminent stock shortage', 'Production stoppage', 'Potential customer loss'],
  },
  'nouvelle_date': { label: 'New Confirmed Delivery Date', hint: 'Date confirmed by vendor after follow-up' },
  'penalite': {
    label: 'Late Penalty Applicable?',
    hint: 'Check contractual terms',
    optionsEn: ['Yes — per contract', 'No — first delay', 'To be negotiated', 'No contractual clause'],
  },
  'note_livraison': { label: 'Delivery Performance Score (1-10)', hint: 'Rate the vendor delivery reliability' },
  'action_recommandee': {
    label: 'Recommended Action',
    hint: 'What action should procurement take?',
    optionsEn: ['Maintain vendor — monitor closely', 'Issue formal warning', 'Diversify supply sources', 'Terminate contract'],
  },
};

// ---- QUIZ TRANSLATIONS ----
export const quizTranslationsEn: Record<string, {
  question?: string;
  optionsEn?: string[];
  explanation?: string;
}> = {
  // ERP-ARCH Quiz
  'arch-q1': {
    question: 'What is the main advantage of an integrated ERP over separate systems?',
    optionsEn: [
      'It is cheaper to purchase',
      'Data is shared in real-time between all departments',
      'It eliminates the need for employees',
      'It works without internet connection'
    ],
    explanation: 'The main advantage of an ERP is real-time data integration: a transaction in one module (e.g., a goods receipt in MM) automatically updates all other modules (stock in MM, accounting in FI). This eliminates manual reconciliation and information silos.',
  },
  'arch-q2': {
    question: 'In SAP S/4HANA, what does the T-code ME21N do?',
    optionsEn: [
      'Record a goods receipt',
      'Create a purchase order',
      'Post a vendor invoice',
      'Process a vendor payment'
    ],
    explanation: 'ME21N is the SAP T-code for creating a Purchase Order (PO). Convention: ME = Materials Management External, 21 = Purchase Order, N = New. In Dynamics 365, this is "Purchase Orders > New". In Odoo, it is "Purchases > Purchase Orders > Create".',
  },
  'arch-q3': {
    question: 'Which module handles the Procure-to-Pay cycle in SAP?',
    optionsEn: ['SD — Sales & Distribution', 'FI — Financial Accounting', 'MM — Materials Management', 'PP — Production Planning'],
    explanation: 'MM (Materials Management) manages the complete Procure-to-Pay cycle: purchase requisitions, purchase orders, goods receipts, invoice verification, and vendor payments. In Dynamics 365, this is "Supply Chain Management". In Odoo, it is the "Purchases" module.',
  },
  'arch-q4': {
    question: 'What does "ERP integration" mean when a goods receipt is posted?',
    optionsEn: [
      'Only the warehouse is notified',
      'Stock and accounting are updated simultaneously and automatically',
      'The vendor receives an automatic payment',
      'A purchase order is automatically created'
    ],
    explanation: 'ERP integration means that one transaction triggers automatic updates in multiple modules. A goods receipt (MIGO in SAP) simultaneously updates: MM (stock +), FI (accounting entry: Dr Inventory / Cr GR/IR Clearing). This is the core value of ERP.',
  },
  'arch-q5': {
    question: 'What differentiates SAP, Dynamics 365, and Odoo for the same P2P process?',
    optionsEn: [
      'The business process is different in each system',
      'Only the interface and terminology differ — the process is identical',
      'SAP does not support purchase orders',
      'Odoo cannot integrate with accounting'
    ],
    explanation: 'This is the core pedagogical message: the P2P process (PR → PO → GR → Invoice → Payment) is universal. What differs is the interface and terminology: SAP uses T-codes (ME21N), Dynamics 365 uses menu navigation, Odoo uses a web interface. Same process, different names.',
  },
  // MM Quiz
  'mm-q1': {
    question: 'What is the correct sequence of the Procure-to-Pay (P2P) cycle?',
    optionsEn: [
      'PO → PR → GR → Invoice → Payment',
      'PR → PO → GR → Invoice → Payment',
      'GR → PO → PR → Invoice → Payment',
      'Invoice → PO → GR → PR → Payment'
    ],
    explanation: 'The P2P sequence is always: PR (internal request) → PO (commitment to vendor) → GR (physical receipt) → Invoice Verification (3-way match) → Payment. This sequence is identical in SAP (ME51N → ME21N → MIGO → MIRO → F-53), Dynamics 365, and Odoo.',
  },
  'mm-q2': {
    question: 'What accounting entry does a Goods Receipt (MIGO in SAP) generate?',
    optionsEn: [
      'Dr Bank / Cr Vendor',
      'Dr Inventory / Cr GR/IR Clearing Account',
      'Dr GR/IR Clearing / Cr Inventory',
      'Dr Vendor / Cr Bank'
    ],
    explanation: 'MIGO generates: Dr Inventory (stock increases) / Cr GR/IR Clearing Account (temporary bridge account). The GR/IR Clearing Account is cleared when the invoice is posted (MIRO). This is the key MM→FI integration point.',
  },
  'mm-q3': {
    question: 'What is the 3-way match in Invoice Verification?',
    optionsEn: [
      'Matching 3 vendors for the same product',
      'Comparing PO + GR + Vendor Invoice to validate payment',
      'Verifying 3 bank accounts before payment',
      'Checking 3 approval levels before creating a PO'
    ],
    explanation: 'The 3-way match compares: PO (what was ordered) + GR (what was received) + Invoice (what the vendor is charging). If all 3 match, the invoice is approved for payment. This is the primary control against overpayment and fraud.',
  },
  'mm-q4': {
    question: 'What is the role of the GR/IR Clearing Account?',
    optionsEn: [
      'It is the vendor\'s bank account',
      'It is a temporary bridge account between goods receipt and invoice posting',
      'It records the final vendor payment',
      'It tracks purchase requisition approvals'
    ],
    explanation: 'The GR/IR (Goods Receipt / Invoice Receipt) Clearing Account is a temporary account. At MIGO: Dr Inventory / Cr GR/IR. At MIRO: Dr GR/IR / Cr Accounts Payable. The GR/IR account nets to zero after both steps. It bridges the gap between physical receipt and financial invoice.',
  },
  // SD Quiz
  'sd-q1': {
    question: 'What is the correct sequence of the Order-to-Cash (O2C) cycle?',
    optionsEn: [
      'Invoice → SO → Delivery → PGI → Payment',
      'SO → Delivery → PGI → Invoice → Payment',
      'PGI → SO → Delivery → Invoice → Payment',
      'SO → Invoice → PGI → Delivery → Payment'
    ],
    explanation: 'The O2C sequence is: SO (customer order) → Delivery (warehouse preparation) → PGI (physical shipment, stock reduced) → Invoice (revenue recognized) → Payment (cash collected). In SAP: VA01 → VL01N → VL02N → VF01 → F-28.',
  },
  'sd-q2': {
    question: 'What does Post Goods Issue (PGI) trigger in the ERP?',
    optionsEn: [
      'Customer invoice creation',
      'Stock reduction and automatic COGS accounting entry',
      'Sales order creation',
      'Customer credit check'
    ],
    explanation: 'PGI (VL02N in SAP) triggers: (1) Stock reduction (inventory -), (2) Automatic accounting entry: Dr COGS / Cr Inventory. This is the SD→FI integration. Revenue is NOT recognized at PGI — it is recognized when the customer invoice is created (VF01).',
  },
  'sd-q3': {
    question: 'What is an ATP Check in the Order-to-Cash cycle?',
    optionsEn: [
      'A payment authorization check',
      'An Available-to-Promise check verifying stock availability for the order',
      'A tax calculation for the invoice',
      'A credit limit verification'
    ],
    explanation: 'ATP (Available-to-Promise) checks whether sufficient stock is available to fulfill the customer order by the requested delivery date. If ATP fails, the system blocks the order or proposes an alternative date. This prevents promising delivery of goods that are not in stock.',
  },
  'sd-q4': {
    question: 'What accounting entry does a customer invoice (VF01 in SAP) generate?',
    optionsEn: [
      'Dr Bank / Cr Revenue',
      'Dr Accounts Receivable / Cr Revenue',
      'Dr Revenue / Cr Accounts Receivable',
      'Dr Inventory / Cr COGS'
    ],
    explanation: 'Customer invoice (VF01 in SAP): Dr Accounts Receivable (customer owes us) / Cr Revenue (we earned it). Cash is NOT received yet — that happens at payment (F-28). This is the accrual accounting principle: revenue is recognized when earned, not when cash is received.',
  },
  // FI Quiz
  'fi-q1': {
    question: 'What is the double-entry bookkeeping principle?',
    optionsEn: [
      'Every transaction is recorded twice in the same account',
      'Every transaction affects at least two accounts: one debit and one credit of equal amounts',
      'Debits are always larger than credits',
      'Only expenses are recorded in the general ledger'
    ],
    explanation: 'Double-entry bookkeeping: every transaction has a debit (Dr) and a credit (Cr) of equal amounts. Assets and expenses increase with Debit. Liabilities, equity, and revenue increase with Credit. The accounting equation always balances: Assets = Liabilities + Equity.',
  },
  'fi-q2': {
    question: 'In ERP, when is a journal entry posted automatically?',
    optionsEn: [
      'Only when the accountant manually enters it',
      'When an operational transaction is executed (e.g., MIGO, VF01)',
      'Only at month-end closing',
      'When the bank statement is imported'
    ],
    explanation: 'ERP automates journal entries: MIGO posts Dr Inventory / Cr GR/IR automatically. VF01 posts Dr AR / Cr Revenue automatically. This is the core value of ERP integration — accountants no longer need to manually post entries for every operational transaction.',
  },
  'fi-q3': {
    question: 'What does the GR/IR Clearing Account represent?',
    optionsEn: [
      'The vendor\'s bank account',
      'A temporary bridge between goods receipt (MM) and invoice posting (FI)',
      'The customer\'s accounts receivable',
      'The company\'s cash account'
    ],
    explanation: 'GR/IR Clearing Account is a liability account used as a temporary bridge. At MIGO: Cr GR/IR (goods received, invoice not yet posted). At MIRO: Dr GR/IR (invoice posted, bridge cleared). Net result: GR/IR = 0, Accounts Payable = vendor liability. This is the MM→FI integration mechanism.',
  },
  'fi-q4': {
    question: 'What is the correct accounting entry for a vendor payment (F-53 in SAP)?',
    optionsEn: [
      'Dr Bank / Cr Accounts Payable',
      'Dr Accounts Payable / Cr Bank',
      'Dr Revenue / Cr Bank',
      'Dr Inventory / Cr Accounts Payable'
    ],
    explanation: 'Vendor payment (F-53): Dr Accounts Payable (vendor liability decreases) / Cr Bank (cash decreases). This clears the vendor liability created at MIRO. The P2P cycle is now complete: Inventory +, Bank -, Vendor AP = 0.',
  },
};

// ---- REFLECTION QUESTION TRANSLATIONS ----
export const reflectionTranslationsEn: Record<string, {
  question?: string;
  hint?: string;
  expectedAnswer?: string;
}> = {
  'mm01-r1': {
    question: 'Why does the Purchase Requisition (PR) not create a vendor liability in accounting?',
    hint: 'Think about the difference between an internal request and a contractual commitment.',
    expectedAnswer: 'The PR is an internal request — it has no legal or financial effect outside the company. A vendor liability is only created when the vendor invoice is posted (MIRO), after the goods have been received and the 3-way match is complete.',
  },
  'mm01-r2': {
    question: 'What is the 3-way match (PO + GR + Invoice) and why is it mandatory before payment?',
    hint: 'PO + GR + Invoice: each document confirms a different stage of the transaction.',
    expectedAnswer: 'The 3-way match verifies: (1) PO — what was ordered and at what price, (2) GR — what was actually received, (3) Invoice — what the vendor is charging. All 3 must match before payment is authorized. This prevents overpayment, fraud, and paying for goods never received.',
  },
  'mm01-r3': {
    question: 'In SAP, Dynamics 365, and Odoo, the P2P process is identical. What truly differs between these systems?',
    hint: 'Compare ME21N, Purchase Order, and Bon de commande: same action, different names.',
    expectedAnswer: 'The business process (PR → PO → GR → Invoice → Payment) is universal. What differs is: (1) Terminology: SAP uses T-codes, Dynamics uses menu paths, Odoo uses French/English labels. (2) Interface: SAP is form-based, Dynamics is ribbon-based, Odoo is web-based. (3) Complexity: SAP has more configuration options. The logic is identical.',
  },
  'sd01-r1': {
    question: 'Why is Post Goods Issue (PGI) a separate step from the delivery order?',
    hint: 'Think about when stock is reserved versus when it physically leaves the warehouse.',
    expectedAnswer: 'The delivery order reserves stock and triggers warehouse operations (pick, pack). PGI is the moment goods physically leave — it reduces inventory and posts the COGS entry. Separating these steps allows warehouse staff to prepare the shipment before the financial impact is recorded.',
  },
  'sd01-r2': {
    question: 'Revenue is recognized at invoicing, not at payment. Why does this matter?',
    hint: 'This is the accrual accounting principle — when is revenue "earned"?',
    expectedAnswer: 'Under accrual accounting, revenue is recognized when earned (goods delivered, invoice sent), not when cash is received. This gives a more accurate picture of business performance. ERP automates this: VF01 posts Dr AR / Cr Revenue. Cash receipt (F-28) only clears the receivable.',
  },
  'fi01-r1': {
    question: 'Why does the GR/IR Clearing Account always net to zero after the P2P cycle?',
    hint: 'Trace the account through MIGO and MIRO.',
    expectedAnswer: 'At MIGO: Cr GR/IR +2,500 (goods received, invoice pending). At MIRO: Dr GR/IR -2,500 (invoice posted, bridge cleared). Net: GR/IR = 0. The account is a temporary bridge that ensures the accounting equation balances between the physical receipt and the financial invoice.',
  },
};
