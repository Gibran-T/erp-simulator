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
