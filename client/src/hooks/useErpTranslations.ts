// useErpTranslations.ts
// Runtime hook that merges English translations into ERP data objects
// Usage: const { t: tStep, tField, tQuiz, tReflection, tScenario } = useErpTranslations();

import { useLang } from '@/contexts/LanguageContext';
import {
  stepTranslationsEn,
  fieldTranslationsEn,
  quizTranslationsEn,
  reflectionTranslationsEn,
  scenarioTranslationsEn,
  moduleTranslationsEn,
} from '@/lib/erpDataEn';
import type {
  TransactionStep,
  TransactionField,
  QuizQuestion,
  ReflectionQuestion,
  Scenario,
  ERPModule,
} from '@/lib/erpData';

export function useErpTranslations() {
  const { lang } = useLang();
  const isEn = lang === 'en';

  /** Translate a TransactionStep */
  function tStep(step: TransactionStep): TransactionStep {
    if (!isEn) return step;
    const en = stepTranslationsEn[step.id];
    if (!en) return step;
    return {
      ...step,
      name: en.name ?? step.name,
      objective: en.objective ?? step.objective,
      validationMessage: en.validationMessage ?? step.validationMessage,
      errorMessage: en.errorMessage ?? step.errorMessage,
      erpImpact: step.erpImpact
        ? {
            ...step.erpImpact,
            stockChange: en.erpImpact?.stockChange ?? step.erpImpact.stockChange,
            accountingEntry: en.erpImpact?.accountingEntry ?? step.erpImpact.accountingEntry,
            documentCreated: en.erpImpact?.documentCreated ?? step.erpImpact.documentCreated,
            documentStatus: en.erpImpact?.documentStatus ?? step.erpImpact.documentStatus,
            note: en.erpImpact?.note ?? step.erpImpact.note,
          }
        : step.erpImpact,
      fields: step.fields.map((f) => tField(f)),
    };
  }

  /** Translate a TransactionField */
  function tField(field: TransactionField): TransactionField {
    if (!isEn) return field;
    const en = fieldTranslationsEn[field.id];
    if (!en) return field;
    // CRITICAL: If the field has a correctValue (validation-critical select),
    // do NOT translate the options — keep original values so validation still works.
    // Only translate labels, placeholders, and hints.
    const shouldTranslateOptions = en.optionsEn && !field.correctValue;
    return {
      ...field,
      label: en.label ?? field.label,
      placeholder: en.placeholder ?? field.placeholder,
      hint: en.hint ?? field.hint,
      options: shouldTranslateOptions ? en.optionsEn! : field.options,
    };
  }

  /** Translate a QuizQuestion */
  function tQuiz(q: QuizQuestion): QuizQuestion {
    if (!isEn) return q;
    const en = quizTranslationsEn[q.id];
    if (!en) return q;
    return {
      ...q,
      question: en.question ?? q.question,
      options: en.optionsEn ?? q.options,
      explanation: en.explanation ?? q.explanation,
    };
  }

  /** Translate a ReflectionQuestion */
  function tReflection(r: ReflectionQuestion): ReflectionQuestion {
    if (!isEn) return r;
    const en = reflectionTranslationsEn[r.id];
    if (!en) return r;
    return {
      ...r,
      question: en.question ?? r.question,
      hint: en.hint ?? r.hint,
      expectedAnswer: en.expectedAnswer ?? r.expectedAnswer,
    };
  }

  /** Translate a Scenario (metadata only, not steps) */
  function tScenario(s: Scenario): Scenario {
    if (!isEn) return s;
    const en = scenarioTranslationsEn[s.id];
    if (!en) return s;
    return {
      ...s,
      title: en.title ?? s.title,
      description: en.description ?? s.description,
      difficultyEn: en.difficultyEn ?? s.difficultyEn,
      learningObjective: en.learningObjective ?? s.learningObjective,
      steps: s.steps.map((step) => tStep(step)),
      reflectionQuestions: s.reflectionQuestions?.map((r) => tReflection(r)),
    };
  }

  /** Translate an ERPModule (metadata only, not scenarios) */
  function tModule(m: ERPModule): ERPModule {
    if (!isEn) return m;
    const en = moduleTranslationsEn[m.id];
    if (!en) return m;
    return {
      ...m,
      fullName: en.fullName ?? m.fullName,
      process: en.process ?? m.process,
      description: en.description ?? m.description,
      scenarios: m.scenarios.map((s) => tScenario(s)),
    };
  }

  /** Get difficulty label in current language */
  function tDifficulty(s: Scenario): string {
    if (!isEn) return s.difficulty;
    return s.difficultyEn ?? (
      s.difficulty === 'Débutant' ? 'Beginner' :
      s.difficulty === 'Intermédiaire' ? 'Intermediate' :
      s.difficulty === 'Avancé' ? 'Advanced' : s.difficulty
    );
  }

  return { tStep, tField, tQuiz, tReflection, tScenario, tModule, tDifficulty, isEn };
}
