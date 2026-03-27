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
- [ ] Save checkpoint
- [ ] Push to GitHub

## Remaining Critical Issues (from QA report)
- [ ] Migrate CohortsPage to use tRPC instead of localStorage (Issue #1)
- [x] Add erpImpact + 3-ERP comparison notes to SD-01 (5 steps) and FI-01 (3 steps) — Issue #2 partially resolved
