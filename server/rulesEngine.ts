/**
 * Rules Engine — Module 1, Module 2 & Module 3
 *
 * Module 1: WMS Process Flow
 *   PO → GR → Stock Available → SO → GI → Cycle Count → Compliance
 *
 * Module 2: Exécution d'entrepôt et gestion des emplacements
 *   GR → PUTAWAY → FIFO_PICK → STOCK_ACCURACY → COMPLIANCE_ADV
 *
 * Module 3: Contrôle des stocks et réapprovisionnement
 *   CC_LIST → CC_COUNT → CC_RECON → REPLENISH → COMPLIANCE_M3
 */

// ─── Shared Types ─────────────────────────────────────────────────────────────
export type StepCode =
  | "PO" | "GR" | "STOCK" | "SO" | "GI" | "CC" | "COMPLIANCE"   // Module 1
  | "PUTAWAY" | "FIFO_PICK" | "STOCK_ACCURACY" | "COMPLIANCE_ADV" // Module 2
  | "CC_LIST" | "CC_COUNT" | "CC_RECON" | "REPLENISH" | "COMPLIANCE_M3"; // Module 3

export interface StepDefinition {
  code: StepCode;
  labelFr: string;
  labelEn: string;
  order: number;
  prerequisite: StepCode | null;
  moduleId: number;
}

export interface RunState {
  completedSteps: StepCode[];
  transactions: Array<{
    docType: string;
    sku: string;
    bin: string;
    qty: number;
    posted: boolean;
  }>;
  cycleCounts: Array<{
    sku: string;
    bin: string;
    variance: number;
    resolved: boolean;
  }>;
  inventory: Record<string, number>; // key: `${sku}::${bin}`
}

// ─── Module 1 Step Definitions ────────────────────────────────────────────────
export const MODULE1_STEPS: StepDefinition[] = [
  { code: "PO",          labelFr: "Bon de commande",        labelEn: "Purchase Order",      order: 1, prerequisite: null,    moduleId: 1 },
  { code: "GR",          labelFr: "Réception marchandises", labelEn: "Goods Receipt",        order: 2, prerequisite: "PO",    moduleId: 1 },
  { code: "STOCK",       labelFr: "Stock disponible",       labelEn: "Stock Available",      order: 3, prerequisite: "GR",    moduleId: 1 },
  { code: "SO",          labelFr: "Commande client",        labelEn: "Sales Order",          order: 4, prerequisite: "STOCK", moduleId: 1 },
  { code: "GI",          labelFr: "Sortie marchandises",    labelEn: "Goods Issue",          order: 5, prerequisite: "SO",    moduleId: 1 },
  { code: "CC",          labelFr: "Comptage cyclique",      labelEn: "Cycle Count",          order: 6, prerequisite: "GI",    moduleId: 1 },
  { code: "COMPLIANCE",  labelFr: "Conformité système",     labelEn: "System Compliance",    order: 7, prerequisite: "CC",    moduleId: 1 },
];

// ─── Module 2 Step Definitions ────────────────────────────────────────────────
export const MODULE2_STEPS: StepDefinition[] = [
  { code: "GR",            labelFr: "Réception marchandises",   labelEn: "Goods Receipt",         order: 1, prerequisite: null,          moduleId: 2 },
  { code: "PUTAWAY",       labelFr: "Rangement structuré",      labelEn: "Structured Putaway",    order: 2, prerequisite: "GR",           moduleId: 2 },
  { code: "FIFO_PICK",     labelFr: "Prélèvement FIFO",         labelEn: "FIFO Pick",             order: 3, prerequisite: "PUTAWAY",      moduleId: 2 },
  { code: "STOCK_ACCURACY",labelFr: "Précision inventaire",     labelEn: "Stock Accuracy",        order: 4, prerequisite: "FIFO_PICK",    moduleId: 2 },
  { code: "COMPLIANCE_ADV",labelFr: "Conformité avancée",       labelEn: "Advanced Compliance",   order: 5, prerequisite: "STOCK_ACCURACY", moduleId: 2 },
];

