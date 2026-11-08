# Tasks: CSA Weekly Box Planning and Member Swaps (V1)

**Input**: Design documents from `specs/001-csa-box-swaps/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Domain-rule unit tests (Vitest) are included because the plan calls for them and they
provide FR-level evidence for the traceability matrix.

**Format**: `[ID] [P?] [Story] Description` — every task cites the FR(s) it implements.

## Phase 1: Setup

- [ ] T001 Create Vite + React + TS project files in frontend/package.json, frontend/tsconfig.json, frontend/index.html, frontend/src/main.tsx
- [ ] T002 Configure base `/ReqsforInfoSys/${APP_VERSION}/` and outDir `../${APP_VERSION}` (default v1) plus Vitest in frontend/vite.config.ts; add scripts `dev`, `test`, `build:v1`
- [ ] T003 [P] Add .nojekyll at repo root and frontend/.gitignore (node_modules, dist)

## Phase 2: Foundational (blocks all stories)

- [ ] T004 Define types HarvestItem, Member, WeekSchedule, BoxPlan (`status: draft | provisional | confirmed`), SwapRequest (`status: pending | approved | declined`), AppState in frontend/src/domain/types.ts
- [ ] T005 [P] Create mock week (12 items incl. 4 substitutes, 4 members, schedule per A-1, share value 25, starter draft plan) in frontend/src/data/mockWeek.ts (A-3)
- [ ] T006 [P] Implement `computeCutoff` (D-1: earlier of packingStart−24h and Wednesday 20:00) and `phaseAt` in frontend/src/domain/schedule.ts (FR-009, FR-014, FR-017)
- [ ] T007 [P] Unit tests for schedule in frontend/src/domain/schedule.test.ts (cutoff = 2026-11-11T08:00; request exactly at cutoff is late)
- [ ] T008 Implement reducer with actions and localStorage persistence (try/catch) + reset in frontend/src/state/reducer.ts and frontend/src/state/store.tsx (FR-021)
- [ ] T009 Implement Header: role switcher, member picker, demo clock with presets + input, phase badge, Reset demo, mock-data/no-safety-claim banner in frontend/src/components/Header.tsx (FR-019, FR-020, FR-021, FR-022)
- [ ] T010 App shell routing by role, styles in frontend/src/App.tsx and frontend/src/styles.css

## Phase 3: User Story 1 — Lucia plans and publishes (P1) 🎯 MVP

**Independent test**: build, publish, confirm a plan from mock harvest (quickstart steps 2–4).

- [ ] T011 [P] [US1] Implement `boxValue`, `infeasibleItems`, `canPublish`, `canEditPlan` in frontend/src/domain/plan.ts (FR-002, FR-003, FR-004, FR-018)
- [ ] T012 [P] [US1] Unit tests in frontend/src/domain/plan.test.ts (shortfall blocks publish; qty × members > available blocks publish; edits blocked after cutoff when confirmed)
- [ ] T013 [US1] PlannerView: harvest table with per-box qty inputs, totals, infeasible flags, value vs share value, Publish/Confirm with reasons, cutoff panel showing Proposal A/B and provisional label in frontend/src/components/PlannerView.tsx (FR-001–FR-005, FR-009, FR-018)

## Phase 4: User Story 2 — Member sees dependable info (P1)

**Independent test**: view box in Draft, Provisional, Confirmed, Confirmed-with-changes.

- [ ] T014 [P] [US2] Implement `memberBox` and `memberChanges` (diff vs confirmed snapshot, reason edit|swap) in frontend/src/domain/memberBox.ts (FR-007, FR-008)
- [ ] T015 [P] [US2] Unit tests in frontend/src/domain/memberBox.test.ts
- [ ] T016 [US2] MemberView box section: Not published / Provisional label / Confirmed at time / changed lines marked, cutoff notice in frontend/src/components/MemberView.tsx (FR-006–FR-009)

## Phase 5: User Story 3 — Swap request and decision (P2)

**Independent test**: request before cutoff → approve/decline → status; late attempt after cutoff.

- [ ] T017 [P] [US3] Implement `substituteOptions`, `validateRequest`, `canApprove`, `effectiveStatus`, removal handling in frontend/src/domain/swaps.ts (FR-010–FR-014, FR-017, FR-018)
- [ ] T018 [P] [US3] Unit tests in frontend/src/domain/swaps.test.ts (only approved substitutes with remaining qty; one active request per item; late rejected; approve blocked when insufficient; pending at packing → not_reviewed)
- [ ] T019 [US3] MemberView swap form + late explanation + my requests list in frontend/src/components/MemberView.tsx (FR-010, FR-011, FR-013, FR-014)
- [ ] T020 [US3] RequestsView queue with Approve/Decline and disabled reasons in frontend/src/components/RequestsView.tsx (FR-012, FR-013)

## Phase 6: User Story 4 — Packing (P2)

**Independent test**: approved swap appears on packing list; check all → mark checked.

- [ ] T021 [P] [US4] Implement `packingList`, `isBoxChecked` in frontend/src/domain/packing.ts (FR-015, FR-016)
- [ ] T022 [P] [US4] Unit tests in frontend/src/domain/packing.test.ts (approved swap applied; declined/pending not applied; checked requires all lines)
- [ ] T023 [US4] PackingView per-member cards with line checks, mark checked, lock note in frontend/src/components/PackingView.tsx (FR-015–FR-017)

## Phase 7: Polish & Deploy

- [ ] T024 Run `npm test` and `npm run build:v1`; verify v1/index.html uses /ReqsforInfoSys/v1/ asset paths
- [ ] T025 Walk through specs/001-csa-box-swaps/quickstart.md locally and fix defects against the spec
- [ ] T026 Commit v1/ build, tag `v1`, create `v1` branch, push; verify https://jyeh2.github.io/ReqsforInfoSys/v1/

## Dependencies

- Setup → Foundational → US1 → (US2, US3, US4). US2–US4 read the plan created in US1; US3 and US4
  can proceed in parallel after US2's `memberBox`.

## Parallel examples

- Phase 2: T005, T006, T007 together.
- US3: T017 and T018 together; US4: T021 and T022 together.

## Implementation strategy

MVP = Phases 1–3 (planning). Then US2 → US3 → US4, testing each story's acceptance scenarios
before moving on; deploy once all four stories pass the quickstart walkthrough.
