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

// ============================================================
// STEP-LEVEL TRANSLATIONS — Field labels, hints, validation/error messages
// ============================================================
export const stepTranslationsEn: Record<string, {
  name?: string;
  objective?: string;
  fields?: Record<string, { label?: string; hint?: string; options?: string[] }>;
  validationMessage?: string;
  errorMessage?: string;
}> = {
  // ---- ERP-ARCH-01 steps ----
  'arch-01-s1': {
    name: 'Identify the Purchasing Module',
    objective: 'Associate the Procure-to-Pay process with the correct ERP module',
    fields: {
      'module_achats': {
        label: 'Which ERP module manages the Procure-to-Pay process?',
        hint: 'This module handles purchasing, inventory, and vendor relationships',
        options: ['Module MM — Materials Management', 'Module SD — Sales & Distribution', 'Module FI — Financial Integration', 'Module HR — Human Resources'],
      },
    },
    validationMessage: '✅ Correct! The MM (Materials Management) module manages the entire Procure-to-Pay cycle: from purchase requisition to vendor payment.',
    errorMessage: '❌ Incorrect. The MM (Materials Management) module is responsible for purchasing and inventory management.',
  },
  'arch-01-s2': {
    name: 'Identify the Sales Module',
    objective: 'Associate the Order-to-Cash process with the correct ERP module',
    fields: {
      'module_ventes': {
        label: 'Which ERP module manages the Order-to-Cash process?',
        hint: 'This module handles customer orders, deliveries, and invoicing',
        options: ['Module MM — Materials Management', 'Module SD — Sales & Distribution', 'Module FI — Financial Integration', 'Module PP — Production Planning'],
      },
    },
    validationMessage: '✅ Correct! The SD (Sales & Distribution) module manages the entire Order-to-Cash cycle: from customer order to payment received.',
    errorMessage: '❌ Incorrect. The SD (Sales & Distribution) module handles sales, deliveries, and customer invoicing.',
  },
  'arch-01-s3': {
    name: 'Identify the Financial Impact',
    objective: 'Understand that every operational transaction automatically generates an accounting entry',
    fields: {
      'integration_fi': {
        label: 'When a goods receipt is posted in MM, what happens automatically in FI?',
        hint: 'This is the fundamental principle of ERP integration',
        options: ['Nothing — the modules are independent', 'An accounting entry is generated automatically', 'The FI module must be updated manually', 'A customer invoice is created'],
      },
    },
    validationMessage: '✅ Excellent! This is the core of ERP integration: every operational transaction automatically generates the corresponding accounting entries in FI.',
    errorMessage: '❌ Incorrect. ERP integration means MM and FI are connected: every goods receipt automatically generates an accounting entry.',
  },
  'arch-01-s4': {
    name: 'Choose the Right ERP for the Context',
    objective: 'Recommend the right ERP system based on company size and needs',
    fields: {
      'choix_erp': {
        label: 'A 50-employee SME is looking for a flexible and affordable ERP. Which solution do you recommend?',
        hint: 'Think about the cost/flexibility ratio for an SME',
        options: ['SAP S/4HANA — complete enterprise solution', 'Microsoft Dynamics 365 — Microsoft integration', 'Odoo — flexible and accessible open source', 'No ERP is suitable for SMEs'],
      },
    },
    validationMessage: '✅ Well done! Odoo is ideal for SMEs: open source, modular, affordable, and easy to customize. SAP and Dynamics are better suited for large enterprises.',
    errorMessage: '❌ For a 50-employee SME, Odoo is the most suitable solution: flexible, affordable, and easy to deploy.',
  },

  // ---- ERP-ARCH-02 steps ----
  'arch-02-s1': {
    name: 'Map the Purchasing Department',
    objective: 'Identify the ERP modules used by the Purchasing department',
    fields: {
      'dept_achats': {
        label: 'What is the correct flow for the Purchasing department in SAP?',
        hint: 'ME = MM Module, these T-codes correspond to the Procure-to-Pay cycle',
        options: ['VA01 → VL01N → VF01', 'ME51N → ME21N → MIGO → MIRO', 'FB50 → F-53 → F-28', 'MM01 → MB1A → MI07'],
      },
    },
    validationMessage: '✅ Correct! In SAP: ME51N (Purchase Requisition) → ME21N (Purchase Order) → MIGO (Goods Receipt) → MIRO (Invoice Verification).',
    errorMessage: '❌ The Purchasing flow in SAP is: ME51N → ME21N → MIGO → MIRO. VA T-codes are for sales, FB for accounting.',
  },
  'arch-02-s2': {
    name: 'Map the Sales Department',
    objective: 'Identify the ERP modules used by the Sales department',
    fields: {
      'dept_ventes': {
        label: 'In Dynamics 365, what is the Order-to-Cash flow?',
        hint: 'Order-to-Cash always starts with a customer order',
        options: ['Purchase Order → Receipt → Invoice', 'Sales Order → Delivery → Invoice → Payment', 'Journal Entry → Cost Center → Report', 'Requisition → Approval → PO → GR'],
      },
    },
    validationMessage: '✅ Perfect! In Dynamics 365: Sales Order → Delivery → Invoice → Payment. This is the same O2C flow as in SAP (VA01 → VL01N → VF01) and Odoo.',
    errorMessage: '❌ The Order-to-Cash flow is: Sales Order → Delivery → Invoice → Payment. This is universal across all ERP systems.',
  },
  'arch-02-s3': {
    name: 'Identify Integration Flows',
    objective: 'Understand how MM, SD, and FI integrate in a complete flow',
    fields: {
      'flux_integration': {
        label: 'In Odoo, when a customer order is confirmed, which module is automatically involved?',
        hint: 'Odoo automatically checks item availability in stock',
        options: ['Only the Sales module', 'Sales + Inventory (availability check)', 'Sales + Accounting only', 'All modules without exception'],
      },
    },
    validationMessage: '✅ Excellent! In Odoo (and all ERP systems), confirming a customer order automatically triggers a stock availability check — this is the SD-MM integration.',
    errorMessage: '❌ When a customer order is confirmed in Odoo, the Inventory module is automatically consulted to check availability.',
  },

  // ---- ERP-ARCH-03 steps ----
  'arch-03-s1': {
    name: 'Identify Information Silos',
    objective: 'Recognize the symptoms of a fragmented information system',
    fields: {
      'silo_symptome': {
        label: 'Distribution Montréal uses Excel for inventory, QuickBooks for accounting, and separate software for sales. What is the main problem?',
        hint: 'Think about what happens when a sale is made — is inventory updated automatically?',
        options: ['The software is too expensive', 'Data is not synchronized in real time between systems', 'The company has too many employees', 'The systems are too modern'],
      },
    },
    validationMessage: '✅ Correct! Information silos cause unsynchronized data, manual errors, delays, and a fragmented view of the business.',
    errorMessage: '❌ The main problem is data desynchronization: a sale in the sales software does not automatically update inventory in Excel or accounting in QuickBooks.',
  },
  'arch-03-s2': {
    name: 'Propose an ERP Solution',
    objective: 'Recommend the right ERP based on the company context',
    fields: {
      'solution_erp': {
        label: 'Distribution Montréal has 80 employees, limited budget, needs inventory + sales + accounting management. Which ERP solution do you recommend?',
        hint: 'Limited budget + SME = accessible and flexible solution',
        options: ['SAP S/4HANA — the most complete', 'Microsoft Dynamics 365 Business Central', 'Odoo Community (open source)', 'Continue with Excel and QuickBooks'],
      },
    },
    validationMessage: '✅ Excellent choice! Odoo Community is ideal: free (open source), covers inventory + sales + accounting, easy to deploy for an 80-person SME.',
    errorMessage: '❌ For an SME with a limited budget, Odoo Community is the best option: open source, free, and covers all the mentioned needs.',
  },
  'arch-03-s3': {
    name: 'Define Integration Benefits',
    objective: 'Articulate the concrete advantages of migrating to an integrated ERP',
    fields: {
      'benefice_erp': {
        label: 'After migrating to Odoo, what immediate benefit will Distribution Montréal gain?',
        hint: 'ERP integration means data synchronizes automatically',
        options: ['50% staff reduction', 'Automatic inventory update with every sale or purchase', 'Elimination of all business problems', 'Guaranteed revenue doubling'],
      },
    },
    validationMessage: '✅ Perfect! ERP integration ensures that every transaction (sale, purchase, receipt) automatically updates inventory, accounting, and all relevant modules — in real time.',
    errorMessage: '❌ The main benefit is automatic data synchronization: every transaction updates all relevant modules in real time.',
  },

  // ---- MM-04 steps ----
  'mm-04-s1': {
    name: 'Analyze Vendor KPIs',
    objective: 'Interpret vendor performance indicators in the ERP',
    fields: {
      'taux_livraison': { label: 'On-time delivery rate (%)', hint: 'Last 6 months data: 65% of deliveries on time' },
      'taux_qualite': { label: 'Quality rate (%)', hint: '88% of received lots conform to specifications' },
      'evaluation': {
        label: 'Overall vendor evaluation',
        hint: 'Based on the 65% delivery rate',
        options: ['Excellent (90-100%)', 'Good (75-89%)', 'Acceptable (60-74%)', 'Insufficient (< 60%)'],
      },
    },
    validationMessage: '✅ Complete analysis. Vendor rated "Acceptable": delivery 65%, quality 88%. Insufficient performance on lead times. Corrective action required.',
    errorMessage: '❌ With 65% on-time deliveries, the vendor is rated "Acceptable (60-74%)".',
  },
  'mm-04-s2': {
    name: 'Decide on Corrective Action',
    objective: 'Choose the appropriate procurement strategy',
    fields: {
      'action': {
        label: 'Recommended corrective action',
        hint: 'Acceptable but improvable performance — dialogue before termination',
        options: ['Continue without change', 'Improvement plan with the vendor', 'RFQ to find an alternative vendor', 'Immediate contract termination'],
      },
      'delai': { label: 'Improvement deadline (months)', hint: 'Allow a reasonable timeframe to improve' },
    },
    validationMessage: '✅ 3-month improvement plan established with the vendor. Target: on-time delivery rate > 85%. Monthly monitoring in the ERP.',
    errorMessage: '❌ The right approach is a 3-month improvement plan before considering a vendor change.',
  },
  'mm-04-s3': {
    name: 'Diversify Supply Sources',
    objective: 'Reduce risk by identifying an alternative vendor',
    fields: {
      'strategie': {
        label: 'Recommended sourcing strategy',
        hint: 'Balance between cost and risk reduction',
        options: ['Single sourcing (one vendor)', 'Dual sourcing (2 vendors)', 'Multi-sourcing (3+ vendors)', 'Vertical integration (produce in-house)'],
      },
    },
    validationMessage: '✅ Dual sourcing strategy adopted: 70% with the primary vendor, 30% with an alternative. Stockout risk reduced. Vendor record updated in the ERP.',
    errorMessage: '❌ Dual sourcing is the best strategy: maintain the current vendor while developing an alternative.',
  },

  // ---- SD-02 steps ----
  'sd-02-s1': {
    name: 'Detect Stockout (ATP Check)',
    objective: 'Identify insufficient stock when creating the Sales Order',
    fields: {
      'stock_disponible': { label: 'Available stock (units)', hint: 'Current warehouse inventory' },
      'quantite_demandee': { label: 'Quantity requested by customer', hint: 'Quantity ordered by CLIENT-QC' },
      'ecart_stock': { label: 'Gap (shortage in units)', hint: '80 - 30 = 50 missing units' },
    },
    validationMessage: '✅ ATP Check: insufficient stock! Available: 30 units. Requested: 80. Shortage: 50 units. Order partially blocked. Action required.',
    errorMessage: '❌ The gap is 50 units (80 requested - 30 available).',
  },
  'sd-02-s2': {
    name: 'Propose a Solution to the Customer',
    objective: 'Choose the best option to satisfy the customer',
    fields: {
      'solution_rupture': {
        label: 'Solution proposed to the customer',
        hint: 'Partially satisfy the customer now and complete upon replenishment',
        options: ['Cancel the order', 'Partial delivery (30 units) + backorder (50 units) in 15 days', 'Postpone the entire delivery by 15 days', 'Substitute with a similar item'],
      },
    },
    validationMessage: '✅ Optimal solution: partial delivery of 30 units today + backorder of 50 units in 15 days. Customer informed and agreement obtained.',
    errorMessage: '❌ The best solution is partial delivery: satisfy the customer partially now and complete upon replenishment.',
  },
  'sd-02-s3': {
    name: 'Create a Replenishment Order',
    objective: 'Trigger an emergency purchase to cover the backorder',
    fields: {
      'quantite_reappro': { label: 'Quantity to replenish', hint: 'Missing quantity to complete the order' },
      'priorite': {
        label: 'Order priority',
        hint: '15-day deadline to satisfy the customer',
        options: ['Standard', 'Urgent', 'Critical'],
      },
    },
    validationMessage: '✅ Urgent purchase requisition created for 50 units. Vendor FOURNISSEUR-MTL contacted. Confirmed lead time: 12 days. Customer backorder will be delivered on time.',
    errorMessage: '❌ Create an urgent requisition for 50 units with Urgent priority.',
  },

  // ---- SD-03 steps ----
  'sd-03-s1': {
    name: 'Identify the Delivery Delay',
    objective: 'Detect the delay via carrier tracking',
    fields: {
      'cause_retard': {
        label: 'Identified cause of delay',
        hint: 'Snowstorm in Montréal — force majeure',
        options: ['Carrier mechanical problem', 'Weather conditions', 'Address error', 'Customs (import/export)'],
      },
      'nouveau_delai': { label: 'New estimated delay (additional days)', hint: 'Carrier estimate' },
    },
    validationMessage: '✅ Delay identified: +3 days for weather conditions (force majeure). Purolator carrier confirmed the new date. Customer to be informed.',
    errorMessage: '❌ The cause is weather conditions (+3 days). This is a force majeure case.',
  },
  'sd-03-s2': {
    name: 'Communicate with the Customer',
    objective: 'Proactively inform the customer of the delay',
    fields: {
      'communication': {
        label: 'Communication action',
        hint: 'Proactivity is essential to maintain the customer relationship',
        options: ['Wait for the customer to call', 'Send a proactive email with new date', 'Call the customer and offer compensation', 'Do nothing — force majeure'],
      },
    },
    validationMessage: '✅ Customer proactively contacted. New date confirmed. Compensation offered: 5% discount on next order. Customer relationship preserved.',
    errorMessage: '❌ Best practice is to proactively contact the customer and offer compensation to maintain the relationship.',
  },
  'sd-03-s3': {
    name: 'Update the Sales Order in the ERP',
    objective: 'Document the delay and new date in the system',
    fields: {
      'note_retard': {
        label: 'Documentation in the ERP',
        hint: 'Complete traceability in the ERP',
        options: ['No documentation required', 'Update delivery date + internal note', 'Cancel and recreate the SO', 'Transfer to another carrier'],
      },
    },
    validationMessage: '✅ SO updated: new delivery date recorded. Internal note documented. Complete traceability in the ERP. Customer follow-up scheduled.',
    errorMessage: '❌ You must update the delivery date in the SO and add an internal note for traceability.',
  },

  // ---- SD-04 steps ----
  'sd-04-s1': {
    name: 'Analyze the Customer Dispute',
    objective: 'Verify whether the dispute is valid',
    fields: {
      'prix_facture': { label: 'Invoiced price (CAD/unit)', hint: 'Price on the invoice sent' },
      'prix_contrat': { label: 'Contract price (CAD/unit)', hint: 'Negotiated price in the customer contract' },
      'ecart_prix': { label: 'Price variance (CAD/unit)', hint: '48.00 - 45.00 = 3.00 CAD overcharged' },
    },
    validationMessage: '✅ Valid dispute! Invoiced price 48.00 vs contract price 45.00. Variance: 3.00 CAD/unit. On 50 units = 150.00 CAD to refund.',
    errorMessage: '❌ The variance is 3.00 CAD/unit (48.00 - 45.00). The dispute is valid.',
  },
  'sd-04-s2': {
    name: 'Issue a Credit Note',
    objective: 'Correct the billing with a credit note',
    fields: {
      'montant_nc': { label: 'Credit note amount (CAD)', hint: '3.00 × 50 units = 150.00 CAD' },
      'raison': {
        label: 'Credit note reason',
        hint: 'The invoiced price did not match the contract',
        options: ['Quantity error', 'Price error — variance from contract', 'Returned goods', 'Commercial discount'],
      },
    },
    validationMessage: '✅ Credit note of 150.00 CAD issued! Accounting entry: Debit Sales 150.00 / Credit Accounts Receivable 150.00. Corrected invoice sent to customer.',
    errorMessage: '❌ The credit note must be 150.00 CAD (3.00 × 50 units) for price error.',
  },
  'sd-04-s3': {
    name: 'Prevent Future Errors',
    objective: 'Identify the root cause and correct the configuration',
    fields: {
      'cause_erreur': {
        label: 'Root cause of the price error',
        hint: 'The contract price was not in the system',
        options: ['Human data entry error', 'Price list not updated in the ERP', 'Contract not recorded in the ERP', 'Training issue'],
      },
      'action_preventive': {
        label: 'Preventive action',
        hint: 'The ERP must contain all contract prices to prevent errors',
        options: ['Train sales staff', 'Record all contracts in the ERP', 'Manually verify each invoice', 'Change ERP system'],
      },
    },
    validationMessage: '✅ Root cause identified: contract not recorded in the ERP. Action: enter all pricing agreements in the customer price list. Error will not recur.',
    errorMessage: '❌ The cause is that the contract was not recorded in the ERP. Solution: record all contracts in the system.',
  },

  // ---- FI-02 steps ----
  'fi-02-s1': {
    name: 'Goods Issue (GI) Accounting Entry',
    objective: 'Identify the COGS entry generated by the Goods Issue',
    fields: {
      'debit_gi': {
        label: 'Account debited at Goods Issue',
        hint: 'Cost of goods sold is recorded',
        options: ['COGS Account', 'Accounts Receivable', 'Inventory Account (Stock)', 'Bank Account'],
      },
      'credit_gi': {
        label: 'Account credited at Goods Issue',
        hint: 'Inventory decreases',
        options: ['COGS Account', 'Accounts Receivable', 'Inventory Account (Stock)', 'Bank Account'],
      },
      'montant_gi': { label: 'COGS amount (CAD) — purchase cost', hint: '50 units × 25.00 CAD (purchase cost) = 1,250.00 CAD' },
    },
    validationMessage: '✅ Correct COGS entry! Debit COGS 1,250.00 / Credit Inventory 1,250.00. Cost of goods sold recorded. Inventory reduced by 1,250.00 CAD.',
    errorMessage: '❌ At GI: Debit COGS (cost of sales) / Credit Inventory (inventory reduction). Amount: 1,250.00 CAD (purchase cost).',
  },
  'fi-02-s2': {
    name: 'Customer Billing Accounting Entry',
    objective: 'Identify the revenue entry generated by the customer invoice',
    fields: {
      'debit_bill': {
        label: 'Account debited at billing',
        hint: 'Customer receivable is created',
        options: ['Inventory Account', 'Accounts Receivable (AR)', 'Bank Account', 'COGS Account'],
      },
      'credit_bill': {
        label: 'Account credited at billing',
        hint: 'Revenue is recognized',
        options: ['Accounts Receivable', 'Inventory Account', 'Sales Account (Revenue)', 'Bank Account'],
      },
      'montant_bill': { label: 'Invoice amount (CAD)', hint: '50 units × 45.00 CAD = 2,250.00 CAD' },
    },
    validationMessage: '✅ Correct billing entry! Debit AR 2,250.00 / Credit Sales 2,250.00. Revenue recognized. Gross margin = 2,250.00 - 1,250.00 = 1,000.00 CAD.',
    errorMessage: '❌ At billing: Debit AR (receivable) / Credit Sales (revenue). Amount: 2,250.00 CAD.',
  },
  'fi-02-s3': {
    name: 'Calculate Gross Margin',
    objective: 'Interpret the financial result of the transaction',
    fields: {
      'ventes': { label: 'Revenue (CAD)', hint: 'Customer invoice amount' },
      'cogs': { label: 'Cost of Goods Sold — COGS (CAD)', hint: 'Purchase cost of the 50 units' },
      'marge': { label: 'Gross margin (CAD)', hint: 'Revenue - COGS = Gross margin' },
    },
    validationMessage: '✅ Complete financial analysis! Revenue: 2,250.00 | COGS: 1,250.00 | Gross margin: 1,000.00 CAD (44.4%). This data automatically feeds the income statement in FI.',
    errorMessage: '❌ Gross margin = Revenue (2,250.00) - COGS (1,250.00) = 1,000.00 CAD.',
  },

  // ---- FI-03 steps ----
  'fi-03-s1': {
    name: 'Generate the Profitability Report',
    objective: 'Extract financial data from the FI module',
    fields: {
      'periode': {
        label: 'Analysis period',
        hint: 'Analyze the first quarter of 2026',
        options: ['January 2026', 'Q1 2026 (Jan-Mar)', 'Year 2025', 'YTD 2026'],
      },
      'dimension': {
        label: 'Analysis dimension',
        hint: 'Identify which products are most profitable',
        options: ['By product', 'By customer', 'By region', 'By sales channel'],
      },
    },
    validationMessage: '✅ Q1 2026 profitability report by product generated. Data extracted from FI/CO module. Analysis available.',
    errorMessage: '❌ Select the Q1 2026 period and the by-product dimension.',
  },
  'fi-03-s2': {
    name: 'Interpret the Indicators',
    objective: 'Analyze the financial KPIs from the report',
    fields: {
      'produit_rentable': {
        label: 'PROD-001: Q1 2026 Gross Margin',
        hint: 'Gross margin of 44.4% = excellent performance',
        options: ['Loss-making (< 0%)', 'Low (0-20%)', 'Acceptable (20-40%)', 'Excellent (> 40%)'],
      },
      'action_fi': {
        label: 'Recommendation based on the analysis',
        hint: 'A product with 44% margin deserves to be developed',
        options: ['Stop PROD-001 production', 'Increase PROD-001 volumes', 'Reduce the selling price', 'Change vendor immediately'],
      },
    },
    validationMessage: '✅ Correct analysis! PROD-001 generates 44.4% gross margin — excellent performance. Recommendation: increase volumes to maximize profitability.',
    errorMessage: '❌ With 44.4% gross margin, PROD-001 is excellent. The right decision is to increase volumes.',
  },
  'fi-03-s3': {
    name: 'Present Results to Management',
    objective: 'Synthesize financial results for decision-making',
    fields: {
      'synthese': {
        label: 'Main conclusion of the report',
        hint: 'The 44.4% margin confirms product profitability',
        options: ['The company is at a loss', 'PROD-001 is profitable and should be developed', 'Purchase costs must be reduced', 'The FI module is misconfigured'],
      },
      'outil_reporting': {
        label: 'Recommended reporting tool for management',
        hint: 'Power BI offers real-time visual dashboards',
        options: ['Manual Excel', 'Power BI connected to Dynamics 365', 'Standard SAP report (F.01)', 'Native Odoo report'],
      },
    },
    validationMessage: '✅ Management report prepared! PROD-001: 44.4% margin, growth recommendation. Power BI connected to Dynamics 365 for real-time dashboards. Decision made on ERP data.',
    errorMessage: '❌ The conclusion is that PROD-001 is profitable. Power BI connected to Dynamics 365 is the most suitable reporting tool for management.',
  },

  // ---- ERP-SIM-01 steps ----
  'sim-01-s1': {
    name: 'Receive Customer Order',
    objective: 'Record the order for 80 tablets from ElectroMTL',
    fields: {
      'client_sim': {
        label: 'Customer',
        hint: 'Primary customer of Distributions La Concorde',
        options: ['ElectroMTL', 'TechSupply Inc.', 'Distributions La Concorde', 'Unknown customer'],
      },
      'produit_sim': { label: 'Product ordered', hint: 'Product code for the tablets' },
      'quantite_sim': { label: 'Quantity ordered', hint: 'ElectroMTL orders 80 units' },
      'prix_sim': { label: 'Unit price (CAD)', hint: 'Selling price of the tablets' },
    },
    validationMessage: '✅ Order SIM-SO-001 created! 80 × 299.00 = 23,920.00 CAD. ATP Check running... Available stock: 50 units. Shortage: 30 units. Action required!',
    errorMessage: '❌ Check the customer (ElectroMTL), product (TABLET-PRO-10), quantity (80), and price (299.00 CAD).',
  },
  'sim-01-s2': {
    name: 'Order the 30 Missing Units',
    objective: 'Create an urgent purchase requisition for 30 tablets',
    fields: {
      'fournisseur_sim': {
        label: 'Vendor',
        hint: 'Primary tablet vendor',
        options: ['TechSupply Inc.', 'ElectroMTL', 'Distributions La Concorde', 'Unknown vendor'],
      },
      'quantite_pr_sim': { label: 'Quantity to order', hint: 'Missing quantity to satisfy ElectroMTL' },
      'prix_achat_sim': { label: 'Purchase unit price (CAD)', hint: 'Purchase price of tablets from TechSupply' },
    },
    validationMessage: '✅ PO-SIM-001 created! 30 × 180.00 = 5,400.00 CAD. Sent to TechSupply Inc. Confirmed delivery: 2 days. Total stock after receipt: 80 units.',
    errorMessage: '❌ Order 30 units from TechSupply Inc. at 180.00 CAD/unit.',
  },
  'sim-01-s3': {
    name: 'Receive the 30 Tablets from TechSupply',
    objective: 'Record the receipt and update inventory',
    fields: {
      'qte_recue_sim': { label: 'Quantity received', hint: 'All 30 units ordered from TechSupply' },
      'emplacement_sim': {
        label: 'Storage location',
        hint: 'Standard storage area for tablets',
        options: ['Zone A — Electronics', 'Zone B — Accessories', 'Zone C — Bulk', 'Zone D — Returns'],
      },
    },
    validationMessage: '✅ GR SIM-GR-001 posted! 30 tablets received. Accounting entry: Debit Inventory 5,400.00 / Credit GR-IR 5,400.00. Total stock: 80 units ready for shipment.',
    errorMessage: '❌ Receive 30 units. Total stock = 50 + 30 = 80 units.',
  },
  'sim-01-s4': {
    name: 'Ship the 80 Tablets to ElectroMTL',
    objective: 'Create the delivery and record the goods issue',
    fields: {
      'qte_expediee': { label: 'Quantity shipped', hint: 'All tablets ordered by ElectroMTL' },
      'transporteur_sim': {
        label: 'Carrier',
        hint: 'Urgent delivery — express service',
        options: ['Purolator Express', 'FedEx Priority', 'Internal transport', 'UPS Standard'],
      },
    },
    validationMessage: '✅ Delivery SIM-DEL-001! 80 tablets shipped via Purolator Express. Stock reduced to 0. COGS recorded in FI: 80 × 180.00 = 14,400.00 CAD.',
    errorMessage: '❌ Ship 80 units via Purolator Express.',
  },
  'sim-01-s5': {
    name: 'Invoice ElectroMTL',
    objective: 'Generate the invoice for 23,920.00 CAD',
    fields: {
      'montant_inv_sim': { label: 'Invoice amount (CAD)', hint: '80 × 299.00 = 23,920.00 CAD' },
      'echeance_sim': {
        label: 'Payment terms',
        hint: 'Standard ElectroMTL terms',
        options: ['Net 30 days', 'Net 60 days', 'Immediate payment', '2/10 Net 30'],
      },
    },
    validationMessage: '✅ Invoice SIM-INV-001! 23,920.00 CAD. FI entry: Debit AR 23,920.00 / Credit Sales 23,920.00. Open receivable. Due in 30 days.',
    errorMessage: '❌ The amount is 23,920.00 CAD (80 × 299.00).',
  },
  'sim-01-s6': {
    name: 'Pay TechSupply Inc.',
    objective: 'Settle the vendor invoice for 5,400.00 CAD',
    fields: {
      'montant_pay_sim': { label: 'Vendor payment amount (CAD)', hint: '30 × 180.00 = 5,400.00 CAD' },
    },
    validationMessage: '✅ Payment SIM-PAY-001! 5,400.00 CAD transferred to TechSupply Inc. FI entry: Debit Accounts Payable 5,400.00 / Credit Bank 5,400.00.',
    errorMessage: '❌ The vendor payment is 5,400.00 CAD (30 × 180.00).',
  },
  'sim-01-s7': {
    name: 'Final Financial Analysis',
    objective: 'Calculate the profitability of the complete transaction',
    fields: {
      'ca_total': { label: 'Total revenue (CAD)', hint: '80 × 299.00 CAD' },
      'cogs_total': { label: 'Total cost of goods sold (CAD)', hint: '80 × 180.00 CAD (purchase cost)' },
      'marge_totale': { label: 'Total gross margin (CAD)', hint: '23,920.00 - 14,400.00 = 9,520.00 CAD' },
    },
    validationMessage: '✅ SIMULATION COMPLETE! Revenue: 23,920.00 | COGS: 14,400.00 | Gross margin: 9,520.00 CAD (39.8%). Full ERP cycle successfully completed! All modules integrated.',
    errorMessage: '❌ Revenue = 23,920.00 | COGS = 14,400.00 | Margin = 9,520.00 CAD.',
  },

  // ---- ERP-SIM-02 steps ----
  'sim-02-s1': {
    name: 'Create the InfoTech Customer Order',
    objective: 'Record the order for 40 laptops from InfoTech Solutions',
    fields: {
      'client_sim2': {
        label: 'Customer',
        hint: 'New customer of Distributions La Concorde',
        options: ['InfoTech Solutions', 'ElectroMTL', 'TechSupply Inc.', 'Unknown customer'],
      },
      'produit_sim2': { label: 'Product ordered', hint: 'Product code for the laptops' },
      'quantite_sim2': { label: 'Quantity ordered', hint: 'InfoTech Solutions orders 40 units' },
      'prix_sim2': { label: 'Unit price (CAD)', hint: 'Selling price of the laptops' },
    },
    validationMessage: '✅ Order SIM2-SO-001 created! 40 × 899.00 = 35,960.00 CAD. ATP Check: Available stock = 40 units. Delivery confirmed — no replenishment needed.',
    errorMessage: '❌ Check the customer (InfoTech Solutions), product (LAPTOP-PRO-15), quantity (40), and price (899.00 CAD).',
  },
  'sim-02-s2': {
    name: 'Prepare and Ship the Order',
    objective: 'Create the delivery order and validate shipment of the 40 computers',
    fields: {
      'qte_exp_sim2': { label: 'Quantity shipped', hint: 'Full InfoTech Solutions order' },
      'transporteur_sim2': {
        label: 'Carrier',
        hint: 'InfoTech Solutions requires FedEx Priority',
        options: ['FedEx Priority', 'Purolator Express', 'Internal transport', 'UPS Standard'],
      },
    },
    validationMessage: '✅ Delivery SIM2-DEL-001! 40 computers shipped via FedEx Priority. Automatic FI entry: Debit COGS 22,000.00 / Credit Inventory 22,000.00 CAD.',
    errorMessage: '❌ Ship 40 units via FedEx Priority.',
  },
  'sim-02-s3': {
    name: 'Invoice InfoTech Solutions',
    objective: 'Generate the customer invoice for 35,960.00 CAD',
    fields: {
      'montant_inv_sim2': { label: 'Invoice amount (CAD)', hint: '40 × 899.00 = 35,960.00 CAD' },
      'echeance_sim2': {
        label: 'Payment terms',
        hint: 'InfoTech Solutions gets a 2% discount if paid within 10 days',
        options: ['Net 30 days', 'Net 60 days', '2/10 Net 30', 'Immediate payment'],
      },
    },
    validationMessage: '✅ Invoice SIM2-INV-001! 35,960.00 CAD. FI entry: Debit AR 35,960.00 / Credit Sales 35,960.00. Possible discount: 719.20 CAD if paid within 10 days.',
    errorMessage: '❌ The amount is 35,960.00 CAD (40 × 899.00). Terms: 2/10 Net 30.',
  },
  'sim-02-s4': {
    name: 'O2C Profitability Analysis',
    objective: 'Calculate the gross margin and margin rate of the transaction',
    fields: {
      'ca_sim2': { label: 'Revenue (CAD)', hint: '40 × 899.00 CAD' },
      'cogs_sim2': { label: 'Cost of goods sold (CAD)', hint: '40 × 550.00 CAD (purchase cost of LAPTOP-PRO-15)' },
      'marge_sim2': { label: 'Gross margin (CAD)', hint: '35,960.00 - 22,000.00 = 13,960.00 CAD' },
    },
    validationMessage: '✅ O2C cycle complete! Revenue: 35,960.00 | COGS: 22,000.00 | Gross margin: 13,960.00 CAD (38.8%). Excellent result! You are ready for ERP-SIM-01.',
    errorMessage: '❌ Revenue = 35,960.00 | COGS = 22,000.00 (40 × 550.00) | Margin = 13,960.00 CAD.',
  },
};