// ─── Module 3 Step Definitions ────────────────────────────────────────────────
export const MODULE3_STEPS: StepDefinition[] = [
  { code: "CC_LIST",        labelFr: "Liste de comptage",           labelEn: "Count List",        order: 1, prerequisite: null,          moduleId: 3 },
  { code: "CC_COUNT",       labelFr: "Saisie des quantités",        labelEn: "Count Entry",       order: 2, prerequisite: "CC_LIST",     moduleId: 3 },
  { code: "CC_RECON",       labelFr: "Réconciliation & ajustement", labelEn: "Reconciliation",    order: 3, prerequisite: "CC_COUNT",    moduleId: 3 },
  { code: "REPLENISH",      labelFr: "Réapprovisionnement",         labelEn: "Replenishment",     order: 4, prerequisite: "CC_RECON",    moduleId: 3 },
  { code: "COMPLIANCE_M3",  labelFr: "Conformité Module 3",         labelEn: "M3 Compliance",     order: 5, prerequisite: "REPLENISH",   moduleId: 3 },
];

// ─── Validation Result ────────────────────────────────────────────────────────
export interface ValidationResult {
  allowed: boolean;
  reason?: string;
  reasonFr?: string;
}

// ─── Module 1: canExecuteStep ─────────────────────────────────────────────────
export function canExecuteStep(step: StepCode, state: RunState): ValidationResult {
  const stepDef = MODULE1_STEPS.find((s) => s.code === step);
  if (!stepDef) return { allowed: false, reason: "Unknown step", reasonFr: "Étape inconnue" };

  if (stepDef.prerequisite && !state.completedSteps.includes(stepDef.prerequisite)) {
    const prereqDef = MODULE1_STEPS.find((s) => s.code === stepDef.prerequisite);
    return {
      allowed: false,
      reason: `Step ${stepDef.prerequisite} must be completed first`,
      reasonFr: `L'étape "${prereqDef?.labelFr}" doit être complétée en premier`,
    };
  }

  if (step === "GR") {
    const hasPO = state.transactions.some((t) => t.docType === "PO" && t.posted);
    if (!hasPO) {
      return {
        allowed: false,
        reason: "No posted Purchase Order found in this run",
        reasonFr: "Aucun Bon de commande (PO) posté trouvé dans cette session",
      };
    }
  }

  if (step === "STOCK") {
    const hasGR = state.transactions.some((t) => t.docType === "GR" && t.posted);
    if (!hasGR) {
      return {
        allowed: false,
        reason: "No posted Goods Receipt found",
        reasonFr: "Aucune Réception marchandises (GR) postée trouvée",
      };
    }
    const totalStock = Object.values(state.inventory).reduce((a, b) => a + b, 0);
    if (totalStock <= 0) {
      return {
        allowed: false,
        reason: "Stock on-hand is zero or negative",
        reasonFr: "Le stock disponible est nul ou négatif",
      };
    }
  }

  if (step === "GI") {
    const hasSO = state.transactions.some((t) => t.docType === "SO" && t.posted);
    if (!hasSO) {
      return {
        allowed: false,
        reason: "No posted Sales Order found",
        reasonFr: "Aucune Commande client (SO) postée trouvée",
      };
    }
  }

  if (step === "COMPLIANCE") {
    const result = checkCompliance(state);
    if (!result.compliant) {
      return {
        allowed: false,
        reason: result.issues.join("; "),
        reasonFr: result.issuesFr.join("; "),
      };
    }
  }

  return { allowed: true };
}

// ─── Module 2: Putaway Validation ────────────────────────────────────────────
export interface PutawayContext {
  sku: string;
  fromBin: string;
  toBin: string;
  qty: number;
  /** All bins with their max capacities, keyed by binCode */
  binCapacities: Record<string, number>;
  /** Current inventory per bin (all SKUs combined), keyed by binCode */
  binCurrentLoad: Record<string, number>;
  /** Existing putaway lots for the SKU, ordered by receivedAt ASC (oldest first) */
  existingLots: Array<{ lotNumber: string; receivedAt: Date; qty: number }>;
  /** The lot number being placed (for FIFO check) */
  lotNumber: string;
  /** When this lot was received (for FIFO check) */
  receivedAt: Date;
}

export interface PutawayValidationResult extends ValidationResult {
  penaltyEvent?: "CAPACITY_OVERFLOW" | "FIFO_VIOLATION";
  penaltyPoints?: number;
}

