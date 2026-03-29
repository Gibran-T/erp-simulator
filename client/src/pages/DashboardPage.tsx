import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { ERP_MODULES } from '@/lib/erpData';
import { trpc } from '@/lib/trpc';
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

// Official brand SVG logos (inline, no external dependency)
const SapLogo = () => (
  <svg viewBox="0 0 48 48" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="8" fill="#0070F2"/>
    <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
      fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="16" fill="white" letterSpacing="-0.5">
      SAP
    </text>
  </svg>
);

const DynamicsLogo = () => (
  <svg viewBox="0 0 48 48" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="8" fill="#0078D4"/>
    {/* Microsoft four-squares motif */}
    <rect x="10" y="10" width="12" height="12" rx="1.5" fill="#F25022"/>
    <rect x="26" y="10" width="12" height="12" rx="1.5" fill="#7FBA00"/>
    <rect x="10" y="26" width="12" height="12" rx="1.5" fill="#00A4EF"/>
    <rect x="26" y="26" width="12" height="12" rx="1.5" fill="#FFB900"/>
  </svg>
);

const OdooLogo = () => (
  <svg viewBox="0 0 48 48" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="8" fill="#714B67"/>
    {/* Odoo honeycomb dot motif */}
    <circle cx="24" cy="14" r="5" fill="white" opacity="0.95"/>
    <circle cx="14" cy="30" r="5" fill="white" opacity="0.75"/>
    <circle cx="34" cy="30" r="5" fill="white" opacity="0.75"/>
    <circle cx="24" cy="36" r="3" fill="white" opacity="0.50"/>
  </svg>
);

