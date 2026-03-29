# ERP Simulator — 9-Phase Transformation TODO

## Phase 1 — Student E2E Simulation
- [x] Create new student via teacher API (seed)
- [x] Log in as student, navigate modules, open slides
- [x] Complete quiz with intentional mistakes
- [x] Run scenario 3x (with errors, hints, retry)
- [x] Verify persistence after logout/login

## Phase 2 — Teacher E2E Simulation
- [x] Log in as teacher, view cohorts
- [x] Create/edit student, assign to cohort, reset password
- [x] Open monitoring dashboard, identify weak students

## Phase 3+4 — 3-ERP Comparative UI + Immersive Experience
- [x] Reinforce 3-ERP panel visibility in scenario steps (MM)
- [x] Add erpComparison data to SD-01 and FI-01 scenario steps
- [x] Add erpImpact data to SD-01 and FI-01 scenario steps
- [x] Role-play context and mission framing per scenario
- [x] Distinct visual identity per ERP system in step header

## Phase 5+6 — Attempt History + Learning Intelligence
- [x] Upgrade attempt history panel in post-scenario screen
- [x] Show improvement trend between attempts
- [x] Learner profile classifier (5 types)
- [x] QA pedagogical feedback after scenario

## Phase 7+8 — Pedagogical Report + Teacher Control Tower
- [x] Post-scenario result screen with step breakdown
- [x] Teacher Control Tower v2.0 (4 tabs: Étudiants, Alertes, Cohortes, Insights)
- [x] At-risk alerts (avg < 60, ≥2 attempts)
- [x] Module difficulty analysis with avg hints per attempt
- [x] Learner profile distribution chart

## Phase 9 — Senior QA Audit
- [x] Write strict QA audit report v3.0 with scores and critical issues

## Final
- [x] TypeScript check (0 errors)
- [x] Save checkpoint
- [x] Push to GitHub