/**
 * Validates a putaway operation for Module 2.
 * Returns allowed=true only if:
 *  1. toBin exists in binCapacities
 *  2. Adding qty does not exceed bin max capacity
 *  3. No older un-placed lot exists for the same SKU (FIFO)
 */
export function validatePutaway(ctx: PutawayContext): PutawayValidationResult {
  // 1. Bin existence check
  if (!(ctx.toBin in ctx.binCapacities)) {
    return {
      allowed: false,
      reason: `Bin "${ctx.toBin}" does not exist in the warehouse master`,
      reasonFr: `L'emplacement "${ctx.toBin}" n'existe pas dans le référentiel entrepôt`,
    };
  }

  // 2. Capacity check
  const maxCap = ctx.binCapacities[ctx.toBin];
  const currentLoad = ctx.binCurrentLoad[ctx.toBin] ?? 0;
  if (currentLoad + ctx.qty > maxCap) {
    return {
      allowed: false,
      reason: `Bin "${ctx.toBin}" capacity exceeded: ${currentLoad + ctx.qty} > ${maxCap}`,
      reasonFr: `Capacité de l'emplacement "${ctx.toBin}" dépassée : ${currentLoad + ctx.qty} / ${maxCap} unités — débordement de ${currentLoad + ctx.qty - maxCap} unités`,
      penaltyEvent: "CAPACITY_OVERFLOW",
      penaltyPoints: -10,
    };
  }

  // 3. FIFO check — reject if an older unplaced lot exists for this SKU
  const olderLots = ctx.existingLots.filter(
    (lot) => lot.receivedAt < ctx.receivedAt && lot.lotNumber !== ctx.lotNumber
  );
  if (olderLots.length > 0) {
    const oldest = olderLots[0];
    return {
      allowed: false,
      reason: `FIFO violation: lot ${oldest.lotNumber} (received ${oldest.receivedAt.toISOString()}) must be placed before ${ctx.lotNumber}`,
      reasonFr: `Violation FIFO : le lot ${oldest.lotNumber} (reçu le ${oldest.receivedAt.toLocaleDateString("fr-CA")}) doit être rangé avant le lot ${ctx.lotNumber}`,
      penaltyEvent: "FIFO_VIOLATION",
      penaltyPoints: -15,
    };
  }

  return { allowed: true };
}

// ─── Module 2: canExecuteStep ─────────────────────────────────────────────────
export function canExecuteStepM2(step: StepCode, state: RunState): ValidationResult {
  const stepDef = MODULE2_STEPS.find((s) => s.code === step);
  if (!stepDef) return { allowed: false, reason: "Unknown M2 step", reasonFr: "Étape M2 inconnue" };

  if (stepDef.prerequisite && !state.completedSteps.includes(stepDef.prerequisite)) {
    const prereqDef = MODULE2_STEPS.find((s) => s.code === stepDef.prerequisite);
    return {
      allowed: false,
      reason: `Step ${stepDef.prerequisite} must be completed first`,
      reasonFr: `L'étape "${prereqDef?.labelFr}" doit être complétée en premier`,
    };
  }

  if (step === "PUTAWAY") {
    const hasGR = state.transactions.some((t) => t.docType === "GR" && t.posted);
    if (!hasGR) {
      return {
        allowed: false,
        reason: "No posted Goods Receipt — receive goods before putaway",
        reasonFr: "Aucune GR postée — réceptionnez les marchandises avant le rangement",
      };
    }
  }

  if (step === "FIFO_PICK") {
    const hasPutaway = state.completedSteps.includes("PUTAWAY");
    if (!hasPutaway) {
      return {
        allowed: false,
        reason: "Putaway must be completed before FIFO pick",
        reasonFr: "Le rangement doit être complété avant le prélèvement FIFO",
      };
    }
  }

  if (step === "COMPLIANCE_ADV") {
    const result = checkCompliance(state);
    if (!result.compliant) {
      return {
        allowed: false,
        reason: result.issues.join("; "),
        reasonFr: result.issuesFr.join("; "),
      };
    }
  }

  return { allowed: true };
}

