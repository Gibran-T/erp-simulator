import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";
import { CheckCircle, AlertTriangle, Trophy, ArrowLeft, FlaskConical, TrendingUp, BookOpen, Lightbulb, RotateCcw, Play } from "lucide-react";
import { useEffect } from "react";

const STEP_LABELS: Record<string, string> = {
  PO: "Purchase Order (ME21N)", GR: "Goods Receipt (MIGO)", STOCK: "Stock Disponible",
  SO: "Sales Order (VA01)", GI: "Goods Issue (VL02N)", CC: "Cycle Count (MI01)", COMPLIANCE: "Conformité Système"
};

const STEP_COLORS: Record<string, string> = {
  PO: "#0070f2", GR: "#107e3e", STOCK: "#5b4b8a", SO: "#e9730c",
  GI: "#bb0000", CC: "#0f2a44", COMPLIANCE: "#107e3e"
};

export default function RunReport() {
  const { runId } = useParams<{ runId: string }>();
  const [, navigate] = useLocation();
  const { data, isLoading } = trpc.runs.state.useQuery({ runId: parseInt(runId) });
  const { data: detail, isLoading: detailLoading } = trpc.runs.detailedReport.useQuery({ runId: parseInt(runId) });

  const recordModulePass = trpc.warehouse.recordModulePass.useMutation();

  // Auto-record module progress when a non-demo run report is viewed
  useEffect(() => {
    if (!data || data.run.isDemo || data.run.status !== "completed") return;
    const moduleId = data.scenario?.moduleId ?? 1;
    recordModulePass.mutate({ moduleId, score: data.totalScore });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.run?.id]);

  if (isLoading || detailLoading) return (
    <FioriShell title="Rapport Final" breadcrumbs={[{ label: "Scénarios", href: "/student/scenarios" }, { label: "Rapport" }]}>
      <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#0070f2] border-t-transparent rounded-full animate-spin" /></div>
    </FioriShell>
  );

  if (!data) return null;
  const { run, scenario, completedSteps, compliance, totalScore, progressPct } = data;
  const isDemo = run.isDemo;
  const isPerfect = totalScore >= 100;

  return (
    <FioriShell title="Rapport Final de Simulation" breadcrumbs={[{ label: "Scénarios", href: "/student/scenarios" }, { label: scenario?.name ?? "Rapport" }, { label: "Rapport Final" }]}>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* ── DEMO NOTICE ── */}
        {isDemo && (
          <div className="bg-[#1a237e] border border-[#3949ab] rounded-md px-5 py-3 flex items-center gap-3">
            <FlaskConical size={16} className="text-[#90caf9] flex-shrink-0" />
            <div>
              <p className="text-[#90caf9] text-xs font-bold uppercase tracking-wider">Mode Démonstration — Score pédagogique</p>
              <p className="text-[#bbdefb] text-xs mt-0.5">Ce score est calculé pour illustrer le système d'évaluation. Il n'est pas comptabilisé dans vos statistiques officielles.</p>
            </div>
          </div>
        )}

        {/* ── HEADER SCORE ── */}
        <div className={`rounded-md p-6 text-center ${isDemo ? "bg-[#1a237e]" : isPerfect ? "bg-[#107e3e]" : compliance.compliant ? "bg-[#0070f2]" : "bg-[#0f2a44]"}`}>
          <div className="flex justify-center mb-3">
            {isPerfect && !isDemo ? <Trophy size={36} className="text-yellow-300" /> : <CheckCircle size={36} className="text-white" />}
          </div>
          {isDemo && <p className="text-[#90caf9] text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><FlaskConical size={10} /> Score pédagogique (non officiel)</p>}
          {!isDemo && <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Score final</p>}
          <p className="text-white font-bold text-5xl mb-1">{totalScore}<span className="text-2xl">/100</span></p>
          <p className="text-white/80 text-sm">
            {isDemo
              ? `Score pédagogique — ${detail?.scoreLabel ?? ""} — ${compliance.compliant ? "Conforme" : "Non conforme"}`
              : isPerfect ? "🏆 Simulation parfaite — Félicitations !"
              : compliance.compliant ? "✅ Module complété avec succès"
              : "⚠ Module complété — Non conforme"}
          </p>
        </div>

        {/* ── SCORES DÉTAILLÉS PAR ÉTAPE ── */}
        {detail && (
          <div className="bg-white border border-[#d9d9d9] rounded-md p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-[#0070f2]" />
              <p className="text-xs font-semibold text-[#0f2a44] uppercase tracking-wider">Scores détaillés par étape</p>
            </div>
            <div className="space-y-3">
              {detail.stepBreakdown.filter(s => s.maxPoints > 0).map(step => (
                <div key={step.step}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {step.completed
                        ? <CheckCircle size={12} className="text-[#107e3e] flex-shrink-0" />
                        : <AlertTriangle size={12} className="text-[#e9730c] flex-shrink-0" />}
                      <span className="text-xs font-medium text-[#0f2a44]">{step.label}</span>
                    </div>
                    <span className={`text-xs font-bold ${step.completed ? "text-[#107e3e]" : "text-gray-400"}`}>
                      {step.pointsEarned} / {step.maxPoints} pts
                    </span>
                  </div>
                  <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${step.pct}%`,
                        backgroundColor: step.completed ? STEP_COLORS[step.step] : "#d9d9d9"
                      }}
                    />
                  </div>
                </div>
              ))}
              {/* Bonus */}
              {detail.bonuses.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#d9d9d9] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy size={12} className="text-yellow-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-[#0f2a44]">Bonus simulation parfaite</span>
                  </div>
                  <span className="text-xs font-bold text-yellow-600">+{detail.bonuses.reduce((s, e) => s + e.pointsDelta, 0)} pts</span>
                </div>
              )}
              {/* Total bar */}
              <div className="mt-3 pt-3 border-t border-[#d9d9d9]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0f2a44]">Total</span>
                  <span className={`text-sm font-bold ${isDemo ? "text-[#5b4b8a]" : "text-[#0070f2]"}`}>{totalScore} / 100</span>
                </div>
                <div className="h-3 bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${totalScore}%`, backgroundColor: isDemo ? "#5b4b8a" : totalScore >= 60 ? "#107e3e" : "#bb0000" }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  Seuil de réussite : 60 pts — {totalScore >= 60 ? "✅ Atteint" : "❌ Non atteint"}
                  {isDemo && " (non officiel)"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── RÉSUMÉ PÉDAGOGIQUE ── */}
        <div className="bg-white border border-[#d9d9d9] rounded-md p-5">
          <p className="text-xs font-semibold text-[#0f2a44] mb-4 uppercase tracking-wider">Résumé Pédagogique</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><p className="text-[10px] text-gray-400 uppercase">Étapes validées</p><p className="text-lg font-bold text-[#0f2a44]">{completedSteps.length}/7</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Progression</p><p className="text-lg font-bold text-[#0070f2]">{progressPct}%</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Conformité système</p><p className={`text-sm font-bold ${compliance.compliant ? "text-[#107e3e]" : "text-[#bb0000]"}`}>{compliance.compliant ? "✅ Conforme" : "🔴 Non conforme"}</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase">Erreurs commises</p><p className={`text-sm font-bold ${(detail?.errors.length ?? 0) === 0 ? "text-[#107e3e]" : "text-[#bb0000]"}`}>{detail?.errors.length ?? 0}</p></div>
          </div>
          {/* Steps checklist */}
          <div className="space-y-1.5">
            {["PO","GR","STOCK","SO","GI","CC","COMPLIANCE"].map(step => {
              const done = completedSteps.includes(step as any);
              const stepDetail = detail?.stepBreakdown.find(s => s.step === step);
              return (
                <div key={step} className={`flex items-center gap-3 p-2.5 rounded ${done ? "bg-[#f0faf4]" : "bg-[#fafafa]"}`}>
                  {done ? <CheckCircle size={13} className="text-[#107e3e] flex-shrink-0" /> : <AlertTriangle size={13} className="text-[#e9730c] flex-shrink-0" />}
                  <span className={`text-xs flex-1 ${done ? "text-[#107e3e] font-medium" : "text-gray-400"}`}>{STEP_LABELS[step]}</span>
                  {stepDetail && stepDetail.maxPoints > 0 && (
                    <span className={`text-[10px] font-semibold ${done ? "text-[#107e3e]" : "text-gray-400"}`}>
                      {stepDetail.pointsEarned}/{stepDetail.maxPoints} pts
                    </span>
                  )}
                  <span className={`text-[10px] font-semibold ${done ? "text-[#107e3e]" : "text-[#e9730c]"}`}>{done ? "VALIDÉ" : "NON COMPLÉTÉ"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ERREURS COMMISES ── */}
        {detail && detail.errors.length > 0 && (
          <div className="bg-white border border-[#bb0000]/30 rounded-md p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={14} className="text-[#bb0000]" />
              <p className="text-xs font-semibold text-[#bb0000] uppercase tracking-wider">
                Erreurs commises ({detail.errors.length}) — Analyse pédagogique
              </p>
            </div>
            <div className="space-y-4">
              {detail.errors.map((err, i) => (
                <div key={i} className="border border-[#fde8e8] rounded-md p-4 bg-[#fff8f8]">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-xs font-bold text-[#bb0000]">{err.explanation.title}</p>
                    <span className="text-xs font-bold text-[#bb0000] flex-shrink-0">{err.pointsDelta} pts</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">{err.explanation.detail}</p>
                  <div className="bg-[#fff3cd] border border-[#ffc107]/40 rounded px-3 py-2">
                    <p className="text-[10px] font-semibold text-[#856404] uppercase mb-0.5">À retenir</p>
                    <p className="text-xs text-[#856404]">{err.explanation.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CONFORMITÉ ── */}
        {compliance.issuesFr.length > 0 && (
          <div className="bg-white border border-[#bb0000]/30 rounded-md p-5">
            <p className="text-xs font-semibold text-[#bb0000] mb-3 flex items-center gap-2"><AlertTriangle size={13} /> Anomalies de conformité</p>
            <div className="space-y-1.5">
              {compliance.issuesFr.map((issue, i) => (
                <p key={i} className="text-xs text-[#bb0000] flex items-start gap-2"><span className="flex-shrink-0">•</span>{issue}</p>
              ))}
            </div>
          </div>
        )}

        {/* ── RECOMMANDATIONS PERSONNALISÉES ── */}
        {detail && detail.recommendations.length > 0 && (
          <div className="bg-white border border-[#d9d9d9] rounded-md p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={14} className="text-[#e9730c]" />
              <p className="text-xs font-semibold text-[#0f2a44] uppercase tracking-wider">Recommandations personnalisées</p>
            </div>
            <div className="space-y-2">
              {detail.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#fff8f0] border border-[#ffe0b2] rounded-md">
                  <span className="text-[#e9730c] font-bold text-xs flex-shrink-0">{i + 1}.</span>
                  <p className="text-xs text-[#0f2a44] leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COMPÉTENCES ── */}
        <div className="bg-white border border-[#d9d9d9] rounded-md p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} className="text-[#0070f2]" />
            <p className="text-xs font-semibold text-[#0f2a44] uppercase tracking-wider">Compétences développées</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["PO/GR (Approvisionnement)", "SO/GI (Expédition)", "WMS — Gestion des bins", "ERP — Flux intégré", "Cycle Count & ADJ", "KPI & Conformité"].map(c => (
              <span key={c} className="text-[10px] bg-[#e8f0fe] text-[#0070f2] font-medium px-2.5 py-1 rounded-full">{c}</span>
            ))}
          </div>
        </div>

        {/* ── ACTION BUTTONS ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/student/scenarios")}
            className="flex items-center gap-2 text-xs text-[#0070f2] hover:underline">
            <ArrowLeft size={13} /> Retour aux scénarios
          </button>
          {scenario && (
            <button
              onClick={() => navigate("/student/scenarios")}
              className="flex items-center gap-2 px-4 py-2 bg-[#0070f2] text-white text-xs font-semibold rounded-md hover:bg-[#0058c7] transition-colors"
            >
              <RotateCcw size={13} /> Recommencer ce scénario
            </button>
          )}
        </div>
      </div>
    </FioriShell>
  );
}
