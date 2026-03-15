/**
 * Scoring Engine — Module 1 (100 points total)
 * Separate from compliance logic.
 */

export interface ScoringRule {
  eventType: string;
  points: number;
  descriptionFr: string;
}

export const MODULE1_SCORING: ScoringRule[] = [
  // Completion points (60 total)
  { eventType: "PO_COMPLETED", points: 10, descriptionFr: "Bon de commande (PO) complété" },
  { eventType: "GR_COMPLETED", points: 10, descriptionFr: "Réception marchandises (GR) complétée" },
  { eventType: "SO_COMPLETED", points: 10, descriptionFr: "Commande client (SO) complétée" },
  { eventType: "GI_COMPLETED", points: 15, descriptionFr: "Sortie marchandises (GI) sans stock négatif" },
  { eventType: "CC_COMPLETED", points: 10, descriptionFr: "Comptage cyclique (Cycle Count) complété" },
  { eventType: "COMPLIANCE_OK", points: 5, descriptionFr: "Conformité système validée" },

  // Penalties (deductions)
  { eventType: "OUT_OF_SEQUENCE", points: -5, descriptionFr: "Tentative hors séquence" },
  { eventType: "NEGATIVE_STOCK_ATTEMPT", points: -5, descriptionFr: "Tentative de GI avec stock insuffisant" },
  { eventType: "UNPOSTED_TX_LEFT", points: -3, descriptionFr: "Transaction non postée laissée en suspens" },
  { eventType: "UNRESOLVED_VARIANCE", points: -5, descriptionFr: "Écart d'inventaire non résolu" },

  // Bonus
  { eventType: "PERFECT_RUN_BONUS", points: 5, descriptionFr: "Bonus : simulation complétée sans erreur" },
];

export function getScoringRule(eventType: string): ScoringRule | undefined {
  return MODULE1_SCORING.find((r) => r.eventType === eventType);
}

export function calculateTotalScore(events: Array<{ pointsDelta: number }>): number {
  const raw = events.reduce((sum, e) => sum + e.pointsDelta, 0);
  return Math.max(0, Math.min(100, raw)); // Clamp between 0 and 100
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Excellent", color: "green" };
  if (score >= 75) return { label: "Bien", color: "blue" };
  if (score >= 60) return { label: "Satisfaisant", color: "orange" };
  return { label: "À améliorer", color: "red" };
}