// ─── Module 3 Constants ───────────────────────────────────────────────────────
export const M3_VARIANCE_THRESHOLD = 5; // abs(variance) >= 5 requires justification

// ─── Module 3: Variance Computation ──────────────────────────────────────────
export interface VarianceResult {
  sku: string;
  systemQty: number;
  countedQty: number;
  varianceQty: number;
  requiresJustification: boolean;
  isCritical: boolean;
}

export function computeVariance(
  systemQty: number,
  countedQty: number
): { varianceQty: number; requiresJustification: boolean } {
  const varianceQty = countedQty - systemQty;
  return {
    varianceQty,
    requiresJustification: Math.abs(varianceQty) >= M3_VARIANCE_THRESHOLD,
  };
}

export function validateVarianceEntry(
  systemQty: number,
  countedQty: number,
  reason: string | null | undefined
): ValidationResult {
  const { varianceQty, requiresJustification } = computeVariance(systemQty, countedQty);
  if (requiresJustification && (!reason || reason.trim().length < 5)) {
    return {
      allowed: false,
      reason: `Variance of ${varianceQty} exceeds threshold (${M3_VARIANCE_THRESHOLD}); justification required`,
      reasonFr: `L'écart de ${varianceQty} dépasse le seuil (${M3_VARIANCE_THRESHOLD}) — une justification est obligatoire`,
    };
  }
  return { allowed: true };
}

// ─── Module 3: Adjustment Validation ─────────────────────────────────────────
export function validateAdjustment(
  varianceQty: number,
  adjustmentQty: number
): ValidationResult {
  if (Math.abs(adjustmentQty - varianceQty) > 0.01) {
    return {
      allowed: false,
      reason: `Adjustment qty (${adjustmentQty}) must equal variance qty (${varianceQty})`,
      reasonFr: `La quantité d'ajustement (${adjustmentQty}) doit correspondre à l'écart (${varianceQty})`,
    };
  }
  return { allowed: true };
}

// ─── Module 3: Replenishment Logic ────────────────────────────────────────────
export interface ReplenishmentInput {
  sku: string;
  systemQty: number;
  minQty: number;
  maxQty: number;
  safetyStock: number;
}

export interface ReplenishmentOutput {
  sku: string;
  systemQty: number;
  suggestedQty: number;
  reason: string;
  isCritical: boolean;
  needsReplenishment: boolean;
}

export function computeReplenishmentSuggestion(input: ReplenishmentInput): ReplenishmentOutput {
  const { sku, systemQty, minQty, maxQty, safetyStock } = input;
  const isCritical = systemQty < safetyStock;
  const needsReplenishment = systemQty < minQty;

  if (!needsReplenishment) {
    return { sku, systemQty, suggestedQty: 0, reason: "Stock suffisant", isCritical, needsReplenishment };
  }

  const suggestedQty = maxQty - systemQty;
  const reasons: string[] = ["Below Min"];
  if (isCritical) reasons.push("Safety Stock");

  return { sku, systemQty, suggestedQty, reason: reasons.join(" + "), isCritical, needsReplenishment };
}

// ─── Module 3: Step Sequence Validation ──────────────────────────────────────
export function canExecuteStepM3(step: StepCode, completedSteps: StepCode[]): ValidationResult {
  const stepDef = MODULE3_STEPS.find((s) => s.code === step);
  if (!stepDef) return { allowed: false, reason: "Unknown M3 step", reasonFr: "Étape M3 inconnue" };

  if (stepDef.prerequisite && !completedSteps.includes(stepDef.prerequisite as StepCode)) {
    const prereqDef = MODULE3_STEPS.find((s) => s.code === stepDef.prerequisite);
    return {
      allowed: false,
      reason: `Step ${stepDef.prerequisite} must be completed first`,
      reasonFr: `L'étape "${prereqDef?.labelFr}" doit être complétée en premier`,
    };
  }
  return { allowed: true };
}

// ─── Module Unlock Check ──────────────────────────────────────────────────────
/**
 * Module 1 (unlockedByModuleId = null) is always accessible.
 * Module 2 requires Module 1 passed.
 * Module 3 requires Module 2 passed AND teacherValidated (hybrid unlock).
 */
