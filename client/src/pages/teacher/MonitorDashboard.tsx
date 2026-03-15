import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { Download, Monitor, RefreshCw, FlaskConical, ShieldCheck, BarChart2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FilterMode = "evaluation" | "demonstration" | "all";

export default function MonitorDashboard() {
  const { data: runs, isLoading, refetch } = trpc.monitor.allRuns.useQuery();
  const [filterMode, setFilterMode] = useState<FilterMode>("evaluation");
  const [resettingRunId, setResettingRunId] = useState<number | null>(null);
  const [confirmResetId, setConfirmResetId] = useState<number | null>(null);

  const resetRunMutation = trpc.runs.resetRun.useMutation({
    onSuccess: (_, variables) => {
      toast.success(`Session #${variables.runId} réinitialisée avec succès. L'étudiant peut recommencer.`);
      setResettingRunId(null);
      setConfirmResetId(null);
      refetch();
    },
    onError: (err) => {
      toast.error(`Erreur lors de la réinitialisation : ${err.message}`);
      setResettingRunId(null);
      setConfirmResetId(null);
    },
  });

  function handleReset(runId: number) {
    if (confirmResetId === runId) {
      setResettingRunId(runId);
      resetRunMutation.mutate({ runId });
    } else {
      setConfirmResetId(runId);
      // Auto-cancel confirmation after 5 seconds
      setTimeout(() => setConfirmResetId(prev => prev === runId ? null : prev), 5000);
    }
  }

  const evalRuns = runs?.filter((r: any) => !r.run?.isDemo) ?? [];
  const demoRuns = runs?.filter((r: any) => r.run?.isDemo) ?? [];

  const displayedRuns =
    filterMode === "evaluation" ? evalRuns :
    filterMode === "demonstration" ? demoRuns :
    runs ?? [];

  // Analytics computed from evaluation runs only
  const avgScore = evalRuns.length > 0
    ? Math.round(evalRuns.reduce((sum: number, r: any) => sum + (r.score ?? 0), 0) / evalRuns.length)
    : 0;
  const completedEval = evalRuns.filter((r: any) => (r.run?.status ?? r.status) === "completed").length;
  const compliantEval = evalRuns.filter((r: any) => r.compliant).length;

  function exportCSV() {
    if (!displayedRuns || displayedRuns.length === 0) return;
    const headers = ["Run ID", "Mode", "Étudiant", "Scénario", "Statut", "Progression %", "Score", "Conforme", "Étapes complétées"];
    const rows = displayedRuns.map((r: any) => [
      r.run?.id ?? r.runId,
      r.run?.isDemo ? "Démonstration" : "Évaluation",
      r.user?.name ?? `User#${r.run?.userId}`,
      r.scenario?.name ?? `Scénario#${r.run?.scenarioId}`,
      r.run?.status ?? r.status,
      r.progressPct,
      r.run?.isDemo ? "N/A" : (r.score ?? 0),
      r.compliant ? "Oui" : "Non",
      r.completedSteps?.join("|") ?? ""
    ]);
    const csv = [headers, ...rows].map(row => row.map(String).map(v => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wms_monitor_${filterMode}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <FioriShell title="Tableau de Surveillance" breadcrumbs={[{ label: "Tableau de bord", href: "/teacher" }, { label: "Surveillance" }]}>

      {/* Analytics Summary — Evaluation Only */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-[#d9d9d9] rounded-md p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={13} className="text-[#0070f2]" />
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Score moyen (éval.)</p>
          </div>
          <p className="text-2xl font-bold text-[#0070f2]">{avgScore}<span className="text-sm text-gray-400">/100</span></p>
          <p className="text-[10px] text-gray-400 mt-0.5">Basé sur {evalRuns.length} session(s) d'évaluation</p>
        </div>
        <div className="bg-white border border-[#d9d9d9] rounded-md p-4">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={13} className="text-[#107e3e]" />
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Complétées (éval.)</p>
          </div>
          <p className="text-2xl font-bold text-[#107e3e]">{completedEval}<span className="text-sm text-gray-400"> / {evalRuns.length}</span></p>
          <p className="text-[10px] text-gray-400 mt-0.5">Sessions d'évaluation terminées</p>
        </div>
        <div className="bg-white border border-[#d9d9d9] rounded-md p-4">
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical size={13} className="text-[#5b4b8a]" />
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Sessions démo</p>
          </div>
          <p className="text-2xl font-bold text-[#5b4b8a]">{demoRuns.length}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Non comptabilisées dans les stats</p>
        </div>
      </div>

      {/* Filter + Actions Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-400 font-medium mr-1">Afficher :</p>
          {([
            { key: "evaluation", label: "Évaluation", icon: <ShieldCheck size={11} />, count: evalRuns.length, color: "text-[#0070f2] border-[#0070f2] bg-[#f0f7ff]" },
            { key: "demonstration", label: "Démonstration", icon: <FlaskConical size={11} />, count: demoRuns.length, color: "text-[#5b4b8a] border-[#5b4b8a] bg-[#ede7f6]" },
            { key: "all", label: "Tout", icon: null, count: (runs?.length ?? 0), color: "text-[#0f2a44] border-[#0f2a44] bg-[#f7f7f7]" },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setFilterMode(f.key as FilterMode)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${
                filterMode === f.key ? f.color : "text-gray-400 border-[#d9d9d9] bg-white hover:border-gray-400"
              }`}
            >
              {f.icon}{f.label} ({f.count})
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => refetch()} className="flex items-center gap-1.5 text-xs border border-[#d9d9d9] bg-white text-[#0f2a44] px-3 py-2 rounded-md hover:border-[#0070f2] transition-colors">
            <RefreshCw size={12} /> Actualiser
          </button>
          <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs bg-[#0070f2] text-white px-3 py-2 rounded-md hover:bg-[#0058c7] transition-colors">
            <Download size={12} /> Exporter CSV
          </button>
        </div>
      </div>

      {/* Demo exclusion notice */}
      {filterMode === "evaluation" && (
        <div className="bg-[#e8f4fd] border border-[#0070f2]/20 rounded-md px-4 py-2.5 mb-4 flex items-center gap-2">
          <ShieldCheck size={13} className="text-[#0070f2] flex-shrink-0" />
          <p className="text-xs text-[#0070f2]">
            <strong>Vue Évaluation :</strong> Les sessions de démonstration sont exclues. Score moyen, taux de complétion et classement basés uniquement sur les sessions d'évaluation officielles.
          </p>
        </div>
      )}
      {filterMode === "demonstration" && (
        <div className="bg-[#ede7f6] border border-[#5b4b8a]/20 rounded-md px-4 py-2.5 mb-4 flex items-center gap-2">
          <FlaskConical size={13} className="text-[#5b4b8a] flex-shrink-0" />
          <p className="text-xs text-[#5b4b8a]">
            <strong>Vue Démonstration :</strong> Ces sessions n'affectent pas les scores, la conformité ni le classement des étudiants. Elles sont à titre informatif uniquement.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#d9d9d9] rounded-md overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#f7f7f7] border-b border-[#ededed]">
              {["Mode", "Étudiant", "Scénario", "Statut", "Progression", "Score", "Conformité", "Étapes", "Actions"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-[#0f2a44] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ededed]">
            {isLoading && (
              <tr><td colSpan={9} className="py-10 text-center text-gray-400">Chargement...</td></tr>
            )}
            {!isLoading && displayedRuns.length === 0 && (
              <tr><td colSpan={9} className="py-10 text-center text-gray-400">
                <Monitor size={24} className="mx-auto mb-2 opacity-40" />
                Aucune simulation enregistrée dans ce mode
              </td></tr>
            )}
            {displayedRuns.map((r: any) => {
              const isDemo = r.run?.isDemo;
              return (
                <tr key={r.run?.id ?? r.runId} className={`hover:bg-[#fafafa] transition-colors ${isDemo ? "bg-[#fafafa]" : ""}`}>
                  <td className="px-4 py-3">
                    {isDemo ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-[#5b4b8a] bg-[#ede7f6] px-2 py-0.5 rounded-full w-fit">
                        <FlaskConical size={9} /> Démo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-[#0070f2] bg-[#e8f4fd] px-2 py-0.5 rounded-full w-fit">
                        <ShieldCheck size={9} /> Éval.
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#0f2a44] text-xs">{r.user?.name ?? `User #${r.run?.userId}`}</p>
                    {r.user?.studentNumber && (
                      <p className="text-[10px] font-mono text-[#0070f2] bg-[#e8f4fd] px-1.5 py-0.5 rounded mt-0.5 w-fit">{r.user.studentNumber}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.scenario?.name ?? `Scénario #${r.run?.scenarioId}`}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      (r.run?.status) === "completed" ? "bg-[#d4edda] text-[#107e3e]" :
                      (r.run?.status) === "in_progress" ? "bg-[#fff3cd] text-[#e9730c]" :
                      "bg-[#f0f0f0] text-gray-500"}`}>
                      {(r.run?.status) === "completed" ? "Terminé" : (r.run?.status) === "in_progress" ? "En cours" : (r.run?.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${isDemo ? "bg-[#5b4b8a]" : "bg-[#0070f2]"}`} style={{ width: `${r.progressPct}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-500">{r.progressPct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#0f2a44]">
                    {isDemo ? (
                      <span className="text-[10px] text-[#5b4b8a] italic">N/A (démo)</span>
                    ) : (
                      `${r.score ?? 0}/100`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold ${r.compliant ? "text-[#107e3e]" : isDemo ? "text-[#e9730c]" : "text-[#bb0000]"}`}>
                      {r.compliant ? "✅ Conforme" : isDemo ? "⚠ Non conforme" : "🔴 Non conforme"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-gray-500">{r.completedSteps?.join(" → ") ?? "—"}</td>
                  <td className="px-4 py-3">
                    {confirmResetId === (r.run?.id ?? r.runId) ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleReset(r.run?.id ?? r.runId)}
                          disabled={resettingRunId === (r.run?.id ?? r.runId)}
                          className="text-[10px] font-semibold px-2 py-1 rounded bg-[#bb0000] text-white hover:bg-[#990000] transition-colors disabled:opacity-50"
                        >
                          {resettingRunId === (r.run?.id ?? r.runId) ? "..." : "Confirmer"}
                        </button>
                        <button
                          onClick={() => setConfirmResetId(null)}
                          className="text-[10px] font-semibold px-2 py-1 rounded border border-[#d9d9d9] text-gray-500 hover:border-gray-400 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleReset(r.run?.id ?? r.runId)}
                        title="Réinitialiser la session de cet étudiant"
                        className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded border border-[#d9d9d9] text-[#e9730c] hover:border-[#e9730c] hover:bg-[#fff3cd] transition-colors"
                      >
                        <RotateCcw size={10} /> Réinitialiser
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </FioriShell>
  );
}
