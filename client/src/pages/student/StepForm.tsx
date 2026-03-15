import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { ArrowLeft, CheckCircle, Lock, AlertTriangle, Info, FlaskConical, ChevronDown, ChevronUp, Database } from "lucide-react";

const STEP_CONFIG: Record<string, {
  title: string; code: string; txCode: string; etape: string;
  objective: string; fields: string[]; tCode: string;
  pedagogicalDeep: { why: string; realSAP: string; dependency: string; realError: string };
}> = {
  po: {
    title: "Purchase Order", code: "PO", txCode: "ME21N", etape: "Étape 1 sur 7", tCode: "ME21N",
    objective: "Créer une commande d'achat auprès d'un fournisseur. Le PO déclenche le processus d'approvisionnement et doit être validé avant toute réception.",
    fields: ["docRef", "sku", "bin", "qty", "comment"],
    pedagogicalDeep: {
      why: "Le Purchase Order (PO) est le document contractuel entre l'entreprise et le fournisseur. Sans PO, aucune réception ne peut être légalement enregistrée dans SAP. Il crée une obligation d'achat et réserve un budget.",
      realSAP: "Dans SAP S/4HANA, la transaction ME21N crée un document PO avec numéro unique. Le système vérifie automatiquement les limites de crédit fournisseur, les contrats-cadres (outline agreements) et les approbations (release strategy).",
      dependency: "Le PO doit précéder le Goods Receipt (GR). Sans PO valide, la transaction MIGO (GR) ne peut pas référencer de document d'achat. Le flux est : PO → GR → Facture fournisseur (MIRO).",
      realError: "Si un GR est créé sans PO, SAP génère une erreur 'No purchase order item found'. En production, cela bloquerait le paiement fournisseur et créerait un écart comptable dans le module FI.",
    }
  },
  gr: {
    title: "Goods Receipt", code: "GR", txCode: "MIGO", etape: "Étape 2 sur 7", tCode: "MIGO",
    objective: "Enregistrer la réception physique des marchandises. Le stock est impacté uniquement si la transaction est postée (Posted=Y).",
    fields: ["docRef", "sku", "bin", "qty", "comment"],
    pedagogicalDeep: {
      why: "Le Goods Receipt (GR) est la confirmation physique que les marchandises commandées sont arrivées en entrepôt. C'est à ce moment que le stock augmente dans le système WMS/ERP, pas au moment de la commande.",
      realSAP: "Dans SAP, MIGO avec mouvement 101 (GR pour PO) crée un document matière (Material Document) et un document comptable (Accounting Document). Le stock passe de 'en transit' à 'disponible'. Le bin/emplacement est mis à jour dans WM (Warehouse Management).",
      dependency: "Le GR dépend d'un PO ouvert et non clôturé. La quantité reçue ne peut pas dépasser la quantité commandée (tolérance configurable). Le GR déclenche automatiquement la mise à jour de l'INVENTORY_BALANCE.",
      realError: "Un GR sans PO correspondant crée une 'réception non planifiée' (unplanned delivery). En audit, cela génère une exception de contrôle interne. Le stock serait enregistré mais sans obligation d'achat, rendant le paiement fournisseur impossible.",
    }
  },
  so: {
    title: "Sales Order", code: "SO", txCode: "VA01", etape: "Étape 3 sur 7", tCode: "VA01",
    objective: "Créer une commande client. Le SO ne peut être créé que si le stock disponible est supérieur à zéro dans l'INVENTORY_BALANCE.",
    fields: ["docRef", "sku", "bin", "qty", "comment"],
    pedagogicalDeep: {
      why: "Le Sales Order (SO) est l'engagement de l'entreprise envers un client. Il déclenche la réservation de stock et le processus de livraison. Sans SO, aucune sortie de stock officielle ne peut être justifiée.",
      realSAP: "Dans SAP, VA01 crée un ordre de vente avec vérification automatique de disponibilité (ATP - Available-to-Promise). SAP vérifie le stock disponible, les réservations existantes, et les délais de réapprovisionnement. Un SO peut déclencher une livraison (VL01N) et une facturation client (VF01).",
      dependency: "Le SO dépend d'un stock disponible positif (résultat du GR). Sans stock, SAP affiche un message de disponibilité insuffisante. Le SO est aussi lié au master data client (KNA1) et au master data article (MARA).",
      realError: "Créer un SO sans stock disponible force une livraison partielle ou un backorder. En production, cela génère des pénalités de retard client, des frais de livraison urgente, et impacte le KPI 'On-Time Delivery'.",
    }
  },
  gi: {
    title: "Goods Issue", code: "GI", txCode: "VL02N", etape: "Étape 4 sur 7", tCode: "VL02N",
    objective: "Émettre les marchandises pour le client. Le GI déduit le stock et génère le mouvement 601. Le système bloque si le stock est insuffisant.",
    fields: ["docRef", "sku", "bin", "qty", "comment"],
    pedagogicalDeep: {
      why: "Le Goods Issue (GI) est la sortie physique des marchandises de l'entrepôt vers le client. C'est l'événement qui réduit le stock et transfère la propriété légale au client. Il déclenche la comptabilisation des coûts (COGS).",
      realSAP: "Dans SAP, VL02N avec mouvement 601 (GI pour livraison) crée un document matière de sortie et un document comptable débitant le compte COGS. Le WM met à jour le bin source. La livraison passe au statut 'Goods Issued' et peut être facturée.",
      dependency: "Le GI dépend d'un SO confirmé et d'un stock suffisant dans le bin spécifié. SAP vérifie que la quantité à émettre ≤ stock disponible dans le bin. Le GI doit référencer une livraison (Delivery Order) liée au SO.",
      realError: "Un GI avec stock insuffisant crée un stock négatif dans SAP (si autorisé) ou bloque la transaction. En audit, un stock négatif est une anomalie critique indiquant soit une erreur de saisie, soit une fraude. Le bilan comptable serait faussé.",
    }
  },
  cc: {
    title: "Cycle Count", code: "CC", txCode: "MI01", etape: "Étape 5 sur 7", tCode: "MI01",
    objective: "Compter physiquement les marchandises et comparer au stock système. Tout écart doit être résolu par un ajustement (ADJ).",
    fields: ["sku", "bin", "physicalQty", "comment"],
    pedagogicalDeep: {
      why: "Le Cycle Count est une méthode d'inventaire tournant qui permet de vérifier régulièrement l'exactitude du stock sans arrêter les opérations. Il remplace l'inventaire annuel complet dans les entrepôts modernes.",
      realSAP: "Dans SAP, MI01 crée un document d'inventaire (Inventory Document). MI04 enregistre le comptage physique. MI07 valide les différences et génère les ajustements. Le système calcule automatiquement la variance (physique - système).",
      dependency: "Le Cycle Count doit être effectué après les transactions GR et GI pour avoir un état de stock stable. Les variances détectées doivent être résolues par des ajustements (ADJ/MI07) avant la clôture de période comptable.",
      realError: "Une variance non résolue lors de la clôture mensuelle crée un écart entre le stock WMS et la comptabilité (FI). Les auditeurs externes exigent une réconciliation complète. Une variance de ±2% est généralement acceptable; au-delà, une investigation est requise.",
    }
  },
  adj: {
    title: "Inventory Adjustment", code: "ADJ", txCode: "MI07", etape: "Étape 6 sur 7", tCode: "MI07",
    objective: "Corriger les écarts d'inventaire détectés lors du Cycle Count. L'ajustement est obligatoire avant la clôture.",
    fields: ["sku", "bin", "qty", "comment"],
    pedagogicalDeep: {
      why: "L'ajustement d'inventaire (ADJ) est la correction officielle d'un écart constaté lors du comptage. Il synchronise le stock système avec la réalité physique. Sans ADJ, le système reste inexact et les décisions d'approvisionnement sont biaisées.",
      realSAP: "Dans SAP, MI07 valide le document d'inventaire et génère automatiquement les mouvements de correction (mouvement 701 pour ajustement positif, 702 pour négatif). Un document comptable est créé pour refléter la perte ou le gain de stock.",
      dependency: "L'ADJ dépend d'un document de Cycle Count (MI01) avec une variance détectée. Il doit être approuvé par un responsable entrepôt (release strategy configurable). L'ADJ doit être complété avant la clôture de la période comptable.",
      realError: "Un ADJ non effectué après un Cycle Count laisse une variance ouverte dans SAP. Lors de la clôture mensuelle, le système de comptabilité (FI) et le WMS sont désynchronisés. Les états financiers (bilan) seraient incorrects, ce qui constitue une erreur comptable grave.",
    }
  },
  compliance: {
    title: "Conformité Système", code: "COMPLIANCE", txCode: "MB52", etape: "Étape 7 sur 7", tCode: "MB52",
    objective: "Valider la conformité complète du système. Tous les indicateurs doivent être au vert : aucune transaction non postée, aucun stock négatif, aucun écart non résolu.",
    fields: ["comment"],
    pedagogicalDeep: {
      why: "La validation de conformité est la clôture officielle du cycle logistique. Elle confirme que toutes les transactions sont cohérentes, que le stock est exact, et que le système est prêt pour la période suivante.",
      realSAP: "Dans SAP, MB52 permet de consulter l'état du stock par entrepôt. La clôture de période (MMPV) vérifie que tous les documents sont comptabilisés. Le module CO (Controlling) réconcilie les coûts avec les mouvements de stock.",
      dependency: "La conformité dépend de la résolution de toutes les variances (ADJ), de la comptabilisation de toutes les transactions (Posted=Y), et de l'absence de stock négatif. C'est le point de contrôle final avant la clôture comptable.",
      realError: "Une clôture de période avec des transactions non conformes crée des erreurs de réconciliation entre WMS, MM (Materials Management) et FI. En audit externe, cela peut entraîner une qualification d'audit avec réserve, voire un refus de certification des comptes.",
    }
  },
};