export function isModuleUnlocked(
  moduleUnlockedByModuleId: number | null,
  passedModuleIds: number[]
): boolean {
  if (moduleUnlockedByModuleId === null) return true;
  return passedModuleIds.includes(moduleUnlockedByModuleId);
}

/** Hybrid unlock: Module 3 requires Module 2 passed AND teacherValidated. */
export function isModule3Unlocked(
  module2Progress: { passed: boolean; teacherValidated: boolean } | null | undefined
): boolean {
  if (!module2Progress) return false;
  return module2Progress.passed && module2Progress.teacherValidated;
}

// ─── Inventory Calculation ────────────────────────────────────────────────────
export function calculateInventory(
  transactions: Array<{ docType: string; sku: string; bin: string; qty: number; posted: boolean }>
): Record<string, number> {
  const inventory: Record<string, number> = {};

  for (const tx of transactions) {
    if (!tx.posted) continue;
    const key = `${tx.sku}::${tx.bin}`;
    if (!(key in inventory)) inventory[key] = 0;

    if (tx.docType === "GR" || tx.docType === "ADJ" || tx.docType === "PUTAWAY") {
      inventory[key] += Number(tx.qty);
    } else if (tx.docType === "GI") {
      inventory[key] -= Number(tx.qty);
    }
  }

  return inventory;
}

/**
 * Calculates total load per bin (all SKUs combined) for capacity checks.
 */
export function calculateBinLoad(
  transactions: Array<{ docType: string; bin: string; qty: number; posted: boolean }>
): Record<string, number> {
  const load: Record<string, number> = {};
  for (const tx of transactions) {
    if (!tx.posted) continue;
    if (tx.docType === "PUTAWAY" || tx.docType === "GR") {
      load[tx.bin] = (load[tx.bin] ?? 0) + Number(tx.qty);
    } else if (tx.docType === "GI") {
      load[tx.bin] = (load[tx.bin] ?? 0) - Number(tx.qty);
    }
  }
  return load;
}

// ─── GI Stock Check ───────────────────────────────────────────────────────────
export function canIssueStock(
  sku: string,
  bin: string,
  qty: number,
  inventory: Record<string, number>
): ValidationResult {
  const key = `${sku}::${bin}`;
  const available = inventory[key] ?? 0;
  if (available < qty) {
    return {
      allowed: false,
      reason: `Insufficient stock: ${available} available, ${qty} requested`,
      reasonFr: `Stock insuffisant : ${available} disponible, ${qty} demandé — approvisionnement requis`,
    };
  }
  return { allowed: true };
}

// ─── Compliance Check ─────────────────────────────────────────────────────────
export interface ComplianceResult {
  compliant: boolean;
  issues: string[];
  issuesFr: string[];
}

export function checkCompliance(state: RunState): ComplianceResult {
  const issues: string[] = [];
  const issuesFr: string[] = [];

  const unposted = state.transactions.filter((t) => !t.posted);
  if (unposted.length > 0) {
    issues.push(`${unposted.length} unposted transaction(s) detected`);
    issuesFr.push(`${unposted.length} transaction(s) non postée(s) détectée(s)`);
  }

  for (const [key, qty] of Object.entries(state.inventory)) {
    if (qty < 0) {
      const [sku, bin] = key.split("::");
      issues.push(`Negative stock: ${sku} in ${bin} (${qty})`);
      issuesFr.push(`Stock négatif : ${sku} dans ${bin} (${qty})`);
    }
  }

  const unresolved = state.cycleCounts.filter((c) => c.variance !== 0 && !c.resolved);
  if (unresolved.length > 0) {
    issues.push(`${unresolved.length} unresolved inventory variance(s)`);
    issuesFr.push(`${unresolved.length} écart(s) d'inventaire non résolu(s) — ADJ requis`);
  }

  return { compliant: issues.length === 0, issues, issuesFr };
}

// ─── Next Required Step ───────────────────────────────────────────────────────
export function getNextRequiredStep(completedSteps: StepCode[], moduleId = 1): StepDefinition | null {
  const steps = moduleId === 3 ? MODULE3_STEPS : moduleId === 2 ? MODULE2_STEPS : MODULE1_STEPS;
  for (const step of steps) {
    if (!completedSteps.includes(step.code)) {
      return step;
    }
  }
  return null;
}