// ---- QUIZ TRANSLATIONS (ERP-SIM module) ----
export const quizTranslationsEn: Record<string, {
  question?: string;
  options?: string[];
  explanation?: string;
}> = {
  'sim-q1': {
    question: 'In ERP-SIM-01, why must 30 additional units be ordered from TechSupply?',
    options: [
      'Because the initial stock is zero',
      'Because ElectroMTL orders 80 units but only 50 are available in stock',
      'Because the vendor imposes a minimum order of 30',
      'Because 30 units are reserved for another customer'
    ],
    explanation: 'The ATP Check detects: order 80 units - available stock 50 units = shortage of 30 units. The ERP automatically triggers an urgent replenishment requisition (ME51N).',
  },
  'sim-q2': {
    question: 'What is the correct gross margin amount in ERP-SIM-01?',
    options: [
      '5,400.00 CAD (vendor payment)',
      '18,520.00 CAD (Revenue - vendor payment)',
      '9,520.00 CAD (Revenue 23,920 - COGS 14,400)',
      '23,920.00 CAD (total revenue)'
    ],
    explanation: 'Gross margin = Revenue - COGS = 23,920.00 - 14,400.00 = 9,520.00 CAD (39.8%). COGS = 80 units × 180 CAD (purchase cost). Note: do not confuse COGS with the vendor payment (30 × 180 = 5,400 CAD).',
  },
  'sim-q3': {
    question: 'In what order are the FI accounting entries generated in ERP-SIM-01?',
    options: [
      'Customer Invoice → GI → GR → Vendor Invoice → Vendor Payment',
      'GR → Vendor Invoice → Vendor Payment → GI → Customer Invoice',
      'GI → Customer Invoice → GR → Vendor Invoice → Vendor Payment',
      'GR → GI → Vendor Invoice → Customer Invoice → Vendor Payment'
    ],
    explanation: 'The correct chronological order is: 1) Goods Receipt GR (inventory + GR-IR), 2) Vendor Invoice (GR-IR + AP), 3) Vendor Payment (AP + Bank), 4) Goods Issue GI (COGS + Inventory), 5) Customer Invoice (AR + Sales).',
  },
  'sim-q4': {
    question: 'What is the main difference between ERP-SIM-01 (Advanced) and ERP-SIM-02 (Intermediate)?',
    options: [
      'ERP-SIM-02 uses a different ERP system',
      'ERP-SIM-01 integrates MM + SD + FI with replenishment; ERP-SIM-02 is a pure O2C cycle without replenishment',
      'ERP-SIM-02 is longer and more complex',
      'There is no difference, they cover the same steps'
    ],
    explanation: 'ERP-SIM-02 is a pure O2C cycle (SD + FI) with sufficient stock — ideal for practice before ERP-SIM-01. ERP-SIM-01 is cross-functional (MM + SD + FI) with stockout detection and emergency replenishment.',
  },
};

