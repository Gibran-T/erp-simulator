/**
 * MonitoringPageFull v2.0 — ERP Integrated Business Simulator
 * Teacher Control Tower — Real data from tRPC backend
 * Phases 7+8: Post-scenario analytics, at-risk alerts, improvement trends
 */
import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { trpc } from '@/lib/trpc';
import { ERP_MODULES } from '@/lib/erpData';
import {
  BarChart3, Users, TrendingUp, Award, AlertTriangle, CheckCircle2,
  Clock, X, ChevronDown, ChevronUp, Brain, Zap, Target,
  RefreshCw, Download, Filter, Eye
} from 'lucide-react';

const totalScenarios = ERP_MODULES.reduce((acc, m) => acc + m.scenarios.length, 0);

function timeAgo(value: Date | string | null | undefined): string {
  if (!value) return 'Jamais';
  const d = new Date(value);
  if (isNaN(d.getTime())) return 'Jamais';
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `Il y a ${days}j`;
}

function classifyLearner(avgScore: number, totalHints: number, totalWrong: number): { label: string; color: string; icon: string } {
  if (avgScore >= 90 && totalHints <= 1) return { label: 'Exécuteur précis', color: 'oklch(0.72 0.14 162)', icon: '🏆' };
  if (avgScore >= 80 && totalHints <= 2) return { label: 'Apprenant fiable', color: 'oklch(0.72 0.16 255)', icon: '⭐' };
  if (avgScore >= 70 && totalWrong > 5) return { label: 'Rapide mais imprécis', color: 'oklch(0.78 0.14 70)', icon: '⚡' };
  if (avgScore >= 60 && totalHints >= 3) return { label: 'Guidé en progression', color: 'oklch(0.78 0.14 70)', icon: '📈' };
  return { label: 'Nécessite du soutien', color: 'oklch(0.65 0.22 25)', icon: '🆘' };
}

type AttemptRow = {
  id: number;
  studentId: number;
  scenarioId: string;
  moduleId: string;
  score: number;
  hintsUsed: number;
  wrongAttempts: number;
  examMode: boolean | number;
  durationSeconds: number;
  completedAt: Date | string;
};

type StudentRow = {
  id: number;
  name: string;
  email: string;
  cohortId: number | null;
  lastActive: Date | string | null;
};

type CohortRow = { id: number; name: string };

type StudentSummary = {
  student: StudentRow;
  attempts: AttemptRow[];
  avgScore: number;
  bestScore: number;
  totalAttempts: number;
  uniqueScenarios: number;
  totalHints: number;
  totalWrong: number;
  isAtRisk: boolean;
  trend: 'up' | 'down' | 'stable' | 'new';
  learnerProfile: { label: string; color: string; icon: string };
  cohortName: string;
};

function buildSummaries(
  students: StudentRow[],
  attempts: AttemptRow[],
  cohorts: CohortRow[]
): StudentSummary[] {
  return students.map(student => {
    const sa = attempts.filter(a => a.studentId === student.id).sort((a, b) =>
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
    const scores = sa.map(a => a.score);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const totalHints = sa.reduce((a, b) => a + b.hintsUsed, 0);
    const totalWrong = sa.reduce((a, b) => a + b.wrongAttempts, 0);
    const uniqueScenarios = new Set(sa.map(a => a.scenarioId)).size;

    // At-risk: avg score < 60 with at least 2 attempts
    const isAtRisk = sa.length >= 2 && avgScore < 60;

    // Trend: compare last 2 attempts
    let trend: 'up' | 'down' | 'stable' | 'new' = 'new';
    if (scores.length >= 2) {
      const last = scores[scores.length - 1];
      const prev = scores[scores.length - 2];
      if (last > prev + 5) trend = 'up';
      else if (last < prev - 5) trend = 'down';
      else trend = 'stable';
    }

    const cohort = cohorts.find(c => c.id === student.cohortId);
    return {
      student,
      attempts: sa,
      avgScore,
      bestScore,
      totalAttempts: sa.length,
      uniqueScenarios,
      totalHints,
      totalWrong,
      isAtRisk,
      trend,
      learnerProfile: classifyLearner(avgScore, totalHints, totalWrong),
      cohortName: cohort?.name || '—',
    };
  });
}

function TrendBadge({ trend }: { trend: 'up' | 'down' | 'stable' | 'new' }) {
  if (trend === 'up') return <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'oklch(0.72 0.14 162 / 15%)', color: 'oklch(0.72 0.14 162)' }}>↑ Progresse</span>;
  if (trend === 'down') return <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'oklch(0.65 0.22 25 / 15%)', color: 'oklch(0.65 0.22 25)' }}>↓ Régresse</span>;
  if (trend === 'stable') return <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'oklch(0.78 0.14 70 / 15%)', color: 'oklch(0.78 0.14 70)' }}>→ Stable</span>;
  return <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'oklch(0.60 0.20 255 / 15%)', color: 'oklch(0.72 0.16 255)' }}>Nouveau</span>;
}

