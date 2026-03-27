import DashboardLayout from '@/components/DashboardLayout';
import { ERP_MODULES } from '@/lib/erpData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';
import { Layers, Package, ShoppingCart, DollarSign, Zap, Play, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  'erp-arch': <Layers size={18} />,
  'mm': <Package size={18} />,
  'sd': <ShoppingCart size={18} />,
  'fi': <DollarSign size={18} />,
  'erp-sim': <Zap size={18} />,
};

export default function SimulatorPageFull() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
            Simulateur ERP
          </h1>
          <p className="text-sm" style={{ color: 'oklch(0.50 0.010 255)' }}>
            Simulez des transactions réelles dans SAP S/4HANA, Microsoft Dynamics 365 et Odoo
          </p>
        </div>

        {/* System legend */}
        <div className="flex flex-wrap gap-3 p-4 rounded-xl" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
          <span className="text-xs font-semibold" style={{ color: 'oklch(0.45 0.010 255)' }}>Systèmes simulés :</span>
          <span className="sys-sap text-xs px-2 py-1 rounded font-mono">SAP S/4HANA — T-codes &amp; Fiori</span>
          <span className="sys-dynamics text-xs px-2 py-1 rounded font-mono">Microsoft Dynamics 365</span>
          <span className="sys-odoo text-xs px-2 py-1 rounded font-mono">Odoo ERP</span>
        </div>

        {/* Scenarios by module */}
        {ERP_MODULES.map(mod => (
          <div key={mod.id}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${mod.color}20`, color: mod.color }}>
                {MODULE_ICONS[mod.id]}
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${mod.color}20`, color: mod.color, border: `1px solid ${mod.color}40` }}>
                {mod.code}
              </span>
              <span className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.80 0.005 255)' }}>{mod.name}</span>
              {mod.process && <span className="text-xs font-mono" style={{ color: mod.color }}>→ {mod.process}</span>}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {mod.scenarios.map(sc => {
                const isCompleted = (({} as Record<string,number>))[sc.id] !== undefined;
                const score = (({} as Record<string,number>))[sc.id];
                return (
                  <Link key={sc.id} href={`/simulator/${sc.id}`}>
                    <div className="card-hover rounded-xl p-4 cursor-pointer"
                      style={{
                        background: 'oklch(0.14 0.018 255)',
                        border: `1px solid ${isCompleted ? mod.color + '40' : 'oklch(1 0 0 / 6%)'}`
                      }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold" style={{ color: mod.color }}>{sc.code}</span>
                        {isCompleted ? (
                          <span className="flex items-center gap-1 text-xs font-bold" style={{ color: 'oklch(0.72 0.16 162)' }}>
                            <CheckCircle2 size={12} /> {score}%
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: sc.difficulty === 'Débutant' ? 'oklch(0.72 0.16 162 / 20%)' : sc.difficulty === 'Intermédiaire' ? 'oklch(0.78 0.16 70 / 20%)' : 'oklch(0.65 0.22 25 / 20%)',
                              color: sc.difficulty === 'Débutant' ? 'oklch(0.72 0.14 162)' : sc.difficulty === 'Intermédiaire' ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.20 25)'
                            }}>
                            {sc.difficulty}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
                        {sc.title}
                      </h3>
                      <p className="text-xs mb-3" style={{ color: 'oklch(0.50 0.010 255)', lineHeight: '1.5' }}>
                        {sc.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1" style={{ color: 'oklch(0.45 0.010 255)' }}>
                          <Clock size={12} />
                          <span className="text-xs">{sc.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: mod.color }}>
                          <Play size={12} />
                          {isCompleted ? 'Recommencer' : 'Simuler'}
                          <ChevronRight size={12} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