// ─── Progress Percentage ──────────────────────────────────────────────────────
export function calculateProgressPct(completedSteps: StepCode[], moduleId = 1): number {
  const steps = moduleId === 3 ? MODULE3_STEPS : moduleId === 2 ? MODULE2_STEPS : MODULE1_STEPS;
  return Math.round((completedSteps.length / steps.length) * 100);
}

// ─── Module 4: Indicateurs de performance logistique ─────────────────────────
// Steps: KPI_DATA → KPI_ROTATION → KPI_SERVICE → KPI_DIAGNOSTIC → COMPLIANCE_M4

export type StepCodeM4 = "KPI_DATA" | "KPI_ROTATION" | "KPI_SERVICE" | "KPI_DIAGNOSTIC" | "COMPLIANCE_M4";

export const MODULE4_STEPS: StepDefinition[] = [
  { code: "KPI_DATA"       as StepCode, labelFr: "Collecte des données KPI",       labelEn: "KPI Data Collection",        order: 1, prerequisite: null,            moduleId: 4 },
  { code: "KPI_ROTATION"   as StepCode, labelFr: "Calcul rotation des stocks",     labelEn: "Inventory Turnover",         order: 2, prerequisite: "KPI_DATA" as StepCode,       moduleId: 4 },
  { code: "KPI_SERVICE"    as StepCode, labelFr: "Taux de service et erreurs",     labelEn: "Service Level & Error Rate", order: 3, prerequisite: "KPI_ROTATION" as StepCode,   moduleId: 4 },
  { code: "KPI_DIAGNOSTIC" as StepCode, labelFr: "Diagnostic global de performance", labelEn: "Global Performance Diagnosis", order: 4, prerequisite: "KPI_SERVICE" as StepCode, moduleId: 4 },
  { code: "COMPLIANCE_M4"  as StepCode, labelFr: "Validation finale M4",           labelEn: "M4 Final Validation",        order: 5, prerequisite: "KPI_DIAGNOSTIC" as StepCode, moduleId: 4 },
];

export interface KpiData {
  annualConsumption: number;   // units consumed per year
  averageStock: number;        // average stock level
  ordersFulfilled: number;     // orders fulfilled on time
  totalOrders: number;         // total orders placed
  operationalErrors: number;   // number of errors
  totalOperations: number;     // total operations performed
  avgLeadTimeDays: number;     // average processing time in days
  stockValue: number;          // total immobilized stock value (CAD)
}

export interface KpiResult {
  rotationRate: number;        // annualConsumption / averageStock
  serviceLevel: number;        // ordersFulfilled / totalOrders (0–1)
  errorRate: number;           // operationalErrors / totalOperations (0–1)
  averageLeadTime: number;     // days
  stockImmobilizedValue: number;
  rotationStatus: "surstock" | "normal" | "sous-performance";
  serviceLevelStatus: "excellent" | "acceptable" | "insuffisant";
  errorRateStatus: "excellent" | "acceptable" | "critique";
}

export function calculateKpis(data: KpiData): KpiResult {
  const rotationRate = data.averageStock > 0 ? data.annualConsumption / data.averageStock : 0;
  const serviceLevel = data.totalOrders > 0 ? data.ordersFulfilled / data.totalOrders : 0;
  const errorRate = data.totalOperations > 0 ? data.operationalErrors / data.totalOperations : 0;

  const rotationStatus: KpiResult["rotationStatus"] =
    rotationRate > 12 ? "sous-performance" :
    rotationRate < 4  ? "surstock" : "normal";

  const serviceLevelStatus: KpiResult["serviceLevelStatus"] =
    serviceLevel >= 0.95 ? "excellent" :
    serviceLevel >= 0.85 ? "acceptable" : "insuffisant";

  const errorRateStatus: KpiResult["errorRateStatus"] =
    errorRate <= 0.01 ? "excellent" :
    errorRate <= 0.05 ? "acceptable" : "critique";

  return {
    rotationRate: Math.round(rotationRate * 100) / 100,
    serviceLevel: Math.round(serviceLevel * 10000) / 10000,
    errorRate: Math.round(errorRate * 10000) / 10000,
    averageLeadTime: data.avgLeadTimeDays,
    stockImmobilizedValue: data.stockValue,
    rotationStatus,
    serviceLevelStatus,
    errorRateStatus,
  };
}

