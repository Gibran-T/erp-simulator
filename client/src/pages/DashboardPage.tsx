import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ERP_MODULES } from '@/lib/erpData';
import { Link } from 'wouter';
import {
  Layers, Package, ShoppingCart, DollarSign, Zap,
  Clock, Award, BookOpen, Play, Users, ChevronRight, CheckCircle2
} from 'lucide-react';

const DIAGRAM = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029779635/h8ynqFBCEuYgutk3aFBMKE/erp-modules-diagram_1e66f49d.png';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  'erp-arch': <Layers size={22} />,
  'mm': <Package size={22} />,
  'sd': <ShoppingCart size={22} />,
  'fi': <DollarSign size={22} />,
  'erp-sim': <Zap size={22} />,
};

const SYSTEM_COLORS = {
  sap: { bg: 'oklch(0.20 0.05 30 / 40%)', color: 'oklch(0.78 0.14 30)', border: 'oklch(0.50 0.12 30 / 30%)' },
  dynamics: { bg: 'oklch(0.15 0.06 255 / 40%)', color: 'oklch(0.75 0.14 255)', border: 'oklch(0.55 0.16 255 / 30%)' },
  odoo: { bg: 'oklch(0.15 0.06 162 / 40%)', color: 'oklch(0.75 0.14 162)', border: 'oklch(0.55 0.16 162 / 30%)' },
};

