/**
 * ScenarioPageFull v3.0 — ERP Integrated Business Simulator
 * Phase 3+4+6+7: 3-ERP comparative UI, role-play context, attempt history,
 * rich post-scenario result screen, AI QA feedback, exam mode
 */
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { ERP_MODULES, TransactionField, TransactionStep } from '@/lib/erpData';
import { trpc } from '@/lib/trpc';
import {
  ChevronLeft, ChevronRight, Award, RotateCcw, BookOpen, Play,
  AlertCircle, CheckCircle2, Clock, Target, Lightbulb, TrendingUp,
  BarChart3, Zap, Shield, Eye, EyeOff, X, Info, ArrowRight,
  AlertTriangle, Star, Brain, Repeat
} from 'lucide-react';

type StepStatus = 'pending' | 'active' | 'correct' | 'incorrect';
type SystemKey = 'sap' | 'dynamics' | 'odoo';

const SYSTEM_CONFIG: Record<SystemKey, { label: string; shortLabel: string; color: string; hexColor: string; bg: string; border: string; accent: string; tagline: string; market: string }> = {
  sap: {
    label: 'SAP S/4HANA',
    shortLabel: 'SAP',
    color: 'oklch(0.72 0.16 240)',
    hexColor: '#5BB8FF',
    bg: 'oklch(0.13 0.04 240 / 80%)',
    border: 'oklch(0.40 0.18 240 / 30%)',
    accent: 'oklch(0.40 0.18 240)',
    tagline: 'Leader mondial · grandes entreprises',
    market: '22% marché',
  },
  dynamics: {
    label: 'Microsoft Dynamics 365',
    shortLabel: 'D365',
    color: 'oklch(0.72 0.16 255)',
    hexColor: '#5EA8FF',
    bg: 'oklch(0.13 0.05 255 / 80%)',
    border: 'oklch(0.45 0.20 255 / 30%)',
    accent: 'oklch(0.45 0.20 255)',
    tagline: 'Suite Microsoft · PME et mid-market',
    market: '18% marché',
  },
  odoo: {
    label: 'Odoo ERP',
    shortLabel: 'Odoo',
    color: 'oklch(0.72 0.16 320)',
    hexColor: '#C084FC',
    bg: 'oklch(0.14 0.06 320 / 80%)',
    border: 'oklch(0.45 0.18 320 / 30%)',
    accent: 'oklch(0.45 0.18 320)',
    tagline: 'Open source · start-ups et PME',
    market: 'Open source',
  },
};

// Brand logo SVGs — consistent with dashboard identity
const SysLogo = ({ sys }: { sys: SystemKey }) => {
  if (sys === 'sap') return (
    <svg viewBox="0 0 36 36" width="24" height="24" fill="none">
      <rect width="36" height="36" rx="6" fill="#0070F2"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
        fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="11" fill="white" letterSpacing="-0.5">SAP</text>
    </svg>
  );
  if (sys === 'dynamics') return (
    <svg viewBox="0 0 36 36" width="24" height="24" fill="none">
      <rect width="36" height="36" rx="6" fill="#0078D4"/>
      <rect x="7" y="7" width="9" height="9" rx="1" fill="#F25022"/>
      <rect x="20" y="7" width="9" height="9" rx="1" fill="#7FBA00"/>
      <rect x="7" y="20" width="9" height="9" rx="1" fill="#00A4EF"/>
      <rect x="20" y="20" width="9" height="9" rx="1" fill="#FFB900"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 36 36" width="24" height="24" fill="none">
      <rect width="36" height="36" rx="6" fill="#714B67"/>
      <circle cx="18" cy="11" r="4" fill="white" opacity="0.95"/>
      <circle cx="10" cy="23" r="4" fill="white" opacity="0.75"/>
      <circle cx="26" cy="23" r="4" fill="white" opacity="0.75"/>
    </svg>
  );
};