// ---- SLIDE TRANSLATIONS (inline in erpData.ts via titleEn/contentEn fields) ----
// These translations are injected directly into erpData.ts slide objects
// The following export provides a lookup map for runtime injection if needed
export const slideTranslationsEn: Record<string, {
  titleEn?: string;
  subtitleEn?: string;
  contentEn?: string;
  keyPointsEn?: string[];
}> = {
  'arch-s1': {
    titleEn: 'What is an ERP?',
    subtitleEn: 'Enterprise Resource Planning — Core Definition',
    contentEn: 'An ERP (Enterprise Resource Planning) is an integrated information system that unifies all of a company\'s operational processes in a single centralized database. It eliminates information silos between departments.',
    keyPointsEn: [
      'Single centralized database for the entire company',
      'Real-time integration between all departments',
      'Automation of repetitive business processes',
      'Complete traceability of all transactions',
      'Consolidated reporting and decision-making dashboards'
    ],
  },
  'arch-s2': {
    titleEn: 'Historical Evolution of ERP',
    subtitleEn: 'From MRP to S/4HANA — 50 years of evolution',
    contentEn: 'The evolution of ERP reflects the transformation of business management: from production planning systems to integrated digital platforms covering the entire value chain.',
    keyPointsEn: [
      '1960s — MRP (Material Requirements Planning): materials needs planning',
      '1970s — MRP II: extension to manufacturing resources',
      '1990s — ERP: integration of all business functions',
      '2000s — Web ERP: internet-based access',
      '2010s — Cloud ERP: SaaS, mobile, real-time analytics',
      '2020s — Intelligent ERP: AI, machine learning, IoT integration'
    ],
  },
  'arch-s3': {
    titleEn: 'ERP Modular Architecture',
    subtitleEn: 'Functional modules and their interconnections',
    contentEn: 'An ERP is built around functional modules, each covering a specific business domain. These modules share a common database, enabling automatic information flow between departments.',
    keyPointsEn: [
      'MM (Materials Management): purchasing, inventory, vendor management',
      'SD (Sales & Distribution): orders, deliveries, customer invoicing',
      'FI (Financial Accounting): general ledger, accounts payable/receivable',
      'PP (Production Planning): manufacturing, work orders',
      'HR (Human Resources): payroll, time management',
      'All modules share a single database — no duplication'
    ],
  },
  'arch-s4': {
    titleEn: 'Digital Transformation of Enterprises',
    subtitleEn: 'The central role of ERP in digital transformation',
    contentEn: 'ERP is the backbone of enterprise digital transformation. It centralizes data, automates processes, and provides real-time visibility across the entire organization.',
    keyPointsEn: [
      'Centralization: one source of truth for all business data',
      'Automation: elimination of manual and repetitive tasks',
      'Visibility: real-time dashboards for all departments',
      'Compliance: automatic traceability of all transactions',
      'Scalability: system grows with the company'
    ],
  },
  'arch-s5': {
    titleEn: 'Integration of Business Processes',
    subtitleEn: 'How ERP modules communicate with each other',
    contentEn: 'ERP integration means that an action in one module automatically triggers updates in other modules. A goods receipt in MM immediately generates an accounting entry in FI — without any manual intervention.',
    keyPointsEn: [
      'MM → FI: every goods receipt generates an accounting entry',
      'SD → FI: every customer invoice creates an accounts receivable entry',
      'SD → MM: a customer order triggers an availability check',
      'MM → SD: replenishment automatically satisfies backorders',
      'All integrations happen in real time, automatically'
    ],
  },
  'arch-s6': {
    titleEn: 'SAP S/4HANA vs Dynamics 365 vs Odoo',
    subtitleEn: 'Comparison of the three major ERP systems on the market',
    contentEn: 'Three ERP systems dominate the market, each targeting different company profiles. The business processes are identical — only the interface, terminology, and complexity differ.',
    keyPointsEn: [
      'SAP S/4HANA: large enterprises, T-codes, HANA in-memory database',
      'Microsoft Dynamics 365: mid-market, Microsoft 365 integration, cloud-native',
      'Odoo: SMEs, open source, modular, web-based interface',
      'Same P2P and O2C processes in all three systems',
      'Different terminology: T-codes / menu paths / French labels'
    ],
  },
  'arch-s7': {
    titleEn: 'SAP T-codes — Navigation in SAP S/4HANA',
    subtitleEn: 'Understanding the logic of SAP transaction codes',
    contentEn: 'T-codes (Transaction Codes) are SAP\'s navigation system. Each T-code opens a specific transaction directly. Mastering T-codes means knowing exactly where to go in SAP to execute each business process.',
    keyPointsEn: [
      'ME51N: Create Purchase Requisition (MM)',
      'ME21N: Create Purchase Order (MM)',
      'MIGO: Goods Movement — Receipt/Issue (MM)',
      'MIRO: Invoice Verification (MM)',
      'VA01: Create Sales Order (SD)',
      'VL01N: Create Delivery (SD)',
      'VF01: Create Billing Document (SD)',
      'F-53: Post Vendor Payment (FI)'
    ],
  },
  'arch-s8': {
    titleEn: 'P2P Flow (Procure-to-Pay) in SAP, Dynamics, and Odoo',
    subtitleEn: 'The Procure-to-Pay cycle step by step in all 3 systems',
    contentEn: 'The Procure-to-Pay cycle is universal across all ERP systems. The steps are identical — only the names and interfaces differ.',
    keyPointsEn: [
      'Step 1 — Purchase Requisition: SAP ME51N / D365 PR / Odoo Purchase Request',
      'Step 2 — Purchase Order: SAP ME21N / D365 PO / Odoo Purchase Order',
      'Step 3 — Goods Receipt: SAP MIGO 101 / D365 Product Receipt / Odoo Validate',
      'Step 4 — Invoice Verification: SAP MIRO / D365 Invoice / Odoo Vendor Bill',
      'Step 5 — Vendor Payment: SAP F-53 / D365 Payment Journal / Odoo Payment'
    ],
  },
  'arch-s9': {
    titleEn: 'O2C Flow (Order-to-Cash) in SAP, Dynamics, and Odoo',
    subtitleEn: 'The Order-to-Cash cycle step by step in all 3 systems',
    contentEn: 'The Order-to-Cash cycle transforms a customer order into cash in the bank. This cycle is identical in all ERP systems — the business logic never changes.',
    keyPointsEn: [
      'Step 1 — Sales Order: SAP VA01 / D365 Sales Order / Odoo Customer Order',
      'Step 2 — Delivery: SAP VL01N / D365 Delivery / Odoo Delivery Order',
      'Step 3 — Goods Issue (PGI): SAP VL02N / D365 Ship / Odoo Validate',
      'Step 4 — Customer Invoice: SAP VF01 / D365 Customer Invoice / Odoo Invoice',
      'Step 5 — Cash Receipt: SAP F-28 / D365 Payment / Odoo Payment'
    ],
  },
  'arch-s10': {
    titleEn: 'Automatic Accounting Entries (FI)',
    subtitleEn: 'How each transaction automatically generates an FI entry',
    contentEn: 'Every operational transaction in MM or SD automatically generates accounting entries in FI. This is the heart of ERP integration — no manual accounting entry is needed.',
    keyPointsEn: [
      'MIGO (GR): Dr Inventory / Cr GR-IR Clearing',
      'MIRO (Invoice): Dr GR-IR Clearing / Cr Accounts Payable',
      'F-53 (Payment): Dr Accounts Payable / Cr Bank',
      'VL02N (PGI): Dr COGS / Cr Inventory',
      'VF01 (Invoice): Dr Accounts Receivable / Cr Sales Revenue',
      'F-28 (Receipt): Dr Bank / Cr Accounts Receivable'
    ],
  },
  'mm-s1': {
    titleEn: 'The Procure-to-Pay (P2P) Process',
    subtitleEn: 'From need to vendor payment',
    contentEn: 'The Procure-to-Pay process covers the complete purchasing cycle: from identifying a need to paying the vendor. Each step generates documents and accounting entries automatically in the ERP.',
    keyPointsEn: [
      'Step 1: Purchase Requisition (PR) — internal need identified',
      'Step 2: Purchase Order (PO) — formal commitment to vendor',
      'Step 3: Goods Receipt (GR) — physical receipt of goods',
      'Step 4: Invoice Verification (IV) — 3-way match validation',
      'Step 5: Vendor Payment — debt settlement'
    ],
  },
  'mm-s2': {
    titleEn: 'Step 1 — Purchase Requisition (PR)',
    subtitleEn: 'The internal purchase request',
    contentEn: 'The Purchase Requisition is an internal document that formalizes a purchasing need. It has no financial impact outside the company — it is simply an internal authorization to proceed with a purchase.',
    keyPointsEn: [
      'SAP: ME51N — Create Purchase Requisition',
      'Dynamics 365: Supply Chain > Procurement > Purchase Requisitions',
      'Odoo: Purchase > Purchase Requests',
      'No accounting entry at PR stage',
      'Requires approval before conversion to PO'
    ],
  },
  'mm-s3': {
    titleEn: 'Step 2 — Purchase Order (PO)',
    subtitleEn: 'The vendor purchase order',
    contentEn: 'The Purchase Order is the legal commitment to the vendor. It specifies the quantity, price, and delivery terms. In the ERP, it creates a budget commitment but no accounting entry yet.',
    keyPointsEn: [
      'SAP: ME21N — Create Purchase Order',
      'Dynamics 365: Purchase Orders',
      'Odoo: Purchase > Purchase Orders',
      'Budget commitment recorded (encumbrance)',
      'Sent to vendor as a binding contract'
    ],
  },
  'mm-s4': {
    titleEn: 'Step 3 — Goods Receipt (GR)',
    subtitleEn: 'Receiving the goods',
    contentEn: 'The Goods Receipt records the physical arrival of goods in the warehouse. This step automatically generates an accounting entry in FI: inventory increases and the GR/IR clearing account is credited.',
    keyPointsEn: [
      'SAP: MIGO Movement Type 101',
      'Dynamics 365: Product Receipt',
      'Odoo: Validate Receipt',
      'Accounting entry: Dr Inventory / Cr GR-IR Clearing',
      'Stock quantity updated in real time'
    ],
  },
  'mm-s5': {
    titleEn: 'Step 4 — Invoice Verification (IV)',
    subtitleEn: 'Vendor invoice verification',
    contentEn: 'Invoice Verification is the 3-way match: PO + GR + Invoice must all agree before payment is authorized. The ERP automatically compares the three documents and blocks payment if there is a discrepancy.',
    keyPointsEn: [
      'SAP: MIRO — Logistics Invoice Verification',
      'Dynamics 365: Vendor Invoice',
      'Odoo: Vendor Bill',
      'Accounting entry: Dr GR-IR Clearing / Cr Accounts Payable',
      '3-way match: PO quantity = GR quantity = Invoice quantity'
    ],
  },
  'mm-s6': {
    titleEn: 'Step 5 — Vendor Payment',
    subtitleEn: 'Paying the vendor',
    contentEn: 'Vendor payment settles the accounts payable created at invoice verification. The ERP generates the final accounting entry: accounts payable decreases and bank decreases.',
    keyPointsEn: [
      'SAP: F-53 — Post Vendor Payment',
      'Dynamics 365: Payment Journal',
      'Odoo: Register Payment',
      'Accounting entry: Dr Accounts Payable / Cr Bank',
      'P2P cycle complete — vendor liability = 0'
    ],
  },
  'mm-s7': {
    titleEn: 'Vendor Management',
    subtitleEn: 'The foundation of vendor relationships in the ERP',
    contentEn: 'Vendor management in the ERP centralizes all vendor information: contact details, payment terms, pricing, and performance history. This master data is used by all P2P transactions.',
    keyPointsEn: [
      'SAP: Vendor Master (XK01/XK02)',
      'Dynamics 365: Vendor Account',
      'Odoo: Contacts > Vendors',
      'Payment terms stored in vendor master',
      'Performance KPIs tracked automatically'
    ],
  },
  'mm-s8': {
    titleEn: 'Mandatory Fields in Each P2P Step',
    subtitleEn: 'What you must enter in SAP, Dynamics, and Odoo',
    contentEn: 'Each P2P step requires specific mandatory fields. Knowing these fields means you can execute any P2P transaction in any ERP system — the logic is identical, only the field names differ.',
    keyPointsEn: [
      'PR: Material/Item, Quantity, Required Date, Cost Center',
      'PO: Vendor, Material, Quantity, Price, Delivery Date',
      'GR: PO Reference, Quantity Received, Storage Location',
      'IV: PO Reference, Invoice Amount, Invoice Date, Vendor',
      'Payment: Vendor, Invoice Reference, Amount, Bank Account'
    ],
  },
  'mm-s9': {
    titleEn: 'Accounting Impact of the P2P Cycle',
    subtitleEn: 'Entries automatically generated in FI',
    contentEn: 'The P2P cycle generates 3 automatic accounting entries in FI. Understanding these entries means you understand how purchasing decisions impact the financial statements.',
    keyPointsEn: [
      'GR: Dr Inventory +2,500 / Cr GR-IR Clearing +2,500',
      'IV: Dr GR-IR Clearing -2,500 / Cr Accounts Payable +2,500',
      'Payment: Dr Accounts Payable -2,500 / Cr Bank -2,500',
      'Net result: Inventory +2,500, Bank -2,500',
      'GR-IR Clearing nets to zero — temporary bridge account'
    ],
  },
  'sd-s1': {
    titleEn: 'The Order-to-Cash (O2C) Process',
    subtitleEn: 'From customer order to cash received',
    contentEn: 'The Order-to-Cash process covers the complete sales cycle: from receiving a customer order to collecting payment. Each step generates documents and accounting entries automatically.',
    keyPointsEn: [
      'Step 1: Sales Order (SO) — customer order recorded',
      'Step 2: Delivery Order — warehouse preparation',
      'Step 3: Goods Issue (PGI) — stock reduction + COGS',
      'Step 4: Customer Invoice — revenue recognition',
      'Step 5: Cash Receipt — accounts receivable cleared'
    ],
  },
  'sd-s2': {
    titleEn: 'Step 1 — Sales Order (SO)',
    subtitleEn: 'The customer order in the ERP',
    contentEn: 'The Sales Order is the starting point of the O2C cycle. It records the customer\'s request, triggers the ATP check, and reserves stock. No accounting entry is generated at this stage.',
    keyPointsEn: [
      'SAP: VA01 — Create Sales Order',
      'Dynamics 365: Sales > Orders',
      'Odoo: Sales > Orders',
      'ATP Check: automatic stock availability verification',
      'No accounting entry — commitment only'
    ],
  },
  'sd-s3': {
    titleEn: 'Step 2 — Create Delivery Order',
    subtitleEn: 'Preparing the shipment',
    contentEn: 'The delivery order triggers warehouse operations: picking, packing, and loading. Stock is reserved but not yet reduced. The accounting impact happens at the Goods Issue step.',
    keyPointsEn: [
      'SAP: VL01N — Create Outbound Delivery',
      'Dynamics 365: Delivery',
      'Odoo: Delivery Order',
      'Stock reserved but not yet reduced',
      'Warehouse staff executes pick/pack/ship'
    ],
  },
  'sd-s4': {
    titleEn: 'Step 3 — Goods Issue (GI)',
    subtitleEn: 'Stock reduction',
    contentEn: 'The Goods Issue (Post Goods Issue — PGI) is the moment goods physically leave the warehouse. This step automatically reduces inventory and records the COGS entry in FI.',
    keyPointsEn: [
      'SAP: VL02N — Post Goods Issue (PGI)',
      'Dynamics 365: Ship',
      'Odoo: Validate Delivery',
      'Accounting entry: Dr COGS / Cr Inventory',
      'Stock quantity reduced in real time'
    ],
  },
  'sd-s5': {
    titleEn: 'Step 4 — Customer Billing',
    subtitleEn: 'Generating the customer invoice',
    contentEn: 'Customer billing creates the invoice and recognizes revenue. The ERP automatically generates the accounts receivable entry: the customer owes the company the invoice amount.',
    keyPointsEn: [
      'SAP: VF01 — Create Billing Document',
      'Dynamics 365: Customer Invoice',
      'Odoo: Create Invoice',
      'Accounting entry: Dr Accounts Receivable / Cr Sales Revenue',
      'Revenue recognized at invoicing (accrual basis)'
    ],
  },
  'sd-s6': {
    titleEn: 'Step 5 — Customer Payment',
    subtitleEn: 'Cash collection and O2C cycle closure',
    contentEn: 'Customer payment clears the accounts receivable. The ERP records the final entry: bank increases and accounts receivable decreases. The O2C cycle is complete.',
    keyPointsEn: [
      'SAP: F-28 — Post Incoming Payment',
      'Dynamics 365: Customer Payment',
      'Odoo: Register Payment',
      'Accounting entry: Dr Bank / Cr Accounts Receivable',
      'O2C cycle complete — receivable = 0'
    ],
  },
  'sd-s7': {
    titleEn: 'Inventory Management in the O2C Cycle',
    subtitleEn: 'Stock impact at each O2C step',
    contentEn: 'Inventory management is tightly integrated with the O2C cycle. The ATP check at order entry, stock reservation at delivery, and stock reduction at PGI all happen automatically in the ERP.',
    keyPointsEn: [
      'Sales Order: ATP check — stock availability verified',
      'Delivery: stock reserved (soft allocation)',
      'Goods Issue (PGI): stock physically reduced (hard deduction)',
      'SAP: MMBE for stock overview',
      'Dynamics 365: On-hand inventory',
      'Odoo: Inventory > Products'
    ],
  },
  'sd-s8': {
    titleEn: 'Mandatory Fields in Each O2C Step',
    subtitleEn: 'What you must enter in SAP, Dynamics, and Odoo',
    contentEn: 'Each O2C step requires specific mandatory fields. Mastering these fields means you can execute any O2C transaction in any ERP system.',
    keyPointsEn: [
      'SO: Customer, Product, Quantity, Price, Requested Delivery Date',
      'Delivery: SO Reference, Shipping Point, Carrier',
      'PGI: Delivery Reference, Actual Goods Issue Date',
      'Invoice: Delivery Reference, Billing Date, Payment Terms',
      'Payment: Invoice Reference, Amount, Bank Account'
    ],
  },
  'sd-s9': {
    titleEn: 'Accounting Impact of the O2C Cycle',
    subtitleEn: 'Entries automatically generated in FI',
    contentEn: 'The O2C cycle generates 3 automatic accounting entries in FI. Understanding these entries means you understand how sales decisions impact the financial statements.',
    keyPointsEn: [
      'PGI: Dr COGS +1,250 / Cr Inventory -1,250',
      'Invoice: Dr Accounts Receivable +2,250 / Cr Sales Revenue +2,250',
      'Payment: Dr Bank +2,250 / Cr Accounts Receivable -2,250',
      'Net result: Bank +2,250, Inventory -1,250, Revenue +2,250',
      'Gross margin = Revenue - COGS = 1,000 CAD (44.4%)'
    ],
  },
  'fi-s1': {
    titleEn: 'FI Integration with MM and SD',
    subtitleEn: 'How MM and SD automatically feed FI',
    contentEn: 'Financial Integration (FI) is the accounting backbone of the ERP. Every transaction in MM and SD automatically generates accounting entries in FI — no manual intervention required.',
    keyPointsEn: [
      'MM → FI: Goods Receipt generates Dr Inventory / Cr GR-IR',
      'MM → FI: Invoice Verification generates Dr GR-IR / Cr AP',
      'SD → FI: Goods Issue generates Dr COGS / Cr Inventory',
      'SD → FI: Customer Invoice generates Dr AR / Cr Revenue',
      'All entries posted in real time, automatically'
    ],
  },
  'fi-s2': {
    titleEn: 'Financial Impact of the P2P Cycle (MM → FI)',
    subtitleEn: 'Accounting entries generated by purchasing',
    contentEn: 'The P2P cycle generates 3 accounting entries that flow automatically from MM to FI. Understanding this flow means understanding how purchasing affects the balance sheet and income statement.',
    keyPointsEn: [
      'GR: Dr Inventory / Cr GR-IR Clearing (asset increases)',
      'IV: Dr GR-IR Clearing / Cr Accounts Payable (liability created)',
      'Payment: Dr Accounts Payable / Cr Bank (liability settled)',
      'Net: Inventory +, Bank -, AP = 0',
      'GR-IR Clearing = temporary bridge, always nets to zero'
    ],
  },
  'fi-s3': {
    titleEn: 'Financial Impact of the O2C Cycle (SD → FI)',
    subtitleEn: 'Accounting entries generated by sales',
    contentEn: 'The O2C cycle generates 3 accounting entries that flow automatically from SD to FI. These entries record the cost, revenue, and cash collection of every sale.',
    keyPointsEn: [
      'PGI: Dr COGS / Cr Inventory (cost recorded)',
      'Invoice: Dr Accounts Receivable / Cr Sales Revenue (revenue recognized)',
      'Payment: Dr Bank / Cr Accounts Receivable (cash collected)',
      'Net: Bank +, Inventory -, Revenue +',
      'Gross margin visible immediately in FI reports'
    ],
  },
  'fi-s4': {
    titleEn: 'The General Ledger',
    subtitleEn: 'The central register of all transactions',
    contentEn: 'The General Ledger is the master record of all financial transactions in the ERP. Every accounting entry from MM and SD flows into the GL automatically, providing a complete financial picture.',
    keyPointsEn: [
      'SAP: FB03 — Display Document / FS10N — Account Balance',
      'Dynamics 365: General Ledger > Transactions',
      'Odoo: Accounting > General Ledger',
      'All entries from MM and SD flow automatically',
      'Basis for all financial reports (P&L, Balance Sheet)'
    ],
  },
  'fi-s5': {
    titleEn: 'ERP Financial Reporting',
    subtitleEn: 'Financial statements generated automatically',
    contentEn: 'ERP financial reporting transforms thousands of individual transactions into consolidated financial statements. These reports are generated automatically from the GL data.',
    keyPointsEn: [
      'Income Statement (P&L): Revenue - COGS - Expenses = Net Income',
      'Balance Sheet: Assets = Liabilities + Equity',
      'Cash Flow Statement: Operating + Investing + Financing',
      'SAP: S_ALR_87012284 (P&L) / F.01 (Balance Sheet)',
      'Dynamics 365: Financial Reports',
      'Odoo: Accounting > Profit & Loss / Balance Sheet'
    ],
  },
  'fi-s6': {
    titleEn: 'Accounting Entries — Debit/Credit Logic',
    subtitleEn: 'Understanding the accounting mechanics in the ERP',
    contentEn: 'Every accounting entry follows the double-entry bookkeeping principle: every debit has a corresponding credit of equal amount. The ERP enforces this rule automatically — you cannot post an unbalanced entry.',
    keyPointsEn: [
      'Assets: Debit = increase, Credit = decrease',
      'Liabilities: Debit = decrease, Credit = increase',
      'Revenue: Debit = decrease, Credit = increase',
      'Expenses (COGS): Debit = increase, Credit = decrease',
      'Every transaction: Total Debits = Total Credits'
    ],
  },
  'fi-s7': {
    titleEn: 'ERP Financial Dashboard',
    subtitleEn: 'Key indicators and financial KPIs in all 3 systems',
    contentEn: 'ERP financial dashboards provide real-time visibility into business performance. Executives can see revenue, costs, margins, and cash position without waiting for month-end reports.',
    keyPointsEn: [
      'SAP: SAP Analytics Cloud / Fiori Dashboard',
      'Dynamics 365: Power BI embedded dashboards',
      'Odoo: Native dashboard with real-time KPIs',
      'Key KPIs: Gross Margin %, DSO, DPO, Current Ratio',
      'All data sourced directly from live ERP transactions'
    ],
  },
  'fi-s8': {
    titleEn: 'The Balance Sheet',
    subtitleEn: 'Assets, Liabilities, and Equity — the financial snapshot',
    contentEn: 'The Balance Sheet is a snapshot of the company\'s financial position at a specific date. The ERP generates it automatically from all posted transactions.',
    keyPointsEn: [
      'Assets = Liabilities + Equity (always balanced)',
      'Current Assets: Cash, Accounts Receivable, Inventory',
      'Non-Current Assets: Equipment, Buildings',
      'Current Liabilities: Accounts Payable, Short-term debt',
      'Equity: Share capital + Retained earnings'
    ],
  },
  'fi-s9': {
    titleEn: 'The Cash Flow Statement',
    subtitleEn: 'Tracking cash inflows and outflows in the ERP',
    contentEn: 'The Cash Flow Statement shows how cash moves through the business. The ERP tracks every cash transaction automatically, enabling real-time cash flow monitoring.',
    keyPointsEn: [
      'Operating Activities: cash from core business operations',
      'Investing Activities: equipment purchases, asset sales',
      'Financing Activities: loans, equity, dividends',
      'SAP: S_ALR_87012271 (Cash Flow)',
      'Dynamics 365: Cash Flow Forecast',
      'Odoo: Accounting > Cash Flow Statement'
    ],
  },
  'sim-s1': {
    titleEn: 'The Integrated ERP Simulation',
    subtitleEn: 'Putting all modules into practice in a real case',
    contentEn: 'The integrated ERP simulation is the culmination of the course. You will execute a complete business cycle — procurement, sales, and financial accounting — using all the modules learned.',
    keyPointsEn: [
      'Module MM: purchase requisition, PO, goods receipt, invoice',
      'Module SD: sales order, delivery, goods issue, customer invoice',
      'Module FI: all accounting entries generated automatically',
      'Real business case: Distributions La Concorde',
      'Same logic in SAP, Dynamics 365, and Odoo'
    ],
  },
  'sim-s2': {
    titleEn: 'Business Case — Distributions La Concorde',
    subtitleEn: 'Simulation context',
    contentEn: 'Distributions La Concorde is a technology product distributor. You are the ERP operator responsible for executing a complete integrated business cycle.',
    keyPointsEn: [
      'Company: Distributions La Concorde — technology distributor',
      'Customer: ElectroMTL — orders 80 TABLET-PRO-10 at 299.00 CAD',
      'Vendor: TechSupply Inc. — supplies tablets at 180.00 CAD',
      'Available stock: 50 units — shortage of 30 units',
      'Your mission: execute the complete P2P + O2C + FI cycle'
    ],
  },
  'sim-s3': {
    titleEn: 'Integrated Simulation Flow',
    subtitleEn: 'The 8 steps of the complete cycle',
    contentEn: 'ERP-SIM-01 combines all three modules in a single integrated scenario. The 8 steps follow the real business flow: from customer order to financial analysis.',
    keyPointsEn: [
      'Step 1: Sales Order (VA01) — ElectroMTL orders 80 tablets',
      'Step 2: Purchase Requisition (ME51N) — 30 missing units',
      'Step 3: Goods Receipt (MIGO) — 30 tablets received',
      'Step 4: Delivery + PGI (VL01N/VL02N) — 80 tablets shipped',
      'Step 5: Customer Invoice (VF01) — 23,920.00 CAD',
      'Step 6: Vendor Payment (F-53) — 5,400.00 CAD',
      'Step 7: Financial Analysis (KE30) — margin 39.8%'
    ],
  },
  'sim-s4': {
    titleEn: 'Consolidated Review — Pre-Simulation Checklist',
    subtitleEn: 'All T-codes and flows to master for ERP-SIM-01',
    contentEn: 'Before starting ERP-SIM-01, verify that you master all the T-codes, accounting entries, and business logic covered in the previous modules.',
    keyPointsEn: [
      'P2P T-codes: ME51N, ME21N, MIGO, MIRO, F-53',
      'O2C T-codes: VA01, VL01N, VL02N, VF01, F-28',
      'FI entries: GR, IV, Payment, PGI, Invoice, Receipt',
      'ATP Check: stock 50 - order 80 = shortage 30',
      'Financial analysis: Revenue - COGS = Gross Margin'
    ],
  },
  'sim-s5': {
    titleEn: 'The ATP Check',
    subtitleEn: 'Available-to-Promise: the delivery commitment logic',
    contentEn: 'The ATP (Available-to-Promise) check is the ERP\'s real-time stock availability engine. It determines whether a customer order can be fully confirmed based on current stock minus existing reservations.',
    keyPointsEn: [
      'ATP = Available Stock - Existing Reservations - Safety Stock',
      'If ATP ≥ Order Quantity: full delivery confirmed',
      'If ATP < Order Quantity: partial delivery or backorder',
      'SAP: CO09 — Check ATP',
      'Dynamics 365: Available-to-Promise Check',
      'Odoo: Automatic availability check on order confirmation'
    ],
  },
  'sim-s6': {
    titleEn: 'Accounting Entries of the Simulation',
    subtitleEn: 'All FI entries generated by ERP-SIM-01',
    contentEn: 'ERP-SIM-01 generates 5 automatic accounting entries. Understanding all of them means you understand the complete financial impact of an integrated business cycle.',
    keyPointsEn: [
      'GR (MIGO): Dr Inventory 5,400 / Cr GR-IR 5,400',
      'IV (MIRO): Dr GR-IR 5,400 / Cr AP 5,400',
      'Payment (F-53): Dr AP 5,400 / Cr Bank 5,400',
      'PGI (VL02N): Dr COGS 14,400 / Cr Inventory 14,400',
      'Invoice (VF01): Dr AR 23,920 / Cr Sales 23,920',
      'Net: Bank -5,400, Inventory 0, Revenue +23,920, COGS -14,400'
    ],
  },
  'sim-s7': {
    titleEn: 'Profitability Analysis — Reading an ERP P&L',
    subtitleEn: 'Interpreting the income statement generated by the simulation',
    contentEn: 'The profitability analysis is the final step of ERP-SIM-01. It synthesizes all the financial data from the simulation into a management P&L.',
    keyPointsEn: [
      'Revenue: 80 × 299.00 = 23,920.00 CAD',
      'COGS: 80 × 180.00 = 14,400.00 CAD',
      'Gross Margin: 23,920 - 14,400 = 9,520.00 CAD',
      'Gross Margin %: 9,520 / 23,920 = 39.8%',
      'SAP: KE30 / D365: Profitability Analysis / Odoo: P&L Report'
    ],
  },
  'sim-s8': {
    titleEn: 'Comparison of 3 ERPs — Integrated Simulation',
    subtitleEn: 'SAP vs Dynamics 365 vs Odoo for a complete cycle',
    contentEn: 'The same integrated simulation can be executed in SAP, Dynamics 365, or Odoo. The business process is identical — only the interface and terminology differ.',
    keyPointsEn: [
      'SAP: T-codes (ME51N, VA01, MIGO, VF01, F-53)',
      'Dynamics 365: Menu-driven (Procurement, Sales, Finance)',
      'Odoo: Web-based (Purchases, Sales, Accounting)',
      'Same 8 steps, same accounting entries, same result',
      'Knowing one ERP means you understand all of them'
    ],
  },
  'sim-s9': {
    titleEn: 'Common Errors and How to Fix Them',
    subtitleEn: 'The 6 most frequent errors in ERP-SIM-01',
    contentEn: 'These are the most common errors students make in ERP-SIM-01. Knowing them in advance means you can avoid them and complete the simulation efficiently.',
    keyPointsEn: [
      'Error 1: Ordering 80 units instead of 30 (only the shortage)',
      'Error 2: Using the wrong carrier (Purolator, not FedEx)',
      'Error 3: Invoice amount 5,400 instead of 23,920 (confusing P2P and O2C)',
      'Error 4: COGS = 5,400 instead of 14,400 (30 units vs 80 units)',
      'Error 5: Gross margin = 18,520 (Revenue - vendor payment, not COGS)',
      'Error 6: Skipping the GR step before the vendor invoice'
    ],
  },
  'sim-s10': {
    titleEn: 'Course Summary — ERP Skills Acquired',
    subtitleEn: 'What you can do after Programme 2 ERP',
    contentEn: 'You have completed Programme 2 — ERP Integrated Business Simulator. Here is a summary of the concrete skills you have developed and can apply in any ERP environment.',
    keyPointsEn: [
      'Execute the complete P2P cycle (PR → PO → GR → IV → Payment)',
      'Execute the complete O2C cycle (SO → Delivery → PGI → Invoice → Payment)',
      'Read and interpret automatic FI accounting entries',
      'Analyze profitability using ERP financial reports',
      'Navigate SAP T-codes, Dynamics 365 menus, and Odoo modules',
      'What you practiced here is exactly what companies use in the field'
    ],
  },
};

// ---- mm-s10 slide translation (GR/IR Key Concept) ----
// Note: mm-s10 already has titleEn/contentEn inline in erpData.ts (the GR/IR slide)
// This entry ensures the lookup map is complete
export const mmS10SlideEn = {
  'mm-s10': {
    titleEn: 'The GR/IR Clearing Account — Key Concept',
    subtitleEn: 'The bridge between physical receipt and vendor invoice',
    contentEn: 'The GR/IR (Goods Receipt / Invoice Receipt) Clearing Account is a temporary bridge account between MM and FI. It ensures that inventory and accounting remain synchronized even when the physical receipt and the vendor invoice arrive at different times.',
    keyPointsEn: [
      'At MIGO (GR): Dr Inventory / Cr GR-IR Clearing — goods received, invoice pending',
      'At MIRO (IV): Dr GR-IR Clearing / Cr Accounts Payable — invoice posted, bridge cleared',
      'Net result: GR-IR Clearing = 0 (always nets to zero)',
      'Prevents double-counting between physical and financial flows',
      'SAP: WT10 / D365: Accrual Account / Odoo: Interim Account'
    ],
  },
};
