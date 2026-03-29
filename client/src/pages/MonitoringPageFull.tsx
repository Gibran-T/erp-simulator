/**
 * MonitoringPageFull v2.1 — ERP Integrated Business Simulator
 * Teacher Control Tower — Real data from tRPC backend
 * Phases 7+8: Post-scenario analytics, at-risk alerts, improvement trends
 * v2.1: Full FR/EN bilingual support via useLang
 */
import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { trpc } from '@/lib/trpc';
import { ERP_MODULES } from '@/lib/erpData';
import { useLang } from '@/contexts/LanguageContext';
import {
  BarChart3, Users, TrendingUp, AlertTriangle, CheckCircle2,
  X, ChevronDown, ChevronUp, Brain,
  Download, Filter, BookOpen, RotateCcw
} from 'lucide-react';

const totalScenarios = ERP_MODULES.reduce((acc, m) => acc + m.scenarios.length, 0);
void totalScenarios;

function timeAgo(value: Date | string | null | undefined, t: (k: string) => string): string {
  if (!value) return t('common.never');
  const d = new Date(value);
  if (isNaN(d.getTime())) return t('common.never');
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return t('common.instantAgo');
  if (mins < 60) return t('common.minutesAgo').replace('{n}', String(mins));
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t('common.hoursAgo').replace('{n}', String(hrs));
  const days = Math.floor(hrs / 24);
  return t('common.daysAgo').replace('{n}', String(days));
}

function classifyLearner(avgScore: number, totalHints: number, totalWrong: number, t: (k: string) => string): { label: string; color: string; icon: string } {
  if (avgScore >= 90 && totalHints <= 1) return { label: t('profile.precise'), color: 'oklch(0.72 0.14 162)', icon: '🏆' };
  if (avgScore >= 80 && totalHints <= 2) return { label: t('profile.reliable'), color: 'oklch(0.72 0.16 255)', icon: '⭐' };
  if (avgScore >= 70 && totalWrong > 5) return { label: t('profile.fast'), color: 'oklch(0.78 0.14 70)', icon: '⚡' };
  if (avgScore >= 60 && totalHints >= 3) return { label: t('profile.guided'), color: 'oklch(0.78 0.14 70)', icon: '📈' };
  return { label: t('profile.support'), color: 'oklch(0.65 0.22 25)', icon: '🆘' };
}

/**
 * Terminology confusion signal:
 * A student who retries many times (wrongAttempts) but scores low likely confuses
 * ERP-specific terms (T-codes, menu names) rather than misunderstanding the process.
 * A student with high hints + low score likely needs process understanding, not just terminology.
 */
function detectConfusionType(avgScore: number, totalHints: number, totalWrong: number, totalAttempts: number, t: (k: string) => string): {
  terminologyConfused: boolean;
  processConfused: boolean;
  label: string;
  color: string;
} {
  if (totalAttempts === 0) return { terminologyConfused: false, processConfused: false, label: t('confusion.noData'), color: 'oklch(0.40 0.010 255)' };
  const wrongPerAttempt = totalAttempts > 0 ? totalWrong / totalAttempts : 0;
  const hintsPerAttempt = totalAttempts > 0 ? totalHints / totalAttempts : 0;
  if (wrongPerAttempt >= 2 && avgScore >= 60) return { terminologyConfused: true, processConfused: false, label: t('confusion.termConf'), color: 'oklch(0.78 0.14 70)' };
  if (hintsPerAttempt >= 1.5 && avgScore < 65) return { terminologyConfused: false, processConfused: true, label: t('confusion.procConf'), color: 'oklch(0.65 0.22 25)' };
  if (wrongPerAttempt >= 2 && hintsPerAttempt >= 1.5 && avgScore < 60) return { terminologyConfused: true, processConfused: true, label: t('confusion.bothConf'), color: 'oklch(0.65 0.22 25)' };
  return { terminologyConfused: false, processConfused: false, label: t('confusion.ok'), color: 'oklch(0.72 0.14 162)' };
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
  stepBreakdown?: string; // JSON: [{stepId, correct, hintsUsed, wrongAttempts}]
};
type StepBreakdownItem = { stepId: string; correct: boolean; hintsUsed: boolean; wrongAttempts: number };

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
  confusionSignal: { terminologyConfused: boolean; processConfused: boolean; label: string; color: string };
};