function StudentDetailPanel({ summary, onClose }: { summary: StudentSummary; onClose: () => void }) {
  const { student, attempts, avgScore, bestScore, totalAttempts, totalHints, totalWrong, learnerProfile, cohortName } = summary;

  // Group attempts by scenario
  const byScenario: Record<string, AttemptRow[]> = {};
  for (const a of attempts) {
    if (!byScenario[a.scenarioId]) byScenario[a.scenarioId] = [];
    byScenario[a.scenarioId].push(a);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'oklch(0 0 0 / 65%)' }} onClick={onClose}>
      <div className="w-full max-w-lg h-full overflow-y-auto" style={{ background: 'oklch(0.12 0.018 255)', borderLeft: '1px solid oklch(1 0 0 / 8%)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5" style={{ background: 'oklch(0.12 0.018 255)', borderBottom: '1px solid oklch(1 0 0 / 6%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'oklch(0.60 0.20 255 / 20%)', color: 'oklch(0.72 0.16 255)' }}>
              {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>{student.name}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{student.email} · {cohortName}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.010 255)' }}><X size={18} /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Score summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Score moyen', value: totalAttempts > 0 ? `${avgScore}%` : '—', color: avgScore >= 80 ? 'oklch(0.72 0.14 162)' : avgScore >= 60 ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.22 25)' },
              { label: 'Meilleur score', value: totalAttempts > 0 ? `${bestScore}%` : '—', color: 'oklch(0.72 0.16 255)' },
              { label: 'Tentatives', value: String(totalAttempts), color: 'oklch(0.65 0.010 255)' },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                <div className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk', color: s.color }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'oklch(0.45 0.010 255)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Learner profile */}
          <div className="p-4 rounded-xl" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'oklch(0.45 0.010 255)' }}>Profil d'apprentissage</div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{learnerProfile.icon}</span>
              <span className="font-semibold" style={{ color: learnerProfile.color }}>{learnerProfile.label}</span>
              <TrendBadge trend={summary.trend} />
            </div>
          </div>

          {/* Attempt history by scenario */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'oklch(0.45 0.010 255)' }}>Historique des tentatives</div>
            {Object.keys(byScenario).length === 0 ? (
              <div className="text-sm text-center py-6" style={{ color: 'oklch(0.45 0.010 255)' }}>Aucune tentative enregistrée</div>
            ) : (
              <div className="space-y-3">
                {Object.entries(byScenario).map(([scenarioId, scenAttempts]) => {
                  const mod = ERP_MODULES.find(m => m.scenarios.some(s => s.id === scenarioId));
                  const scenario = mod?.scenarios.find(s => s.id === scenarioId);
                  return (
                    <div key={scenarioId} className="rounded-xl overflow-hidden" style={{ border: '1px solid oklch(1 0 0 / 6%)' }}>
                      <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'oklch(0.14 0.018 255)' }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: mod?.color || 'oklch(0.55 0.010 255)' }} />
                        <span className="text-xs font-semibold" style={{ color: 'oklch(0.78 0.008 255)' }}>{scenario?.code || scenarioId}</span>
                        <span className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{scenario?.title}</span>
                      </div>
                      <div className="divide-y" style={{ borderColor: 'oklch(1 0 0 / 5%)' }}>
                        {scenAttempts.map((a, i) => {
                          const sc = a.score;
                          const scColor = sc >= 80 ? 'oklch(0.72 0.14 162)' : sc >= 60 ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.22 25)';
                          return (
                            <div key={a.id} className="flex items-center gap-3 px-4 py-2.5" style={{ background: 'oklch(0.11 0.015 255)' }}>
                              <span className="text-xs w-16" style={{ color: 'oklch(0.45 0.010 255)' }}>#{i + 1}</span>
                              <div className="flex-1">
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(0.20 0.018 255)' }}>
                                  <div className="h-full rounded-full" style={{ width: `${sc}%`, background: scColor }} />
                                </div>
                              </div>
                              <span className="text-sm font-bold w-10 text-right" style={{ color: scColor }}>{sc}%</span>
                              <span className="text-xs w-20 text-right" style={{ color: 'oklch(0.40 0.010 255)' }}>{timeAgo(a.completedAt)}</span>
                              {a.examMode ? <span className="text-xs px-1 rounded" style={{ background: 'oklch(0.65 0.22 25 / 15%)', color: 'oklch(0.65 0.22 25)' }}>Examen</span> : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Last active */}
          <div className="text-xs text-center" style={{ color: 'oklch(0.40 0.010 255)' }}>
            Dernière activité : {timeAgo(student.lastActive)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MonitoringPageFull() {
  const { data: attemptsRaw = [] } = trpc.attempts.allHistory.useQuery();
  const { data: studentsRaw = [] } = trpc.students.list.useQuery();
  const { data: cohortsRaw = [] } = trpc.cohorts.list.useQuery();

  const attempts = attemptsRaw as AttemptRow[];
  const students = studentsRaw as StudentRow[];
  const cohorts = cohortsRaw as CohortRow[];

  const [selectedCohort, setSelectedCohort] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<'name' | 'score' | 'attempts' | 'risk'>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedSummary, setSelectedSummary] = useState<StudentSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'cohorts' | 'insights'>('students');

  const summaries = useMemo(() => buildSummaries(students, attempts, cohorts), [students, attempts, cohorts]);

  const filtered = useMemo(() => {
    let list = selectedCohort ? summaries.filter(s => s.student.cohortId === selectedCohort) : summaries;
    list = [...list].sort((a, b) => {
      let av = 0, bv = 0;
      if (sortKey === 'name') return sortDir === 'asc' ? a.student.name.localeCompare(b.student.name) : b.student.name.localeCompare(a.student.name);
      if (sortKey === 'score') { av = a.avgScore; bv = b.avgScore; }
      if (sortKey === 'attempts') { av = a.totalAttempts; bv = b.totalAttempts; }
      if (sortKey === 'risk') { av = a.isAtRisk ? 1 : 0; bv = b.isAtRisk ? 1 : 0; }
      return sortDir === 'desc' ? bv - av : av - bv;
    });
    return list;
  }, [summaries, selectedCohort, sortKey, sortDir]);

  const atRiskCount = summaries.filter(s => s.isAtRisk).length;
  const avgClassScore = summaries.length > 0
    ? Math.round(summaries.reduce((a, b) => a + b.avgScore, 0) / summaries.length)
    : 0;
  const totalAttemptsCount = attempts.length;

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  // CSV export
  function exportCSV() {
    const rows = ['Nom,Email,Cohorte,Score moyen,Meilleur score,Tentatives,Scénarios,Profil,En risque'];
    for (const s of summaries) {
      rows.push([s.student.name, s.student.email, s.cohortName, s.avgScore, s.bestScore, s.totalAttempts, s.uniqueScenarios, s.learnerProfile.label, s.isAtRisk ? 'Oui' : 'Non'].join(','));
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'resultats_erp.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  // Cohort insights
  const cohortInsights = useMemo(() => {
    return cohorts.map(c => {
      const cs = summaries.filter(s => s.student.cohortId === c.id);
      const avg = cs.length > 0 ? Math.round(cs.reduce((a, b) => a + b.avgScore, 0) / cs.length) : 0;
      const atRisk = cs.filter(s => s.isAtRisk).length;
      const improving = cs.filter(s => s.trend === 'up').length;
      return { cohort: c, count: cs.length, avg, atRisk, improving };
    });
  }, [cohorts, summaries]);

  // Module difficulty insights
  const moduleInsights = useMemo(() => {
    return ERP_MODULES.map(mod => {
      const modAttempts = attempts.filter(a => a.moduleId === mod.id);
      const avg = modAttempts.length > 0 ? Math.round(modAttempts.reduce((a, b) => a + b.score, 0) / modAttempts.length) : null;
      const avgHints = modAttempts.length > 0 ? (modAttempts.reduce((a, b) => a + b.hintsUsed, 0) / modAttempts.length).toFixed(1) : null;
      return { mod, attempts: modAttempts.length, avg, avgHints };
    });
  }, [attempts]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
              Tour de contrôle pédagogique
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'oklch(0.45 0.010 255)' }}>
              Suivi en temps réel · {students.length} étudiants · {totalAttemptsCount} tentatives enregistrées
            </p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: 'oklch(0.60 0.20 255 / 15%)', color: 'oklch(0.72 0.16 255)', border: '1px solid oklch(0.60 0.20 255 / 25%)' }}>
            <Download size={14} /> Exporter CSV
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Users size={20} />, label: 'Étudiants', value: students.length, color: 'oklch(0.72 0.16 255)' },
            { icon: <BarChart3 size={20} />, label: 'Score moyen', value: `${avgClassScore}%`, color: avgClassScore >= 70 ? 'oklch(0.72 0.14 162)' : 'oklch(0.78 0.14 70)' },
            { icon: <TrendingUp size={20} />, label: 'Tentatives', value: totalAttemptsCount, color: 'oklch(0.65 0.010 255)' },
            { icon: <AlertTriangle size={20} />, label: 'En risque', value: atRiskCount, color: atRiskCount > 0 ? 'oklch(0.65 0.22 25)' : 'oklch(0.72 0.14 162)' },
          ].map((kpi, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: kpi.color }}>{kpi.icon}</div>
              <div className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk', color: kpi.color }}>{kpi.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'oklch(0.45 0.010 255)' }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'oklch(0.12 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
          {(['students', 'cohorts', 'insights'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: activeTab === tab ? 'oklch(0.60 0.20 255 / 20%)' : 'transparent',
                color: activeTab === tab ? 'oklch(0.72 0.16 255)' : 'oklch(0.45 0.010 255)',
              }}>
              {tab === 'students' ? 'Étudiants' : tab === 'cohorts' ? 'Cohortes' : 'Insights pédagogiques'}
            </button>
          ))}
        </div>

        {/* Students tab */}
        {activeTab === 'students' && (
          <div className="space-y-3">
            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Filter size={14} style={{ color: 'oklch(0.45 0.010 255)' }} />
                <span className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>Cohorte :</span>
              </div>
              <button onClick={() => setSelectedCohort(null)}
                className="text-xs px-3 py-1 rounded-lg transition-all"
                style={{ background: !selectedCohort ? 'oklch(0.60 0.20 255 / 20%)' : 'oklch(0.14 0.018 255)', color: !selectedCohort ? 'oklch(0.72 0.16 255)' : 'oklch(0.55 0.010 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                Tous ({summaries.length})
              </button>
              {cohorts.map(c => (
                <button key={c.id} onClick={() => setSelectedCohort(c.id)}
                  className="text-xs px-3 py-1 rounded-lg transition-all"
                  style={{ background: selectedCohort === c.id ? 'oklch(0.60 0.20 255 / 20%)' : 'oklch(0.14 0.018 255)', color: selectedCohort === c.id ? 'oklch(0.72 0.16 255)' : 'oklch(0.55 0.010 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                  {c.name} ({summaries.filter(s => s.student.cohortId === c.id).length})
                </button>
              ))}
            </div>

            {/* At-risk alert */}
            {atRiskCount > 0 && (
              <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'oklch(0.65 0.22 25 / 8%)', border: '1px solid oklch(0.65 0.22 25 / 25%)' }}>
                <AlertTriangle size={18} style={{ color: 'oklch(0.65 0.22 25)', flexShrink: 0 }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'oklch(0.65 0.22 25)' }}>
                    {atRiskCount} étudiant{atRiskCount > 1 ? 's' : ''} en difficulté
                  </div>
                  <div className="text-xs" style={{ color: 'oklch(0.55 0.010 255)' }}>
                    Score moyen &lt; 60% sur 2+ tentatives. Intervention recommandée.
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid oklch(1 0 0 / 6%)' }}>
              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ background: 'oklch(0.14 0.018 255)', color: 'oklch(0.45 0.010 255)' }}>
                <div className="col-span-3 cursor-pointer hover:text-white flex items-center gap-1" onClick={() => toggleSort('name')}>
                  Étudiant {sortKey === 'name' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
                <div className="col-span-2">Cohorte</div>
                <div className="col-span-2 cursor-pointer hover:text-white flex items-center gap-1" onClick={() => toggleSort('score')}>
                  Score moy. {sortKey === 'score' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
                <div className="col-span-2 cursor-pointer hover:text-white flex items-center gap-1" onClick={() => toggleSort('attempts')}>
                  Tentatives {sortKey === 'attempts' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
                <div className="col-span-2">Profil</div>
                <div className="col-span-1 cursor-pointer hover:text-white" onClick={() => toggleSort('risk')}>Statut</div>
              </div>

              {/* Table rows */}
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-sm" style={{ color: 'oklch(0.45 0.010 255)', background: 'oklch(0.11 0.015 255)' }}>
                  Aucun étudiant trouvé
                </div>
              ) : (
                filtered.map((summary, i) => {
                  const { student, avgScore, totalAttempts, isAtRisk, learnerProfile, cohortName, trend } = summary;
                  const scoreColor = avgScore >= 80 ? 'oklch(0.72 0.14 162)' : avgScore >= 60 ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.22 25)';
                  return (
                    <div key={student.id}
                      className="grid grid-cols-12 gap-2 px-4 py-3 cursor-pointer transition-all hover:bg-white/5"
                      style={{
                        background: i % 2 === 0 ? 'oklch(0.11 0.015 255)' : 'oklch(0.12 0.018 255)',
                        borderTop: '1px solid oklch(1 0 0 / 4%)',
                        borderLeft: isAtRisk ? '3px solid oklch(0.65 0.22 25)' : '3px solid transparent',
                      }}
                      onClick={() => setSelectedSummary(summary)}>
                      <div className="col-span-3 flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: 'oklch(0.60 0.20 255 / 15%)', color: 'oklch(0.72 0.16 255)' }}>
                          {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate" style={{ color: 'oklch(0.85 0.005 255)' }}>{student.name}</div>
                          <div className="text-xs truncate" style={{ color: 'oklch(0.40 0.010 255)' }}>{student.email}</div>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-xs truncate" style={{ color: 'oklch(0.55 0.010 255)' }}>{cohortName}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        {totalAttempts > 0 ? (
                          <>
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(0.20 0.018 255)' }}>
                              <div className="h-full rounded-full" style={{ width: `${avgScore}%`, background: scoreColor }} />
                            </div>
                            <span className="text-xs font-bold w-8 text-right" style={{ color: scoreColor }}>{avgScore}%</span>
                          </>
                        ) : (
                          <span className="text-xs" style={{ color: 'oklch(0.35 0.010 255)' }}>—</span>
                        )}
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-xs" style={{ color: 'oklch(0.55 0.010 255)' }}>
                          {totalAttempts > 0 ? `${totalAttempts} tentative${totalAttempts > 1 ? 's' : ''}` : 'Aucune'}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        <span className="text-sm">{learnerProfile.icon}</span>
                        <span className="text-xs truncate" style={{ color: learnerProfile.color }}>{learnerProfile.label.split(' ')[0]}</span>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <TrendBadge trend={trend} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Cohorts tab */}
        {activeTab === 'cohorts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cohortInsights.map(({ cohort, count, avg, atRisk, improving }) => (
              <div key={cohort.id} className="p-5 rounded-xl" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>{cohort.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'oklch(0.60 0.20 255 / 15%)', color: 'oklch(0.72 0.16 255)' }}>
                    {count} étudiant{count > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xl font-black" style={{ fontFamily: 'Space Grotesk', color: avg >= 70 ? 'oklch(0.72 0.14 162)' : 'oklch(0.78 0.14 70)' }}>{avg > 0 ? `${avg}%` : '—'}</div>
                    <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>Score moyen</div>
                  </div>
                  <div>
                    <div className="text-xl font-black" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.72 0.14 162)' }}>{improving}</div>
                    <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>En progression</div>
                  </div>
                  <div>
                    <div className="text-xl font-black" style={{ fontFamily: 'Space Grotesk', color: atRisk > 0 ? 'oklch(0.65 0.22 25)' : 'oklch(0.72 0.14 162)' }}>{atRisk}</div>
                    <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>En risque</div>
                  </div>
                </div>
              </div>
            ))}
            {cohortInsights.length === 0 && (
              <div className="col-span-2 py-12 text-center text-sm" style={{ color: 'oklch(0.45 0.010 255)' }}>
                Aucune cohorte configurée
              </div>
            )}
          </div>
        )}

        {/* Insights tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold" style={{ color: 'oklch(0.75 0.008 255)' }}>Difficulté par module</h3>
            <div className="space-y-3">
              {moduleInsights.map(({ mod, attempts: cnt, avg, avgHints }) => (
                <div key={mod.id} className="p-4 rounded-xl" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: mod.color }} />
                      <span className="text-sm font-semibold" style={{ color: 'oklch(0.85 0.005 255)' }}>{mod.id.toUpperCase()} — {mod.name}</span>
                    </div>
                    <span className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{cnt} tentative{cnt > 1 ? 's' : ''}</span>
                  </div>
                  {avg !== null ? (
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'oklch(0.20 0.018 255)' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${avg}%`, background: avg >= 70 ? 'oklch(0.72 0.14 162)' : avg >= 50 ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.22 25)' }} />
                        </div>
                      </div>
                      <span className="text-sm font-bold w-12 text-right" style={{ color: avg >= 70 ? 'oklch(0.72 0.14 162)' : avg >= 50 ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.22 25)' }}>{avg}%</span>
                      <span className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>💡 {avgHints} indices/tentative</span>
                    </div>
                  ) : (
                    <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>Aucune tentative enregistrée</div>
                  )}
                </div>
              ))}
            </div>

            {/* Learner profile distribution */}
            <h3 className="text-sm font-semibold pt-2" style={{ color: 'oklch(0.75 0.008 255)' }}>Distribution des profils d'apprentissage</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Exécuteur précis', icon: '🏆', color: 'oklch(0.72 0.14 162)' },
                { label: 'Apprenant fiable', icon: '⭐', color: 'oklch(0.72 0.16 255)' },
                { label: 'Rapide mais imprécis', icon: '⚡', color: 'oklch(0.78 0.14 70)' },
                { label: 'Guidé en progression', icon: '📈', color: 'oklch(0.78 0.14 70)' },
                { label: 'Nécessite du soutien', icon: '🆘', color: 'oklch(0.65 0.22 25)' },
              ].map(p => {
                const count = summaries.filter(s => s.learnerProfile.label === p.label).length;
                return (
                  <div key={p.label} className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <div className="text-lg font-black" style={{ fontFamily: 'Space Grotesk', color: p.color }}>{count}</div>
                      <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{p.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Student detail panel */}
        {selectedSummary && (
          <StudentDetailPanel summary={selectedSummary} onClose={() => setSelectedSummary(null)} />
        )}
      </div>
    </DashboardLayout>
  );
}