export function scoreKpiInterpretation(
  kpiKey: "rotationRate" | "serviceLevel" | "errorRate" | "diagnostic",
  studentAnswer: string,
  kpiResult: KpiResult
): { isCorrect: boolean; pointsDelta: number; feedback: string } {
  const answer = studentAnswer.toLowerCase().trim();

  if (kpiKey === "rotationRate") {
    const correct = kpiResult.rotationStatus;
    const isCorrect =
      (correct === "surstock" && (answer.includes("surstock") || answer.includes("sur-stock") || answer.includes("excès"))) ||
      (correct === "normal" && (answer.includes("normal") || answer.includes("optimal") || answer.includes("équilibr"))) ||
      (correct === "sous-performance" && (answer.includes("sous") || answer.includes("rupture") || answer.includes("insuffisant")));
    return {
      isCorrect,
      pointsDelta: isCorrect ? 15 : -5,
      feedback: isCorrect
        ? `Correct — taux de rotation ${kpiResult.rotationRate}x → situation ${correct}`
        : `Incorrect — taux ${kpiResult.rotationRate}x indique une situation de ${correct}`,
    };
  }

  if (kpiKey === "serviceLevel") {
    const correct = kpiResult.serviceLevelStatus;
    const isCorrect =
      (correct === "excellent" && (answer.includes("excellent") || answer.includes("très bon") || answer.includes("optimal"))) ||
      (correct === "acceptable" && (answer.includes("acceptable") || answer.includes("moyen") || answer.includes("correct"))) ||
      (correct === "insuffisant" && (answer.includes("insuffisant") || answer.includes("faible") || answer.includes("problème") || answer.includes("améliorer")));
    return {
      isCorrect,
      pointsDelta: isCorrect ? 15 : -5,
      feedback: isCorrect
        ? `Correct — taux de service ${(kpiResult.serviceLevel * 100).toFixed(1)}% → ${correct}`
        : `Incorrect — ${(kpiResult.serviceLevel * 100).toFixed(1)}% indique un niveau ${correct}`,
    };
  }

  if (kpiKey === "errorRate") {
    const correct = kpiResult.errorRateStatus;
    const isCorrect =
      (correct === "excellent" && (answer.includes("excellent") || answer.includes("faible") || answer.includes("bien"))) ||
      (correct === "acceptable" && (answer.includes("acceptable") || answer.includes("modéré") || answer.includes("correct"))) ||
      (correct === "critique" && (answer.includes("critique") || answer.includes("élevé") || answer.includes("problème") || answer.includes("action")));
    return {
      isCorrect,
      pointsDelta: isCorrect ? 15 : -5,
      feedback: isCorrect
        ? `Correct — taux d'erreur ${(kpiResult.errorRate * 100).toFixed(2)}% → ${correct}`
        : `Incorrect — ${(kpiResult.errorRate * 100).toFixed(2)}% est un niveau ${correct}`,
    };
  }

  // Diagnostic global (Scenario 3) — bonus for strategic recommendation
  const hasRecommendation = answer.length > 50 &&
    (answer.includes("recommand") || answer.includes("action") || answer.includes("améliorer") || answer.includes("stratégie") || answer.includes("décision"));
  return {
    isCorrect: hasRecommendation,
    pointsDelta: hasRecommendation ? 20 : 0,
    feedback: hasRecommendation
      ? "Bonne analyse stratégique — recommandation pertinente identifiée"
      : "Analyse incomplète — une recommandation stratégique justifiée est attendue",
  };
}

// ─── Module 5: Simulation opérationnelle intégrée ────────────────────────────
// Steps: M5_RECEPTION → M5_PUTAWAY → M5_CYCLE_COUNT → M5_REPLENISH → M5_KPI → M5_DECISION → COMPLIANCE_M5