const RECENT_ACTIVITIES = [
  { action: 'Scénario MM-01 complété', score: 95, time: 'Il y a 2h', module: 'mm' },
  { action: 'Slides ERP-ARCH consultées', score: null, time: 'Il y a 4h', module: 'erp-arch' },
  { action: 'Scénario ERP-ARCH-01 complété', score: 88, time: 'Hier', module: 'erp-arch' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const totalScenarios = ERP_MODULES.reduce((acc, m) => acc + m.scenarios.length, 0);
  const completedScenarios = Object.keys(user?.progress || {}).length;
  const avgScore = Object.values(user?.progress || {}).length > 0
    ? Math.round(Object.values(user?.progress || {}).reduce((a, b) => a + b, 0) / Object.values(user?.progress || {}).length)
    : 0;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
              Bonjour, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>
              {isTeacher ? 'Tableau de bord professeur — ERP Integrated Business Simulator' : `Programme 2 · ERP Systems · ${user?.cohort || 'ERP-2026'}`}
            </p>
          </div>
          <div className="hidden md:block text-xs px-3 py-1.5 rounded-full font-mono"
            style={{ background: 'oklch(0.60 0.20 255 / 15%)', color: 'oklch(0.75 0.16 255)', border: '1px solid oklch(0.60 0.20 255 / 30%)' }}>
            Programme 2 — ERP
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Modules ERP', value: '5', sub: 'ERP-ARCH, MM, SD, FI, SIM', icon: <BookOpen size={18} />, color: 'oklch(0.60 0.20 255)' },
            { label: 'Scénarios', value: `${completedScenarios}/${totalScenarios}`, sub: 'complétés', icon: <CheckCircle2 size={18} />, color: 'oklch(0.72 0.16 162)' },
            { label: 'Score moyen', value: avgScore > 0 ? `${avgScore}%` : '—', sub: 'sur les simulations', icon: <Award size={18} />, color: 'oklch(0.78 0.16 70)' },
            { label: 'Durée totale', value: '30h', sub: '5 modules · 14 scénarios', icon: <Clock size={18} />, color: 'oklch(0.65 0.22 295)' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium" style={{ color: 'oklch(0.50 0.010 255)' }}>{stat.label}</span>
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>{stat.value}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Modules */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>Modules ERP</h2>
              <Link href="/modules"><span className="text-xs flex items-center gap-1" style={{ color: 'oklch(0.60 0.16 255)' }}>Voir tout <ChevronRight size={12} /></span></Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {ERP_MODULES.map(mod => {
                const done = mod.scenarios.filter(s => (user?.progress || {})[s.id] !== undefined).length;
                const pct = mod.scenarios.length > 0 ? Math.round((done / mod.scenarios.length) * 100) : 0;
                return (
                  <Link key={mod.id} href={`/modules/${mod.id}`}>
                    <div className={`card-hover rounded-xl p-4 cursor-pointer`}
                      style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${mod.color}25` }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${mod.color}20`, color: mod.color }}>
                          {MODULE_ICONS[mod.id]}
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold"
                          style={{ background: `${mod.color}20`, color: mod.color, border: `1px solid ${mod.color}40` }}>
                          {mod.code}
                        </span>
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.88 0.005 255)' }}>{mod.name}</div>
                      <div className="text-xs mb-2" style={{ color: 'oklch(0.45 0.010 255)' }}>{mod.duration} · {mod.scenarios.length} scénarios · {mod.slides.length} slides</div>
                      {mod.process && <div className="text-xs font-mono mb-3" style={{ color: mod.color }}>{mod.process}</div>}
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${mod.color}, ${mod.color}aa)` }} />
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{done}/{mod.scenarios.length} scénarios</span>
                        <span className="text-xs font-semibold" style={{ color: mod.color }}>{pct}%</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* ERP Systems */}
            <div className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>Systèmes ERP couverts</h3>
              {[
                { id: 'sap', name: 'SAP S/4HANA', desc: 'T-codes · Fiori · HANA DB', modules: 'MM, SD, FI, CO, PP' },
                { id: 'dynamics', name: 'Microsoft Dynamics 365', desc: 'Power Platform · Azure · Power BI', modules: 'Finance, SCM, Sales' },
                { id: 'odoo', name: 'Odoo ERP', desc: 'Open source · Python · PostgreSQL', modules: 'Achats, Ventes, Compta' },
              ].map(sys => {
                const c = SYSTEM_COLORS[sys.id as keyof typeof SYSTEM_COLORS];
                return (
                  <div key={sys.id} className="mb-3 last:mb-0 p-3 rounded-lg" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <div className="text-xs font-bold mb-0.5" style={{ color: c.color }}>{sys.name}</div>
                    <div className="text-xs mb-1" style={{ color: 'oklch(0.55 0.010 255)' }}>{sys.desc}</div>
                    <div className="text-xs font-mono" style={{ color: 'oklch(0.45 0.010 255)' }}>{sys.modules}</div>
                  </div>
                );
              })}
            </div>

            {/* Quick actions */}
            <div className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>Accès rapide</h3>
              <div className="space-y-2">
                <Link href="/simulator">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer" style={{ background: 'oklch(0.60 0.20 255 / 10%)', border: '1px solid oklch(0.60 0.20 255 / 20%)' }}>
                    <Play size={16} style={{ color: 'oklch(0.72 0.16 255)' }} />
                    <span className="text-sm font-medium" style={{ color: 'oklch(0.80 0.10 255)' }}>Lancer une simulation</span>
                  </div>
                </Link>
                <Link href="/modules/erp-sim">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer" style={{ background: 'oklch(0.65 0.22 25 / 10%)', border: '1px solid oklch(0.65 0.22 25 / 20%)' }}>
                    <Zap size={16} style={{ color: 'oklch(0.72 0.18 25)' }} />
                    <span className="text-sm font-medium" style={{ color: 'oklch(0.80 0.12 25)' }}>Simulation intégrée ERP-SIM</span>
                  </div>
                </Link>
                {isTeacher && (
                  <Link href="/monitoring">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer" style={{ background: 'oklch(0.72 0.16 162 / 10%)', border: '1px solid oklch(0.72 0.16 162 / 20%)' }}>
                      <Users size={16} style={{ color: 'oklch(0.72 0.14 162)' }} />
                      <span className="text-sm font-medium" style={{ color: 'oklch(0.80 0.10 162)' }}>Suivi des étudiants</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Activity */}
            <div className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>Activité récente</h3>
              <div className="space-y-3">
                {RECENT_ACTIVITIES.map((act, i) => {
                  const mod = ERP_MODULES.find(m => m.id === act.module);
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${mod?.color}20`, color: mod?.color }}>
                        {MODULE_ICONS[act.module]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium" style={{ color: 'oklch(0.75 0.008 255)' }}>{act.action}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{act.time}</span>
                          {act.score && <span className="text-xs font-semibold" style={{ color: 'oklch(0.72 0.16 162)' }}>{act.score}%</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Assessment */}
        <div className="rounded-xl p-5" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>Structure d'évaluation — Programme 2</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Transactions simulées', pct: 30, color: 'oklch(0.72 0.15 200)', desc: 'Cycles P2P et O2C' },
              { label: 'Quiz & concepts', pct: 20, color: 'oklch(0.65 0.22 295)', desc: 'ERP-ARCH et FI' },
              { label: 'Simulation finale', pct: 50, color: 'oklch(0.65 0.22 25)', desc: 'ERP-SIM-01 intégré' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg"
                style={{ background: `${item.color}10`, border: `1px solid ${item.color}25` }}>
                <div className="text-3xl font-bold shrink-0" style={{ fontFamily: 'Space Grotesk', color: item.color }}>{item.pct}%</div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'oklch(0.85 0.005 255)' }}>{item.label}</div>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
