import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import FioriShell from "@/components/FioriShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, FlaskConical, ShieldCheck, Zap, AlertTriangle, Play, Lock, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Module2ModeSelectionPage() {
  const params = useParams<{ scenarioId: string }>();
  const scenarioId = parseInt(params.scenarioId ?? "0", 10);
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [selectedMode, setSelectedMode] = useState<"evaluation" | "demonstration">("evaluation");

  const { data: scenarios } = trpc.scenarios.list.useQuery();
  const scenario = scenarios?.find((s) => s.id === scenarioId);

  const startRun = trpc.runs.start.useMutation({
    onSuccess: (data) => {
      navigate(`/student/module2/run/${data.runId}/putaway`);
    },
    onError: (err) => {
      toast.error(err.message ?? "Erreur lors du démarrage");
    },
  });

  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";

  if (!scenarioId || !scenario) {
    return (
      <FioriShell>
        <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
          Scénario introuvable.
        </div>
      </FioriShell>
    );
  }

  return (
    <FioriShell>
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
        {/* Breadcrumb */}
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="cursor-pointer hover:underline" onClick={() => navigate("/student/module2")}>Module 2</span>
          <span>›</span>
          <span>Mode de simulation</span>
        </div>

        {/* Scenario card */}
        <Card className="border-blue-200 bg-blue-50/40">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Scénario sélectionné</p>
                <CardTitle className="text-base">{scenario.name}</CardTitle>
                <CardDescription className="text-xs">{scenario.difficulty ?? "facile"}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Mode selection */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">MODE DE SIMULATION :</p>

          {/* Evaluation mode */}
          <div
            className={`rounded-lg border-2 p-4 cursor-pointer transition-colors ${
              selectedMode === "evaluation" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => setSelectedMode("evaluation")}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMode === "evaluation" ? "border-blue-500" : "border-slate-400"}`}>
                {selectedMode === "evaluation" && <div className="w-2 h-2 rounded-full bg-blue-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">Mode Évaluation</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs" variant="outline">PAR DÉFAUT</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Mode officiel avec score et blocage séquentiel. Les points sont calculés, les pénalités s'appliquent.
                  <strong> Score maximum : 100 points.</strong>
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Score activé</span>
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Règles FIFO/Capacité</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-blue-500" /> Rapport final</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo mode */}
          <div
            className={`rounded-lg border-2 p-4 transition-colors ${
              !isTeacherOrAdmin
                ? "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                : selectedMode === "demonstration"
                ? "border-blue-500 bg-blue-50 cursor-pointer"
                : "border-slate-200 hover:border-slate-300 cursor-pointer"
            }`}
            onClick={() => isTeacherOrAdmin && setSelectedMode("demonstration")}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMode === "demonstration" && isTeacherOrAdmin ? "border-blue-500" : "border-slate-400"}`}>
                {selectedMode === "demonstration" && isTeacherOrAdmin && <div className="w-2 h-2 rounded-full bg-blue-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">Mode Démonstration</span>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs" variant="outline">ENSEIGNANTS</Badge>
                  {!isTeacherOrAdmin && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Lock className="w-3 h-3" /> Réservé
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Mode pédagogique libre. Aucun score enregistré, aucune pénalité, progression libre. Inclut les explications approfondies et la transparence du backend WMS.
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><FlaskConical className="w-3 h-3 text-blue-500" /> Progression libre</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-purple-500" /> Explications pédagogiques</span>
                  {!isTeacherOrAdmin && <span className="text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Accès réservé aux enseignants</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={() => navigate("/student/module2")}>
            ← Retour aux scénarios
          </Button>
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            disabled={startRun.isPending}
            onClick={() => {
              startRun.mutate({
                scenarioId,
                isDemo: selectedMode === "demonstration",
              });
            }}
          >
            <Play className="w-4 h-4" />
            {startRun.isPending ? "Démarrage..." : `Démarrer en mode ${selectedMode === "evaluation" ? "Évaluation" : "Démonstration"}`}
          </Button>
        </div>
      </div>
    </FioriShell>
  );
}
