import DashboardLayout from '@/components/DashboardLayout';
import { ERP_MODULES } from '@/lib/erpData';
import { BarChart3, Users, TrendingUp, Award, CheckCircle2, Clock } from 'lucide-react';

const STUDENTS = [
  { name: 'Alexandre Tremblay', cohort: 'ERP-2026-A', progress: { 'erp-arch-01': 92, 'erp-arch-02': 88, 'mm-01': 95, 'mm-02': 78 }, lastActive: 'Il y a 2h' },
  { name: 'Sophie Lavoie', cohort: 'ERP-2026-A', progress: { 'erp-arch-01': 85, 'erp-arch-02': 91, 'mm-01': 87 }, lastActive: 'Il y a 4h' },
  { name: 'Marc Bouchard', cohort: 'ERP-2026-A', progress: { 'erp-arch-01': 78 }, lastActive: 'Hier' },
  { name: 'Julie Gagnon', cohort: 'ERP-2026-B', progress: { 'erp-arch-01': 96, 'erp-arch-02': 94, 'erp-arch-03': 89, 'mm-01': 92, 'mm-02': 88, 'sd-01': 91 }, lastActive: 'Il y a 1h' },
  { name: 'Pierre Martin', cohort: 'ERP-2026-B', progress: { 'erp-arch-01': 82, 'mm-01': 79 }, lastActive: 'Il y a 3h' },
  { name: 'Isabelle Roy', cohort: 'ERP-2026-B', progress: { 'erp-arch-01': 90, 'erp-arch-02': 86, 'mm-01': 93, 'sd-01': 88, 'fi-01': 85 }, lastActive: 'Il y a 30min' },
];

const totalScenarios = ERP_MODULES.reduce((acc, m) => acc + m.scenarios.length, 0);

export default function MonitoringPageFull() {
  const avgScore = Math.round(STUDENTS.reduce((acc, s) => {
    const scores = Object.values(s.progress);
    return acc + (scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
  }, 0) / STUDENTS.length);

  const avgCompletion = Math.round(STUDENTS.reduce((acc, s) => acc + (Object.keys(s.progress).length / totalScenarios) * 100, 0) / STUDENTS.length);

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
            { label: 'Étudiants actifs', value: STUDENTS.length, icon: <Users size={18} />, color: 'oklch(0.72 0.15 200)' },
            { label: 'Score moyen', value: `${avgScore}%`, icon: <Award size={18} />, color: 'oklch(0.78 0.16 70)' },
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
              const completions = STUDENTS.map(st => {
                const done = modScenarioIds.filter(id => st.progress[id as keyof typeof st.progress] !== undefined).length;
                return mod.scenarios.length > 0 ? Math.round((done / mod.scenarios.length) * 100) : 0;
              });
              const avg = Math.round(completions.reduce((a, b) => a + b, 0) / completions.length);
              return (
                <div key={mod.id} className="flex items-center gap-4">
                  <div className="w-20 shrink-0">
                    <span className="text-xs font-mono font-bold" style={{ color: mod.color }}>{mod.code}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full" style={{ background: 'oklch(0.20 0.018 255)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${avg}%`, background: mod.color }} />
                    </div>
                    <span className="text-xs font-semibold w-10 text-right" style={{ color: mod.color }}>{avg}%</span>
                  </div>
                  <div className="flex gap-1">
                    {completions.map((c, i) => (
                      <div key={i} className="w-5 h-5 rounded text-xs flex items-center justify-center font-bold"
                        style={{
                          background: c >= 80 ? `${mod.color}30` : c >= 50 ? `${mod.color}15` : 'oklch(0.18 0.018 255)',
                          color: c >= 80 ? mod.color : c >= 50 ? mod.color + 'aa' : 'oklch(0.35 0.010 255)',
                          fontSize: '9px'
                        }}>
                        {c > 0 ? c : '—'}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-1 mt-3 justify-end">
            {STUDENTS.map((s, i) => (
              <div key={i} className="w-5 text-center" style={{ fontSize: '9px', color: 'oklch(0.40 0.010 255)' }}>
                {s.name.split(' ')[0].charAt(0)}{s.name.split(' ')[1]?.charAt(0)}
              </div>
            ))}
          </div>
        </div>

        {/* Student table */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 6%)' }}>
            <h2 className="text-base font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
              Détail par étudiant
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid oklch(1 0 0 / 6%)' }}>
                  {['Étudiant', 'Cohorte', 'Scénarios', 'Score moy.', 'Dernière activité', 'Progression'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'oklch(0.45 0.010 255)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STUDENTS.map((student, i) => {
                  const scores = Object.values(student.progress);
                  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                  const pct = Math.round((Object.keys(student.progress).length / totalScenarios) * 100);
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid oklch(1 0 0 / 4%)' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: 'oklch(0.60 0.20 255 / 20%)', color: 'oklch(0.72 0.16 255)' }}>
                            {student.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium" style={{ color: 'oklch(0.82 0.005 255)' }}>{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono" style={{ color: 'oklch(0.50 0.010 255)' }}>{student.cohort}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm" style={{ color: 'oklch(0.75 0.008 255)' }}>
                          {Object.keys(student.progress).length}/{totalScenarios}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold" style={{
                          color: avg >= 90 ? 'oklch(0.72 0.16 162)' : avg >= 70 ? 'oklch(0.78 0.16 70)' : 'oklch(0.65 0.22 25)'
                        }}>
                          {avg > 0 ? `${avg}%` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>
                          <Clock size={11} /> {student.lastActive}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'oklch(0.20 0.018 255)', minWidth: '60px' }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'oklch(0.60 0.20 255)' }} />
                          </div>
                          <span className="text-xs font-semibold" style={{ color: 'oklch(0.60 0.16 255)' }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
