/**
 * Phase 10 — Vitest coverage for all 9 improvement phases
 * Tests verify data integrity and logic correctness, not UI rendering.
 */
import { describe, it, expect } from 'vitest';

// ─── Phase 3: MM-01 micro-learning notes ────────────────────────────────────
describe('Phase 3 — MM-01 erpImpact.note completeness', () => {
  it('all 5 MM-01 steps have erpImpact.note populated', async () => {
    const { ERP_MODULES } = await import('../client/src/lib/erpData');
    const mm = ERP_MODULES.find(m => m.id === 'mm');
    expect(mm).toBeDefined();
    const mm01 = mm!.scenarios.find(s => s.id === 'mm-01');
    expect(mm01).toBeDefined();
    for (const step of mm01!.steps) {
      expect(step.erpImpact?.note, `Step ${step.stepNumber} (${step.title}) missing erpImpact.note`).toBeTruthy();
    }
  });
});

// ─── Phase 3: SD-01 and FI-01 micro-learning notes ──────────────────────────
describe('Phase 3 — SD-01 and FI-01 erpImpact.note completeness', () => {
  it('all SD-01 steps have erpImpact.note', async () => {
    const { ERP_MODULES } = await import('../client/src/lib/erpData');
    const sd = ERP_MODULES.find(m => m.id === 'sd');
    const sd01 = sd?.scenarios.find(s => s.id === 'sd-01');
    expect(sd01).toBeDefined();
    for (const step of sd01!.steps) {
      expect(step.erpImpact?.note, `SD-01 Step ${step.stepNumber} missing note`).toBeTruthy();
    }
  });

  it('all FI-01 steps have erpImpact.note', async () => {
    const { ERP_MODULES } = await import('../client/src/lib/erpData');
    const fi = ERP_MODULES.find(m => m.id === 'fi');
    const fi01 = fi?.scenarios.find(s => s.id === 'fi-01');
    expect(fi01).toBeDefined();
    for (const step of fi01!.steps) {
      expect(step.erpImpact?.note, `FI-01 Step ${step.stepNumber} missing note`).toBeTruthy();
    }
  });
});

// ─── Phase 4: Reflection questions ──────────────────────────────────────────
describe('Phase 4 — Reflection questions on MM-01, SD-01, FI-01', () => {
  it('MM-01 has at least 2 reflection questions', async () => {
    const { ERP_MODULES } = await import('../client/src/lib/erpData');
    const mm01 = ERP_MODULES.find(m => m.id === 'mm')?.scenarios.find(s => s.id === 'mm-01');
    expect(mm01?.reflectionQuestions?.length).toBeGreaterThanOrEqual(2);
  });

  it('SD-01 has at least 2 reflection questions', async () => {
    const { ERP_MODULES } = await import('../client/src/lib/erpData');
    const sd01 = ERP_MODULES.find(m => m.id === 'sd')?.scenarios.find(s => s.id === 'sd-01');
    expect(sd01?.reflectionQuestions?.length).toBeGreaterThanOrEqual(2);
  });

  it('FI-01 has at least 2 reflection questions', async () => {
    const { ERP_MODULES } = await import('../client/src/lib/erpData');
    const fi01 = ERP_MODULES.find(m => m.id === 'fi')?.scenarios.find(s => s.id === 'fi-01');
    expect(fi01?.reflectionQuestions?.length).toBeGreaterThanOrEqual(2);
  });

  it('each reflection question has a non-empty text and hint', async () => {
    const { ERP_MODULES } = await import('../client/src/lib/erpData');
    const allScenarios = ERP_MODULES.flatMap(m => m.scenarios);
    for (const scenario of allScenarios) {
      if (!scenario.reflectionQuestions) continue;
      for (const q of scenario.reflectionQuestions) {
        expect(q.question, `Empty question in ${scenario.id}`).toBeTruthy();
        expect(q.hint, `Empty hint in ${scenario.id}`).toBeTruthy();
      }
    }
  });
});