function buildSummaries(
  students: StudentRow[],
  attempts: AttemptRow[],
  cohorts: CohortRow[],
  t: (k: string) => string
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
    const isAtRisk = sa.length >= 2 && avgScore < 60;
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
      learnerProfile: classifyLearner(avgScore, totalHints, totalWrong, t),
      cohortName: cohort?.name || '—',
      confusionSignal: detectConfusionType(avgScore, totalHints, totalWrong, sa.length, t),
    };
  });
}

function TrendBadge({ trend, t }: { trend: 'up' | 'down' | 'stable' | 'new'; t: (k: string) => string }) {
  if (trend === 'up') return <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'oklch(0.72 0.14 162 / 15%)', color: 'oklch(0.72 0.14 162)' }}>↑ {t('monitoring.filterImproving').split(' ')[0]}</span>;
  if (trend === 'down') return <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'oklch(0.65 0.22 25 / 15%)', color: 'oklch(0.65 0.22 25)' }}>↓ {t('monitoring.regressing')}</span>;
  if (trend === 'stable') return <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'oklch(0.78 0.14 70 / 15%)', color: 'oklch(0.78 0.14 70)' }}>→ {t('monitoring.stable')}</span>;
  return <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'oklch(0.60 0.20 255 / 15%)', color: 'oklch(0.72 0.16 255)' }}>{t('monitoring.new')}</span>;
}

