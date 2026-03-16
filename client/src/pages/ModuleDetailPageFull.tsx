// ModuleDetailPageFull — ERP Integrated Business Simulator
// Slides viewer with quiz integration, presentation mode, FR/EN support
// SAP S/4HANA | Microsoft Dynamics 365 | Odoo ERP
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getModuleById } from '@/lib/erpData';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { Link, useParams } from 'wouter';
import {
  Layers, Package, ShoppingCart, DollarSign, Zap,
  ChevronLeft, ChevronRight, Play, BookOpen, CheckCircle2,
  Maximize2, Minimize2, HelpCircle, X
} from 'lucide-react';
import QuizModal from '@/components/QuizModal';
import { getQuizByModuleId } from '@/lib/quizData';

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
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState<'slides' | 'scenarios'>('slides');
  const [slideIndex, setSlideIndex] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const quiz = mod ? getQuizByModuleId(mod.id) : undefined;

  // Keyboard navigation in presentation mode
  useEffect(() => {
    if (!presentationMode || !mod) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setSlideIndex(i => Math.min(i + 1, mod.slides.length - 1));
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setSlideIndex(i => Math.max(i - 1, 0));
      if (e.key === 'Escape') setPresentationMode(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [presentationMode, mod]);

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
  const isLastSlide = slideIndex === mod.slides.length - 1;

  // ─── Presentation Mode Overlay ───────────────────────────────
  if (presentationMode) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col"
        style={{ background: 'oklch(0.08 0.015 255)' }}>
        {/* Presentation header */}
        <div className="flex items-center justify-between px-8 py-4 shrink-0"
          style={{ borderBottom: '1px solid oklch(1 0 0 / 8%)' }}>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded-full"
              style={{ background: `${mod.color}20`, color: mod.color, border: `1px solid ${mod.color}30` }}>
              {mod.code}
            </span>
            <span className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
              {mod.fullName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono" style={{ color: 'oklch(0.45 0.010 255)' }}>
              {slideIndex + 1} / {mod.slides.length}
            </span>
            <span className="text-xs" style={{ color: 'oklch(0.35 0.010 255)' }}>ESC {lang === 'fr' ? 'pour quitter' : 'to exit'}</span>
            <button onClick={() => setPresentationMode(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ background: 'oklch(1 0 0 / 8%)', color: 'oklch(0.65 0.010 255)' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Slide content */}
        <div className="flex-1 flex items-center justify-center p-12 overflow-auto">
          <div className="w-full max-w-4xl">
            <div className="text-xs font-mono mb-3 opacity-60" style={{ color: mod.color }}>
              {mod.code} · Slide {slideIndex + 1}
            </div>
            <h2 className="text-4xl font-bold mb-3 leading-tight"
              style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.95 0.005 255)' }}>
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-xl mb-6" style={{ color: mod.color }}>{slide.subtitle}</p>
            )}
            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'oklch(0.72 0.008 255)' }}>
              {slide.content}
            </p>
            {slide.keyPoints && slide.keyPoints.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {slide.keyPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: `${mod.color}10`, border: `1px solid ${mod.color}20` }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{ background: `${mod.color}30`, color: mod.color }}>
                      {i + 1}
                    </div>
                    <span className="text-base" style={{ color: 'oklch(0.80 0.008 255)' }}>{pt}</span>
                  </div>
                ))}
              </div>
            )}
            {slide.systemRef && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'SAP S/4HANA', val: slide.systemRef.sap, cls: 'sys-sap' },
                  { label: 'Dynamics 365', val: slide.systemRef.dynamics, cls: 'sys-dynamics' },
                  { label: 'Odoo ERP', val: slide.systemRef.odoo, cls: 'sys-odoo' },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-lg" style={{ background: 'oklch(0.12 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
                    <span className={`${s.cls} text-xs px-2 py-0.5 rounded font-mono`}>{s.label}</span>
                    <p className="text-sm mt-2" style={{ color: 'oklch(0.65 0.010 255)' }}>{s.val}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-8 py-4 shrink-0"
          style={{ borderTop: '1px solid oklch(1 0 0 / 8%)' }}>
          <button onClick={() => setSlideIndex(i => Math.max(i - 1, 0))}
            disabled={slideIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
            style={{ background: 'oklch(1 0 0 / 8%)', color: 'oklch(0.65 0.010 255)' }}>
            <ChevronLeft size={16} />
            {lang === 'fr' ? 'Précédent' : 'Previous'}
          </button>
          {/* Dots */}
          <div className="flex gap-1.5">
            {mod.slides.map((_, i) => (
              <button key={i} onClick={() => setSlideIndex(i)}
                className="rounded-full transition-all"
                style={{ width: i === slideIndex ? '24px' : '6px', height: '6px', background: i === slideIndex ? mod.color : 'oklch(0.25 0.015 255)' }} />
            ))}
          </div>
          {isLastSlide ? (
            <button onClick={() => { setPresentationMode(false); if (quiz) setShowQuiz(true); }}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: mod.color, color: 'oklch(0.10 0.015 255)' }}>
              <HelpCircle size={16} />
              {lang === 'fr' ? 'Lancer le quiz' : 'Start Quiz'}
            </button>
          ) : (
            <button onClick={() => setSlideIndex(i => Math.min(i + 1, mod.slides.length - 1))}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'oklch(1 0 0 / 8%)', color: 'oklch(0.65 0.010 255)' }}>
              {lang === 'fr' ? 'Suivant' : 'Next'}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── Normal Mode ─────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>
          <Link href="/modules"><span className="hover:text-white transition-colors cursor-pointer">
            {lang === 'fr' ? 'Modules' : 'Modules'}
          </span></Link>
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
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color: mod.color }}>{pct}%</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>{done}/{mod.scenarios.length} scénarios</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: 'oklch(0.14 0.018 255)' }}>
          {[
            { id: 'slides', label: `${lang === 'fr' ? 'Slides' : 'Slides'} (${mod.slides.length})`, icon: <BookOpen size={14} /> },
            { id: 'scenarios', label: `${lang === 'fr' ? 'Scénarios' : 'Scenarios'} (${mod.scenarios.length})`, icon: <Play size={14} /> },
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

              {/* Quiz button in sidebar */}
              {quiz && (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full text-left p-3 rounded-lg transition-all mt-3"
                  style={{ background: `${mod.color}15`, border: `1px solid ${mod.color}40` }}
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle size={14} style={{ color: mod.color }} />
                    <span className="text-xs font-semibold" style={{ color: mod.color }}>
                      {lang === 'fr' ? 'Quiz de compréhension' : 'Comprehension Quiz'}
                    </span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'oklch(0.40 0.010 255)' }}>
                    {quiz.questions.length} {lang === 'fr' ? 'questions' : 'questions'} · SAP / D365 / Odoo
                  </div>
                </button>
              )}
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
                    {/* Presentation mode button */}
                    <button
                      onClick={() => setPresentationMode(true)}
                      title={lang === 'fr' ? 'Mode présentation' : 'Presentation mode'}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: `${mod.color}20`, color: mod.color, border: `1px solid ${mod.color}30` }}>
                      <Maximize2 size={14} />
                    </button>
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
                      {lang === 'fr' ? 'Points clés' : 'Key Points'}
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
                      {lang === 'fr' ? 'Référence dans les systèmes ERP' : 'Reference in ERP Systems'}
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

                {/* Progress dots + quiz CTA at last slide */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-1.5">
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
                  {isLastSlide && quiz && (
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                      style={{ background: `${mod.color}20`, color: mod.color, border: `1px solid ${mod.color}40` }}>
                      <HelpCircle size={14} />
                      {lang === 'fr' ? 'Tester mes connaissances' : 'Test my knowledge'}
                    </button>
                  )}
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
                        <span className="font-semibold" style={{ color: mod.color }}>
                          {lang === 'fr' ? 'Objectif : ' : 'Objective: '}
                        </span>
                        {sc.learningObjective}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Link href={`/simulator/${sc.id}`}>
                        <button className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                          style={{ background: mod.color, color: 'white' }}>
                          {isCompleted
                            ? (lang === 'fr' ? 'Recommencer' : 'Retry')
                            : (lang === 'fr' ? 'Simuler' : 'Simulate')
                          }
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

      {/* Quiz Modal */}
      {showQuiz && quiz && (
        <QuizModal
          moduleCode={mod.code}
          moduleName={mod.fullName}
          moduleColor={mod.color}
          questions={quiz.questions}
          onClose={() => setShowQuiz(false)}
          onComplete={(score) => {
            console.log(`Quiz ${mod.code} completed with score: ${score}%`);
          }}
        />
      )}
    </DashboardLayout>
  );
}
