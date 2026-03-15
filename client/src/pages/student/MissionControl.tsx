import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";
import { CheckCircle, Circle, Lock, ChevronRight, ArrowRight, AlertTriangle, Trophy, FlaskConical } from "lucide-react";

const STEPS = [
  { key: "PO", label: "Purchase Order", code: "ME21N", desc: "Créer la commande d'achat" },
  { key: "GR", label: "Goods Receipt", code: "MIGO", desc: "Enregistrer la réception" },
  { key: "SO", label: "Sales Order", code: "VA01", desc: "Créer la commande client" },
  { key: "GI", label: "Goods Issue", code: "VL02N", desc: "Émettre les marchandises" },
  { key: "CC", label: "Cycle Count", code: "MI01", desc: "Compter l'inventaire" },
  { key: "ADJ", label: "Adjustment", code: "MI07", desc: "Ajuster les écarts" },
  { key: "COMPLIANCE", label: "Conformité", code: "MB52", desc: "Valider la conformité" },
];

const PEDAGOGICAL_OBJECTIVES: Record<string, string> = {
  PO: "Comprendre le processus d'approvisionnement : création d'une commande d'achat (PO) avec fournisseur, SKU et quantité.",
  GR: "Maîtriser l'entrée en stock : la réception physique (GR) impacte l'inventaire uniquement si Posted=Y.",
  SO: "Analyser la demande client : un Sales Order (SO) ne peut être créé que si le stock disponible est suffisant.",
  GI: "Contrôler la sortie de stock : le Goods Issue (GI) déduit le stock et génère le mouvement 601.",
  CC: "Vérifier l'exactitude de l'inventaire : comparer le stock physique au stock système pour détecter les écarts.",
  ADJ: "Corriger les écarts : tout écart de Cycle Count doit être résolu par un ajustement (ADJ) avant la clôture.",
  COMPLIANCE: "Valider la conformité système : tous les indicateurs doivent être au vert avant de clôturer le module.",
};