function StudentDetailPanel({ summary, onClose, t }: { summary: StudentSummary; onClose: () => void; t: (k: string) => string }) {
  const { student, attempts, avgScore, bestScore, totalAttempts, totalHints, totalWrong, learnerProfile, cohortName, confusionSignal } = summary;

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
              { label: t('monitoring.avgScore'), value: totalAttempts > 0 ? `${avgScore}%` : '—', color: avgScore >= 80 ? 'oklch(0.72 0.14 162)' : avgScore >= 60 ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.22 25)' },
              { label: t('monitoring.bestScore'), value: totalAttempts > 0 ? `${bestScore}%` : '—', color: 'oklch(0.72 0.16 255)' },
              { label: t('common.attempts'), value: String(totalAttempts), color: 'oklch(0.65 0.010 255)' },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                <div className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk', color: s.color }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'oklch(0.45 0.010 255)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Learner profile */}
          <div className="p-4 rounded-xl" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('monitoring.learnerProfile')}</div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{learnerProfile.icon}</span>
              <span className="font-semibold" style={{ color: learnerProfile.color }}>{learnerProfile.label}</span>
              <TrendBadge trend={summary.trend} t={t} />
            </div>
          </div>

          {/* ERP confusion signal */}
          {totalAttempts > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${confusionSignal.color}25` }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('monitoring.erpDiagnostic')}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: confusionSignal.color }} />
                <span className="text-sm font-semibold" style={{ color: confusionSignal.color }}>{confusionSignal.label}</span>
              </div>
              <div className="text-xs leading-relaxed" style={{ color: 'oklch(0.50 0.010 255)' }}>
                {confusionSignal.terminologyConfused && !confusionSignal.processConfused && t('monitoring.diagTermConf')}
                {confusionSignal.processConfused && !confusionSignal.terminologyConfused && t('monitoring.diagProcConf')}
                {confusionSignal.terminologyConfused && confusionSignal.processConfused && t('monitoring.diagBothConf')}
                {!confusionSignal.terminologyConfused && !confusionSignal.processConfused && totalAttempts > 0 && t('monitoring.diagOk')}
              </div>
              <div className="mt-2 flex gap-3 text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>
                <span>{totalWrong} {t('monitoring.totalErrors')}</span>
                <span>·</span>
                <span>{totalHints} {t('monitoring.hintsUsed')}</span>
              </div>
            </div>
          )}

          {/* Attempt history by scenario */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('monitoring.attemptHistory')}</div>
            {Object.keys(byScenario).length === 0 ? (
              <div className="text-sm text-center py-6" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('monitoring.noAttempts')}</div>
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
                          let breakdown: StepBreakdownItem[] = [];
                          try { if (a.stepBreakdown) { const parsed = JSON.parse(a.stepBreakdown); breakdown = Array.isArray(parsed) ? parsed : []; } } catch {}
                          const correctSteps = breakdown.filter(s => s.correct).length;
                          const failedSteps = breakdown.filter(s => !s.correct);
                          return (
                            <div key={a.id} style={{ background: 'oklch(0.11 0.015 255)' }}>
                              <div className="flex items-center gap-3 px-4 py-2.5">
                                <span className="text-xs w-16" style={{ color: 'oklch(0.45 0.010 255)' }}>#{i + 1}</span>
                                <div className="flex-1">
                                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(0.20 0.018 255)' }}>
                                    <div className="h-full rounded-full" style={{ width: `${sc}%`, background: scColor }} />
                                  </div>
                                </div>
                                <span className="text-sm font-bold w-10 text-right" style={{ color: scColor }}>{sc}%</span>
                                <span className="text-xs w-20 text-right" style={{ color: 'oklch(0.40 0.010 255)' }}>{timeAgo(a.completedAt, t)}</span>
                                {a.examMode ? <span className="text-xs px-1 rounded" style={{ background: 'oklch(0.65 0.22 25 / 15%)', color: 'oklch(0.65 0.22 25)' }}>Exam</span> : null}
                              </div>
                              {breakdown.length > 0 && (
                                <div className="px-4 pb-2.5">
                                  <div className="flex gap-1 mb-1.5">
                                    {breakdown.map((step, si) => (
                                      <div key={si} title={`${step.stepId}: ${step.correct ? '✓' : '✗'}${step.hintsUsed ? ' (hint)' : ''}${step.wrongAttempts > 0 ? ` (${step.wrongAttempts}x wrong)` : ''}`}
                                        className="flex-1 h-2 rounded-sm"
                                        style={{ background: step.correct ? 'oklch(0.72 0.14 162)' : 'oklch(0.65 0.22 25)', opacity: step.hintsUsed ? 0.7 : 1 }} />
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>
                                    <span style={{ color: 'oklch(0.72 0.14 162)' }}>✓ {correctSteps}/{breakdown.length}</span>
                                    {failedSteps.length > 0 && (
                                      <span style={{ color: 'oklch(0.65 0.22 25)' }}>✗ {failedSteps.map(s => s.stepId.split('-').pop()).join(', ')}</span>
                                    )}
                                    {a.hintsUsed > 0 && <span>💡 {a.hintsUsed} hint{a.hintsUsed > 1 ? 's' : ''}</span>}
                                    {a.durationSeconds > 0 && <span>⏱ {Math.floor(a.durationSeconds / 60)}m{a.durationSeconds % 60}s</span>}
                                  </div>
                                </div>
                              )}
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

          {/* Teacher actions */}
          {totalAttempts > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.60 0.20 255 / 20%)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('monitoring.teacherActions')}</div>
              <div className="space-y-2">
                {confusionSignal.processConfused && (
                  <a href={`/modules/${attempts[0]?.moduleId || 'mm'}`}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                    style={{ background: 'oklch(0.72 0.16 255 / 15%)', color: 'oklch(0.72 0.16 255)', border: '1px solid oklch(0.72 0.16 255 / 25%)' }}>
                    <BookOpen size={12} />
                    {t('monitoring.reviewSlides')}
                    <span className="ml-auto text-xs opacity-60">Recommandé</span>
                  </a>
                )}
                {(confusionSignal.terminologyConfused || confusionSignal.processConfused) && (
                  <a href={`/simulator/${attempts[0]?.scenarioId || 'mm-01'}`}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                    style={{ background: 'oklch(0.78 0.14 70 / 15%)', color: 'oklch(0.78 0.14 70)', border: '1px solid oklch(0.78 0.14 70 / 25%)' }}>
                    <RotateCcw size={12} />
                    {t('monitoring.retryGuided')}
                  </a>
                )}
                {!confusionSignal.terminologyConfused && !confusionSignal.processConfused && avgScore >= 80 && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs" style={{ background: 'oklch(0.72 0.14 162 / 10%)', color: 'oklch(0.72 0.14 162)', border: '1px solid oklch(0.72 0.14 162 / 20%)' }}>
                    <CheckCircle2 size={12} />
                    {t('monitoring.diagOk').split('.')[0]}
                  </div>
                )}
                {avgScore < 60 && totalAttempts >= 2 && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs" style={{ background: 'oklch(0.65 0.22 25 / 10%)', color: 'oklch(0.65 0.22 25)', border: '1px solid oklch(0.65 0.22 25 / 20%)' }}>
                    <AlertTriangle size={12} />
                    {t('monitoring.diagBothConf').split('.')[0]}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Last active */}
          <div className="text-xs text-center" style={{ color: 'oklch(0.40 0.010 255)' }}>
            {t('common.lastActive')} : {timeAgo(student.lastActive, t)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MonitoringPageFull() {
  const { t } = useLang();
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

  const summaries = useMemo(() => buildSummaries(students, attempts, cohorts, t), [students, attempts, cohorts, t]);

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

  function exportCSV() {
    const rows = [`${t('common.name')},Email,${t('common.cohort')},${t('monitoring.avgScore')},${t('monitoring.bestScore')},${t('common.attempts')},${t('common.scenarios')},${t('monitoring.learnerProfile')},${t('monitoring.atRisk')}`];
    for (const s of summaries) {
      rows.push([s.student.name, s.student.email, s.cohortName, s.avgScore, s.bestScore, s.totalAttempts, s.uniqueScenarios, s.learnerProfile.label, s.isAtRisk ? t('common.yes') : t('common.no')].join(','));
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'resultats_erp.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const cohortInsights = useMemo(() => {
    return cohorts.map(c => {
      const cs = summaries.filter(s => s.student.cohortId === c.id);
      const avg = cs.length > 0 ? Math.round(cs.reduce((a, b) => a + b.avgScore, 0) / cs.length) : 0;
      const atRisk = cs.filter(s => s.isAtRisk).length;
      const improving = cs.filter(s => s.trend === 'up').length;
      return { cohort: c, count: cs.length, avg, atRisk, improving };
    });
  }, [cohorts, summaries]);

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
              {t('monitoring.controlTower')}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'oklch(0.45 0.010 255)' }}>
              {t('monitoring.realtime')} · {students.length} {t('common.students').toLowerCase()} · {totalAttemptsCount} {t('monitoring.attempts')}
            </p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: 'oklch(0.60 0.20 255 / 15%)', color: 'oklch(0.72 0.16 255)', border: '1px solid oklch(0.60 0.20 255 / 25%)' }}>
            <Download size={14} /> {t('monitoring.exportCSV')}
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Users size={20} />, label: t('common.students'), value: students.length, color: 'oklch(0.72 0.16 255)' },
            { icon: <BarChart3 size={20} />, label: t('monitoring.avgScore'), value: `${avgClassScore}%`, color: avgClassScore >= 70 ? 'oklch(0.72 0.14 162)' : 'oklch(0.78 0.14 70)' },
            { icon: <TrendingUp size={20} />, label: t('common.attempts'), value: totalAttemptsCount, color: 'oklch(0.65 0.010 255)' },
            { icon: <AlertTriangle size={20} />, label: t('monitoring.atRisk'), value: atRiskCount, color: atRiskCount > 0 ? 'oklch(0.65 0.22 25)' : 'oklch(0.72 0.14 162)' },
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
              {tab === 'students' ? t('monitoring.tabStudents') : tab === 'cohorts' ? t('monitoring.tabCohorts') : t('monitoring.tabInsights')}
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
                <span className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('common.cohort')} :</span>
              </div>
              <button onClick={() => setSelectedCohort(null)}
                className="text-xs px-3 py-1 rounded-lg transition-all"
                style={{ background: !selectedCohort ? 'oklch(0.60 0.20 255 / 20%)' : 'oklch(0.14 0.018 255)', color: !selectedCohort ? 'oklch(0.72 0.16 255)' : 'oklch(0.55 0.010 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                {t('monitoring.filterAll')} ({summaries.length})
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
                    {atRiskCount} {t('common.students').toLowerCase()} {t('monitoring.atRisk').toLowerCase()}
                  </div>
                  <div className="text-xs" style={{ color: 'oklch(0.55 0.010 255)' }}>
                    {t('monitoring.avgScore')} &lt; 60% · 2+ {t('common.attempts').toLowerCase()}
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid oklch(1 0 0 / 6%)' }}>
              {/* Table header */}
              <div className="grid gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ gridTemplateColumns: '2fr 1.2fr 1.4fr 1.2fr 2fr 1.2fr', background: 'oklch(0.14 0.018 255)', color: 'oklch(0.45 0.010 255)' }}>
                <div className="cursor-pointer hover:text-white flex items-center gap-1" onClick={() => toggleSort('name')}>
                  {t('monitoring.sortName')} {sortKey === 'name' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
                <div>{t('common.cohort')}</div>
                <div className="cursor-pointer hover:text-white flex items-center gap-1" onClick={() => toggleSort('score')}>
                  {t('monitoring.sortScore')} {sortKey === 'score' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
                <div className="cursor-pointer hover:text-white flex items-center gap-1" onClick={() => toggleSort('attempts')}>
                  {t('monitoring.sortAttempts').slice(0, 4)}. {sortKey === 'attempts' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
                <div className="flex items-center gap-1"><Brain size={10} /> {t('monitoring.erpDiagnostic')}</div>
                <div className="cursor-pointer hover:text-white" onClick={() => toggleSort('risk')}>{t('common.status')}</div>
              </div>

              {/* Table rows */}
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-sm" style={{ color: 'oklch(0.45 0.010 255)', background: 'oklch(0.11 0.015 255)' }}>
                  {t('monitoring.noStudents')}
                </div>
              ) : (
                filtered.map((summary, i) => {
                  const { student, avgScore, totalAttempts, isAtRisk, cohortName, trend } = summary;
                  const scoreColor = avgScore >= 80 ? 'oklch(0.72 0.14 162)' : avgScore >= 60 ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.22 25)';
                  const { confusionSignal } = summary;
                  return (
                    <div key={student.id}
                      className="grid gap-2 px-4 py-3 cursor-pointer transition-all hover:bg-white/5"
                      style={{
                        gridTemplateColumns: '2fr 1.2fr 1.4fr 1.2fr 2fr 1.2fr',
                        background: i % 2 === 0 ? 'oklch(0.11 0.015 255)' : 'oklch(0.12 0.018 255)',
                        borderTop: '1px solid oklch(1 0 0 / 4%)',
                        borderLeft: isAtRisk ? '3px solid oklch(0.65 0.22 25)' : '3px solid transparent',
                      }}
                      onClick={() => setSelectedSummary(summary)}>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: 'oklch(0.60 0.20 255 / 15%)', color: 'oklch(0.72 0.16 255)' }}>
                          {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate" style={{ color: 'oklch(0.85 0.005 255)' }}>{student.name}</div>
                          <div className="text-xs truncate" style={{ color: 'oklch(0.40 0.010 255)' }}>{student.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs truncate" style={{ color: 'oklch(0.55 0.010 255)' }}>{cohortName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {totalAttempts > 0 ? (
                          <>
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(0.20 0.018 255)' }}>
                              <div className="h-full rounded-full" style={{ width: `${avgScore}%`, background: scoreColor }} />
                            </div>
                            <span className="text-xs font-bold w-7 text-right shrink-0" style={{ color: scoreColor }}>{avgScore}%</span>
                          </>
                        ) : (
                          <span className="text-xs" style={{ color: 'oklch(0.35 0.010 255)' }}>—</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs" style={{ color: 'oklch(0.55 0.010 255)' }}>
                          {totalAttempts > 0 ? `${totalAttempts}` : '—'}
                        </span>
                      </div>
                      <div className="flex items-center min-w-0">
                        {totalAttempts > 0 ? (
                          <span className="text-xs px-1.5 py-0.5 rounded-md font-medium truncate" style={{ background: `${confusionSignal.color}18`, color: confusionSignal.color, border: `1px solid ${confusionSignal.color}30`, maxWidth: '100%' }}>
                            {confusionSignal.label}
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color: 'oklch(0.35 0.010 255)' }}>—</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <TrendBadge trend={trend} t={t} />
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
                    {count} {t('common.students').toLowerCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xl font-black" style={{ fontFamily: 'Space Grotesk', color: avg >= 70 ? 'oklch(0.72 0.14 162)' : 'oklch(0.78 0.14 70)' }}>{avg > 0 ? `${avg}%` : '—'}</div>
                    <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('monitoring.avgScore')}</div>
                  </div>
                  <div>
                    <div className="text-xl font-black" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.72 0.14 162)' }}>{improving}</div>
                    <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('common.improving')}</div>
                  </div>
                  <div>
                    <div className="text-xl font-black" style={{ fontFamily: 'Space Grotesk', color: atRisk > 0 ? 'oklch(0.65 0.22 25)' : 'oklch(0.72 0.14 162)' }}>{atRisk}</div>
                    <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{t('monitoring.atRisk')}</div>
                  </div>
                </div>
              </div>
            ))}
            {cohortInsights.length === 0 && (
              <div className="col-span-2 py-12 text-center text-sm" style={{ color: 'oklch(0.45 0.010 255)' }}>
                {t('cohorts.noCohort')}
              </div>
            )}
          </div>
        )}

        {/* Insights tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold" style={{ color: 'oklch(0.75 0.008 255)' }}>{t('monitoring.moduleDifficulty')}</h3>
            <div className="space-y-3">
              {moduleInsights.map(({ mod, attempts: cnt, avg, avgHints }) => (
                <div key={mod.id} className="p-4 rounded-xl" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: mod.color }} />
                      <span className="text-sm font-semibold" style={{ color: 'oklch(0.85 0.005 255)' }}>{mod.id.toUpperCase()} — {mod.name}</span>
                    </div>
                    <span className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{cnt} {t('common.attempts').toLowerCase()}</span>
                  </div>
                  {avg !== null ? (
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'oklch(0.20 0.018 255)' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${avg}%`, background: avg >= 70 ? 'oklch(0.72 0.14 162)' : avg >= 50 ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.22 25)' }} />
                        </div>
                      </div>
                      <span className="text-sm font-bold w-12 text-right" style={{ color: avg >= 70 ? 'oklch(0.72 0.14 162)' : avg >= 50 ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.22 25)' }}>{avg}%</span>
                      <span className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>💡 {avgHints} {t('monitoring.hintsPerAttempt')}</span>
                    </div>
                  ) : (
                    <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{t('monitoring.noAttempts')}</div>
                  )}
                </div>
              ))}
            </div>

            {/* ERP confusion breakdown */}
            <h3 className="text-sm font-semibold pt-2" style={{ color: 'oklch(0.75 0.008 255)' }}>{t('monitoring.erpDiagnosticClass')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { labelKey: 'monitoring.understands', color: 'oklch(0.72 0.14 162)', check: (s: StudentSummary) => !s.confusionSignal.terminologyConfused && !s.confusionSignal.processConfused && s.totalAttempts > 0 },
                { labelKey: 'monitoring.confusesNames', color: 'oklch(0.78 0.14 70)', check: (s: StudentSummary) => s.confusionSignal.terminologyConfused && !s.confusionSignal.processConfused },
                { labelKey: 'monitoring.confusesProcess', color: 'oklch(0.65 0.22 25)', check: (s: StudentSummary) => s.confusionSignal.processConfused && !s.confusionSignal.terminologyConfused },
                { labelKey: 'monitoring.doubleConfusion', color: 'oklch(0.65 0.22 25)', check: (s: StudentSummary) => s.confusionSignal.terminologyConfused && s.confusionSignal.processConfused },
              ].map(({ labelKey, color, check }) => {
                const count = summaries.filter(check).length;
                return (
                  <div key={labelKey} className="p-3 rounded-xl" style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${color}20` }}>
                    <div className="text-xl font-black mb-1" style={{ fontFamily: 'Space Grotesk', color }}>{count}</div>
                    <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{t(labelKey)}</div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs" style={{ color: 'oklch(0.38 0.010 255)' }}>
              {t('monitoring.clickForDiag')}
            </p>

            {/* Learner profile distribution */}
            <h3 className="text-sm font-semibold pt-2" style={{ color: 'oklch(0.75 0.008 255)' }}>{t('monitoring.profileDistrib')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { labelKey: 'profile.precise', icon: '🏆', color: 'oklch(0.72 0.14 162)' },
                { labelKey: 'profile.reliable', icon: '⭐', color: 'oklch(0.72 0.16 255)' },
                { labelKey: 'profile.fast', icon: '⚡', color: 'oklch(0.78 0.14 70)' },
                { labelKey: 'profile.guided', icon: '📈', color: 'oklch(0.78 0.14 70)' },
                { labelKey: 'profile.support', icon: '🆘', color: 'oklch(0.65 0.22 25)' },
              ].map(p => {
                const label = t(p.labelKey);
                const count = summaries.filter(s => s.learnerProfile.label === label).length;
                return (
                  <div key={p.labelKey} className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <div className="text-lg font-black" style={{ fontFamily: 'Space Grotesk', color: p.color }}>{count}</div>
                      <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Student detail panel */}
        {selectedSummary && (
          <StudentDetailPanel summary={selectedSummary} onClose={() => setSelectedSummary(null)} t={t} />
        )}
      </div>
    </DashboardLayout>
  );
}
