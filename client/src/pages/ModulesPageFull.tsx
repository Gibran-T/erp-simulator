import DashboardLayout from '@/components/DashboardLayout';
import { ERP_MODULES } from '@/lib/erpData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';
import { Layers, Package, ShoppingCart, DollarSign, Zap, BookOpen, Play, ChevronRight } from 'lucide-react';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  'erp-arch': <Layers size={28} />,
  'mm': <Package size={28} />,
  'sd': <ShoppingCart size={28} />,
  'fi': <DollarSign size={28} />,
  'erp-sim': <Zap size={28} />,
};

export default function ModulesPageFull() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
            Modules ERP
          </h1>
          <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>
            Programme 2 — 5 modules · 30 heures · SAP S/4HANA · Microsoft Dynamics 365 · Odoo
          </p>
        </div>

        {/* Programme overview */}
        <div className="rounded-xl p-5" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
          <div className="grid sm:grid-cols-5 gap-3">
            {ERP_MODULES.map((mod, i) => (
              <div key={mod.id} className="text-center">
                <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                  style={{ background: `${mod.color}20`, color: mod.color }}>
                  {MODULE_ICONS[mod.id]}
                </div>
                <div className="text-xs font-mono font-bold" style={{ color: mod.color }}>{mod.code}</div>
                <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{mod.hours}h</div>
                {i < ERP_MODULES.length - 1 && (
                  <div className="hidden sm:block absolute" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: 'oklch(0.20 0.018 255)' }}>
            <div className="h-full rounded-full" style={{
              width: `${Math.round((Object.keys(user?.progress || {}).length / ERP_MODULES.reduce((a, m) => a + m.scenarios.length, 0)) * 100)}%`,
              background: 'linear-gradient(90deg, oklch(0.65 0.22 295), oklch(0.72 0.15 200), oklch(0.72 0.16 162), oklch(0.78 0.16 70), oklch(0.65 0.22 25))',
              transition: 'width 0.5s ease'
            }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>Début du programme</span>
            <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>ERP-SIM Simulation finale</span>
          </div>
        </div>

        {/* Module cards */}
        <div className="space-y-4">
          {ERP_MODULES.map(mod => {
            const done = mod.scenarios.filter(s => (user?.progress || {})[s.id] !== undefined).length;
            const pct = mod.scenarios.length > 0 ? Math.round((done / mod.scenarios.length) * 100) : 0;
            return (
              <div key={mod.id} className="rounded-xl overflow-hidden" style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${mod.color}25` }}>
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${mod.color}20`, color: mod.color }}>
                      {MODULE_ICONS[mod.id]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${mod.color}20`, color: mod.color, border: `1px solid ${mod.color}40` }}>
                          {mod.code}
                        </span>
                        <span className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{mod.duration}</span>
                        {mod.process && (
                          <span className="text-xs font-mono" style={{ color: mod.color }}>→ {mod.process}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.90 0.005 255)' }}>
                        {mod.fullName}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: 'oklch(0.55 0.010 255)', lineHeight: '1.5' }}>
                        {mod.description}
                      </p>

                      {/* Stats row */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-1.5">
                          <BookOpen size={14} style={{ color: mod.color }} />
                          <span className="text-xs" style={{ color: 'oklch(0.55 0.010 255)' }}>{mod.slides.length} slides pédagogiques</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Play size={14} style={{ color: mod.color }} />
                          <span className="text-xs" style={{ color: 'oklch(0.55 0.010 255)' }}>{mod.scenarios.length} scénarios de simulation</span>
                        </div>
                      </div>

                      {/* Scenarios list */}
                      <div className="grid sm:grid-cols-2 gap-2 mb-4">
                        {mod.scenarios.map(sc => {
                          const isCompleted = (user?.progress || {})[sc.id] !== undefined;
                          const score = (user?.progress || {})[sc.id];
                          return (
                            <Link key={sc.id} href={`/simulator/${sc.id}`}>
                              <div className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all"
                                style={{
                                  background: isCompleted ? `${mod.color}10` : 'oklch(0.17 0.018 255)',
                                  border: `1px solid ${isCompleted ? mod.color + '30' : 'oklch(1 0 0 / 6%)'}`
                                }}>
                                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                                  style={{ background: `${mod.color}20`, color: mod.color }}>
                                  {sc.code.split('-').pop()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-semibold truncate" style={{ color: 'oklch(0.80 0.005 255)' }}>{sc.title}</div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{sc.difficulty} · {sc.duration}</span>
                                    {isCompleted && score !== undefined && (
                                      <span className="text-xs font-bold" style={{ color: 'oklch(0.72 0.16 162)' }}>{score}%</span>
                                    )}
                                  </div>
                                </div>
                                <ChevronRight size={12} style={{ color: 'oklch(0.40 0.010 255)', flexShrink: 0 }} />
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Progress */}
                      <div className="progress-bar mb-1">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${mod.color}, ${mod.color}aa)` }} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{done}/{mod.scenarios.length} scénarios complétés</span>
                        <span className="text-xs font-semibold" style={{ color: mod.color }}>{pct}%</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="shrink-0 hidden md:flex flex-col gap-2">
                      <Link href={`/modules/${mod.id}`}>
                        <button className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                          style={{ background: `${mod.color}20`, color: mod.color, border: `1px solid ${mod.color}40` }}>
                          Voir les slides
                        </button>
                      </Link>
                      <Link href={`/simulator/${mod.scenarios[0]?.id}`}>
                        <button className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                          style={{ background: mod.color, color: 'white' }}>
                          Simuler
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
