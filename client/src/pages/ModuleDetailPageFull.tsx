import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getModuleById } from '@/lib/erpData';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useParams } from 'wouter';
import { Layers, Package, ShoppingCart, DollarSign, Zap, ChevronLeft, ChevronRight, Play, BookOpen, CheckCircle2 } from 'lucide-react';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  'erp-arch': <Layers size={24} />,
  'mm': <Package size={24} />,
  'sd': <ShoppingCart size={24} />,
  'fi': <DollarSign size={24} />,
  'erp-sim': <Zap size={24} />,
};

export default function ModuleDetailPageFull() {
  const params = useParams<{ moduleId: string }>();
  const moduleId = params.moduleId || 'erp-arch';
  const mod = getModuleById(moduleId);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'slides' | 'scenarios'>('slides');
  const [slideIndex, setSlideIndex] = useState(0);

  if (!mod) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center" style={{ color: 'oklch(0.85 0.005 255)' }}>
          Module introuvable. <Link href="/modules"><span style={{ color: 'oklch(0.60 0.16 255)' }}>Retour aux modules</span></Link>
        </div>
      </DashboardLayout>
    );
  }

  const slide = mod.slides[slideIndex];
  const done = mod.scenarios.filter(s => (user?.progress || {})[s.id] !== undefined).length;
  const pct = mod.scenarios.length > 0 ? Math.round((done / mod.scenarios.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>
          <Link href="/modules"><span className="hover:text-white transition-colors cursor-pointer">Modules</span></Link>
          <ChevronRight size={12} />
          <span style={{ color: mod.color }}>{mod.code}</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${mod.color}20`, color: mod.color }}>
            {MODULE_ICONS[mod.id]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${mod.color}20`, color: mod.color, border: `1px solid ${mod.color}40` }}>
                {mod.code}
              </span>
              <span className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{mod.duration}</span>
              {mod.process && <span className="text-xs font-mono" style={{ color: mod.color }}>{mod.process}</span>}
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
              {mod.fullName}
            </h1>
            <p className="text-sm" style={{ color: 'oklch(0.55 0.010 255)' }}>{mod.description}</p>
          </div>
          <div className="hidden md:block text-right shrink-0">
            <div className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color: mod.color }}>{pct}%</div>
            <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{done}/{mod.scenarios.length} scénarios</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: 'oklch(0.14 0.018 255)' }}>
          {[
            { id: 'slides', label: `Slides (${mod.slides.length})`, icon: <BookOpen size={14} /> },
            { id: 'scenarios', label: `Scénarios (${mod.scenarios.length})`, icon: <Play size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'slides' | 'scenarios')}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.id ? mod.color : 'transparent',
                color: activeTab === tab.id ? 'white' : 'oklch(0.55 0.010 255)'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Slides tab */}
        {activeTab === 'slides' && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Slide list */}
            <div className="space-y-2">
              {mod.slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSlideIndex(i)}
                  className="w-full text-left p-3 rounded-lg transition-all"
                  style={{
                    background: i === slideIndex ? `${mod.color}15` : 'oklch(0.14 0.018 255)',
                    border: `1px solid ${i === slideIndex ? mod.color + '40' : 'oklch(1 0 0 / 6%)'}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono" style={{ color: mod.color }}>{i + 1}</span>
                    <span className="text-xs font-semibold truncate" style={{ color: i === slideIndex ? 'oklch(0.88 0.005 255)' : 'oklch(0.65 0.010 255)' }}>
                      {s.title}
                    </span>
                  </div>
                  <div className="text-xs truncate" style={{ color: 'oklch(0.40 0.010 255)' }}>{s.subtitle}</div>
                </button>
              ))}
            </div>

            {/* Slide content */}
            <div className="lg:col-span-3">
              <div className="rounded-xl p-6 min-h-96" style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${mod.color}25` }}>
                {/* Slide header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{ background: `${mod.color}20`, color: mod.color }}>
                      {mod.code} · Slide {slideIndex + 1}/{mod.slides.length}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'oklch(0.18 0.018 255)', color: 'oklch(0.50 0.010 255)' }}>
                      {slide.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSlideIndex(Math.max(0, slideIndex - 1))}
                      disabled={slideIndex === 0}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                      style={{ background: 'oklch(0.18 0.018 255)', color: 'oklch(0.65 0.010 255)' }}>
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => setSlideIndex(Math.min(mod.slides.length - 1, slideIndex + 1))}
                      disabled={slideIndex === mod.slides.length - 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                      style={{ background: 'oklch(0.18 0.018 255)', color: 'oklch(0.65 0.010 255)' }}>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-sm mb-4" style={{ color: mod.color }}>{slide.subtitle}</p>
                )}
                <p className="text-sm mb-5" style={{ color: 'oklch(0.70 0.008 255)', lineHeight: '1.7' }}>
                  {slide.content}
                </p>

                {/* Key points */}
                {slide.keyPoints && slide.keyPoints.length > 0 && (
                  <div className="mb-5">
                    <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'oklch(0.45 0.010 255)' }}>
                      Points clés
                    </div>
                    <div className="space-y-2">
                      {slide.keyPoints.map((pt, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                            style={{ background: `${mod.color}20`, color: mod.color }}>
                            {i + 1}
                          </div>
                          <span className="text-sm" style={{ color: 'oklch(0.75 0.008 255)', lineHeight: '1.5' }}>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* System references */}
                {slide.systemRef && (
                  <div className="rounded-lg p-4" style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'oklch(0.45 0.010 255)' }}>
                      Référence dans les systèmes ERP
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="sys-sap text-xs px-2 py-0.5 rounded font-mono shrink-0">SAP</span>
                        <span className="text-xs" style={{ color: 'oklch(0.65 0.010 255)' }}>{slide.systemRef.sap}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="sys-dynamics text-xs px-2 py-0.5 rounded font-mono shrink-0">D365</span>
                        <span className="text-xs" style={{ color: 'oklch(0.65 0.010 255)' }}>{slide.systemRef.dynamics}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="sys-odoo text-xs px-2 py-0.5 rounded font-mono shrink-0">Odoo</span>
                        <span className="text-xs" style={{ color: 'oklch(0.65 0.010 255)' }}>{slide.systemRef.odoo}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-1.5 mt-6">
                  {mod.slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      className="rounded-full transition-all"
                      style={{
                        width: i === slideIndex ? '20px' : '6px',
                        height: '6px',
                        background: i === slideIndex ? mod.color : 'oklch(0.25 0.015 255)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scenarios tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-4">
            {mod.scenarios.map(sc => {
              const isCompleted = (user?.progress || {})[sc.id] !== undefined;
              const score = (user?.progress || {})[sc.id];
              return (
                <div key={sc.id} className="rounded-xl p-5" style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${isCompleted ? mod.color + '30' : 'oklch(1 0 0 / 6%)'}` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                      style={{ background: `${mod.color}20`, color: mod.color, fontFamily: 'Space Mono' }}>
                      {sc.code.split('-').slice(-1)[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono font-bold" style={{ color: mod.color }}>{sc.code}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: sc.difficulty === 'Débutant' ? 'oklch(0.72 0.16 162 / 20%)' : sc.difficulty === 'Intermédiaire' ? 'oklch(0.78 0.16 70 / 20%)' : 'oklch(0.65 0.22 25 / 20%)',
                            color: sc.difficulty === 'Débutant' ? 'oklch(0.72 0.14 162)' : sc.difficulty === 'Intermédiaire' ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.20 25)'
                          }}>
                          {sc.difficulty}
                        </span>
                        <span className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{sc.duration}</span>
                        {isCompleted && score !== undefined && (
                          <span className="flex items-center gap-1 text-xs font-bold" style={{ color: 'oklch(0.72 0.16 162)' }}>
                            <CheckCircle2 size={12} /> {score}%
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.88 0.005 255)' }}>
                        {sc.title}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: 'oklch(0.55 0.010 255)', lineHeight: '1.5' }}>{sc.description}</p>
                      <div className="text-xs p-2 rounded-lg" style={{ background: 'oklch(0.11 0.015 255)', color: 'oklch(0.55 0.010 255)' }}>
                        <span className="font-semibold" style={{ color: mod.color }}>Objectif : </span>{sc.learningObjective}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Link href={`/simulator/${sc.id}`}>
                        <button className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                          style={{ background: mod.color, color: 'white' }}>
                          {isCompleted ? 'Recommencer' : 'Simuler'}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