export const MODULE5_STEPS: StepDefinition[] = [
  { code: "M5_RECEPTION"   as StepCode, labelFr: "Réception fournisseur",          labelEn: "Supplier Reception",          order: 1, prerequisite: null,                  moduleId: 5 },
  { code: "M5_PUTAWAY"     as StepCode, labelFr: "Rangement et FIFO",              labelEn: "Putaway & FIFO",               order: 2, prerequisite: "M5_RECEPTION" as StepCode,   moduleId: 5 },
  { code: "M5_CYCLE_COUNT" as StepCode, labelFr: "Inventaire cyclique",            labelEn: "Cycle Count",                  order: 3, prerequisite: "M5_PUTAWAY" as StepCode,     moduleId: 5 },
  { code: "M5_REPLENISH"   as StepCode, labelFr: "Réapprovisionnement",            labelEn: "Replenishment",                order: 4, prerequisite: "M5_CYCLE_COUNT" as StepCode, moduleId: 5 },
  { code: "M5_KPI"         as StepCode, labelFr: "Calcul des KPI",                 labelEn: "KPI Calculation",              order: 5, prerequisite: "M5_REPLENISH" as StepCode,   moduleId: 5 },
  { code: "M5_DECISION"    as StepCode, labelFr: "Décision stratégique",           labelEn: "Strategic Decision",           order: 6, prerequisite: "M5_KPI" as StepCode,         moduleId: 5 },
  { code: "COMPLIANCE_M5"  as StepCode, labelFr: "Validation finale M5",           labelEn: "M5 Final Validation",          order: 7, prerequisite: "M5_DECISION" as StepCode,    moduleId: 5 },
];

export function scoreM5Decision(studentDecision: string, kpiResult: KpiResult): { score: number; feedback: string } {
  const text = studentDecision.toLowerCase();
  let score = 0;
  const feedbackParts: string[] = [];

  // Check for KPI-based reasoning
  if (text.includes("rotation") || text.includes("turnover")) { score += 10; feedbackParts.push("✓ Rotation des stocks mentionnée"); }
  if (text.includes("service") || text.includes("taux de service")) { score += 10; feedbackParts.push("✓ Taux de service mentionné"); }
  if (text.includes("erreur") || text.includes("error")) { score += 10; feedbackParts.push("✓ Taux d'erreur mentionné"); }

  // Check for strategic action
  if (text.includes("réapprovisionnement") || text.includes("commander") || text.includes("stock")) { score += 15; feedbackParts.push("✓ Action de réapprovisionnement proposée"); }
  if (text.includes("formation") || text.includes("procédure") || text.includes("améliorer")) { score += 15; feedbackParts.push("✓ Action corrective identifiée"); }

  // Bonus for comprehensive analysis (Scenario 3 higher weighting)
  if (text.length > 150 && feedbackParts.length >= 4) { score += 20; feedbackParts.push("✓ Analyse complète et justifiée"); }

  return {
    score: Math.min(score, 80), // max 80 pts from decision, rest from sequence
    feedback: feedbackParts.length > 0 ? feedbackParts.join(" | ") : "Décision insuffisamment justifiée — référencez les KPI observés",
  };
}

// ─── Updated getNextRequiredStep (all modules) ────────────────────────────────
export function getNextRequiredStepAllModules(completedSteps: StepCode[], moduleId: number): StepDefinition | null {
  const stepsMap: Record<number, StepDefinition[]> = {
    1: MODULE1_STEPS,
    2: MODULE2_STEPS,
    3: MODULE3_STEPS,
    4: MODULE4_STEPS,
    5: MODULE5_STEPS,
  };
  const steps = stepsMap[moduleId] ?? MODULE1_STEPS;
  for (const step of steps) {
    if (!completedSteps.includes(step.code)) {
      return step;
    }
  }
  return null;
}

export function calculateProgressPctAllModules(completedSteps: StepCode[], moduleId: number): number {
  const stepsMap: Record<number, StepDefinition[]> = {
    1: MODULE1_STEPS,
    2: MODULE2_STEPS,
    3: MODULE3_STEPS,
    4: MODULE4_STEPS,
    5: MODULE5_STEPS,
  };
  const steps = stepsMap[moduleId] ?? MODULE1_STEPS;
  if (steps.length === 0) return 0;
  return Math.round((completedSteps.length / steps.length) * 100);
}
