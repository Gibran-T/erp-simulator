/**
 * AdminPage — ERP Integrated Business Simulator
 * System administration + student management quick actions
 */
import DashboardLayout from '@/components/DashboardLayout';
import { useStudents } from '@/contexts/StudentsContext';
import { ERP_MODULES } from '@/lib/erpData';
import { Settings, Database, Users, BookOpen, BarChart3, Shield, RefreshCw, Download, UserPlus, GraduationCap, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useLocation } from 'wouter';

const totalScenarios = ERP_MODULES.reduce((acc, m) => acc + m.scenarios.length, 0);
const totalSlides = ERP_MODULES.reduce((acc, m) => acc + m.slides.length, 0);

export default function AdminPage() {
  const { students, cohorts, removeStudent, removeCohort, getStudentsByCohort } = useStudents();
  const [, navigate] = useLocation();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const activeCohorts = cohorts.filter(c => c.status === 'active').length;

  function exportCSV() {
    const rows = [
      ['Nom', 'Email', 'Cohorte', 'Statut', 'Scénarios complétés', 'Score moyen', 'Dernière activité'],
      ...students.map(s => {
        const scores = Object.values(s.progress);
        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const cohort = cohorts.find(c => c.id === s.cohortId);
        return [s.name, s.email, cohort?.name ?? s.cohortId, s.status, Object.keys(s.progress).length, avg > 0 ? `${avg}%` : '—', s.lastActive];
      })
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'erp-resultats.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Export CSV téléchargé');
  }

  function resetAllProgress() {
    // Clear localStorage progress data
    localStorage.removeItem('erp_students');
    localStorage.removeItem('erp_cohorts');
    toast.success('Données réinitialisées — rechargez la page');
    setShowResetConfirm(false);
    setTimeout(() => window.location.reload(), 1500);
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>Administration</h1>
            <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>Gestion du système — Programme 2 ERP Simulator</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'oklch(0.65 0.22 295 / 15%)', border: '1px solid oklch(0.65 0.22 295 / 30%)' }}>
            <Shield size={14} style={{ color: 'oklch(0.72 0.18 295)' }} />
            <span className="text-xs font-semibold" style={{ color: 'oklch(0.72 0.18 295)' }}>Accès Professeur</span>
          </div>
        </div>

        {/* System stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Étudiants inscrits', value: totalStudents, icon: <Users size={18} />, color: 'oklch(0.60 0.20 255)' },
            { label: 'Étudiants actifs', value: activeStudents, icon: <GraduationCap size={18} />, color: 'oklch(0.72 0.16 162)' },
            { label: 'Cohortes actives', value: activeCohorts, icon: <BookOpen size={18} />, color: 'oklch(0.78 0.16 70)' },
            { label: 'Scénarios disponibles', value: totalScenarios, icon: <Database size={18} />, color: 'oklch(0.65 0.22 295)' },
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

        {/* Student management quick actions */}
        <div className="rounded-xl p-5" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.60 0.20 255 / 20%)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
            Gestion des étudiants
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <button onClick={() => navigate('/cohorts')}
              className="flex items-center gap-3 p-4 rounded-xl text-left"
              style={{ background: 'oklch(0.60 0.20 255 / 10%)', border: '1px solid oklch(0.60 0.20 255 / 25%)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'oklch(0.60 0.20 255 / 20%)', color: 'oklch(0.72 0.16 255)' }}>
                <UserPlus size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'oklch(0.85 0.005 255)' }}>Ajouter des étudiants</div>
                <div className="text-xs mt-0.5" style={{ color: 'oklch(0.50 0.010 255)' }}>Gérer les cohortes</div>
              </div>
            </button>
            <button onClick={exportCSV}
              className="flex items-center gap-3 p-4 rounded-xl text-left"
              style={{ background: 'oklch(0.72 0.16 162 / 10%)', border: '1px solid oklch(0.72 0.16 162 / 25%)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'oklch(0.72 0.16 162 / 20%)', color: 'oklch(0.72 0.14 162)' }}>
                <Download size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'oklch(0.85 0.005 255)' }}>Exporter les résultats</div>
                <div className="text-xs mt-0.5" style={{ color: 'oklch(0.50 0.010 255)' }}>Télécharger CSV ({totalStudents} étudiants)</div>
              </div>
            </button>
            <button onClick={() => navigate('/monitoring')}
              className="flex items-center gap-3 p-4 rounded-xl text-left"
              style={{ background: 'oklch(0.78 0.16 70 / 10%)', border: '1px solid oklch(0.78 0.16 70 / 25%)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'oklch(0.78 0.16 70 / 20%)', color: 'oklch(0.78 0.14 70)' }}>
                <BarChart3 size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'oklch(0.85 0.005 255)' }}>Voir le suivi</div>
                <div className="text-xs mt-0.5" style={{ color: 'oklch(0.50 0.010 255)' }}>Progression en temps réel</div>
              </div>
            </button>
          </div>
        </div>

        {/* Cohort summary */}
        {cohorts.length > 0 && (
          <div className="rounded-xl overflow-hidden" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
            <div className="p-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 6%)' }}>
              <h2 className="text-base font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>Cohortes enregistrées</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr style={{ borderBottom: '1px solid oklch(1 0 0 / 6%)' }}>
                  {['Cohorte', 'Semestre', 'Étudiants', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'oklch(0.45 0.010 255)' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {cohorts.map(cohort => {
                    const cs = getStudentsByCohort(cohort.id);
                    return (
                      <tr key={cohort.id} style={{ borderBottom: '1px solid oklch(1 0 0 / 4%)' }}>
                        <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'oklch(0.82 0.005 255)' }}>{cohort.name}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'oklch(0.60 0.010 255)' }}>{cohort.semester} {cohort.year}</td>
                        <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'oklch(0.70 0.010 255)' }}>{cs.length}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: cohort.status === 'active' ? 'oklch(0.72 0.16 162 / 20%)' : 'oklch(0.18 0.018 255)', color: cohort.status === 'active' ? 'oklch(0.72 0.14 162)' : 'oklch(0.45 0.010 255)' }}>
                            {cohort.status === 'active' ? 'Actif' : cohort.status === 'planned' ? 'Planifié' : 'Complété'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Module inventory */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'oklch(1 0 0 / 6%)' }}>
            <h2 className="text-base font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>Inventaire des modules</h2>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'oklch(0.50 0.010 255)' }}>
              <span>{totalSlides} slides</span>
              <span>·</span>
              <span>{totalScenarios} scénarios</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr style={{ borderBottom: '1px solid oklch(1 0 0 / 6%)' }}>
                {['Module', 'Code', 'Durée', 'Slides', 'Scénarios', 'Statut'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'oklch(0.45 0.010 255)' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {ERP_MODULES.map(mod => (
                  <tr key={mod.id} style={{ borderBottom: '1px solid oklch(1 0 0 / 4%)' }}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'oklch(0.82 0.005 255)' }}>{mod.name}</td>
                    <td className="px-4 py-3"><span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full" style={{ background: `${mod.color}20`, color: mod.color, border: `1px solid ${mod.color}40` }}>{mod.code}</span></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'oklch(0.60 0.010 255)' }}>{mod.duration}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'oklch(0.70 0.010 255)' }}>{mod.slides.length}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'oklch(0.70 0.010 255)' }}>{mod.scenarios.length}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'oklch(0.72 0.16 162 / 20%)', color: 'oklch(0.72 0.14 162)' }}>Actif</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-xl p-5" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.65 0.22 25 / 20%)' }}>
          <h2 className="text-base font-semibold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.75 0.18 25)' }}>Zone de danger</h2>
          <p className="text-xs mb-4" style={{ color: 'oklch(0.50 0.010 255)' }}>Ces actions sont irréversibles. Utilisez avec précaution.</p>
          <button onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-3 p-4 rounded-xl text-left w-full sm:w-auto"
            style={{ background: 'oklch(0.65 0.22 25 / 10%)', border: '1px solid oklch(0.65 0.22 25 / 30%)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'oklch(0.65 0.22 25 / 20%)', color: 'oklch(0.65 0.22 25)' }}>
              <Trash2 size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'oklch(0.75 0.18 25)' }}>Réinitialiser toutes les données</div>
              <div className="text-xs mt-0.5" style={{ color: 'oklch(0.50 0.010 255)' }}>Effacer étudiants, cohortes et progressions du localStorage</div>
            </div>
          </button>
        </div>
      </div>

      {/* Reset confirm modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 70%)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.65 0.22 25 / 40%)' }}>
            <div className="flex items-center gap-3">
              <AlertTriangle size={22} style={{ color: 'oklch(0.78 0.16 70)' }} />
              <h2 className="text-base font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>Confirmer la réinitialisation</h2>
            </div>
            <p className="text-sm" style={{ color: 'oklch(0.60 0.010 255)' }}>
              Cette action supprimera <strong style={{ color: 'oklch(0.75 0.18 25)' }}>toutes les données</strong> (étudiants, cohortes, progressions) du stockage local. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2 rounded-lg text-sm font-semibold hover:bg-white/5"
                style={{ border: '1px solid oklch(0.25 0.018 255)', color: 'oklch(0.55 0.010 255)' }}>Annuler</button>
              <button onClick={resetAllProgress} className="flex-1 py-2 rounded-lg text-sm font-bold"
                style={{ background: 'oklch(0.55 0.22 25)', color: 'white' }}>Réinitialiser</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