function getSystemCode(step: TransactionStep, sys: SystemKey): string {
  if (sys === 'sap') return step.sapCode || step.code || '';
  if (sys === 'dynamics') return step.dynamicsName || step.name || '';
  if (sys === 'odoo') return step.odooName || step.name || '';
  return '';
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function generateQAFeedback(
  score: number,
  hintsUsed: number,
  wrongAttempts: number,
  moduleId: string,
  lang: string
): string {
  const isFr = lang === 'fr';
  const moduleNames: Record<string, string> = {
    'erp-arch': isFr ? 'Architecture ERP' : 'ERP Architecture',
    'mm': isFr ? 'Materials Management' : 'Materials Management',
    'sd': isFr ? 'Sales & Distribution' : 'Sales & Distribution',
    'fi': isFr ? 'Finance' : 'Finance',
    'erp-sim': isFr ? 'Simulation Intégrée' : 'Integrated Simulation',
  };
  const modName = moduleNames[moduleId] || moduleId.toUpperCase();

  if (score >= 90 && hintsUsed === 0) {
    return isFr
      ? `Excellente maîtrise du module ${modName}. L'étudiant a complété le scénario sans aide et avec très peu d'erreurs. Prêt pour le mode examen.`
      : `Excellent mastery of ${modName}. Student completed the scenario without hints and with minimal errors. Ready for exam mode.`;
  }
  if (score >= 80) {
    return isFr
      ? `Bonne compréhension du processus ${modName}. ${hintsUsed > 0 ? `${hintsUsed} indice(s) utilisé(s) — réviser les étapes correspondantes.` : 'Aucun indice utilisé.'} ${wrongAttempts > 2 ? 'Quelques hésitations sur les valeurs exactes — revoir les données de référence.' : ''}`
      : `Good understanding of ${modName} process. ${hintsUsed > 0 ? `${hintsUsed} hint(s) used — review corresponding steps.` : 'No hints used.'} ${wrongAttempts > 2 ? 'Some hesitation on exact values — review reference data.' : ''}`;
  }
  if (score >= 60) {
    return isFr
      ? `Compréhension partielle du module ${modName}. ${wrongAttempts} erreur(s) de saisie détectée(s). Recommandation : revoir les slides du module, puis retenter en mode guidé avant de passer en mode examen.`
      : `Partial understanding of ${modName}. ${wrongAttempts} input error(s) detected. Recommendation: review module slides, then retry in guided mode before attempting exam mode.`;
  }
  return isFr
    ? `Difficultés significatives sur le module ${modName}. Score de ${score}% avec ${wrongAttempts} erreur(s) et ${hintsUsed} indice(s). Recommandation : revoir l'ensemble des slides du module et pratiquer les étapes individuellement avant de retenter le scénario complet.`
    : `Significant difficulties on ${modName}. Score of ${score}% with ${wrongAttempts} error(s) and ${hintsUsed} hint(s). Recommendation: review all module slides and practice individual steps before retrying the full scenario.`;
}

function classifyLearner(score: number, hintsUsed: number, wrongAttempts: number, lang: string): { label: string; color: string; icon: string } {
  const isFr = lang === 'fr';
  if (score >= 90 && hintsUsed === 0 && wrongAttempts <= 1) {
    return { label: isFr ? 'Exécuteur précis' : 'Precise Executor', color: 'oklch(0.72 0.14 162)', icon: '🎯' };
  }
  if (score >= 80 && hintsUsed <= 1) {
    return { label: isFr ? 'Apprenant fiable' : 'Reliable Learner', color: 'oklch(0.72 0.16 255)', icon: '✅' };
  }
  if (score >= 70 && wrongAttempts > 3) {
    return { label: isFr ? 'Rapide mais imprécis' : 'Fast but Imprecise', color: 'oklch(0.78 0.14 70)', icon: '⚡' };
  }
  if (score >= 60 && hintsUsed >= 2) {
    return { label: isFr ? 'Guidé — en progression' : 'Guided — Progressing', color: 'oklch(0.72 0.14 200)', icon: '📈' };
  }
  if (score < 60) {
    return { label: isFr ? 'Nécessite du soutien' : 'Needs Support', color: 'oklch(0.65 0.22 25)', icon: '🆘' };
  }
  return { label: isFr ? 'En développement' : 'Developing', color: 'oklch(0.65 0.010 255)', icon: '🔄' };
}

// ─── Rich Post-Scenario Result Screen ────────────────────────────────────────
interface ResultScreenProps {
  score: number;
  totalSteps: number;
  stepStatuses: StepStatus[];
  hintsUsed: Set<number>;
  wrongAttempts: number;
  elapsedTime: number;
  examMode: boolean;
  scenario: { code: string; title: string; difficulty: string; steps: TransactionStep[] };
  mod: { color: string; code: string; id: string };
  selectedSystem: SystemKey;
  attemptNumber: number;
  onRetry: () => void;
  onRetryExam: () => void;
  onBack: () => void;
  lang: string;
}

function ResultScreen({
  score, totalSteps, stepStatuses, hintsUsed, wrongAttempts, elapsedTime,
  examMode, scenario, mod, selectedSystem, attemptNumber, onRetry, onRetryExam, onBack, lang
}: ResultScreenProps) {
  const isFr = lang === 'fr';
  const sys = SYSTEM_CONFIG[selectedSystem];
  const correctCount = stepStatuses.filter(s => s === 'correct').length;
  const qaFeedback = generateQAFeedback(score, hintsUsed.size, wrongAttempts, mod.id, lang);
  const learnerProfile = classifyLearner(score, hintsUsed.size, wrongAttempts, lang);

  const scoreColor = score >= 80 ? 'oklch(0.72 0.14 162)' : score >= 60 ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.22 25)';
  const scoreLabel = score >= 80 ? (isFr ? 'Excellent' : 'Excellent') : score >= 60 ? (isFr ? 'Acceptable' : 'Acceptable') : (isFr ? 'À améliorer' : 'Needs Work');

  return (
    <div className="space-y-6">
      {/* Hero result card */}
      <div className="rounded-2xl p-8 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, oklch(0.12 0.018 255), oklch(0.16 0.022 255))`, border: `1px solid ${mod.color}30` }}>
        {/* Background glow */}
        <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 50% 0%, ${mod.color}, transparent 70%)` }} />
        <div className="relative">
          {/* Score circle */}
          <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto mb-4 relative"
            style={{ background: `${scoreColor}15`, border: `3px solid ${scoreColor}40` }}>
            <div className="text-4xl font-black" style={{ fontFamily: 'Space Grotesk', color: scoreColor }}>{score}</div>
            <div className="text-xs font-semibold" style={{ color: scoreColor }}>/ 100</div>
          </div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: scoreColor }}>{scoreLabel}</div>
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
            {isFr ? 'Scénario terminé' : 'Scenario Complete'}
          </h2>
          <p className="text-sm mb-1" style={{ color: 'oklch(0.55 0.010 255)' }}>
            {scenario.code} · {sys.label} · {isFr ? `Tentative #${attemptNumber}` : `Attempt #${attemptNumber}`}
          </p>
          {examMode && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1"
              style={{ background: 'oklch(0.65 0.22 25 / 15%)', color: 'oklch(0.65 0.22 25)', border: '1px solid oklch(0.65 0.22 25 / 30%)' }}>
              <Shield size={10} /> {isFr ? 'Mode Examen' : 'Exam Mode'}
            </span>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <CheckCircle2 size={18} />, label: isFr ? 'Étapes réussies' : 'Steps Passed', value: `${correctCount}/${totalSteps}`, color: 'oklch(0.72 0.14 162)' },
          { icon: <Clock size={18} />, label: isFr ? 'Temps total' : 'Total Time', value: formatTime(elapsedTime), color: 'oklch(0.72 0.16 255)' },
          { icon: <Lightbulb size={18} />, label: isFr ? 'Indices utilisés' : 'Hints Used', value: String(hintsUsed.size), color: 'oklch(0.78 0.14 70)' },
          { icon: <AlertCircle size={18} />, label: isFr ? 'Erreurs' : 'Errors', value: String(wrongAttempts), color: wrongAttempts > 3 ? 'oklch(0.65 0.22 25)' : 'oklch(0.65 0.010 255)' },
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-xl text-center" style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
            <div className="flex justify-center mb-2" style={{ color: item.color }}>{item.icon}</div>
            <div className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk', color: item.color }}>{item.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'oklch(0.45 0.010 255)' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Step-by-step breakdown */}
      <div className="rounded-xl p-5" style={{ background: 'oklch(0.13 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'oklch(0.75 0.008 255)' }}>
          <BarChart3 size={16} style={{ color: mod.color }} />
          {isFr ? 'Détail par étape' : 'Step-by-Step Breakdown'}
        </h3>
        <div className="space-y-2">
          {scenario.steps.map((step, i) => {
            const status = stepStatuses[i];
            const hinted = hintsUsed.has(i);
            const isOk = status === 'correct';
            return (
              <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: isOk ? 'oklch(0.72 0.14 162 / 6%)' : 'oklch(0.65 0.22 25 / 6%)', border: `1px solid ${isOk ? 'oklch(0.72 0.14 162 / 20%)' : 'oklch(0.65 0.22 25 / 20%)'}` }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ background: isOk ? 'oklch(0.72 0.14 162 / 20%)' : 'oklch(0.65 0.22 25 / 20%)', color: isOk ? 'oklch(0.72 0.14 162)' : 'oklch(0.65 0.22 25)' }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: 'oklch(0.80 0.008 255)' }}>{step.name}</div>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>
                    {step.sapCode && `SAP: ${step.sapCode}`}
                    {hinted && <span className="ml-2" style={{ color: 'oklch(0.78 0.14 70)' }}>💡 {isFr ? 'Indice utilisé' : 'Hint used'}</span>}
                  </div>
                </div>
                <div className="shrink-0">
                  {isOk
                    ? <CheckCircle2 size={16} style={{ color: 'oklch(0.72 0.14 162)' }} />
                    : <AlertCircle size={16} style={{ color: 'oklch(0.65 0.22 25)' }} />
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learner profile */}
      <div className="rounded-xl p-5" style={{ background: 'oklch(0.13 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'oklch(0.75 0.008 255)' }}>
          <Brain size={16} style={{ color: mod.color }} />
          {isFr ? 'Profil d\'apprentissage' : 'Learning Profile'}
        </h3>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{learnerProfile.icon}</span>
          <span className="text-sm font-semibold" style={{ color: learnerProfile.color }}>{learnerProfile.label}</span>
        </div>
        <div className="p-4 rounded-lg text-sm leading-relaxed" style={{ background: 'oklch(0.11 0.015 255)', color: 'oklch(0.68 0.008 255)', border: '1px solid oklch(1 0 0 / 5%)' }}>
          <div className="flex items-start gap-2">
            <Star size={14} style={{ color: mod.color, flexShrink: 0, marginTop: '2px' }} />
            <span>{qaFeedback}</span>
          </div>
        </div>
      </div>

      {/* 3-ERP overview — one key idea: same steps, 3 names */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'oklch(0.13 0.018 255)', border: '1px solid oklch(1 0 0 / 7%)' }}>
        <div className="px-4 py-2 flex items-center justify-between" style={{ borderBottom: '1px solid oklch(1 0 0 / 6%)' }}>
          <span className="text-xs font-semibold" style={{ color: 'oklch(0.75 0.008 255)' }}>
            {isFr ? 'Même processus — 3 systèmes' : 'Same process — 3 systems'}
          </span>
          <span className="text-xs" style={{ color: 'oklch(0.38 0.010 255)' }}>
            {isFr ? 'Seuls les noms changent' : 'Only the names change'}
          </span>
        </div>
        <div className="grid grid-cols-3">
          {(['sap', 'dynamics', 'odoo'] as SystemKey[]).map((sys, idx) => {
            const cfg = SYSTEM_CONFIG[sys];
            const codes = scenario.steps.map(s => getSystemCode(s, sys)).filter(Boolean);
            return (
              <div key={sys} className="px-3 py-2.5" style={{ borderRight: idx < 2 ? '1px solid oklch(1 0 0 / 6%)' : 'none' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <SysLogo sys={sys} />
                  <span className="text-xs font-bold" style={{ color: cfg.hexColor }}>{cfg.shortLabel}</span>
                </div>
                <div className="space-y-0.5">
                  {codes.slice(0, 3).map((code, i) => (
                    <div key={i} className="text-xs font-mono" style={{ color: 'oklch(0.58 0.008 255)' }}>{code}</div>
                  ))}
                  {codes.length > 3 && <div className="text-xs" style={{ color: 'oklch(0.35 0.008 255)' }}>+{codes.length - 3}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl p-5" style={{ background: 'oklch(0.13 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'oklch(0.75 0.008 255)' }}>
          <TrendingUp size={16} style={{ color: mod.color }} />
          {isFr ? 'Recommandations' : 'Recommendations'}
        </h3>
        <div className="space-y-2">
          {score < 70 && (
            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'oklch(0.65 0.22 25 / 8%)', border: '1px solid oklch(0.65 0.22 25 / 20%)' }}>
              <AlertTriangle size={14} style={{ color: 'oklch(0.65 0.22 25)', flexShrink: 0, marginTop: '2px' }} />
              <span className="text-xs" style={{ color: 'oklch(0.70 0.010 255)' }}>
                {isFr ? 'Revoir les slides du module avant de retenter.' : 'Review module slides before retrying.'}
              </span>
            </div>
          )}
          {score >= 70 && score < 90 && !examMode && (
            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'oklch(0.78 0.14 70 / 8%)', border: '1px solid oklch(0.78 0.14 70 / 20%)' }}>
              <Repeat size={14} style={{ color: 'oklch(0.78 0.14 70)', flexShrink: 0, marginTop: '2px' }} />
              <span className="text-xs" style={{ color: 'oklch(0.70 0.010 255)' }}>
                {isFr ? 'Bon score ! Essayez maintenant en mode examen pour valider votre maîtrise.' : 'Good score! Try exam mode now to validate your mastery.'}
              </span>
            </div>
          )}
          {score >= 90 && (
            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'oklch(0.72 0.14 162 / 8%)', border: '1px solid oklch(0.72 0.14 162 / 20%)' }}>
              <Star size={14} style={{ color: 'oklch(0.72 0.14 162)', flexShrink: 0, marginTop: '2px' }} />
              <span className="text-xs" style={{ color: 'oklch(0.70 0.010 255)' }}>
                {isFr ? 'Excellent ! Passez au scénario suivant ou testez un autre système ERP.' : 'Excellent! Move to the next scenario or test another ERP system.'}
              </span>
            </div>
          )}
          {hintsUsed.size > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'oklch(0.72 0.16 255 / 8%)', border: '1px solid oklch(0.72 0.16 255 / 20%)' }}>
              <BookOpen size={14} style={{ color: 'oklch(0.72 0.16 255)', flexShrink: 0, marginTop: '2px' }} />
              <span className="text-xs" style={{ color: 'oklch(0.70 0.010 255)' }}>
                {isFr ? `${hintsUsed.size} indice(s) utilisé(s). Mémorisez ces étapes pour le mode examen.` : `${hintsUsed.size} hint(s) used. Memorize these steps for exam mode.`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 pb-4">
        <button onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'oklch(0.18 0.018 255)', color: 'oklch(0.65 0.010 255)' }}>
          <RotateCcw size={14} /> {isFr ? 'Retenter (guidé)' : 'Retry (Guided)'}
        </button>
        {score >= 60 && (
          <button onClick={onRetryExam}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'oklch(0.65 0.22 25 / 15%)', color: 'oklch(0.65 0.22 25)', border: '1px solid oklch(0.65 0.22 25 / 30%)' }}>
            <Shield size={14} /> {isFr ? 'Mode examen' : 'Exam Mode'}
          </button>
        )}
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ml-auto"
          style={{ background: mod.color, color: 'white' }}>
          {isFr ? 'Autres scénarios' : 'Other Scenarios'} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ScenarioPageFull() {
  const params = useParams<{ scenarioId: string }>();
  const scenarioId = params.scenarioId || '';
  const { user } = useAuth();
  const { lang } = useLang();
  const isFr = lang === 'fr';

  // Find module + scenario
  const result = (() => {
    for (const mod of ERP_MODULES) {
      const sc = mod.scenarios.find((s: { id: string }) => s.id === scenarioId);
      if (sc) return { module: mod, scenario: sc };
    }
    return null;
  })();

  const submitAttempt = trpc.attempts.submit.useMutation();
  const { data: myHistory } = trpc.attempts.myHistory.useQuery();

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
  const [selectedSystem, setSelectedSystem] = useState<SystemKey>('sap');
  const [showHint, setShowHint] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [stepFeedback, setStepFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [stepBreakdown, setStepBreakdown] = useState<Array<{ stepId: string; correct: boolean; hintsUsed: boolean; wrongAttempts: number }>>([]);

  const mod = result?.module;
  const scenario = result?.scenario;

  // Count previous attempts for this scenario
  const attemptNumber = (myHistory?.filter((a: { scenarioId: string }) => a.scenarioId === scenarioId).length ?? 0) + 1;

  useEffect(() => {
    if (scenario) {
      setStepStatuses(scenario!.steps.map(() => 'pending') as StepStatus[]);
      setStepBreakdown(scenario!.steps.map((s: TransactionStep) => ({ stepId: s.id, correct: false, hintsUsed: false, wrongAttempts: 0 })));
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
          {isFr ? 'Scénario introuvable.' : 'Scenario not found.'}
        </div>
      </DashboardLayout>
    );
  }

  const totalSteps = scenario.steps.length;
  const step: TransactionStep = scenario.steps[currentStep];
  const completedCount = stepStatuses.filter(s => s === 'correct').length;
  const sys = SYSTEM_CONFIG[selectedSystem];

  function handleInputChange(stepIdx: number, fieldId: string, value: string) {
    setStepInputs(prev => ({ ...prev, [stepIdx]: { ...(prev[stepIdx] || {}), [fieldId]: value } }));
    if (stepErrors[stepIdx]) setStepErrors(prev => ({ ...prev, [stepIdx]: '' }));
  }

  function validateStep(): boolean {
    const inputs = stepInputs[currentStep] || {};
    for (const field of step.fields) {
      if (field.required && !inputs[field.id]?.trim()) {
        setStepErrors(prev => ({ ...prev, [currentStep]: isFr ? `Le champ "${field.label}" est requis.` : `Field "${field.label}" is required.` }));
        return false;
      }
      if (field.correctValue && inputs[field.id]?.trim().toLowerCase() !== field.correctValue.toLowerCase()) {
        return false;
      }
    }
    return true;
  }

  function handleNextStep() {
    if (stepFeedback && !stepFeedback.correct) {
      setStepFeedback(null);
      setShowHint(false);
      return;
    }
    const isCorrect = validateStep();
    if (!isCorrect) {
      const newWrong = wrongAttempts + 1;
      setWrongAttempts(newWrong);
      setStepBreakdown(prev => prev.map((b, i) => i === currentStep ? { ...b, wrongAttempts: b.wrongAttempts + 1 } : b));
      if (!examMode) {
        setStepFeedback({ correct: false, message: step.errorMessage || (isFr ? 'Valeur incorrecte. Vérifiez et réessayez.' : 'Incorrect value. Check and retry.') });
      }
      return;
    }
    // Correct
    setStepBreakdown(prev => prev.map((b, i) => i === currentStep ? { ...b, correct: true, hintsUsed: hintsUsed.has(currentStep) } : b));
    const newStatuses = [...stepStatuses];
    newStatuses[currentStep] = 'correct';
    setStepStatuses(newStatuses);
    setStepFeedback({ correct: true, message: step.validationMessage || (isFr ? '✓ Étape validée !' : '✓ Step validated!') });

    if (currentStep === totalSteps - 1) {
      // Finish
      setTimeout(() => finishScenario(newStatuses), 800);
    } else {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setStepFeedback(null);
        setShowHint(false);
      }, 600);
    }
  }

  function finishScenario(statuses: StepStatus[]) {
    setTimerActive(false);
    const correctSteps = statuses.filter(s => s === 'correct').length;
    const baseScore = Math.round((correctSteps / totalSteps) * 100);
    const hintPenalty = hintsUsed.size * 5;
    const errorPenalty = Math.min(wrongAttempts * 2, 20);
    const finalScore = Math.max(0, baseScore - hintPenalty - errorPenalty);
    setScore(finalScore);
    setFinished(true);

    // Submit to backend
    submitAttempt.mutate({
      scenarioId: scenario!.id,
      moduleId: mod!.id,
      score: finalScore,
      hintsUsed: hintsUsed.size,
      wrongAttempts,
      examMode,
      durationSeconds: elapsedTime,
      stepBreakdown: JSON.stringify(stepBreakdown),
    });
  }

  function handleReset(withExamMode = false) {
    setStarted(false);
    setFinished(false);
    setCurrentStep(0);
    setStepStatuses(scenario!.steps.map(() => 'pending') as StepStatus[]);
    setStepInputs({});
    setStepErrors({});
    setStepFeedback(null);
    setHintsUsed(new Set());
    setWrongAttempts(0);
    setElapsedTime(0);
    setTimerActive(false);
    setShowHint(false);
    setExamMode(withExamMode);
    setStepBreakdown(scenario!.steps.map((s: TransactionStep) => ({ stepId: s.id, correct: false, hintsUsed: false, wrongAttempts: 0 })));
  }

  const difficultyColor: Record<string, string> = {
    'Débutant': 'oklch(0.72 0.14 162)',
    'Intermédiaire': 'oklch(0.78 0.14 70)',
    'Avancé': 'oklch(0.65 0.22 25)',
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>
          <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/simulator')}>
            {isFr ? 'Simulateur' : 'Simulator'}
          </span>
          <ChevronRight size={12} />
          <span style={{ color: mod.color }}>{scenario.code}</span>
          {attemptNumber > 1 && (
            <>
              <ChevronRight size={12} />
              <span style={{ color: 'oklch(0.78 0.14 70)' }}>
                {isFr ? `Tentative #${attemptNumber}` : `Attempt #${attemptNumber}`}
              </span>
            </>
          )}
        </div>

        {/* Finished → Rich Result Screen */}
        {finished && (
          <ResultScreen
            score={score}
            totalSteps={totalSteps}
            stepStatuses={stepStatuses}
            hintsUsed={hintsUsed}
            wrongAttempts={wrongAttempts}
            elapsedTime={elapsedTime}
            examMode={examMode}
            scenario={scenario}
            mod={mod}
            selectedSystem={selectedSystem}
            attemptNumber={attemptNumber}
            onRetry={() => handleReset(false)}
            onRetryExam={() => handleReset(true)}
            onBack={() => navigate('/simulator')}
            lang={lang}
          />
        )}

        {/* Start screen */}
        {!started && !finished && (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'oklch(0.13 0.018 255)', border: `1px solid ${mod.color}30` }}>
            {/* Header band */}
            <div className="px-6 py-4 flex items-center gap-3" style={{ background: `${mod.color}12`, borderBottom: `1px solid ${mod.color}20` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${mod.color}20`, color: mod.color }}>
                <Target size={20} />
              </div>
              <div>
                <div className="text-xs font-mono" style={{ color: mod.color }}>{mod.code} · {scenario.code}</div>
                <div className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>{scenario.title}</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${difficultyColor[scenario.difficulty] || mod.color}15`, color: difficultyColor[scenario.difficulty] || mod.color, border: `1px solid ${difficultyColor[scenario.difficulty] || mod.color}30` }}>
                  {scenario.difficulty}
                </span>
                <span className="text-xs flex items-center gap-1" style={{ color: 'oklch(0.50 0.010 255)' }}>
                  <Clock size={12} /> {scenario.duration}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Role-play context */}
              <div className="p-4 rounded-xl" style={{ background: 'oklch(0.60 0.20 255 / 6%)', border: '1px solid oklch(0.60 0.20 255 / 15%)' }}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl shrink-0">🧑‍💼</div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'oklch(0.72 0.16 255)' }}>
                      {isFr ? 'Contexte professionnel' : 'Professional Context'}
                    </div>
                    <p className="text-sm" style={{ color: 'oklch(0.72 0.008 255)', lineHeight: '1.6' }}>
                      {isFr
                        ? `Vous êtes analyste ERP junior chez Concordia Industries. Votre mission : exécuter le scénario ${scenario.code} dans le système ${selectedSystem === 'sap' ? 'SAP S/4HANA' : selectedSystem === 'dynamics' ? 'Microsoft Dynamics 365' : 'Odoo ERP'} en respectant les procédures standard de l'entreprise.`
                        : `You are a junior ERP analyst at Concordia Industries. Your mission: execute scenario ${scenario.code} in ${selectedSystem === 'sap' ? 'SAP S/4HANA' : selectedSystem === 'dynamics' ? 'Microsoft Dynamics 365' : 'Odoo ERP'} following standard company procedures.`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Learning objective */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'oklch(0.45 0.010 255)' }}>
                  {isFr ? 'Objectif pédagogique' : 'Learning Objective'}
                </div>
                <p className="text-sm" style={{ color: 'oklch(0.68 0.008 255)', lineHeight: '1.6' }}>{scenario.learningObjective}</p>
              </div>

              {/* Steps overview */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'oklch(0.45 0.010 255)' }}>
                  {isFr ? `${totalSteps} étapes à compléter` : `${totalSteps} steps to complete`}
                </div>
                <div className="space-y-2">
                  {scenario.steps.map((s: TransactionStep, i: number) => (
                    <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(1 0 0 / 5%)' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                        style={{ background: `${mod.color}20`, color: mod.color }}>{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium" style={{ color: 'oklch(0.78 0.008 255)' }}>{s.name}</div>
                        <div className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>
                          SAP: {s.sapCode || s.code}
                          {s.dynamicsName && ` · D365: ${s.dynamicsName}`}
                          {s.odooName && ` · Odoo: ${s.odooName}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ERP system selector */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'oklch(0.45 0.010 255)' }}>
                  {isFr ? 'Choisir le système ERP' : 'Choose ERP System'}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(['sap', 'dynamics', 'odoo'] as SystemKey[]).map(s => {
                    const cfg = SYSTEM_CONFIG[s];
                    return (
                      <button key={s} onClick={() => setSelectedSystem(s)}
                        className="p-3 rounded-xl text-left transition-all"
                        style={{
                          background: selectedSystem === s ? cfg.bg : 'oklch(0.11 0.015 255)',
                          border: `2px solid ${selectedSystem === s ? cfg.border : 'oklch(1 0 0 / 6%)'}`,
                        }}>
                        <div className="text-xs font-bold mb-0.5" style={{ color: selectedSystem === s ? cfg.color : 'oklch(0.55 0.010 255)' }}>
                          {cfg.label}
                        </div>
                        <div className="text-xs font-mono" style={{ color: 'oklch(0.40 0.010 255)' }}>
                          {s === 'sap' ? scenario.steps[0]?.sapCode : s === 'dynamics' ? scenario.steps[0]?.dynamicsName : scenario.steps[0]?.odooName}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Exam mode toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'oklch(0.11 0.015 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2" style={{ color: 'oklch(0.80 0.008 255)' }}>
                    <Shield size={14} style={{ color: 'oklch(0.65 0.22 25)' }} />
                    {isFr ? 'Mode examen' : 'Exam Mode'}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'oklch(0.45 0.010 255)' }}>
                    {isFr ? 'Pas de feedback immédiat, pas d\'indices' : 'No immediate feedback, no hints'}
                  </div>
                </div>
                <button onClick={() => setExamMode(!examMode)}
                  className="w-12 h-6 rounded-full transition-all relative"
                  style={{ background: examMode ? 'oklch(0.65 0.22 25)' : 'oklch(0.25 0.015 255)' }}>
                  <div className="w-5 h-5 rounded-full absolute top-0.5 transition-all"
                    style={{ left: examMode ? '26px' : '2px', background: 'white' }} />
                </button>
              </div>

              {/* Previous attempts */}
              {attemptNumber > 1 && myHistory && (
                <div className="p-4 rounded-xl" style={{ background: 'oklch(0.78 0.14 70 / 6%)', border: '1px solid oklch(0.78 0.14 70 / 20%)' }}>
                  <div className="text-xs font-semibold mb-2 flex items-center gap-2" style={{ color: 'oklch(0.78 0.14 70)' }}>
                    <TrendingUp size={12} /> {isFr ? 'Historique de vos tentatives' : 'Your attempt history'}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {myHistory.filter((a: { scenarioId: string }) => a.scenarioId === scenarioId).slice(-5).map((a: { id: number; score: number; examMode: boolean }, i: number) => (
                      <div key={a.id} className="text-xs px-2 py-1 rounded"
                        style={{ background: 'oklch(0.14 0.018 255)', color: a.score >= 80 ? 'oklch(0.72 0.14 162)' : a.score >= 60 ? 'oklch(0.78 0.14 70)' : 'oklch(0.65 0.22 25)' }}>
                        #{i + 1}: {a.score}% {a.examMode ? '🎓' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Start button */}
              <button
                onClick={() => { setStarted(true); setTimerActive(true); }}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-base font-bold transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${mod.color}, ${mod.color}cc)`, color: 'white' }}>
                <Play size={18} fill="white" />
                {isFr ? 'Démarrer la simulation' : 'Start Simulation'}
                {examMode && <span className="text-xs opacity-80">({isFr ? 'Mode examen' : 'Exam mode'})</span>}
              </button>
            </div>
          </div>
        )}

        {/* Active simulation */}
        {started && !finished && (
          <div className="grid lg:grid-cols-4 gap-5">
            {/* Step sidebar */}
            <div className="lg:col-span-1">
              {/* Timer + score */}
              <div className="rounded-xl p-4 mb-3 flex items-center justify-between" style={{ background: 'oklch(0.13 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                <div className="flex items-center gap-2">
                  <Clock size={14} style={{ color: mod.color }} />
                  <span className="text-sm font-mono font-bold" style={{ color: 'oklch(0.85 0.005 255)' }}>{formatTime(elapsedTime)}</span>
                </div>
                {examMode && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'oklch(0.65 0.22 25 / 15%)', color: 'oklch(0.65 0.22 25)' }}>
                    <Shield size={10} className="inline mr-1" />{isFr ? 'Examen' : 'Exam'}
                  </span>
                )}
              </div>

              {/* Steps list */}
              <div className="rounded-xl p-4 space-y-2" style={{ background: 'oklch(0.13 0.018 255)', border: '1px solid oklch(1 0 0 / 6%)' }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'oklch(0.45 0.010 255)' }}>
                  {isFr ? 'Progression' : 'Progress'}
                </div>
                {scenario.steps.map((s: TransactionStep, i: number) => {
                  const status = stepStatuses[i];
                  const isActive = i === currentStep;
                  return (
                    <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg transition-all"
                      style={{
                        background: isActive ? `${mod.color}15` : 'transparent',
                        border: `1px solid ${isActive ? mod.color + '30' : 'transparent'}`,
                      }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                        style={{
                          background: status === 'correct' ? 'oklch(0.72 0.14 162 / 20%)' : isActive ? `${mod.color}25` : 'oklch(0.20 0.018 255)',
                          color: status === 'correct' ? 'oklch(0.72 0.14 162)' : isActive ? mod.color : 'oklch(0.40 0.010 255)',
                        }}>
                        {status === 'correct' ? '✓' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate" style={{ color: isActive ? 'oklch(0.85 0.005 255)' : 'oklch(0.50 0.010 255)' }}>
                          {s.name}
                        </div>
                        <div className="text-xs font-mono" style={{ color: 'oklch(0.35 0.010 255)' }}>
                          {getSystemCode(s, selectedSystem)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="mt-3">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(0.20 0.018 255)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((completedCount / totalSteps) * 100)}%`, background: `linear-gradient(90deg, ${mod.color}, ${mod.color}aa)` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: 'oklch(0.40 0.010 255)' }}>{completedCount}/{totalSteps}</span>
                    <span className="text-xs font-semibold" style={{ color: mod.color }}>{Math.round((completedCount / totalSteps) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main step content */}
            <div className="lg:col-span-3 space-y-4">
              {/* 3-ERP system bar */}
              <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: sys.bg, border: `1px solid ${sys.border}` }}>
                <div className="flex gap-1">
                  {(['sap', 'dynamics', 'odoo'] as SystemKey[]).map(s => (
                    <button key={s} onClick={() => setSelectedSystem(s)}
                      className="text-xs px-2 py-1 rounded font-mono font-bold transition-all"
                      style={{
                        background: selectedSystem === s ? SYSTEM_CONFIG[s].color : 'oklch(0.18 0.018 255)',
                        color: selectedSystem === s ? 'white' : 'oklch(0.45 0.010 255)',
                      }}>
                      {s === 'sap' ? 'SAP' : s === 'dynamics' ? 'D365' : 'Odoo'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-xs font-bold" style={{ color: sys.color }}>{sys.label}</span>
                  {getSystemCode(step, selectedSystem) && (
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'oklch(0.10 0.015 255 / 60%)', color: sys.color }}>
                      {getSystemCode(step, selectedSystem)}
                    </span>
                  )}
                </div>
                <span className="ml-auto text-xs" style={{ color: 'oklch(0.45 0.010 255)' }}>
                  {isFr ? 'Étape' : 'Step'} {currentStep + 1} / {totalSteps}
                </span>
              </div>

              {/* Step form card */}
              <div className="rounded-xl p-5" style={{ background: 'oklch(0.14 0.018 255)', border: `1px solid ${mod.color}25` }}>
                {/* Step header */}
                <div className="mb-4">
                  <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.93 0.005 255)' }}>
                    {step.name}
                  </h2>
                  <p className="text-sm" style={{ color: 'oklch(0.62 0.010 255)', lineHeight: '1.6' }}>{step.objective}</p>
                </div>

                {/* 3-ERP step equivalence — one key idea per step */}
                {(step.sapCode || step.dynamicsName || step.odooName) && (
                  <div className="mb-4 grid grid-cols-3 gap-0 rounded-lg overflow-hidden" style={{ border: '1px solid oklch(1 0 0 / 8%)' }}>
                    {([
                      { sys: 'sap' as SystemKey, value: step.sapCode || step.code },
                      { sys: 'dynamics' as SystemKey, value: step.dynamicsName || step.name },
                      { sys: 'odoo' as SystemKey, value: step.odooName || step.name },
                    ]).map((item, idx) => {
                      const cfg = SYSTEM_CONFIG[item.sys];
                      return (
                        <div key={item.sys} className="px-2.5 py-2" style={{
                          background: cfg.bg,
                          borderRight: idx < 2 ? '1px solid oklch(1 0 0 / 6%)' : 'none'
                        }}>
                          <div className="flex items-center gap-1 mb-0.5">
                            <SysLogo sys={item.sys} />
                            <span className="text-xs font-bold" style={{ color: cfg.hexColor }}>{cfg.shortLabel}</span>
                          </div>
                          <div className="text-xs font-mono" style={{ color: 'oklch(0.65 0.008 255)' }}>{item.value}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

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
                            }}>
                            <option value="">{isFr ? '— Sélectionner —' : '— Select —'}</option>
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
                        {field.hint && !examMode && (
                          <div className="text-xs mt-1" style={{ color: 'oklch(0.45 0.010 255)' }}>💡 {field.hint}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Validation feedback */}
                {stepFeedback && (
                  <div className="mb-4 p-3 rounded-lg" style={{
                    background: stepFeedback.correct ? 'oklch(0.72 0.14 162 / 10%)' : 'oklch(0.65 0.22 25 / 10%)',
                    border: `1px solid ${stepFeedback.correct ? 'oklch(0.72 0.14 162 / 30%)' : 'oklch(0.65 0.22 25 / 30%)'}`
                  }}>
                    <div className="flex items-start gap-2">
                      {stepFeedback.correct
                        ? <CheckCircle2 size={14} style={{ color: 'oklch(0.72 0.14 162)', flexShrink: 0, marginTop: '2px' }} />
                        : <AlertCircle size={14} style={{ color: 'oklch(0.65 0.22 25)', flexShrink: 0, marginTop: '2px' }} />
                      }
                      <p className="text-xs" style={{ color: stepFeedback.correct ? 'oklch(0.72 0.14 162)' : 'oklch(0.65 0.22 25)' }}>
                        {stepFeedback.message}
                      </p>
                    </div>
                  </div>
                )}

                {/* Micro-learning feedback — one sentence after correct step */}
                {stepFeedback?.correct && step.erpImpact?.note && (
                  <div className="mb-3 px-3 py-2 rounded-lg flex items-start gap-2" style={{
                    background: 'oklch(0.72 0.14 162 / 6%)',
                    border: '1px solid oklch(0.72 0.14 162 / 20%)'
                  }}>
                    <Brain size={13} style={{ color: 'oklch(0.72 0.14 162)', flexShrink: 0, marginTop: '2px' }} />
                    <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.65 0.010 255)' }}>
                      {step.erpImpact.note}
                    </p>
                  </div>
                )}

                {/* ERP Impact panel */}
                {step.erpImpact && stepFeedback?.correct && (
                  <div className="mb-4 p-4 rounded-xl" style={{ background: `${mod.color}08`, border: `1px solid ${mod.color}20` }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: mod.color }}>
                      <Zap size={12} /> {isFr ? 'Impact ERP' : 'ERP Impact'}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {step.erpImpact.documentCreated && (
                        <div className="p-2 rounded" style={{ background: 'oklch(0.11 0.015 255)' }}>
                          <div style={{ color: 'oklch(0.45 0.010 255)' }}>{isFr ? 'Document créé' : 'Document Created'}</div>
                          <div className="font-mono font-semibold" style={{ color: 'oklch(0.80 0.008 255)' }}>{step.erpImpact.documentCreated}</div>
                        </div>
                      )}
                      {step.erpImpact.stockChange && (
                        <div className="p-2 rounded" style={{ background: 'oklch(0.11 0.015 255)' }}>
                          <div style={{ color: 'oklch(0.45 0.010 255)' }}>{isFr ? 'Stock' : 'Stock'}</div>
                          <div className="font-mono font-semibold" style={{ color: 'oklch(0.72 0.14 162)' }}>{step.erpImpact.stockChange}</div>
                        </div>
                      )}
                      {step.erpImpact.accountingEntry && (
                        <div className="p-2 rounded col-span-2" style={{ background: 'oklch(0.11 0.015 255)' }}>
                          <div style={{ color: 'oklch(0.45 0.010 255)' }}>{isFr ? 'Écriture comptable' : 'Accounting Entry'}</div>
                          <div className="font-mono font-semibold" style={{ color: 'oklch(0.78 0.14 70)' }}>{step.erpImpact.accountingEntry}</div>
                        </div>
                      )}
                      {step.erpImpact.note && (
                        <div className="p-2 rounded col-span-2" style={{ background: 'oklch(0.11 0.015 255)' }}>
                          <div className="italic" style={{ color: 'oklch(0.55 0.010 255)' }}>{step.erpImpact.note}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Hint */}
                {showHint && !examMode && (
                  <div className="mb-4 p-3 rounded-lg" style={{ background: 'oklch(0.78 0.16 70 / 10%)', border: '1px solid oklch(0.78 0.16 70 / 30%)' }}>
                    <div className="flex items-start gap-2">
                      <Lightbulb size={14} style={{ color: 'oklch(0.78 0.16 70)', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.78 0.14 70)' }}>
                          {isFr ? 'Indice' : 'Hint'} <span className="font-normal opacity-60">(-5 pts)</span>
                        </div>
                        <p className="text-xs" style={{ color: 'oklch(0.70 0.010 255)', lineHeight: '1.5' }}>
                          {step.fields?.[0]?.hint || (isFr ? 'Consultez les slides du module pour trouver la bonne réponse.' : 'Consult the module slides to find the correct answer.')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step error */}
                {stepErrors[currentStep] && (
                  <div className="mb-4 p-3 rounded-lg" style={{ background: 'oklch(0.65 0.22 25 / 8%)', border: '1px solid oklch(0.65 0.22 25 / 25%)' }}>
                    <p className="text-xs" style={{ color: 'oklch(0.65 0.22 25)' }}>{stepErrors[currentStep]}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { if (currentStep > 0) { setCurrentStep(p => p - 1); setStepFeedback(null); setShowHint(false); } }}
                      disabled={currentStep === 0}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs transition-all disabled:opacity-30"
                      style={{ background: 'oklch(0.18 0.018 255)', color: 'oklch(0.65 0.010 255)' }}>
                      <ChevronLeft size={14} /> {isFr ? 'Précédent' : 'Previous'}
                    </button>
                    {!examMode && (
                      <button onClick={() => { setShowHint(!showHint); if (!showHint) setHintsUsed(prev => { const n = new Set(prev); n.add(currentStep); return n; }); }}
                        className="px-3 py-2 rounded-lg text-xs transition-all"
                        style={{ background: 'oklch(0.78 0.16 70 / 15%)', color: 'oklch(0.78 0.14 70)' }}>
                        {showHint ? (isFr ? 'Masquer' : 'Hide') : (isFr ? 'Indice' : 'Hint')}
                      </button>
                    )}
                  </div>
                  <button onClick={handleNextStep}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: mod.color, color: 'white' }}>
                    {stepFeedback && !stepFeedback.correct
                      ? (isFr ? 'Réessayer' : 'Retry')
                      : currentStep === totalSteps - 1
                        ? (isFr ? 'Terminer' : 'Finish')
                        : (isFr ? 'Étape suivante' : 'Next Step')
                    }
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