type FormValues = {
  docRef?: string;
  sku?: string;
  bin?: string;
  qty?: string;
  physicalQty?: string;
  comment?: string;
};

function PedagogicalPanel({ cfg, isDemo }: { cfg: typeof STEP_CONFIG[string]; isDemo: boolean }) {
  const [open, setOpen] = useState(false);
  if (!isDemo) return null;
  return (
    <div className="border border-[#5b4b8a]/30 rounded-md overflow-hidden mt-4">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#ede7f6] text-[#5b4b8a] text-xs font-semibold hover:bg-[#e8ddf5] transition-colors"
      >
        <span className="flex items-center gap-2"><FlaskConical size={13} /> Explication pédagogique approfondie</span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && (
        <div className="bg-white p-4 space-y-3 text-xs">
          <div>
            <p className="font-bold text-[#5b4b8a] mb-1">📚 Pourquoi cette transaction existe dans l'ERP ?</p>
            <p className="text-gray-600 leading-relaxed">{cfg.pedagogicalDeep.why}</p>
          </div>
          <div>
            <p className="font-bold text-[#0070f2] mb-1">🔧 Dans SAP S/4HANA réel :</p>
            <p className="text-gray-600 leading-relaxed">{cfg.pedagogicalDeep.realSAP}</p>
          </div>
          <div>
            <p className="font-bold text-[#107e3e] mb-1">🔗 Dépendance système :</p>
            <p className="text-gray-600 leading-relaxed">{cfg.pedagogicalDeep.dependency}</p>
          </div>
          <div>
            <p className="font-bold text-[#bb0000] mb-1">⚠ Erreur en production réelle :</p>
            <p className="text-gray-600 leading-relaxed">{cfg.pedagogicalDeep.realError}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function BackendTransparencyPanel({ runData }: { runData: any }) {
  const [open, setOpen] = useState(false);
  if (!runData?.isDemo || !runData?.demoBackendState) return null;
  const { inventory, transactions, cycleCounts } = runData.demoBackendState;
  const inventoryEntries = Object.entries(inventory as Record<string, number>).filter(([, qty]) => qty !== 0);
  return (
    <div className="border border-[#1a237e]/30 rounded-md overflow-hidden mt-4">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#e8eaf6] text-[#1a237e] text-xs font-semibold hover:bg-[#e0e4f4] transition-colors"
      >
        <span className="flex items-center gap-2"><Database size={13} /> Voir logique système (WMS backend)</span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && (
        <div className="bg-white p-4 space-y-4 text-xs">
          {/* Current Stock */}
          <div>
            <p className="font-bold text-[#1a237e] mb-2">📦 Stock actuel (INVENTORY_BALANCE)</p>
            {inventoryEntries.length === 0 ? (
              <p className="text-gray-400 italic">Aucun stock enregistré</p>
            ) : (
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f0f4ff]">
                    <th className="text-left px-2 py-1 font-semibold text-[#1a237e]">SKU :: BIN</th>
                    <th className="text-right px-2 py-1 font-semibold text-[#1a237e]">Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryEntries.map(([key, qty]) => (
                    <tr key={key} className="border-t border-[#e8eaf6]">
                      <td className="px-2 py-1 font-mono text-gray-600">{key}</td>
                      <td className={`px-2 py-1 text-right font-bold ${(qty as number) < 0 ? "text-[#bb0000]" : "text-[#107e3e]"}`}>{qty as number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Pending Transactions */}
          <div>
            <p className="font-bold text-[#1a237e] mb-2">📋 Transactions enregistrées ({transactions?.length ?? 0})</p>
            {(transactions?.length ?? 0) === 0 ? (
              <p className="text-gray-400 italic">Aucune transaction</p>
            ) : (
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f0f4ff]">
                    <th className="text-left px-2 py-1 font-semibold text-[#1a237e]">Type</th>
                    <th className="text-left px-2 py-1 font-semibold text-[#1a237e]">SKU</th>
                    <th className="text-left px-2 py-1 font-semibold text-[#1a237e]">BIN</th>
                    <th className="text-right px-2 py-1 font-semibold text-[#1a237e]">Qté</th>
                    <th className="text-center px-2 py-1 font-semibold text-[#1a237e]">Posté</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx: any, i: number) => (
                    <tr key={i} className="border-t border-[#e8eaf6]">
                      <td className="px-2 py-1"><span className="font-bold text-[#0070f2]">{tx.docType}</span></td>
                      <td className="px-2 py-1 font-mono text-gray-600">{tx.sku}</td>
                      <td className="px-2 py-1 font-mono text-gray-600">{tx.bin}</td>
                      <td className="px-2 py-1 text-right">{tx.qty}</td>
                      <td className="px-2 py-1 text-center">{tx.posted ? "✅" : "❌"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Cycle Counts */}
          {(cycleCounts?.length ?? 0) > 0 && (
            <div>
              <p className="font-bold text-[#1a237e] mb-2">🔍 Cycle Counts ({cycleCounts.length})</p>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f0f4ff]">
                    <th className="text-left px-2 py-1 font-semibold text-[#1a237e]">SKU</th>
                    <th className="text-left px-2 py-1 font-semibold text-[#1a237e]">BIN</th>
                    <th className="text-right px-2 py-1 font-semibold text-[#1a237e]">Variance</th>
                    <th className="text-center px-2 py-1 font-semibold text-[#1a237e]">Résolu</th>
                  </tr>
                </thead>
                <tbody>
                  {cycleCounts.map((cc: any, i: number) => (
                    <tr key={i} className="border-t border-[#e8eaf6]">
                      <td className="px-2 py-1 font-mono text-gray-600">{cc.sku}</td>
                      <td className="px-2 py-1 font-mono text-gray-600">{cc.bin}</td>
                      <td className={`px-2 py-1 text-right font-bold ${cc.variance !== 0 ? "text-[#bb0000]" : "text-[#107e3e]"}`}>{cc.variance > 0 ? "+" : ""}{cc.variance}</td>
                      <td className="px-2 py-1 text-center">{cc.resolved ? "✅" : "❌"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StepForm() {
  const { runId, step } = useParams<{ runId: string; step: string }>();
  const [, navigate] = useLocation();
  const cfg = STEP_CONFIG[step?.toLowerCase() ?? ""] ?? STEP_CONFIG.po;

  const { data: runData, isLoading, refetch } = trpc.runs.state.useQuery({ runId: parseInt(runId) });
  const { data: masterData } = trpc.master.skus.useQuery();
  const { data: bins } = trpc.master.bins.useQuery();

  const submitPO = trpc.transactions.submitPO.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitGR = trpc.transactions.submitGR.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitSO = trpc.transactions.submitSO.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitGI = trpc.transactions.submitGI.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitCC = trpc.cycleCounts.submit.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitADJ = trpc.transactions.submitADJ.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const submitCompliance = trpc.compliance.finalize.useMutation({ onSuccess: handleSuccess, onError: handleError });

  const { register, handleSubmit, watch, formState: { errors: formErrors } } = useForm<FormValues>();

  function handleSuccess(data: any) {
    if (data?.demoWarning) {
      toast.warning(`⚠ Avertissement (mode démo) : ${data.demoWarning}`);
    } else {
      toast.success(`${cfg.title} — Étape validée avec succès !`);
    }
    refetch();
    setTimeout(() => navigate(`/student/run/${runId}`), 1200);
  }

  function handleError(err: any) {
    toast.error(err.message ?? "Erreur de validation");
  }

  function onSubmit(values: FormValues) {
    const base = { runId: parseInt(runId) };
    const qty = values.qty ? Number(values.qty) : 0;
    const physicalQty = values.physicalQty ? Number(values.physicalQty) : 0;
    // Client-side SKU validation
    if (cfg.fields.includes("sku") && (!values.sku || values.sku === "")) {
      toast.error("Veuillez sélectionner un SKU avant de valider.");
      return;
    }
    // Client-side Bin validation
    if (cfg.fields.includes("bin") && (!values.bin || values.bin === "")) {
      toast.error("Veuillez sélectionner un emplacement (Bin) avant de valider.");
      return;
    }
    // Client-side docRef validation
    if (cfg.fields.includes("docRef") && (!values.docRef || values.docRef.trim() === "")) {
      toast.error("Veuillez saisir un numéro de document avant de valider.");
      return;
    }
    // Client-side qty validation
    if (cfg.fields.includes("qty") && (!values.qty || Number(values.qty) <= 0)) {
      toast.error("Veuillez saisir une quantité valide (> 0) avant de valider.");
      return;
    }
    switch (step?.toLowerCase()) {
      case "po": return submitPO.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef!, comment: values.comment });
      case "gr": return submitGR.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef!, comment: values.comment });
      case "so": return submitSO.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef!, comment: values.comment });
      case "gi": return submitGI.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef!, comment: values.comment });
      case "cc": return submitCC.mutate({ ...base, sku: values.sku!, bin: values.bin!, physicalQty });
      case "adj": return submitADJ.mutate({ ...base, sku: values.sku!, bin: values.bin!, qty, docRef: values.docRef ?? "ADJ-AUTO", comment: values.comment });
      case "compliance": return submitCompliance.mutate({ ...base });
    }
  }

  const isAnyPending = submitPO.isPending || submitGR.isPending || submitSO.isPending || submitGI.isPending || submitCC.isPending || submitADJ.isPending || submitCompliance.isPending;

  if (isLoading) {
    return (
      <FioriShell title={cfg.title} breadcrumbs={[{ label: "Scénarios", href: "/student/scenarios" }, { label: "Mission Control", href: `/student/run/${runId}` }, { label: cfg.title }]}>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#0070f2] border-t-transparent rounded-full animate-spin" />
        </div>
      </FioriShell>
    );
  }

  const isDemo = runData?.isDemo ?? false;
  const nextStep = (runData?.nextStep as any)?.code;
  const isCurrentStep = nextStep === cfg.code;
  const isCompleted = runData?.completedSteps.includes(cfg.code as any);
  // In demo mode, all non-completed steps are accessible
  const isLocked = !isDemo && !isCurrentStep && !isCompleted;

  const inventory = runData?.inventory ?? {};
  const selectedSku = watch("sku");
  const selectedBin = watch("bin");
  const availableStock = selectedSku && selectedBin ? (inventory[`${selectedSku}::${selectedBin}`] ?? 0) : null;
  const selectedQty = watch("qty");

  // In demo mode, show warning if out of sequence but don't block
  const isOutOfSequence = isDemo && !isCurrentStep && !isCompleted;

  return (
    <FioriShell
      title={`Transaction: ${cfg.title} (${cfg.code}) | ${cfg.etape}`}
      breadcrumbs={[
        { label: "Scénarios", href: "/student/scenarios" },
        { label: "Mission Control", href: `/student/run/${runId}` },
        { label: cfg.title },
      ]}
    >
      <div className="max-w-2xl mx-auto">
        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="bg-[#1a237e] border border-[#3949ab] rounded-md px-4 py-2.5 mb-4 flex items-center gap-2">
            <FlaskConical size={14} className="text-[#90caf9] flex-shrink-0" />
            <p className="text-[#90caf9] text-xs font-semibold">🔵 MODE DÉMONSTRATION — Aucun score enregistré · Progression libre activée</p>
          </div>
        )}

        {/* Transaction Header */}
        <div className={`rounded-t-md px-5 py-3 flex items-center justify-between ${isDemo ? "bg-[#1a237e]" : "bg-[#0f2a44]"}`}>
          <div>
            <p className="text-white/60 text-xs">Transaction Code</p>
            <p className="text-white font-bold text-sm">{cfg.tCode} — {cfg.title}</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs">Statut</p>
            {isCompleted ? (
              <span className="badge-valid">✓ VALIDÉ</span>
            ) : isLocked ? (
              <span className="badge-blocked">🔒 VERROUILLÉ</span>
            ) : isDemo && isOutOfSequence ? (
              <span className="text-[10px] bg-[#5b4b8a] text-white px-2 py-0.5 rounded-full font-semibold">⚠ HORS SÉQUENCE</span>
            ) : (
              <span className="badge-pending">⏳ EN COURS</span>
            )}
          </div>
        </div>

        {/* Locked State (evaluation mode only) */}
        {isLocked && (
          <div className="bg-white border border-[#d9d9d9] border-t-0 rounded-b-md p-6">
            <div className="alert-blocked flex items-start gap-3 mb-4">
              <Lock size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold mb-0.5">Étape actuellement verrouillée</p>
                <p className="text-xs">Complétez l'étape précédente avant d'accéder à cette transaction.</p>
              </div>
            </div>
            <button onClick={() => navigate(`/student/run/${runId}`)}
              className="flex items-center gap-2 text-xs text-[#0070f2] hover:underline">
              <ArrowLeft size={13} /> Retour au Mission Control
            </button>
          </div>
        )}

        {/* Completed State */}
        {isCompleted && (
          <div className="bg-white border border-[#d9d9d9] border-t-0 rounded-b-md p-6">
            <div className="alert-compliant flex items-start gap-3 mb-4">
              <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold mb-0.5">Étape validée</p>
                <p className="text-xs">Cette transaction a été complétée avec succès. Retournez au tableau de contrôle.</p>
              </div>
            </div>
            <BackendTransparencyPanel runData={runData} />
            <PedagogicalPanel cfg={cfg} isDemo={isDemo} />
            <button onClick={() => navigate(`/student/run/${runId}`)}
              className="flex items-center gap-2 text-xs text-[#0070f2] hover:underline mt-4">
              <ArrowLeft size={13} /> Retour au Mission Control
            </button>
          </div>
        )}

        {/* Active Form (current step) or Demo out-of-sequence form */}
        {(isCurrentStep || (isDemo && !isCompleted)) && !isLocked && (
          <div className="bg-white border border-[#d9d9d9] border-t-0 rounded-b-md">
            {/* Out-of-sequence warning in demo mode */}
            {isDemo && isOutOfSequence && (
              <div className="bg-[#fff8e1] border-b border-[#ffe082] px-4 py-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-[#e9730c] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#e9730c]">
                  <strong>Avertissement pédagogique :</strong> Cette étape est hors séquence recommandée. En mode évaluation, elle serait bloquée et pénalisée. En mode démonstration, la progression est autorisée.
                </p>
              </div>
            )}

            {/* Objective */}
            <div className="alert-info m-4 mb-0">
              <p className="text-xs font-semibold mb-0.5 flex items-center gap-1.5"><Info size={12} /> Objectif pédagogique</p>
              <p className="text-xs">{cfg.objective}</p>
            </div>

            {/* Context Panel: Previous Steps Summary */}
            {(step?.toLowerCase() === "gr" || step?.toLowerCase() === "so" || step?.toLowerCase() === "gi" || step?.toLowerCase() === "cc" || step?.toLowerCase() === "adj") && runData?.demoBackendState?.transactions && runData.demoBackendState.transactions.length > 0 && (
              <div className="mx-4 mt-4 bg-[#f0f7ff] border border-[#0070f2]/20 rounded-md p-3">
                <p className="text-[10px] font-bold text-[#0070f2] uppercase tracking-wider mb-2">Référence — Étapes précédentes</p>
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="text-[#0f2a44]/60">
                      <th className="text-left pb-1">Transaction</th>
                      <th className="text-left pb-1">SKU</th>
                      <th className="text-left pb-1">Bin</th>
                      <th className="text-left pb-1">Qté</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runData.demoBackendState.transactions.map((tx: any) => (
                      <tr key={tx.id} className="border-t border-[#0070f2]/10">
                        <td className="py-1 font-mono font-semibold text-[#0070f2]">{tx.txType}</td>
                        <td className="py-1">{tx.sku || <span className="text-[#bb0000]">non défini</span>}</td>
                        <td className="py-1 font-mono">{tx.bin || "—"}</td>
                        <td className="py-1">{tx.qty ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Context Panel: Also show for non-demo (evaluation mode) using completedSteps + inventory */}
            {(step?.toLowerCase() === "gi" || step?.toLowerCase() === "cc") && !isDemo && (
              <div className="mx-4 mt-4 bg-[#f0f7ff] border border-[#0070f2]/20 rounded-md p-3">
                <p className="text-[10px] font-bold text-[#0070f2] uppercase tracking-wider mb-1">📊 Stock actuel par emplacement
                </p>
                <p className="text-[10px] text-gray-500 mb-2">Utilisez le même SKU et Bin que vos étapes précédentes (PO/GR).</p>
                {Object.entries(runData?.inventory ?? {}).filter(([, qty]) => (qty as number) > 0).length === 0 ? (
                  <p className="text-[10px] text-[#bb0000]">⚠ Aucun stock disponible — vérifiez que la GR a été validée avec un SKU sélectionné.</p>
                ) : (
                  <div className="space-y-0.5">
                    {Object.entries(runData?.inventory ?? {}).filter(([, qty]) => (qty as number) > 0).map(([key, qty]) => {
                      const [sku, bin] = key.split("::");
                      return (
                        <p key={key} className="text-[10px] font-mono">
                          <span className="text-[#0070f2] font-semibold">{sku}</span> @ <span className="text-[#107e3e]">{bin}</span> — <strong>{qty as number} unités</strong>
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              {/* Compliance step — just a button */}
              {step?.toLowerCase() === "compliance" && (
                <div>
                  <div className={`rounded-md p-4 mb-4 ${runData?.compliance.compliant ? "bg-[#d4edda]" : isDemo ? "bg-[#fff8e1]" : "bg-[#fde8e8]"}`}>
                    <p className={`font-bold text-sm mb-2 ${runData?.compliance.compliant ? "text-[#107e3e]" : isDemo ? "text-[#e9730c]" : "text-[#bb0000]"}`}>
                      {runData?.compliance.compliant
                        ? "✅ Système conforme — Prêt pour clôture"
                        : isDemo
                        ? "⚠ Non conforme (démo) — Clôture autorisée en mode démonstration"
                        : "🔴 Système non conforme — Résoudre les problèmes"}
                    </p>
                    {runData?.compliance.issuesFr.map((issue, i) => (
                      <p key={i} className={`text-xs ${isDemo ? "text-[#e9730c]" : "text-[#bb0000]"}`}>• {issue}</p>
                    ))}
                  </div>
                  {!runData?.compliance.compliant && !isDemo && (
                    <div className="alert-blocked flex items-start gap-2 mb-4">
                      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                      <p className="text-xs">Résolvez tous les problèmes de conformité avant de clôturer le module.</p>
                    </div>
                  )}
                  <div className="flex items-center gap-0.5 mb-3">
                    <label className="text-xs text-gray-500">Commentaire de clôture (optionnel)</label>
                  </div>
                  <input {...register("comment")} placeholder="Ex: Module 1 complété avec succès" className="w-full border border-[#d9d9d9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0070f2]" />
                </div>
              )}

              {/* Standard fields */}
              {cfg.fields.includes("docRef") && (
                <div>
                  <label className="fiori-field-label">N° Document <span className="text-[#bb0000]">*</span> <span className="text-[10px] text-gray-400 ml-1">Requis</span></label>
                  <input {...register("docRef")} placeholder={`Ex: ${cfg.code}-2025-001`}
                    className="fiori-field-input fiori-field-active" />
                </div>
              )}

              {cfg.fields.includes("sku") && (
                <div>
                  <label className="fiori-field-label">SKU <span className="text-[#bb0000]">*</span> <span className="text-[10px] text-gray-400 ml-1">Requis</span></label>
                  <select {...register("sku")} className="fiori-field-input fiori-field-active">
                    <option value="">— Sélectionner un SKU —</option>
                    {masterData?.map((s: any) => (
                      <option key={s.sku} value={s.sku}>{s.sku} — {s.descriptionFr}</option>
                    ))}
                  </select>
                </div>
              )}

              {cfg.fields.includes("bin") && (
                <div>
                  <label className="fiori-field-label">Bin / Emplacement <span className="text-[#bb0000]">*</span> <span className="text-[10px] text-gray-400 ml-1">Requis</span></label>
                  <select {...register("bin")} className="fiori-field-input fiori-field-active">
                    <option value="">— Sélectionner un emplacement —</option>
                    {bins?.map((b: any) => (
                      <option key={b.binCode} value={b.binCode}>{b.binCode} — {b.zone}</option>
                    ))}
                  </select>
                  {availableStock !== null && (
                    <p className={`text-xs mt-1 font-medium ${availableStock > 0 ? "text-[#107e3e]" : "text-[#bb0000]"}`}>
                      Stock disponible : {availableStock} unité(s)
                    </p>
                  )}
                </div>
              )}

              {cfg.fields.includes("qty") && (
                <div>
                  <label className="fiori-field-label">Quantité <span className="text-[#bb0000]">*</span> <span className="text-[10px] text-gray-400 ml-1">Requis</span></label>
                  <input {...register("qty")} type="number" min={1} placeholder="Ex: 50"
                    className="fiori-field-input fiori-field-active" />
                  {(step?.toLowerCase() === "gi" || step?.toLowerCase() === "so") && availableStock !== null && (
                    <p className={`text-xs mt-1 ${isDemo ? "text-[#e9730c]" : "text-[#e9730c]"}`}>
                      {isDemo ? "⚠ Démo : " : ""}Ne peut pas dépasser le stock disponible ({availableStock})
                      {isDemo && " — En mode démonstration, le dépassement est autorisé avec avertissement."}
                    </p>
                  )}
                </div>
              )}

              {cfg.fields.includes("physicalQty") && (
                <div>
                  <label className="fiori-field-label">Quantité physique comptée <span className="text-[#bb0000]">*</span></label>
                  <input {...register("physicalQty")} type="number" min={0} placeholder="Ex: 48"
                    className="fiori-field-input fiori-field-active" />
                </div>
              )}

              {cfg.fields.includes("comment") && step?.toLowerCase() !== "compliance" && (
                <div>
                  <label className="fiori-field-label">Commentaire <span className="text-[10px] text-gray-400 ml-1">Optionnel</span></label>
                  <input {...register("comment")} placeholder="Remarques..."
                    className="fiori-field-input" />
                </div>
              )}

              {/* Status Block */}
              <div className={isDemo ? "bg-[#e8eaf6] border border-[#3949ab]/20 rounded-md p-3" : "alert-info"}>
                <p className="text-xs font-semibold">{isDemo ? "MODE DÉMONSTRATION — STATUT" : "STATUT DE L'ÉTAPE"}</p>
                <p className="text-xs mt-0.5">
                  {isDemo
                    ? "Étape accessible en mode démonstration. Aucun score enregistré."
                    : "Étape active — Remplissez les champs requis et soumettez pour valider."}
                </p>
              </div>

              {/* Pedagogical Deep Panel (demo only) */}
              <PedagogicalPanel cfg={cfg} isDemo={isDemo} />

              {/* Backend Transparency Panel (demo only) */}
              <BackendTransparencyPanel runData={runData} />

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#ededed]">
                <button type="button" onClick={() => navigate(`/student/run/${runId}`)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0070f2] transition-colors">
                  <ArrowLeft size={13} /> Retour au Mission Control
                </button>
                <button
                  type="submit"
                  disabled={isAnyPending || (!isDemo && step?.toLowerCase() === "compliance" && !runData?.compliance.compliant)}
                  className={`flex items-center gap-2 text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDemo ? "bg-[#5b4b8a] hover:bg-[#4a3a72]" : "bg-[#0070f2] hover:bg-[#0058c7]"
                  }`}
                >
                  {isAnyPending ? (
                    <><div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Traitement...</>
                  ) : (
                    <><CheckCircle size={13} /> {isDemo ? "Valider (Démo)" : `Valider — ${cfg.title}`}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </FioriShell>
  );
}