export default function MissionControl() {
  const { runId } = useParams<{ runId: string }>();
  const [, navigate] = useLocation();
  const { data, isLoading, refetch } = trpc.runs.state.useQuery({ runId: parseInt(runId) });

  if (isLoading) {
    return (
      <FioriShell title="MISSION CONTROL" breadcrumbs={[{ label: "Scénarios", href: "/student/scenarios" }, { label: "Mission Control" }]}>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#0070f2] border-t-transparent rounded-full animate-spin" />
        </div>
      </FioriShell>
    );
  }

  if (!data) return null;

  const { run, scenario, completedSteps, compliance, totalScore: score, nextStep, progressPct, isDemo } = data;
  const completedCount = completedSteps.length;
  const isCompliant = compliance.compliant;

  const getStepStatus = (stepKey: string) => {
    if (completedSteps.includes(stepKey as any)) return "completed";
    if (stepKey === (nextStep as any)?.code) return "active";
    // In demo mode, all steps are accessible (not locked)
    if (isDemo) return "demo-available";
    return "locked";
  };
  const nextStepCode = (nextStep as any)?.code as string | undefined;

  return (
    <FioriShell
      title={`MISSION CONTROL — ${scenario?.name}`}
      breadcrumbs={[{ label: "Scénarios", href: "/student/scenarios" }, { label: "Mission Control" }]}
    >
      <div className="max-w-5xl mx-auto space-y-4">

        {/* ── DEMO MODE BANNER ── */}
        {isDemo && (
          <div className="bg-[#1a237e] border border-[#3949ab] rounded-md px-5 py-3 flex items-center gap-3">
            <FlaskConical size={18} className="text-[#90caf9] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[#90caf9] text-xs font-bold uppercase tracking-wider">🔵 MODE DÉMONSTRATION ACTIF — Score pédagogique visible (non officiel)</p>
              <p className="text-[#bbdefb] text-xs mt-0.5">Progression libre activée. Le score affiché est calculé en temps réel pour illustrer le système d'évaluation — il n'est pas comptabilisé dans les statistiques officielles.</p>
            </div>
            {score > 0 && (
              <div className="flex-shrink-0 text-center">
                <p className="text-[#90caf9] text-[10px] font-semibold uppercase">Score pédagogique</p>
                <p className="text-white font-bold text-2xl">{score}<span className="text-sm">/100</span></p>
              </div>
            )}
          </div>
        )}

        {/* Mission Context */}
        <div className="bg-white border border-[#d9d9d9] rounded-md p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div><p className="text-gray-400 font-medium uppercase tracking-wider mb-0.5">Entreprise</p><p className="font-semibold text-[#0f2a44]">Distribution Concorde Inc.</p></div>
            <div><p className="text-gray-400 font-medium uppercase tracking-wider mb-0.5">Module</p><p className="font-semibold text-[#0f2a44]">Module 1 — Logistique</p></div>
            <div><p className="text-gray-400 font-medium uppercase tracking-wider mb-0.5">Scénario</p><p className="font-semibold text-[#0f2a44]">{scenario?.name}</p></div>
            <div><p className="text-gray-400 font-medium uppercase tracking-wider mb-0.5">Difficulté</p><p className="font-semibold text-[#0f2a44] capitalize">{scenario?.difficulty}</p></div>
            <div>
              <p className="text-gray-400 font-medium uppercase tracking-wider mb-0.5">Score</p>
              {isDemo ? (
                <div>
                  <p className="font-semibold text-[#5b4b8a] text-base">{score} / 100</p>
                  <p className="text-[9px] text-[#5b4b8a] bg-[#ede7f6] px-1.5 py-0.5 rounded-full font-semibold inline-flex items-center gap-0.5">
                    <FlaskConical size={8} /> Non officiel
                  </p>
                </div>
              ) : (
                <p className="font-semibold text-[#0070f2] text-base">{score} / 100</p>
              )}
            </div>
          </div>
        </div>

        {/* Next Action Banner */}
        <div className={`rounded-md p-4 flex items-center gap-3 ${isCompliant && run.status === "completed" ? "bg-[#107e3e]" : nextStep ? (isDemo ? "bg-[#1a237e]" : "bg-[#0f2a44]") : "bg-[#bb0000]"}`}>
          <div className="flex-shrink-0">
            {run.status === "completed" ? <Trophy size={22} className="text-white" /> : <ArrowRight size={22} className="text-white" />}
          </div>
          <div className="flex-1">
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
              {isDemo ? "Mode Démonstration — Prochaine étape suggérée" : "Prochaine action requise"}
            </p>
            <p className="text-white font-bold text-base">
              {run.status === "completed"
                ? "✅ Simulation terminée — Voir le rapport final"
                : nextStepCode
                ? `→ ${STEPS.find(s => s.key === nextStepCode)?.label ?? nextStepCode} (${STEPS.find(s => s.key === nextStepCode)?.code})`
                : isDemo ? "✅ Toutes les étapes complétées" : "⚠ Vérifier les blocages système"}
            </p>
          </div>
          {run.status === "completed" ? (
            <button onClick={() => navigate(`/student/run/${runId}/report`)}
              className="bg-white text-[#107e3e] text-xs font-bold px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0">
              Voir Rapport
            </button>
          ) : nextStepCode && (
            <button onClick={() => navigate(`/student/run/${runId}/step/${nextStepCode.toLowerCase()}`)}
              className="bg-[#0070f2] text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-[#0058c7] transition-colors flex-shrink-0">
              Exécuter →
            </button>
          )}
        </div>

        {/* Pedagogical Objective */}
        {nextStepCode && (
          <div className="alert-info">
            <p className="text-xs font-semibold mb-0.5">Objectif pédagogique — {STEPS.find(s => s.key === nextStepCode)?.label}</p>
            <p className="text-xs">{PEDAGOGICAL_OBJECTIVES[nextStepCode] ?? ""}</p>
          </div>
        )}

        {/* Process Flow */}
        <div className="bg-white border border-[#d9d9d9] rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Flux de processus — Module 1</p>
            {isDemo && (
              <span className="text-[10px] text-[#5b4b8a] bg-[#ede7f6] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <FlaskConical size={9} /> Progression libre
              </span>
            )}
          </div>
          <div className="flex items-start gap-0 overflow-x-auto pb-2">
            {STEPS.map((step, i) => {
              const status = getStepStatus(step.key);
              const isActive = step.key === nextStepCode;
              const isClickable = status !== "locked";
              return (
                <div key={step.key} className="flex items-start flex-shrink-0">
                  <div className="flex flex-col items-center gap-2 w-24">
                    <button
                      onClick={() => isClickable && navigate(`/student/run/${runId}/step/${step.key.toLowerCase()}`)}
                      title={isDemo && status === "demo-available" ? "Mode démonstration — cliquez pour accéder" : undefined}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                        status === "completed" ? "bg-[#107e3e] border-[#107e3e] text-white" :
                        isActive ? "bg-[#0070f2] border-[#0070f2] text-white shadow-lg" :
                        status === "demo-available" ? "bg-[#ede7f6] border-[#5b4b8a] text-[#5b4b8a] hover:bg-[#5b4b8a] hover:text-white cursor-pointer" :
                        "bg-[#f7f7f7] border-[#d9d9d9] text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {status === "completed" ? <CheckCircle size={18} /> :
                       status === "locked" ? <Lock size={14} /> :
                       status === "demo-available" ? <FlaskConical size={14} /> :
                       <span>{i + 1}</span>}
                    </button>
                    <div className="text-center">
                      <p className={`text-xs font-semibold leading-tight ${isActive ? "text-[#0070f2]" : status === "completed" ? "text-[#107e3e]" : status === "demo-available" ? "text-[#5b4b8a]" : "text-gray-400"}`}>{step.key}</p>
                      <p className="text-[10px] text-gray-400 leading-tight">{step.code}</p>
                    </div>
                    {isActive && <span className="badge-pending text-[9px]">ACTIF</span>}
                    {status === "completed" && <span className="badge-valid text-[9px]">VALIDÉ</span>}
                    {status === "demo-available" && !isActive && <span className="text-[9px] text-[#5b4b8a] bg-[#ede7f6] px-1.5 py-0.5 rounded-full">LIBRE</span>}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 w-6 mt-6 flex-shrink-0 ${status === "completed" ? "bg-[#107e3e]" : isDemo ? "bg-[#5b4b8a]/30" : "bg-[#d9d9d9]"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress + Compliance Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Progression pédagogique */}
          <div className="bg-white border border-[#d9d9d9] rounded-md p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Progression pédagogique</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-[#0070f2]">{progressPct}%</span>
              <span className={`text-xs font-semibold ${progressPct === 100 ? "text-[#107e3e]" : "text-[#e9730c]"}`}>
                {progressPct === 100 ? "TERMINÉ" : "EN COURS"}
              </span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">{completedCount} / {STEPS.length} étapes validées</p>
          </div>

          {/* Conformité système */}
          <div className="bg-white border border-[#d9d9d9] rounded-md p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Conformité système</p>
            <div className={`rounded-md p-3 ${isCompliant ? "bg-[#d4edda]" : "bg-[#fde8e8]"}`}>
              <p className={`text-sm font-bold mb-2 ${isCompliant ? "text-[#107e3e]" : "text-[#bb0000]"}`}>
                {isCompliant ? "✅ CONFORME" : isDemo ? "⚠ NON CONFORME (démo)" : "🔴 NON CONFORME"}
              </p>
              <div className="space-y-1">
                {[
                  { label: "Transactions postées", ok: !compliance.issues.some(i => i.includes('unposted')), val: !compliance.issues.some(i => i.includes('unposted')) ? "OK" : "Non postée(s)" },
                  { label: "Stock positif", ok: !compliance.issues.some(i => i.includes('Negative')), val: !compliance.issues.some(i => i.includes('Negative')) ? "OK" : "Stock négatif" },
                  { label: "Écarts résolus", ok: !compliance.issues.some(i => i.includes('variance')), val: !compliance.issues.some(i => i.includes('variance')) ? "OK" : "ADJ requis" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className={isCompliant ? "text-[#107e3e]" : "text-[#bb0000]"}>{item.label}</span>
                    <span className={`font-semibold ${item.ok ? "text-[#107e3e]" : "text-[#bb0000]"}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Alert */}
        {!isCompliant && (
          <div className={`flex items-start gap-3 ${isDemo ? "bg-[#fff8e1] border border-[#ffe082] rounded-md p-3" : "alert-blocked"}`}>
            <AlertTriangle size={16} className={`flex-shrink-0 mt-0.5 ${isDemo ? "text-[#e9730c]" : ""}`} />
            <div>
              <p className="text-xs font-semibold mb-0.5">
                {isDemo ? "⚠ Avertissement pédagogique (mode démonstration)" : "Diagnostic système"}
              </p>
              <p className="text-xs">
                {compliance.issuesFr.join(" — ")}
                {isDemo && " — En mode démonstration, vous pouvez continuer malgré ces avertissements."}
              </p>
            </div>
          </div>
        )}
      </div>
    </FioriShell>
  );
}
