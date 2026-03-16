import DashboardLayout from '@/components/DashboardLayout';
import { ERP_MODULES } from '@/lib/erpData';
import { Settings, Database, Users, BookOpen, BarChart3, Shield, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const totalScenarios = ERP_MODULES.reduce((a, m) => a + m.scenarios.length, 0);
  const totalSlides = ERP_MODULES.reduce((a, m) => a + m.slides.length, 0);
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'oklch(0.65 0.22 25 / 20%)', color: 'oklch(0.65 0.20 25)' }}><Shield size={20} /></div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>Administration</h1>
            <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>Gestion du système ERP Simulator — Collège de la Concorde</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ label: 'Modules ERP', value: ERP_MODULES.length, icon: <BookOpen size={18} />, color: 'oklch(0.65 0.22 295)' },
            { label: 'Scénarios', value: totalScenarios, icon: <Database size={18} />, color: 'oklch(0.60 0.20 255)' },
            { label: 'Slides pédagogiques', value: totalSlides, icon: <BarChart3 size={18} />, color: 'oklch(0.78 0.16 70)' },
            { label: 'Systèmes ERP', value: 3, icon: <Settings size={18} />, color: 'oklch(0.72 0.16 162)' }]
            .map((stat, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                <div className="flex items-center justify-between mb-2"><span style={{ color: stat.color }}>{stat.icon}</span></div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: 'oklch(0.50 0.010 255)' }}>{stat.label}</div>
              </div>
            ))}
        </div>
        <div className="rounded-xl overflow-hidden" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'oklch(1 0 0 / 6%)' }}>
            <h2 className="text-base font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>Inventaire des modules</h2>
            <button onClick={() => toast.success('Contenu synchronisé')} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg" style={{ background: 'oklch(0.18 0.018 255)', color: 'oklch(0.65 0.010 255)' }}><RefreshCw size={12} /> Synchroniser</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr style={{ borderBottom: '1px solid oklch(1 0 0 / 6%)' }}>
                {['Module', 'Code', 'Durée', 'Slides', 'Scénarios', 'Statut'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'oklch(0.45 0.010 255)' }}>{h}</th>)}
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
        <div className="grid sm:grid-cols-2 gap-4">
          {[{ title: 'Réinitialiser les scores', desc: 'Effacer toutes les progressions étudiants', icon: <RefreshCw size={18} />, color: 'oklch(0.65 0.22 25)', action: () => toast.warning('Action réservée au super-administrateur') },
            { title: 'Exporter les résultats', desc: 'Télécharger CSV de toutes les notes', icon: <Database size={18} />, color: 'oklch(0.60 0.20 255)', action: () => toast.info('Export CSV généré') },
            { title: 'Gérer les utilisateurs', desc: 'Ajouter, modifier ou supprimer des comptes', icon: <Users size={18} />, color: 'oklch(0.72 0.16 162)', action: () => toast.info('Gestion des utilisateurs') },
            { title: 'Paramètres du système', desc: 'Configuration générale du simulateur', icon: <Settings size={18} />, color: 'oklch(0.78 0.16 70)', action: () => toast.info('Paramètres système') }]
            .map((item, i) => (
              <button key={i} onClick={item.action} className="flex items-start gap-4 p-4 rounded-xl text-left" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'oklch(0.18 0.018 255)', color: item.color }}>{item.icon}</div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'oklch(0.82 0.005 255)' }}>{item.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'oklch(0.50 0.010 255)' }}>{item.desc}</div>
                </div>
              </button>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
