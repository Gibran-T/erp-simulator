import FioriShell from "@/components/FioriShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { BookOpen, Play, ChevronRight, AlertCircle, UserCircle, CheckCircle, Pencil, MonitorPlay, Presentation } from "lucide-react";
import ModeSelectionScreen from "./ModeSelectionScreen";
import { useLanguage } from "@/contexts/LanguageContext";

const difficultyConfig: Record<string, { label: string; color: string }> = {
  facile: { label: "Facile", color: "badge-valid" },
  moyen: { label: "Moyen", color: "badge-pending" },
  difficile: { label: "Difficile", color: "badge-blocked" },
};

export default function ScenarioList() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";
  const { data: scenarios, isLoading } = trpc.scenarios.list.useQuery();
  const { data: myRuns } = trpc.runs.myRuns.useQuery();
  const { data: myProfile, refetch: refetchProfile } = trpc.profiles.mine.useQuery();
  const upsertProfile = trpc.profiles.upsert.useMutation({ onSuccess: () => refetchProfile() });
  const [pendingScenario, setPendingScenario] = useState<{ id: number; name: string; difficulty?: string } | null>(null);
  const [editingStudentNum, setEditingStudentNum] = useState(false);
  const [studentNumInput, setStudentNumInput] = useState("");

  const getRunForScenario = (scenarioId: number) =>
    myRuns?.find((r) => r.run.scenarioId === scenarioId && r.run.status === "in_progress" && !r.run.isDemo);

  const getCompletedRunForScenario = (scenarioId: number) =>
    myRuns?.find((r) => r.run.scenarioId === scenarioId && r.run.status === "completed" && !r.run.isDemo);

  const handleOpenEdit = () => {
    setStudentNumInput(myProfile?.studentNumber ?? "");
    setEditingStudentNum(true);
  };

  const handleSaveStudentNum = () => {
    upsertProfile.mutate({ studentNumber: studentNumInput.trim() || null });
    setEditingStudentNum(false);
  };

  // Show mode selection screen when a scenario is clicked
  if (pendingScenario) {
    return (
      <ModeSelectionScreen
        scenarioId={pendingScenario.id}
        scenarioName={pendingScenario.name}
        scenarioDifficulty={pendingScenario.difficulty}
        onCancel={() => setPendingScenario(null)}
      />
    );
  }

  return (
    <FioriShell
      title="Mes Scénarios — Module 1"
      breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Scénarios" }]}
    >
      <div className="max-w-4xl mx-auto">

        {/* ── Mode Enseignant Banner ─────────────────────────────────────── */}
        {isTeacherOrAdmin && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-md mb-4 border-2 border-[#5b4b8a] bg-gradient-to-r from-[#ede7f6] to-[#f3e5f5]">
            <div className="w-8 h-8 bg-[#5b4b8a] rounded-md flex items-center justify-center shrink-0">
              <MonitorPlay size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#3d1f6e]">Mode Enseignant — Vue de démonstration</p>
              <p className="text-[10px] text-[#5b4b8a] mt-0.5">Vous consultez l’interface étudiant en tant qu’enseignant. Les scores affichés sont à titre pédagogique (non officiels).</p>
            </div>
            <button
              onClick={() => navigate("/teacher")}
              className="text-xs text-[#5b4b8a] font-semibold hover:underline shrink-0"
            >
              ← Retour tableau de bord
            </button>
          </div>
        )}

        {/* ── Numéro étudiant banner ─────────────────────────────────────── */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-md mb-4 border ${myProfile?.studentNumber ? "bg-[#f0f9f4] border-[#107e3e]/30" : "bg-[#fff8e6] border-[#e9730c]/30"}`}>
          <UserCircle size={18} className={myProfile?.studentNumber ? "text-[#107e3e]" : "text-[#e9730c]"} />
          {editingStudentNum ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={studentNumInput}
                onChange={(e) => setStudentNumInput(e.target.value)}
                placeholder="Ex: 2024-12345"
                maxLength={64}
                className="border border-[#d9d9d9] rounded px-2 py-1 text-xs w-48 focus:outline-none focus:border-[#0070f2]"
                onKeyDown={(e) => e.key === "Enter" && handleSaveStudentNum()}
                autoFocus
              />
              <button
                onClick={handleSaveStudentNum}
                disabled={upsertProfile.isPending}
                className="flex items-center gap-1 bg-[#0070f2] text-white text-xs font-semibold px-3 py-1 rounded hover:bg-[#0058c7] transition-colors"
              >
                <CheckCircle size={12} />
                Enregistrer
              </button>
              <button
                onClick={() => setEditingStudentNum(false)}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
              >
                Annuler
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs font-semibold text-gray-600">Numéro étudiant :</span>
              {myProfile?.studentNumber ? (
                <span className="text-xs font-bold text-[#107e3e] font-mono">{myProfile.studentNumber}</span>
              ) : (
                <span className="text-xs text-[#e9730c] italic">Non défini — requis pour l'identification par l'enseignant</span>
              )}
              <button
                onClick={handleOpenEdit}
                className="ml-1 text-gray-400 hover:text-[#0070f2] transition-colors"
                title="Modifier le numéro étudiant"
              >
                <Pencil size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Module Header */}
        <div className="bg-white border border-[#d9d9d9] rounded-md p-5 mb-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#0f2a44] rounded-md flex items-center justify-center flex-shrink-0">
              <BookOpen size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Module 1</p>
                  <h2 className="text-[#0f2a44] font-semibold text-base">{t("Fondements de la chaîne logistique et intégration ERP/WMS", "Foundations of Supply Chain & ERP/WMS Integration")}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("Maîtrisez le cycle complet :", "Master the complete cycle:")}{" "}<span className="font-medium text-[#0070f2]">PO → GR → Stock → SO → GI → Cycle Count → Conformité</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate("/student/slides/1")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-white shrink-0 transition-opacity hover:opacity-90"
                  style={{ background: "#0f2a44" }}
                  title={t("Accéder aux slides du Module 1", "Access Module 1 slides")}
                >
                  <Presentation size={14} />
                  {t("Slides M1", "Slides M1")}
                </button>
              </div>
            </div>
          </div>

          {/* Process Flow Mini */}
          <div className="mt-4 flex items-center gap-1 overflow-x-auto pb-1">
            {["PO", "GR", "STOCK", "SO", "GI", "CC", "COMPLIANCE"].map((step, i) => (
              <div key={step} className="flex items-center gap-1 flex-shrink-0">
                <span className="px-2 py-1 bg-[#e8f4fd] text-[#0070f2] text-xs font-semibold rounded">{step}</span>
                {i < 6 && <ChevronRight size={12} className="text-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        {/* Scenarios */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Scénarios disponibles ({scenarios?.length ?? 0})</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-[#d9d9d9] rounded-md p-5 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {scenarios?.map((scenario) => {
              const activeRun = getRunForScenario(scenario.id);
              const completedRun = getCompletedRunForScenario(scenario.id);
              const diffCfg = difficultyConfig[scenario.difficulty ?? 'facile'] ?? difficultyConfig.facile;

              return (
                <div key={scenario.id} className="bg-white border border-[#d9d9d9] rounded-md p-5 hover:border-[#0070f2] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={diffCfg.color}>{diffCfg.label}</span>
                        {completedRun && <span className="badge-valid">✓ Complété</span>}
                        {activeRun && <span className="badge-pending">En cours</span>}
                      </div>
                      <h3 className="text-[#0f2a44] font-semibold text-sm mb-1">{scenario.name}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{scenario.descriptionFr}</p>
                    </div>

                    <div className="flex-shrink-0 flex flex-col gap-2">
                      {activeRun ? (
                        <button
                          onClick={() => navigate(`/student/run/${activeRun.run.id}`)}
                          className="flex items-center gap-1.5 bg-[#e9730c] text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-[#c8600a] transition-colors"
                        >
                          <Play size={12} />
                          Continuer
                        </button>
                      ) : completedRun ? (
                        <button
                          onClick={() => navigate(`/student/run/${completedRun.run.id}/report`)}
                          className="flex items-center gap-1.5 bg-[#107e3e] text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-[#0a5c2d] transition-colors"
                        >
                          Voir rapport
                        </button>
                      ) : null}
                      {/* Always show "Démarrer / Nouvelle simulation" button */}
                      {!activeRun && (
                        <button
                          onClick={() => setPendingScenario({ id: scenario.id, name: scenario.name, difficulty: scenario.difficulty ?? undefined })}
                          className="flex items-center gap-1.5 bg-[#0070f2] text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-[#0058c7] transition-colors"
                        >
                          <Play size={12} />
                          {completedRun ? "Recommencer" : "Démarrer"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="alert-info mt-5 flex items-start gap-3">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold mb-0.5">Instructions pédagogiques</p>
            <p className="text-xs">
              Chaque scénario simule un contexte d'entrepôt réel. Suivez le flux séquentiel obligatoire.
              Le système bloque toute action hors séquence. Score maximum : <strong>100 points</strong>.
              Les enseignants peuvent activer le <strong>Mode Démonstration</strong> pour une exploration libre sans score.
            </p>
          </div>
        </div>
      </div>
    </FioriShell>
  );
}
