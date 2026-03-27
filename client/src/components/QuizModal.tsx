// QuizModal — ERP Integrated Business Simulator
// Quiz de compréhension intégré à la fin des slides de chaque module
// SAP S/4HANA | Microsoft Dynamics 365 | Odoo ERP
import { useState } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { QuizQuestion } from '@/lib/quizData';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy, BookOpen, Zap } from 'lucide-react';

interface QuizModalProps {
  moduleCode: string;
  moduleName: string;
  moduleColor: string;
  questions: QuizQuestion[];
  onClose: () => void;
  onComplete?: (score: number) => void;
}

type AnswerState = 'unanswered' | 'correct' | 'wrong';

export default function QuizModal({
  moduleCode, moduleName, moduleColor, questions, onClose, onComplete
}: QuizModalProps) {
  const { lang } = useLang();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const q = questions[currentQ];
  const questionText = lang === 'en' ? q.questionEn : q.question;
  const opts = lang === 'en' ? q.optionsEn : q.options;
  const explanation = lang === 'en' ? q.explanationEn : q.explanation;

  const score = answers.filter(Boolean).length;
  const pct = Math.round((score / questions.length) * 100);

  const SYSTEM_COLORS: Record<string, string> = {
    sap: 'oklch(0.78 0.14 30)',
    dynamics: 'oklch(0.75 0.14 255)',
    odoo: 'oklch(0.75 0.14 162)',
    general: 'oklch(0.65 0.010 255)',
  };
  const systemColor = SYSTEM_COLORS[q.system || 'general'];

  const handleSelect = (idx: number) => {
    if (answerState !== 'unanswered') return;
    setSelected(idx);
    const isCorrect = idx === q.correctIndex;
    setAnswerState(isCorrect ? 'correct' : 'wrong');
    setAnswers(prev => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setAnswerState('unanswered');
    } else {
      setFinished(true);
      onComplete?.(pct);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswerState('unanswered');
    setAnswers([]);
    setFinished(false);
  };

  const gradeColor = pct >= 80 ? 'oklch(0.72 0.16 162)' : pct >= 60 ? 'oklch(0.78 0.16 70)' : 'oklch(0.65 0.22 25)';
  const gradeLabel = lang === 'fr'
    ? (pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien' : 'À revoir')
    : (pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good' : 'Needs review');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'oklch(0.12 0.018 255)', border: `1px solid ${moduleColor}30` }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid oklch(1 0 0 / 8%)', background: `${moduleColor}10` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${moduleColor}25`, color: moduleColor }}>
              <BookOpen size={16} />
            </div>
            <div>
              <div className="text-xs font-mono font-bold" style={{ color: moduleColor }}>{moduleCode}</div>
              <div className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.88 0.005 255)' }}>
                {lang === 'fr' ? 'Quiz de compréhension' : 'Comprehension Quiz'}
              </div>
            </div>
          </div>
          {!finished && (
            <div className="text-xs font-mono px-2.5 py-1 rounded-full"
              style={{ background: 'oklch(1 0 0 / 6%)', color: 'oklch(0.55 0.010 255)' }}>
              {currentQ + 1} / {questions.length}
            </div>
          )}
        </div>

        {finished ? (
          /* Results screen */
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: `${gradeColor}20`, border: `2px solid ${gradeColor}50` }}>
              <Trophy size={32} style={{ color: gradeColor }} />
            </div>
            <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: gradeColor }}>
              {pct}%
            </div>
            <div className="text-lg font-semibold mb-1" style={{ color: 'oklch(0.88 0.005 255)' }}>{gradeLabel}</div>
            <div className="text-sm mb-6" style={{ color: 'oklch(0.50 0.010 255)' }}>
              {score} / {questions.length} {lang === 'fr' ? 'bonnes réponses' : 'correct answers'}
            </div>

            {/* Score breakdown */}
            <div className="flex gap-2 justify-center mb-6">
              {answers.map((correct, i) => (
                <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: correct ? 'oklch(0.72 0.16 162 / 20%)' : 'oklch(0.65 0.22 25 / 20%)',
                    border: `1px solid ${correct ? 'oklch(0.72 0.16 162 / 40%)' : 'oklch(0.65 0.22 25 / 40%)'}`
                  }}>
                  {correct
                    ? <CheckCircle2 size={14} style={{ color: 'oklch(0.72 0.16 162)' }} />
                    : <XCircle size={14} style={{ color: 'oklch(0.65 0.22 25)' }} />
                  }
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: 'oklch(1 0 0 / 8%)', color: 'oklch(0.70 0.010 255)', border: '1px solid oklch(1 0 0 / 12%)' }}
              >
                <RotateCcw size={14} />
                {lang === 'fr' ? 'Recommencer' : 'Retry'}
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{ background: moduleColor, color: 'oklch(0.10 0.015 255)' }}
              >
                <Zap size={14} />
                {lang === 'fr' ? 'Continuer vers les scénarios' : 'Continue to Scenarios'}
              </button>
            </div>
          </div>
        ) : (
          /* Question screen */
          <div className="p-6">
            {/* Progress bar */}
            <div className="mb-5">
              <div className="h-1.5 rounded-full" style={{ background: 'oklch(1 0 0 / 8%)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${((currentQ) / questions.length) * 100}%`, background: moduleColor }} />
              </div>
            </div>

            {/* System badge */}
            {q.system && q.system !== 'general' && (
              <div className="inline-flex items-center gap-1.5 mb-4 px-2.5 py-1 rounded-full text-xs font-mono"
                style={{ background: `${systemColor}15`, color: systemColor, border: `1px solid ${systemColor}30` }}>
                {q.system === 'sap' ? 'SAP S/4HANA' : q.system === 'dynamics' ? 'Dynamics 365' : 'Odoo ERP'}
              </div>
            )}

            {/* Question */}
            <p className="text-base font-semibold mb-5 leading-relaxed"
              style={{ fontFamily: 'Space Grotesk', color: 'oklch(0.90 0.005 255)' }}>
              {questionText}
            </p>

            {/* Options */}
            <div className="space-y-2.5 mb-5">
              {opts.map((opt, idx) => {
                let bg = 'oklch(0.16 0.020 255)';
                let border = 'oklch(1 0 0 / 8%)';
                let textColor = 'oklch(0.75 0.008 255)';

                if (answerState !== 'unanswered') {
                  if (idx === q.correctIndex) {
                    bg = 'oklch(0.72 0.16 162 / 15%)';
                    border = 'oklch(0.72 0.16 162 / 50%)';
                    textColor = 'oklch(0.80 0.14 162)';
                  } else if (idx === selected && idx !== q.correctIndex) {
                    bg = 'oklch(0.65 0.22 25 / 15%)';
                    border = 'oklch(0.65 0.22 25 / 50%)';
                    textColor = 'oklch(0.75 0.18 25)';
                  }
                } else if (selected === idx) {
                  bg = `${moduleColor}15`;
                  border = `${moduleColor}50`;
                  textColor = moduleColor;
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={answerState !== 'unanswered'}
                    className="w-full text-left p-3.5 rounded-xl transition-all duration-200 flex items-center gap-3"
                    style={{ background: bg, border: `1px solid ${border}`, color: textColor }}
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: 'oklch(1 0 0 / 8%)', color: 'oklch(0.55 0.010 255)' }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm">{opt}</span>
                    {answerState !== 'unanswered' && idx === q.correctIndex && (
                      <CheckCircle2 size={16} className="ml-auto shrink-0" style={{ color: 'oklch(0.72 0.16 162)' }} />
                    )}
                    {answerState !== 'unanswered' && idx === selected && idx !== q.correctIndex && (
                      <XCircle size={16} className="ml-auto shrink-0" style={{ color: 'oklch(0.65 0.22 25)' }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answerState !== 'unanswered' && (
              <div className="rounded-xl p-4 mb-5"
                style={{
                  background: answerState === 'correct' ? 'oklch(0.72 0.16 162 / 10%)' : 'oklch(0.65 0.22 25 / 10%)',
                  border: `1px solid ${answerState === 'correct' ? 'oklch(0.72 0.16 162 / 30%)' : 'oklch(0.65 0.22 25 / 30%)'}`
                }}>
                <div className="flex items-center gap-2 mb-2">
                  {answerState === 'correct'
                    ? <CheckCircle2 size={15} style={{ color: 'oklch(0.72 0.16 162)' }} />
                    : <XCircle size={15} style={{ color: 'oklch(0.65 0.22 25)' }} />
                  }
                  <span className="text-xs font-semibold"
                    style={{ color: answerState === 'correct' ? 'oklch(0.72 0.16 162)' : 'oklch(0.65 0.22 25)' }}>
                    {answerState === 'correct'
                      ? (lang === 'fr' ? 'Bonne réponse !' : 'Correct!')
                      : (lang === 'fr' ? 'Mauvaise réponse' : 'Wrong answer')
                    }
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.85 0.008 255)', lineHeight: '1.65' }}>
                  {explanation}
                </p>
              </div>
            )}

            {/* Next button */}
            {answerState !== 'unanswered' && (
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: moduleColor, color: 'oklch(0.10 0.015 255)' }}
                >
                  {currentQ < questions.length - 1
                    ? (lang === 'fr' ? 'Question suivante' : 'Next Question')
                    : (lang === 'fr' ? 'Voir les résultats' : 'See Results')
                  }
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
