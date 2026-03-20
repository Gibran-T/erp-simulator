/**
 * MonitoringPageFull — ERP Integrated Business Simulator
 * Real-time student monitoring using StudentsContext (localStorage-backed)
 */
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useStudents, Student } from '@/contexts/StudentsContext';
import { ERP_MODULES } from '@/lib/erpData';
import { BarChart3, Users, TrendingUp, Award, CheckCircle2, Clock, Mail, X, ChevronRight, Pencil, SortAsc } from 'lucide-react';

const totalScenarios = ERP_MODULES.reduce((acc, m) => acc + m.scenarios.length, 0);

function timeAgo(value: string): string {
  // Handle both ISO timestamps and legacy strings like 'Il y a 2h'
  if (!value || value === 'Jamais') return 'Jamais';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value; // legacy string — return as-is
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'À l\'instant';
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `Il y a ${days}j`;
}

type SortKey = 'name' | 'score' | 'completion' | 'lastActive';

function StudentDetailPanel({ student, cohorts, onClose }: { student: Student; cohorts: ReturnType<typeof useStudents>['cohorts']; onClose: () => void }) {
  const cohort = cohorts.find(c => c.id === student.cohortId);
  const scores = Object.values(student.progress);
  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const totalSc = ERP_MODULES.reduce((a, m) => a + m.scenarios.length, 0);
  const completion = Math.round((Object.keys(student.progress).length / totalSc) * 100);

  function scoreColor(s: number) {
    if (s >= 80) return 'oklch(0.72 0.14 162)';
    if (s >= 60) return 'oklch(0.78 0.14 70)';
    return 'oklch(0.65 0.22 25)';
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'oklch(0 0 0 / 60%)' }} onClick={onClose}>
      <div className="w-full max-w-md h-full overflow-y-auto" style={{ background: 'oklch(0.12 0.018 255)', borderLeft: '1px solid oklch(1 0 0 / 8%)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5" style={{ background: 'oklch(0.12 0.018 255)', borderBottom: '1px solid oklch(1 0 0 / 6%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'oklch(0.60 0.20 255 / 20%)', color: 'oklch(0.72 0.16 255)' }}>
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>{student.name}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{student.email}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10" style={{ color: 'oklch(0.55 0.010 255)' }}><X size={18} /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Score moyen', value: avg > 0 ? `${avg}%` : '—', color: avg > 0 ? scoreColor(avg) : 'oklch(0.45 0.010 255)' },
              { label: 'Complétion', value: `${completion}%`, color: 'oklch(0.60 0.20 255)' },
              { label: 'Scénarios', value: `${Object.keys(student.progress).length}/${totalSc}`, color: 'oklch(0.85 0.005 255)' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-3 text-center" style={{ background: 'oklch(0.16 0.018 255)' }}>
                <div className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk', color: s.color }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'oklch(0.45 0.010 255)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="rounded-xl p-4 space-y-2" style={{ background: 'oklch(0.16 0.018 255)' }}>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'oklch(0.50 0.010 255)' }}>Cohorte</span>
              <span style={{ color: 'oklch(0.80 0.005 255)' }}>{cohort?.name || '—'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'oklch(0.50 0.010 255)' }}>Statut</span>
              <span style={{ color: student.status === 'active' ? 'oklch(0.72 0.14 162)' : 'oklch(0.55 0.010 255)' }}>
                {student.status === 'active' ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'oklch(0.50 0.010 255)' }}>Inscrit le</span>
              <span style={{ color: 'oklch(0.80 0.005 255)' }}>{student.enrolledAt}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'oklch(0.50 0.010 255)' }}>Dernière activité</span>
              <span style={{ color: 'oklch(0.80 0.005 255)' }}>{timeAgo(student.lastActive)}</span>
            </div>
          </div>

          {/* Scenario scores by module */}
          {ERP_MODULES.map(mod => {
            const modScenarios = mod.scenarios.filter(s => student.progress[s.id] !== undefined);
            if (modScenarios.length === 0) return null;
            return (
              <div key={mod.id}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'oklch(0.45 0.010 255)' }}>{mod.name}</div>
                <div className="space-y-1.5">
                  {modScenarios.map(sc => {
                    const score = student.progress[sc.id];
                    return (
                      <div key={sc.id} className="flex items-center justify-between px-3 py-2 rounded-lg"
                        style={{ background: 'oklch(0.16 0.018 255)' }}>
                        <div>
                          <div className="text-xs font-semibold" style={{ color: 'oklch(0.80 0.005 255)' }}>{sc.code}</div>
                          <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{sc.title}</div>
                        </div>
                        <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: scoreColor(score) }}>{score}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {Object.keys(student.progress).length === 0 && (
            <div className="text-center py-8">
              <CheckCircle2 size={28} className="mx-auto mb-2" style={{ color: 'oklch(0.30 0.010 255)' }} />
              <p className="text-sm" style={{ color: 'oklch(0.45 0.010 255)' }}>Aucun scénario complété pour l\'instant.</p>
            </div>
          )}

          {/* Notes */}
          {student.notes && (
            <div className="rounded-xl p-4" style={{ background: 'oklch(0.78 0.16 70 / 8%)', border: '1px solid oklch(0.78 0.16 70 / 20%)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.78 0.14 70)' }}>Notes du professeur</div>
              <p className="text-xs" style={{ color: 'oklch(0.70 0.010 255)', lineHeight: '1.6' }}>{student.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MonitoringPageFull() {
  const { students, cohorts, getCohortStats } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('name');

  const avgScore = students.length === 0 ? 0 : Math.round(
    students.reduce((acc, s) => {
      const scores = Object.values(s.progress);
      return acc + (scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
    }, 0) / students.length
  );

  const avgCompletion = students.length === 0 ? 0 : Math.round(
    students.reduce((acc, s) => acc + (Object.keys(s.progress).length / totalScenarios) * 100, 0) / students.length
  );

   const activeStudents = students.filter(s => s.status === 'active');

  const sortedStudents = [...students].sort((a, b) => {
    if (sortKey === 'score') {
      const aS = Object.values(a.progress); const bS = Object.values(b.progress);
      const aAvg = aS.length > 0 ? aS.reduce((x, y) => x + y, 0) / aS.length : -1;
      const bAvg = bS.length > 0 ? bS.reduce((x, y) => x + y, 0) / bS.length : -1;
      return bAvg - aAvg;
    }
    if (sortKey === 'completion') return Object.keys(b.progress).length - Object.keys(a.progress).length;
    if (sortKey === 'lastActive') {
      const aT = new Date(a.lastActive).getTime() || 0;
      const bT = new Date(b.lastActive).getTime() || 0;
      return bT - aT;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
            Suivi des étudiants
          </h1>
          <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>
            Progression en temps réel — Programme 2 ERP
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Étudiants actifs', value: activeStudents.length, icon: <Users size={18} />, color: 'oklch(0.72 0.15 200)' },
            { label: 'Score moyen', value: avgScore > 0 ? `${avgScore}%` : '—', icon: <Award size={18} />, color: 'oklch(0.78 0.16 70)' },
            { label: 'Complétion moyenne', value: `${avgCompletion}%`, icon: <TrendingUp size={18} />, color: 'oklch(0.72 0.16 162)' },
            { label: 'Scénarios disponibles', value: totalScenarios, icon: <BarChart3 size={18} />, color: 'oklch(0.65 0.22 295)' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: 'oklch(0.50 0.010 255)' }}>{stat.label}</span>
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Module completion heatmap */}
        <div className="rounded-xl p-5" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
            Complétion par module
          </h2>
          <div className="space-y-3">
            {ERP_MODULES.map(mod => {
              const modScenarioIds = mod.scenarios.map(s => s.id);
              const studentsWithMod = students.filter(s => modScenarioIds.some(id => s.progress[id] !== undefined));
              const completion = students.length === 0 ? 0 : Math.round((studentsWithMod.length / students.length) * 100);
              const avgModScore = studentsWithMod.length === 0 ? 0 : Math.round(
                studentsWithMod.reduce((acc, s) => {
                  const scores = modScenarioIds.map(id => s.progress[id]).filter(v => v !== undefined) as number[];
                  return acc + (scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
                }, 0) / studentsWithMod.length
              );
              return (
                <div key={mod.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: 'oklch(0.75 0.005 255)' }}>{mod.name}</span>
                    <div className="flex items-center gap-3">
                      {avgModScore > 0 && (
                        <span className="text-xs font-semibold" style={{ color: 'oklch(0.78 0.16 70)' }}>moy. {avgModScore}%</span>
                      )}
                      <span className="text-xs font-semibold" style={{ color: 'oklch(0.60 0.20 255)' }}>{completion}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'oklch(0.20 0.018 255)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${completion}%`, background: 'oklch(0.60 0.20 255)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cohort overview */}
        {cohorts.length > 0 && (
          <div className="rounded-xl p-5" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
            <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
              Résumé par cohorte
            </h2>
            <div className="space-y-3">
              {cohorts.map(cohort => {
                const stats = getCohortStats(cohort.id);
                return (
                  <div key={cohort.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'oklch(0.11 0.015 255)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold" style={{ color: 'oklch(0.85 0.005 255)' }}>{cohort.name}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{ background: cohort.status === 'active' ? 'oklch(0.72 0.16 162 / 20%)' : 'oklch(0.18 0.018 255)', color: cohort.status === 'active' ? 'oklch(0.72 0.14 162)' : 'oklch(0.45 0.010 255)' }}>
                          {cohort.status === 'active' ? 'Actif' : cohort.status === 'planned' ? 'Planifié' : 'Complété'}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'oklch(0.20 0.018 255)' }}>
                        <div className="h-full rounded-full" style={{ width: `${stats.avgCompletion}%`, background: 'oklch(0.60 0.20 255)' }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-center shrink-0">
                      <div>
                        <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>{stats.total}</div>
                        <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>étudiants</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.78 0.16 70)' }}>{stats.avgScore > 0 ? `${stats.avgScore}%` : '—'}</div>
                        <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>score moy.</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.60 0.20 255)' }}>{stats.avgCompletion}%</div>
                        <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>complétion</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Student table */}
        <div className="rounded-xl p-5" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
            Détail par étudiant
          </h2>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>Détail par étudiant</h2>
            <div className="flex items-center gap-1">
              {(['name', 'score', 'completion', 'lastActive'] as SortKey[]).map(key => (
                <button key={key} onClick={() => setSortKey(key)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: sortKey === key ? 'oklch(0.60 0.20 255 / 20%)' : 'oklch(0.18 0.018 255)', color: sortKey === key ? 'oklch(0.72 0.16 255)' : 'oklch(0.45 0.010 255)' }}>
                  {{ name: 'Nom', score: 'Score', completion: 'Complétion', lastActive: 'Activité' }[key]}
                </button>
              ))}
            </div>
          </div>
          {students.length === 0 ? (
            <div className="text-center py-8" style={{}}>
              <Users size={32} className="mx-auto mb-3" style={{ color: 'oklch(0.35 0.010 255)' }} />
              <p className="text-sm" style={{ color: 'oklch(0.45 0.010 255)' }}>Aucun étudiant enregistré. Ajoutez des étudiants dans la page Cohortes.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedStudents.map(student => {
                const completedCount = Object.keys(student.progress).length;
                const scores = Object.values(student.progress);
                const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                const completion = Math.round((completedCount / totalScenarios) * 100);
                const cohort = cohorts.find(c => c.id === student.cohortId);

                return (
                  <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/5"
                    onClick={() => setSelectedStudent(student)}
                    style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(1 0 0 / 5%)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{ background: student.status === 'active' ? 'oklch(0.60 0.20 255 / 20%)' : 'oklch(0.18 0.018 255)', color: student.status === 'active' ? 'oklch(0.72 0.16 255)' : 'oklch(0.45 0.010 255)' }}>
                      {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate" style={{ color: 'oklch(0.85 0.005 255)' }}>{student.name}</span>
                        {cohort && <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0" style={{ background: 'oklch(0.60 0.20 255 / 15%)', color: 'oklch(0.72 0.16 255)' }}>{cohort.name}</span>}
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>
                        <Mail size={10} /> {student.email}
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-center shrink-0">
                      <div>
                        <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>{completedCount}/{totalScenarios}</div>
                        <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>scénarios</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: avg >= 70 ? 'oklch(0.72 0.16 162)' : avg >= 50 ? 'oklch(0.78 0.16 70)' : avg > 0 ? 'oklch(0.65 0.22 25)' : 'oklch(0.45 0.010 255)' }}>
                          {avg > 0 ? `${avg}%` : '—'}
                        </div>
                        <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>score moy.</div>
                      </div>
                      <div className="w-20">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{completion}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'oklch(0.20 0.018 255)' }}>
                          <div className="h-full rounded-full" style={{ width: `${completion}%`, background: 'oklch(0.60 0.20 255)' }} />
                        </div>
                      </div>
                      <div className="hidden lg:block">
                        <div className="flex items-center gap-1 text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>
                          <Clock size={10} /> {timeAgo(student.lastActive)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {selectedStudent && (
        <StudentDetailPanel
          student={selectedStudent}
          cohorts={cohorts}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </DashboardLayout>
  );
}