function timeAgo(ts: number, lang: string): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return lang === 'fr' ? `Il y a ${mins}min` : `${mins}min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return lang === 'fr' ? `Il y a ${hrs}h` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return lang === 'fr' ? `Il y a ${days}j` : `${days}d ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const totalScenarios = ERP_MODULES.reduce((acc, m) => acc + m.scenarios.length, 0);
  const { data: myHistory } = trpc.attempts.myHistory.useQuery(undefined, { enabled: !isTeacher });
  const completedScenarios = myHistory ? new Set(myHistory.map((a: { scenarioId: string }) => a.scenarioId)).size : 0;
  const avgScore = myHistory && myHistory.length > 0
    ? Math.round(myHistory.reduce((a: number, b: { score: number }) => a + b.score, 0) / myHistory.length)
    : 0;
  const recentActivities = myHistory ? [...myHistory].reverse().slice(0, 5) : [];
  // Real per-module completion from attempt history
  const completedByModule = myHistory
    ? myHistory.reduce((acc: Record<string, Set<string>>, a: { scenarioId: string; moduleId: string }) => {
        if (!acc[a.moduleId]) acc[a.moduleId] = new Set();
        acc[a.moduleId].add(a.scenarioId);
        return acc;
      }, {})
    : {};
  // Best score per scenario
  const bestScoreByScenario = myHistory
    ? myHistory.reduce((acc: Record<string, number>, a: { scenarioId: string; score: number }) => {
        acc[a.scenarioId] = Math.max(acc[a.scenarioId] ?? 0, a.score);
        return acc;
      }, {})
    : {};
  // Next recommended scenario (first not yet passed with score >= 80)
  const nextScenario = ERP_MODULES
    .flatMap(m => m.scenarios.map(s => ({ ...s, moduleId: m.id, moduleName: m.name, moduleColor: m.color })))
    .find(s => !bestScoreByScenario[s.id] || bestScoreByScenario[s.id] < 80);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
              {lang === 'fr' ? 'Bonjour' : 'Hello'}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>
              {isTeacher
                ? (lang === 'fr' ? 'Tableau de bord professeur — ERP Integrated Business Simulator' : 'Teacher Dashboard — ERP Integrated Business Simulator')
                : `Programme 2 · ERP Systems · ${'ERP-2026'}`}
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
            { label: lang === 'fr' ? 'Modules ERP' : 'ERP Modules', value: '5', sub: 'ERP-ARCH, MM, SD, FI, SIM', icon: <BookOpen size={18} />, color: 'oklch(0.60 0.20 255)' },
            { label: lang === 'fr' ? 'Scénarios' : 'Scenarios', value: `${completedScenarios}/${totalScenarios}`, sub: lang === 'fr' ? 'complétés' : 'completed', icon: <CheckCircle2 size={18} />, color: 'oklch(0.72 0.16 162)' },
            { label: lang === 'fr' ? 'Score moyen' : 'Avg Score', value: avgScore > 0 ? `${avgScore}%` : '—', sub: lang === 'fr' ? 'sur les simulations' : 'across simulations', icon: <Award size={18} />, color: 'oklch(0.78 0.16 70)' },
            { label: lang === 'fr' ? 'Durée totale' : 'Total Duration', value: '30h', sub: lang === 'fr' ? '5 modules · 14 scénarios' : '5 modules · 14 scenarios', icon: <Clock size={18} />, color: 'oklch(0.65 0.22 295)' },
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
              <h2 className="text-base font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>{lang === 'fr' ? 'Modules ERP' : 'ERP Modules'}</h2>
              <Link href="/modules"><span className="text-xs flex items-center gap-1" style={{ color: 'oklch(0.60 0.16 255)' }}>{lang === 'fr' ? 'Voir tout' : 'View all'} <ChevronRight size={12} /></span></Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {ERP_MODULES.map(mod => {
                const done = completedByModule[mod.id] ? completedByModule[mod.id].size : 0;
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
                      <div className="text-xs mb-2" style={{ color: 'oklch(0.45 0.010 255)' }}>{mod.duration} · {mod.scenarios.length} {lang === 'fr' ? 'scénarios' : 'scenarios'} · {mod.slides.length} slides</div>
                      {mod.process && <div className="text-xs font-mono mb-3" style={{ color: mod.color }}>{mod.process}</div>}
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${mod.color}, ${mod.color}aa)` }} />
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{done}/{mod.scenarios.length} {lang === 'fr' ? 'scénarios' : 'scenarios'}</span>
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

            {/* ERP Systems — Compact pedagogical entry points */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'oklch(0.45 0.010 255)' }}>
                  {lang === 'fr' ? 'Systèmes étudiés' : 'Systems studied'}
                </h3>
                <span className="text-xs" style={{ color: 'oklch(0.38 0.010 255)' }}>
                  {lang === 'fr' ? 'Même processus, noms différents' : 'Same process, different names'}
                </span>
              </div>

              {([
                { Logo: SapLogo, name: 'SAP S/4HANA', color: '#5BB8FF', bg: 'oklch(0.13 0.04 240 / 80%)', border: 'oklch(0.40 0.18 240 / 20%)', key: lang === 'fr' ? 'T-codes (VA01, ME21N, MIGO)' : 'T-codes (VA01, ME21N, MIGO)' },
                { Logo: DynamicsLogo, name: 'Dynamics 365', color: '#5EA8FF', bg: 'oklch(0.13 0.05 255 / 80%)', border: 'oklch(0.45 0.20 255 / 20%)', key: lang === 'fr' ? 'Menus (Sales Order, Purchase Order)' : 'Menus (Sales Order, Purchase Order)' },
                { Logo: OdooLogo, name: 'Odoo', color: '#C084FC', bg: 'oklch(0.14 0.06 320 / 80%)', border: 'oklch(0.45 0.18 320 / 20%)', key: lang === 'fr' ? 'Modules (Ventes, Achats, Stock)' : 'Modules (Sales, Purchase, Stock)' },
              ] as const).map(({ Logo, name, color, bg, border, key }, idx, arr) => (
                <Link key={name} href="/modules/erp-arch">
                  <div className="card-hover px-4 py-2.5 cursor-pointer flex items-center gap-3"
                    style={{ background: bg, borderTop: `1px solid ${border}`, borderBottomLeftRadius: idx === arr.length - 1 ? '0.75rem' : 0, borderBottomRightRadius: idx === arr.length - 1 ? '0.75rem' : 0 }}>
                    <Logo />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold" style={{ color, fontFamily: 'Space Grotesk' }}>{name}</div>
                      <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{key}</div>
                    </div>
                    <ChevronRight size={14} style={{ color: 'oklch(0.35 0.010 255)', flexShrink: 0 }} />
                  </div>
                </Link>
              ))}
            </div>

            {/* Recommended next step */}
            {!isTeacher && nextScenario && (
              <Link href={`/simulator/${nextScenario.id}`}>
                <div className="card-hover rounded-xl p-4 cursor-pointer" style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${nextScenario.moduleColor}40` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Play size={13} style={{ color: nextScenario.moduleColor }} />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: nextScenario.moduleColor }}>
                      {lang === 'fr' ? 'Prochaine étape recommandée' : 'Recommended next step'}
                    </span>
                  </div>
                  <div className="text-sm font-bold mb-0.5" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.90 0.005 255)' }}>{nextScenario.code} — {nextScenario.title}</div>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{nextScenario.moduleName} · {nextScenario.duration} · {nextScenario.difficulty}</div>
                  {bestScoreByScenario[nextScenario.id] > 0 && (
                    <div className="mt-1.5 text-xs" style={{ color: 'oklch(0.78 0.14 70)' }}>
                      {lang === 'fr' ? `Meilleur score : ${bestScoreByScenario[nextScenario.id]}% — à améliorer` : `Best score: ${bestScoreByScenario[nextScenario.id]}% — improve it`}
                    </div>
                  )}
                </div>
              </Link>
            )}

            {/* Quick actions */}
            <div className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>{lang === 'fr' ? 'Accès rapide' : 'Quick Access'}</h3>
              <div className="space-y-2">
                <Link href="/simulator">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer" style={{ background: 'oklch(0.60 0.20 255 / 10%)', border: '1px solid oklch(0.60 0.20 255 / 20%)' }}>
                    <Play size={16} style={{ color: 'oklch(0.72 0.16 255)' }} />
                    <span className="text-sm font-medium" style={{ color: 'oklch(0.80 0.10 255)' }}>{lang === 'fr' ? 'Lancer une simulation' : 'Start a Simulation'}</span>
                  </div>
                </Link>
                <Link href="/modules/erp-sim">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer" style={{ background: 'oklch(0.65 0.22 25 / 10%)', border: '1px solid oklch(0.65 0.22 25 / 20%)' }}>
                    <Zap size={16} style={{ color: 'oklch(0.72 0.18 25)' }} />
                    <span className="text-sm font-medium" style={{ color: 'oklch(0.80 0.12 25)' }}>{lang === 'fr' ? 'Simulation intégrée ERP-SIM' : 'Integrated ERP-SIM Simulation'}</span>
                  </div>
                </Link>
                {isTeacher && (
                  <Link href="/monitoring">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer" style={{ background: 'oklch(0.72 0.16 162 / 10%)', border: '1px solid oklch(0.72 0.16 162 / 20%)' }}>
                      <Users size={16} style={{ color: 'oklch(0.72 0.14 162)' }} />
                      <span className="text-sm font-medium" style={{ color: 'oklch(0.80 0.10 162)' }}>{lang === 'fr' ? 'Suivi des étudiants' : 'Student Monitoring'}</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Activity */}
            <div className="rounded-xl p-4" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
                {lang === 'fr' ? 'Activité récente' : 'Recent Activity'}
              </h3>
              <div className="space-y-3">
                {recentActivities.length === 0 ? (
                  <p className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>
                    {lang === 'fr' ? 'Aucune activité pour l’instant. Lancez votre premier scénario !' : 'No activity yet. Start your first scenario!'}
                  </p>
                ) : recentActivities.map((act: { id: number; scenarioId: string; moduleId: string; score: number; createdAt: number }) => {
                  const mod = ERP_MODULES.find(m => m.id === act.moduleId);
                  return (
                    <div key={act.id} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${mod?.color ?? 'oklch(0.60 0.20 255)'}20`, color: mod?.color ?? 'oklch(0.60 0.20 255)' }}>
                        {MODULE_ICONS[act.moduleId] ?? <Zap size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium" style={{ color: 'oklch(0.75 0.008 255)' }}>
                          {lang === 'fr' ? `Scénario ${act.scenarioId.toUpperCase()} complété` : `Scenario ${act.scenarioId.toUpperCase()} completed`}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{timeAgo(act.createdAt, lang)}</span>
                          <span className="text-xs font-semibold" style={{ color: act.score >= 80 ? 'oklch(0.72 0.16 162)' : act.score >= 60 ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.22 25)' }}>{act.score}%</span>
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
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>{lang === 'fr' ? "Structure d'évaluation — Programme 2" : 'Assessment Structure — Programme 2'}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: lang === 'fr' ? 'Transactions simulées' : 'Simulated Transactions', pct: 30, color: 'oklch(0.72 0.15 200)', desc: lang === 'fr' ? 'Cycles P2P et O2C' : 'P2P and O2C Cycles' },
              { label: 'Quiz & concepts', pct: 20, color: 'oklch(0.65 0.22 295)', desc: lang === 'fr' ? 'ERP-ARCH et FI' : 'ERP-ARCH and FI' },
              { label: lang === 'fr' ? 'Simulation finale' : 'Final Simulation', pct: 50, color: 'oklch(0.65 0.22 25)', desc: lang === 'fr' ? 'ERP-SIM-01 intégré' : 'ERP-SIM-01 integrated' },
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