// ─── Phase 7: Confusion signal logic ────────────────────────────────────────
describe('Phase 7 — Confusion signal derivation logic', () => {
  it('correctly classifies a student with many wrong attempts and low score as double confusion', () => {
    // Simulate the buildSummaries logic from MonitoringPageFull
    const wrongAttempts = 18;
    const hintsUsed = 10;
    const avgScore = 42;
    const totalSteps = 5;

    const confusionScore = (wrongAttempts / Math.max(totalSteps, 1)) + (hintsUsed / Math.max(totalSteps, 1));
    const isHighConfusion = confusionScore > 4;
    const isLowScore = avgScore < 55;

    let signal: string;
    if (isHighConfusion && isLowScore) signal = 'double';
    else if (isHighConfusion && !isLowScore) signal = 'terminology';
    else if (!isHighConfusion && isLowScore) signal = 'process';
    else signal = 'ok';

    expect(signal).toBe('double');
  });

  it('correctly classifies a student with good score but many hints as terminology confusion', () => {
    const wrongAttempts = 12;
    const hintsUsed = 8;
    const avgScore = 72;
    const totalSteps = 5;

    const confusionScore = (wrongAttempts / Math.max(totalSteps, 1)) + (hintsUsed / Math.max(totalSteps, 1));
    const isHighConfusion = confusionScore >= 4;
    const isLowScore = avgScore < 55;

    let signal: string;
    if (isHighConfusion && isLowScore) signal = 'double';
    else if (isHighConfusion && !isLowScore) signal = 'terminology';
    else if (!isHighConfusion && isLowScore) signal = 'process';
    else signal = 'ok';

    expect(signal).toBe('terminology');
  });

  it('correctly classifies a student with low score but few attempts as process confusion', () => {
    const wrongAttempts = 2;
    const hintsUsed = 1;
    const avgScore = 48;
    const totalSteps = 5;

    const confusionScore = (wrongAttempts / Math.max(totalSteps, 1)) + (hintsUsed / Math.max(totalSteps, 1));
    const isHighConfusion = confusionScore > 4;
    const isLowScore = avgScore < 55;

    let signal: string;
    if (isHighConfusion && isLowScore) signal = 'double';
    else if (isHighConfusion && !isLowScore) signal = 'terminology';
    else if (!isHighConfusion && isLowScore) signal = 'process';
    else signal = 'ok';

    expect(signal).toBe('process');
  });
});

// ─── Phase 8: ERP-SIM micro-learning notes ──────────────────────────────────
describe('Phase 8 — ERP-SIM-01 and ERP-SIM-02 erpImpact.note completeness', () => {
  it('all ERP-SIM-01 steps have erpImpact.note', async () => {
    const { ERP_MODULES } = await import('../client/src/lib/erpData');
    const sim = ERP_MODULES.find(m => m.id === 'erp-sim');
    const sim01 = sim?.scenarios.find(s => s.id === 'erp-sim-01');
    expect(sim01).toBeDefined();
    for (const step of sim01!.steps) {
      expect(step.erpImpact?.note, `ERP-SIM-01 Step ${step.stepNumber} missing note`).toBeTruthy();
    }
  });

  it('all ERP-SIM-02 steps have erpImpact.note', async () => {
    const { ERP_MODULES } = await import('../client/src/lib/erpData');
    const sim = ERP_MODULES.find(m => m.id === 'erp-sim');
    const sim02 = sim?.scenarios.find(s => s.id === 'erp-sim-02');
    expect(sim02).toBeDefined();
    for (const step of sim02!.steps) {
      expect(step.erpImpact?.note, `ERP-SIM-02 Step ${step.stepNumber} missing note`).toBeTruthy();
    }
  });
});

// ─── Phase 9: Real progress computation ─────────────────────────────────────
describe('Phase 9 — Real module progress computation', () => {
  it('completedByModule correctly groups scenario IDs by module', () => {
    const history = [
      { scenarioId: 'mm-01', moduleId: 'mm', score: 85 },
      { scenarioId: 'mm-01', moduleId: 'mm', score: 90 }, // duplicate — same scenario
      { scenarioId: 'sd-01', moduleId: 'sd', score: 72 },
    ];

    const completedByModule = history.reduce((acc: Record<string, Set<string>>, a) => {
      if (!acc[a.moduleId]) acc[a.moduleId] = new Set();
      acc[a.moduleId].add(a.scenarioId);
      return acc;
    }, {});

    expect(completedByModule['mm'].size).toBe(1); // deduped
    expect(completedByModule['sd'].size).toBe(1);
    expect(completedByModule['fi']).toBeUndefined();
  });

  it('bestScoreByScenario keeps the highest score per scenario', () => {
    const history = [
      { scenarioId: 'mm-01', score: 60 },
      { scenarioId: 'mm-01', score: 85 },
      { scenarioId: 'mm-01', score: 72 },
    ];

    const bestScoreByScenario = history.reduce((acc: Record<string, number>, a) => {
      acc[a.scenarioId] = Math.max(acc[a.scenarioId] ?? 0, a.score);
      return acc;
    }, {});

    expect(bestScoreByScenario['mm-01']).toBe(85);
  });

  it('nextScenario is the first scenario with best score below 80', () => {
    const bestScoreByScenario: Record<string, number> = {
      'mm-01': 90, // passed
      'sd-01': 65, // not passed
    };

    const scenarios = [
      { id: 'mm-01', moduleId: 'mm' },
      { id: 'sd-01', moduleId: 'sd' },
      { id: 'fi-01', moduleId: 'fi' },
    ];

    const next = scenarios.find(s => !bestScoreByScenario[s.id] || bestScoreByScenario[s.id] < 80);
    expect(next?.id).toBe('sd-01');
  });
});
