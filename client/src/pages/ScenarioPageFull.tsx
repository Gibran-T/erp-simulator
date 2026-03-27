import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getScenarioById, type TransactionStep, type TransactionField } from '@/lib/erpData';
import { useAuth } from '@/contexts/AuthContext';
import { useStudents } from '@/contexts/StudentsContext';
import { trpc } from '@/lib/trpc';
import { useParams, useLocation } from 'wouter';
import {
  ChevronRight, ChevronLeft, CheckCircle2, XCircle, AlertCircle,
  Play, RotateCcw, Award, Clock, BookOpen, Layers, Package, ShoppingCart, DollarSign, Zap
} from 'lucide-react';
import { toast } from 'sonner';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  'erp-arch': <Layers size={16} />,
  'mm': <Package size={16} />,
  'sd': <ShoppingCart size={16} />,
  'fi': <DollarSign size={16} />,
  'erp-sim': <Zap size={16} />,
};

type StepStatus = 'pending' | 'active' | 'completed' | 'error';

const SYSTEM_LABELS = { sap: 'SAP S/4HANA', dynamics: 'Dynamics 365', odoo: 'Odoo ERP' };
const SYSTEM_STYLES = {
  sap: { bg: 'oklch(0.20 0.05 30 / 60%)', color: 'oklch(0.78 0.14 30)', border: 'oklch(0.50 0.12 30 / 40%)' },
  dynamics: { bg: 'oklch(0.15 0.06 255 / 60%)', color: 'oklch(0.75 0.14 255)', border: 'oklch(0.55 0.16 255 / 40%)' },
  odoo: { bg: 'oklch(0.15 0.06 162 / 60%)', color: 'oklch(0.75 0.14 162)', border: 'oklch(0.55 0.16 162 / 40%)' },
};

