import DashboardLayout from '@/components/DashboardLayout';
import { ERP_MODULES } from '@/lib/erpData';
import { ClipboardList, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

const ASSIGNMENTS = ERP_MODULES.flatMap(mod =>
  mod.scenarios.map((sc, idx) => ({
    id: sc.id, code: sc.code, title: sc.title, module: mod.code, moduleColor: mod.color,
    difficulty: sc.difficulty, duration: sc.duration, dueDate: '2026-04-15',
    status: idx % 3 === 0 ? 'completed' : 'pending'
  }))
);

export default function AssignmentsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>Travaux &amp; Devoirs</h1>
          <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>Scénarios assignés — Programme 2 ERP</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total assignés', value: ASSIGNMENTS.length, color: 'oklch(0.60 0.20 255)' },
            { label: 'Complétés', value: ASSIGNMENTS.filter(a => a.status === 'completed').length, color: 'oklch(0.72 0.16 162)' },
            { label: 'En attente', value: ASSIGNMENTS.filter(a => a.status === 'pending').length, color: 'oklch(0.78 0.16 70)' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'oklch(0.50 0.010 255)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {ASSIGNMENTS.map(a => (
            <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${a.status === 'completed' ? a.moduleColor + '30' : 'oklch(1 0 0 / 6%)'}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${a.moduleColor}20`, color: a.moduleColor }}>
                {a.status === 'completed' ? <CheckCircle2 size={16} /> : <ClipboardList size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold shrink-0" style={{ color: a.moduleColor }}>{a.code}</span>
                  <span className="text-sm font-semibold truncate" style={{ color: 'oklch(0.82 0.005 255)' }}>{a.title}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{a.module}</span>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'oklch(0.45 0.010 255)' }}><Clock size={10} /> {a.duration}</span>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'oklch(0.45 0.010 255)' }}><Calendar size={10} /> Échéance: {a.dueDate}</span>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full font-semibold shrink-0"
                style={{ background: a.status === 'completed' ? 'oklch(0.72 0.16 162 / 20%)' : 'oklch(0.78 0.16 70 / 20%)', color: a.status === 'completed' ? 'oklch(0.72 0.14 162)' : 'oklch(0.78 0.14 70)' }}>
                {a.status === 'completed' ? 'Complété' : 'En attente'}
              </span>
              <button
                onClick={() => toast.info(`Scénario ${a.code} — ${a.status === 'completed' ? 'Déjà complété' : 'Accédez via le Simulateur'}`)}
                className="text-xs px-3 py-1.5 rounded-lg shrink-0"
                style={{ background: 'oklch(0.18 0.018 255)', color: 'oklch(0.65 0.010 255)' }}>
                Voir
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