## Remaining Critical Issues (from QA report)
- [x] Migrate CohortsPage to use tRPC instead of localStorage (Issue #1) — DONE
- [x] Add erpImpact + 3-ERP comparison notes to SD-01 (5 steps) and FI-01 (3 steps) — Issue #2 partially resolved

## Pedagogical ERP Card Transformation
- [x] Transform ERP brand cards into pedagogical entry points (real-world context, strengths, process equivalence, clickable links)
- [x] Unify 3-ERP comparison panel visual identity in ScenarioPageFull to match dashboard brand cards
- [x] Add "même processus, terminologie différente" equivalence message to all 3-ERP comparison panels

## Micro-Learning & Simplification Sprint
- [x] Simplify dashboard ERP cards to one-line equivalence (strip overload)
- [x] Simplify scenario-level 3-ERP panel to one key idea per scenario
- [x] Simplify per-step comparison to one key idea (logo + name + one-line note)
- [x] Add micro-learning feedback sentence after each correct step
- [x] Add terminology confusion tracking field to erpData step notes (derived from wrongAttempts + hintsUsed)
- [x] Expose terminology confusion analytics in teacher monitoring dashboard (Diagnostic ERP panel + class breakdown)

## 10-Phase Professional Educational System Transformation

### Phase 2 — Critical UX Fixes
- [x] Replace native <select> with shadcn/ui Select components (visible selection confirmation)
- [x] Add explanatory feedback sentence to quiz after wrong answers (improved visibility)
- [x] Remove hardcoded fake activity data from student dashboard (replaced with real tRPC data)

### Phase 3 — Complete Micro-Learning
- [x] Add erpImpact.note to all 5 MM-01 steps

### Phase 4 — Reflection Questions
- [x] Add 2–3 reflection questions after each scenario completion screen
- [x] Questions test conceptual understanding (not just execution recall)

### Phase 7 — Teacher Dashboard Upgrade
- [x] Add confusion signal column directly in student list table (no click required)
- [x] Add teacher action buttons: "Revoir les slides", "Retry guidé", "Envoyer feedback"
- [ ] Add step-level execution tracking (OK / ERROR / HINT per step per attempt) — deferred
- [ ] Add error classification (sequence / concept / terminology) — deferred

### Phase 8 — ERP Impact Completion
- [x] Add erpImpact.note to all MM-01 steps (micro-learning feedback)
- [x] Add erpImpact.note to all ERP-SIM-01 and ERP-SIM-02 steps

### Phase 9 — Student Dashboard Improvement
- [x] Replace fake activity with real progress per module (% completion, last activity)
- [x] Add recommended next step card per student (first scenario with score < 80)

### Phase 10 — Final QA Validation
- [x] Conducted real end-to-end QA test — 3 production bugs found and fixed, 16 vitest tests passing

## E2E QA Simulation (2026-03-27)
- [x] Student E2E simulation (42 min, 3 attempts MM-01, 100% final score)
- [x] Teacher E2E simulation (8 min, monitoring + insights + diagnostic ERP)
- [x] FR/EN switch QA across all 11 pages
- [x] Python-style QA checklist (30 items: 24 PASS, 6 FAIL)
- [x] Micro-learning note display extended from 600ms to 2000ms (FIXED)
- [x] CohortsPage migrated from localStorage to tRPC database (FIXED)
- [x] Language support for 5 missing pages: Login, ModulesPageFull, MonitoringPageFull, CohortsPage, AssignmentsPage — DONE

## Language Consistency Sprint (2026-03-27)
- [x] Audit all pages for FR/EN gaps
- [x] Fix MonitoringPageFull — full EN translations added (698 lines rewritten)
- [x] Fix CohortsPage — full EN translations added (bilingual v2.1)
- [x] Fix AssignmentsPage — full EN translations added
- [x] Fix LoginPage — full EN translations added
- [x] Fix ModulesPageFull — full EN translations added
- [x] Fix ModuleDetailPageFull — already had useLang, verified
- [x] Fix ScenarioPageFull — already fully bilingual (83 useLang calls)
- [x] Fix DashboardPage — already uses lang ternaries, verified
- [x] Fix TeacherGuidePage — already fully bilingual (44 useLang calls)
- [x] Fix shared components (DashboardLayout sidebar/topbar) — already bilingual
- [x] Validate FR/EN switch end-to-end — all 11 pages PASS
- [x] Produce Python-style QA checklist + final language report

## Final Pedagogical Completion Sprint (2026-03-28)
- [ ] Phase 1: Verify FR/EN toggle visible on ALL pages (Login, Simulator, Completion)
- [ ] Phase 2: Translate erpData.ts — titleEn, descriptionEn, instructionEn, hintEn, erpImpact.noteEn, quizQuestionEn, quizOptionsEn, explanationEn
- [ ] Phase 2: Update ScenarioPageFull + ModuleDetailPageFull to render EN content dynamically
- [ ] Phase 3: Add GR-IR micro-learning to MM steps (Goods Receipt + Invoice Verification)
- [ ] Phase 3: Add FI debit/credit micro-learning with "What increases? What decreases?" logic
- [ ] Phase 4: Add stepExecutions table to DB schema (attemptId, stepIndex, status, hintsUsed)
- [ ] Phase 4: Track step OK/ERROR/HINT in ScenarioPageFull and save to DB on completion
- [ ] Phase 4: Display step-level breakdown in teacher monitoring student detail panel
- [ ] Phase 5: Add post-scenario summary panel (steps failed, hints used, explanation per step)
- [ ] Phase 6: Add reflection answer text inputs to completion screen
- [ ] Phase 6: Save reflection answers to DB (reflectionAnswers table)
- [ ] Phase 6: Display reflection answers in teacher monitoring student detail panel
- [ ] Phase 7: Push to GitHub + deliver final QA report

## Validation Sprint Completion (2026-03-28 continued)
- [x] Fix MonitoringPageFull — stepBreakdown parsing bug fixed (filter on non-array crash)
- [x] Fix ModulesPageFull — add useErpTranslations hook for scenario/module title EN translation
- [x] Fix DashboardPage — fix untranslated stats labels, Quick Access, Assessment Structure section
- [x] Validate simulator page EN mode — all step names translated (Standard Procurement Cycle, etc.)
- [x] Validate modules page EN mode — all scenario titles translated
- [x] Validate dashboard EN mode — all stat labels, section titles, quick access links translated
- [x] Validate cohorts page EN mode — working correctly
- [x] Validate monitoring page EN mode — working correctly

## Final System Completion Sprint (2026-03-29)
- [x] Phase 1: Add erpImpact.note (WHY explanations) to all 27 steps in MM-02/03/04, SD-02/03/04, FI-02/03
- [x] Phase 2: Add stepExecutions DB table + pnpm db:push migration
- [x] Phase 2: Add saveStepExecutions/getLastAttemptId helpers to server/db.ts
- [x] Phase 2: Add attemptsSteps.submitWithSteps tRPC procedure to server/routers.ts
- [x] Phase 3: Add per-step start-time tracking (stepStartTime, stepDurations state) to ScenarioPageFull
- [x] Phase 3: Wire finishScenario to use submitWithSteps with per-step payload
- [x] Phase 4: Add reflection textarea inputs to ResultScreen with save-to-DB via trpc.reflection.submit
- [x] Phase 5: Add Critical Step column to MonitoringPage student table
- [x] Phase 5: Fix isFr not defined error in MonitoringPageFull
- [x] Phase 6: Verify SAP codes bug not present (getSystemCode already correct)
- [x] Phase 6: Verify stale history fixed (refetchHistory + invalidate in submitWithSteps.onSuccess)
- [x] Phase 7: Add struggled/improved sections to ResultScreen (What You Mastered / What Needs Work)