export default function ScenarioPageFull() {
  const params = useParams<{ scenarioId: string }>();
  const scenarioId = params.scenarioId || '';
  const result = getScenarioById(scenarioId);
  const { user } = useAuth();
  const { students, updateStudent } = useStudents();
  const submitScenarioScore = trpc.scores.submitScenario.useMutation();
  const [hintsUsed, setHintsUsed] = useState<Set<number>>(new Set());
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [examMode, setExamMode] = useState(false);
  const [, navigate] = useLocation();

  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>([]);
  const [stepInputs, setStepInputs] = useState<Record<number, Record<string, string>>>({});
  const [stepErrors, setStepErrors] = useState<Record<number, string>>({});
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedSystem, setSelectedSystem] = useState<'sap' | 'dynamics' | 'odoo'>('sap');
  const [showHint, setShowHint] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [stepFeedback, setStepFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  const mod = result?.module;
  const scenario = result?.scenario;

  useEffect(() => {
    if (scenario) {
      setStepStatuses(scenario.steps.map(() => 'pending') as StepStatus[]);
    }
  }, [scenario]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive && !finished) {
      interval = setInterval(() => setElapsedTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, finished]);

  if (!scenario || !mod) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center" style={{ color: 'oklch(0.85 0.005 255)' }}>
          Scénario introuvable.
        </div>
      </DashboardLayout>
    );
  }

  const step: TransactionStep = scenario.steps[currentStep];
  const totalSteps = scenario.steps.length;
  const completedCount = stepStatuses.filter(s => s === 'completed').length;

  const handleStart = () => {
    setStarted(true);
    setTimerActive(true);
    const newStatuses = scenario.steps.map((_, i) => i === 0 ? 'active' : 'pending') as StepStatus[];
    setStepStatuses(newStatuses);
  };

  const handleInputChange = (stepIdx: number, fieldId: string, value: string) => {
    setStepInputs(prev => ({ ...prev, [stepIdx]: { ...(prev[stepIdx] || {}), [fieldId]: value } }));
    if (stepErrors[stepIdx]) setStepErrors(prev => { const n = { ...prev }; delete n[stepIdx]; return n; });
    setStepFeedback(null);
  };

  const validateStep = (stepIdx: number): boolean => {
    const s: TransactionStep = scenario.steps[stepIdx];
    if (!s.fields || s.fields.length === 0) return true;
    const inputs = stepInputs[stepIdx] || {};
    for (const field of s.fields) {
      if (field.required && !inputs[field.id]?.trim()) {
        setStepErrors(prev => ({ ...prev, [stepIdx]: `Le champ "${field.label}" est obligatoire.` }));
        return false;
      }
    }
    // Check correctValue
    let allCorrect = true;
    for (const field of s.fields) {
      if (field.correctValue && inputs[field.id]) {
        const val = inputs[field.id].trim();
        if (val !== field.correctValue) {
          allCorrect = false;
        }
      }
    }
    if (!allCorrect) {
      setStepFeedback({ correct: false, message: s.errorMessage });
    } else {
      setStepFeedback({ correct: true, message: s.validationMessage });
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;

    // If there's feedback showing an error, count wrong attempt and allow retry
    if (stepFeedback && !stepFeedback.correct) {
      setWrongAttempts(w => w + 1);
      return;
    }

    const newStatuses = [...stepStatuses] as StepStatus[];
    newStatuses[currentStep] = 'completed';

    if (currentStep + 1 < totalSteps) {
      newStatuses[currentStep + 1] = 'active';
      setCurrentStep(currentStep + 1);
      setStepFeedback(null);
      setShowHint(false);
    } else {
      // Deterministic score: ratio of correct steps, minus 10 pts per hint used
      const correctSteps = scenario.steps.filter((_, i) => {
        const inputs = stepInputs[i] || {};
        const s = scenario.steps[i];
        if (!s.fields || s.fields.length === 0) return true;
        return s.fields.every(f => !f.correctValue || inputs[f.id]?.trim() === f.correctValue);
      }).length;
      const hintPenalty = hintsUsed.size * 5;
      const wrongPenalty = wrongAttempts * 10;
      const rawScore = Math.round((correctSteps / totalSteps) * 100);
      const finalScore = Math.max(0, Math.min(100, rawScore - hintPenalty - wrongPenalty));
      setScore(finalScore);
      setFinished(true);
      setTimerActive(false);
      // Submit to backend if student is authenticated
      if (user?.role === 'student' && mod) {
        submitScenarioScore.mutate({
          scenarioId,
          moduleId: mod.id,
          score: finalScore,
          hintsUsed: hintsUsed.size,
          wrongAttempts,
          examMode,
        });
      }
      // Bridge: update the student record in StudentsContext so monitoring reflects real activity
      if (user?.email) {
        const matched = students.find(s => s.email.toLowerCase() === user.email.toLowerCase());
        if (matched) {
          const updatedProgress = { ...matched.progress, [scenarioId]: finalScore };
          updateStudent(matched.id, {
            progress: updatedProgress,
            lastActive: new Date().toISOString(),
          });
        }
      }
      toast.success(`Scénario complété ! Score : ${finalScore}%`);
    }
    setStepStatuses(newStatuses);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const newStatuses = [...stepStatuses] as StepStatus[];
      newStatuses[currentStep] = 'pending';
      newStatuses[currentStep - 1] = 'active';
      setCurrentStep(currentStep - 1);
      setStepStatuses(newStatuses);
      setStepFeedback(null);
    }
  };

  const handleReset = () => {
    setStarted(false);
    setFinished(false);
    setCurrentStep(0);
    setStepStatuses(scenario.steps.map(() => 'pending') as StepStatus[]);
    setStepInputs({});
    setStepErrors({});
    setShowHint(false);
    setElapsedTime(0);
    setTimerActive(false);
    setScore(0);
    setStepFeedback(null);
    setWrongAttempts(0);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const getSystemCode = (step: TransactionStep) => {
    if (selectedSystem === 'sap') return step.sapCode || '';
    if (selectedSystem === 'dynamics') return step.dynamicsName || '';
    return step.odooName || '';
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>
          <span onClick={() => navigate('/modules')} className="cursor-pointer hover:text-white transition-colors">Modules</span>
          <ChevronRight size={12} />
          <span onClick={() => navigate(`/modules/${mod.id}`)} className="cursor-pointer" style={{ color: mod.color }}>{mod.code}</span>
          <ChevronRight size={12} />
          <span style={{ color: 'oklch(0.70 0.008 255)' }}>{scenario.code}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${mod.color}20`, color: mod.color }}>
              {MODULE_ICONS[mod.id]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${mod.color}20`, color: mod.color, border: `1px solid ${mod.color}40` }}>
                  {scenario.code}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: scenario.difficulty === 'Débutant' ? 'oklch(0.72 0.16 162 / 20%)' : scenario.difficulty === 'Intermédiaire' ? 'oklch(0.78 0.16 70 / 20%)' : 'oklch(0.65 0.22 25 / 20%)',
                    color: scenario.difficulty === 'Débutant' ? 'oklch(0.72 0.14 162)' : scenario.difficulty === 'Intermédiaire' ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.20 25)'
                  }}>
                  {scenario.difficulty}
                </span>
                <span className="text-xs flex items-center gap-1" style={{ color: 'oklch(0.45 0.010 255)' }}>
                  <Clock size={11} /> {scenario.duration}
                </span>
              </div>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
                {scenario.title}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.010 255)' }}>{scenario.description}</p>
            </div>
          </div>
          {started && !finished && (
            <div className="shrink-0 text-right">
              <div className="text-lg font-mono font-bold" style={{ color: mod.color }}>{formatTime(elapsedTime)}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>Temps écoulé</div>
            </div>
          )}
        </div>

        {/* Not started */}
        {!started && !finished && (
          <div className="rounded-xl p-6" style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${mod.color}25` }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-base font-semibold mb-3" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
                  Objectif pédagogique
                </h2>
                <p className="text-sm mb-4" style={{ color: 'oklch(0.65 0.010 255)', lineHeight: '1.6' }}>
                  {scenario.learningObjective}
                </p>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'oklch(0.45 0.010 255)' }}>
                  Étapes du scénario ({totalSteps})
                </div>
                <div className="space-y-1.5">
                  {scenario.steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: `${mod.color}20`, color: mod.color }}>
                        {i + 1}
                      </div>
                      <span className="text-xs" style={{ color: 'oklch(0.60 0.010 255)' }}>{s.name}</span>
                      {s.sapCode && <span className="text-xs font-mono" style={{ color: 'oklch(0.40 0.010 255)' }}>{s.sapCode}</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-base font-semibold mb-3" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.85 0.005 255)' }}>
                  Choisir le système ERP
                </h2>
                <div className="space-y-2 mb-6">
                  {(['sap', 'dynamics', 'odoo'] as const).map(sys => {
                    const st = SYSTEM_STYLES[sys];
                    return (
                      <button key={sys} onClick={() => setSelectedSystem(sys)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left"
                        style={{
                          background: selectedSystem === sys ? st.bg : 'oklch(0.17 0.018 255)',
                          border: `1px solid ${selectedSystem === sys ? st.border : 'oklch(1 0 0 / 6%)'}`,
                        }}>
                        <div className="w-3 h-3 rounded-full" style={{ background: selectedSystem === sys ? st.color : 'oklch(0.30 0.015 255)' }} />
                        <span className="text-sm font-semibold" style={{ color: selectedSystem === sys ? st.color : 'oklch(0.55 0.010 255)' }}>
                          {SYSTEM_LABELS[sys]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button onClick={handleStart}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
                  style={{ background: mod.color, color: 'white' }}>
                  <Play size={16} /> Démarrer la simulation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active simulation */}
        {started && !finished && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Step list sidebar */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'oklch(0.45 0.010 255)' }}>
                Progression
              </div>
              {scenario.steps.map((s, i) => {
                const status = stepStatuses[i];
                return (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg"
                    style={{
                      background: i === currentStep ? `${mod.color}15` : 'oklch(0.14 0.018 255)',
                      border: `1px solid ${i === currentStep ? mod.color + '40' : status === 'completed' ? mod.color + '20' : 'oklch(1 0 0 / 6%)'}`
                    }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
                      style={{
                        background: status === 'completed' ? 'oklch(0.72 0.16 162 / 20%)' : i === currentStep ? `${mod.color}20` : 'oklch(0.18 0.018 255)',
                        color: status === 'completed' ? 'oklch(0.72 0.14 162)' : i === currentStep ? mod.color : 'oklch(0.40 0.010 255)'
                      }}>
                      {status === 'completed' ? <CheckCircle2 size={14} /> : i + 1}
                    </div>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: i === currentStep ? 'oklch(0.88 0.005 255)' : status === 'completed' ? 'oklch(0.65 0.010 255)' : 'oklch(0.45 0.010 255)' }}>
                        {s.name}
                      </div>
                      {getSystemCode(s) && (
                        <div className="text-xs font-mono mt-0.5" style={{ color: SYSTEM_STYLES[selectedSystem].color }}>
                          {getSystemCode(s)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="mt-3">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.round((completedCount / totalSteps) * 100)}%`, background: `linear-gradient(90deg, ${mod.color}, ${mod.color}aa)` }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{completedCount}/{totalSteps}</span>
                  <span className="text-xs font-semibold" style={{ color: mod.color }}>{Math.round((completedCount / totalSteps) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Active step content */}
            <div className="lg:col-span-3">
              <div className="rounded-xl p-6" style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${mod.color}30` }}>
                {/* System bar */}
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg"
                  style={{ background: SYSTEM_STYLES[selectedSystem].bg, border: `1px solid ${SYSTEM_STYLES[selectedSystem].border}` }}>
                  <span className="text-xs font-bold" style={{ color: SYSTEM_STYLES[selectedSystem].color }}>
                    {SYSTEM_LABELS[selectedSystem]}
                  </span>
                  {getSystemCode(step) && (
                    <span className="font-mono text-xs px-2 py-0.5 rounded ml-2"
                      style={{ background: 'oklch(0.10 0.015 255 / 60%)', color: SYSTEM_STYLES[selectedSystem].color }}>
                      {getSystemCode(step)}
                    </span>
                  )}
                  <span className="ml-auto text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>
                    Étape {currentStep + 1} / {totalSteps}
                  </span>
                </div>

                <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
                  {step.name}
                </h2>
                <p className="text-sm mb-4" style={{ color: 'oklch(0.65 0.010 255)', lineHeight: '1.6' }}>
                  {step.objective}
                </p>

                {/* Fields */}
                {step.fields && step.fields.length > 0 && (
                  <div className="space-y-4 mb-4">
                    {step.fields.map((field: TransactionField) => (
                      <div key={field.id}>
                        <label className="text-xs font-semibold mb-1.5 flex items-center gap-1" style={{ color: 'oklch(0.65 0.010 255)' }}>
                          {field.label}
                          {field.required && <span style={{ color: 'oklch(0.65 0.22 25)' }}>*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            value={stepInputs[currentStep]?.[field.id] || ''}
                            onChange={e => handleInputChange(currentStep, field.id, e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                            style={{
                              background: 'oklch(0.11 0.015 255)',
                              border: `1px solid ${stepErrors[currentStep] ? 'oklch(0.65 0.22 25 / 50%)' : 'oklch(1 0 0 / 10%)'}`,
                              color: 'oklch(0.85 0.005 255)'
                            }}
                          >
                            <option value="">— Sélectionner —</option>
                            {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : (
                          <input
                            type={field.type || 'text'}
                            value={stepInputs[currentStep]?.[field.id] || ''}
                            onChange={e => handleInputChange(currentStep, field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                            style={{
                              background: 'oklch(0.11 0.015 255)',
                              border: `1px solid ${stepErrors[currentStep] ? 'oklch(0.65 0.22 25 / 50%)' : 'oklch(1 0 0 / 10%)'}`,
                              color: 'oklch(0.85 0.005 255)'
                            }}
                          />
                        )}
                        {field.hint && (
                          <div className="text-xs mt-1" style={{ color: 'oklch(0.45 0.010 255)' }}>💡 {field.hint}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Validation feedback */}
                {stepFeedback && (
                  <div className="mb-4 p-4 rounded-lg"
                    style={{
                      background: stepFeedback.correct ? 'oklch(0.72 0.16 162 / 10%)' : 'oklch(0.65 0.22 25 / 10%)',
                      border: `1px solid ${stepFeedback.correct ? 'oklch(0.72 0.16 162 / 40%)' : 'oklch(0.65 0.22 25 / 40%)'}`
                    }}>
                    <div className="flex items-start gap-2">
                      {stepFeedback.correct
                        ? <CheckCircle2 size={16} style={{ color: 'oklch(0.72 0.14 162)', flexShrink: 0, marginTop: '2px' }} />
                        : <XCircle size={16} style={{ color: 'oklch(0.65 0.22 25)', flexShrink: 0, marginTop: '2px' }} />
                      }
                      <p className="text-sm" style={{ color: stepFeedback.correct ? 'oklch(0.80 0.10 162)' : 'oklch(0.80 0.12 25)', lineHeight: '1.5' }}>
                        {stepFeedback.message}
                      </p>
                    </div>
                  </div>
                )}

                {/* ERP Impact Panel — shown after correct validation */}
                {stepFeedback?.correct && step.erpImpact && (
                  <div className="mb-4 p-4 rounded-lg" style={{ background: 'oklch(0.60 0.20 255 / 8%)', border: '1px solid oklch(0.60 0.20 255 / 25%)' }}>
                    <div className="text-xs font-bold mb-3 flex items-center gap-2" style={{ color: 'oklch(0.75 0.16 255)' }}>
                      <Zap size={13} /> Impact ERP — Ce qui vient de se passer dans le système
                    </div>
                    <div className="space-y-2">
                      {step.erpImpact.documentCreated && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold w-28 shrink-0" style={{ color: 'oklch(0.65 0.22 295)' }}>Document créé</span>
                          <span className="text-xs" style={{ color: 'oklch(0.75 0.008 255)' }}>{step.erpImpact.documentCreated}</span>
                        </div>
                      )}
                      {step.erpImpact.documentStatus && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold w-28 shrink-0" style={{ color: 'oklch(0.78 0.16 70)' }}>Statut</span>
                          <span className="text-xs" style={{ color: 'oklch(0.75 0.008 255)' }}>{step.erpImpact.documentStatus}</span>
                        </div>
                      )}
                      {step.erpImpact.stockChange && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold w-28 shrink-0" style={{ color: 'oklch(0.72 0.16 162)' }}>Stock</span>
                          <span className="text-xs font-mono" style={{ color: 'oklch(0.72 0.14 162)' }}>{step.erpImpact.stockChange}</span>
                        </div>
                      )}
                      {step.erpImpact.accountingEntry && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold w-28 shrink-0" style={{ color: 'oklch(0.78 0.16 70)' }}>Écriture FI</span>
                          <span className="text-xs font-mono" style={{ color: 'oklch(0.80 0.12 70)' }}>{step.erpImpact.accountingEntry}</span>
                        </div>
                      )}
                      {step.erpImpact.note && (
                        <div className="mt-2 pt-2" style={{ borderTop: '1px solid oklch(0.60 0.20 255 / 20%)' }}>
                          <span className="text-xs italic" style={{ color: 'oklch(0.55 0.010 255)' }}>{step.erpImpact.note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Error */}
                {stepErrors[currentStep] && (
                  <div className="mb-4 p-3 rounded-lg flex items-start gap-2"
                    style={{ background: 'oklch(0.65 0.22 25 / 10%)', border: '1px solid oklch(0.65 0.22 25 / 30%)' }}>
                    <AlertCircle size={14} style={{ color: 'oklch(0.65 0.22 25)', flexShrink: 0, marginTop: '2px' }} />
                    <span className="text-xs" style={{ color: 'oklch(0.75 0.18 25)' }}>{stepErrors[currentStep]}</span>
                  </div>
                )}

                {/* Hint */}
                {showHint && (
                  <div className="mb-4 p-3 rounded-lg" style={{ background: 'oklch(0.78 0.16 70 / 10%)', border: '1px solid oklch(0.78 0.16 70 / 30%)' }}>
                    <div className="flex items-start gap-2">
                      <BookOpen size={14} style={{ color: 'oklch(0.78 0.16 70)', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.78 0.14 70)' }}>Indice</div>
                        <p className="text-xs" style={{ color: 'oklch(0.70 0.010 255)', lineHeight: '1.5' }}>
                          {step.fields?.[0]?.hint || 'Consultez les slides du module pour trouver la bonne réponse.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button onClick={handlePrevStep} disabled={currentStep === 0}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs transition-all disabled:opacity-30"
                      style={{ background: 'oklch(0.18 0.018 255)', color: 'oklch(0.65 0.010 255)' }}>
                      <ChevronLeft size={14} /> Précédent
                    </button>
                    <button onClick={() => { setShowHint(!showHint); if (!showHint) setHintsUsed(prev => new Set(prev).add(currentStep)); }}
                      className="px-3 py-2 rounded-lg text-xs transition-all"
                      style={{ background: 'oklch(0.78 0.16 70 / 15%)', color: 'oklch(0.78 0.14 70)' }}>
                      {showHint ? 'Masquer' : 'Indice'}
                    </button>
                  </div>
                  <button onClick={handleNextStep}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold"
                    style={{ background: mod.color, color: 'white' }}>
                    {stepFeedback && !stepFeedback.correct ? 'Réessayer' : currentStep === totalSteps - 1 ? 'Terminer' : 'Étape suivante'}
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Finished */}
        {finished && (
          <div className="rounded-xl p-8 text-center" style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${mod.color}40` }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: `${mod.color}20`, color: mod.color }}>
              <Award size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
              Scénario complété !
            </h2>
            <p className="text-sm mb-6" style={{ color: 'oklch(0.55 0.010 255)' }}>
              Vous avez complété <strong style={{ color: mod.color }}>{scenario.code}</strong> dans {SYSTEM_LABELS[selectedSystem]}
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              {[
                { label: 'Score final', value: `${score}%`, color: mod.color },
                { label: 'Étapes', value: `${totalSteps}`, color: 'oklch(0.85 0.005 255)' },
                { label: 'Temps', value: formatTime(elapsedTime), color: 'oklch(0.85 0.005 255)' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: i === 0 ? `${mod.color}15` : 'oklch(0.18 0.018 255)', border: `1px solid ${i === 0 ? mod.color + '30' : 'oklch(1 0 0 / 6%)'}` }}>
                  <div className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color: item.color }}>{item.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'oklch(0.50 0.010 255)' }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'oklch(0.18 0.018 255)', color: 'oklch(0.65 0.010 255)' }}>
                <RotateCcw size={14} /> Recommencer
              </button>
              <button onClick={() => navigate('/simulator')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: mod.color, color: 'white' }}>
                Autres scénarios <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
