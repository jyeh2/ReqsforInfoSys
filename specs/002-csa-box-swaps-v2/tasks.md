# Tasks: CSA Weekly Box Planning and Member Swaps (V2)

**Input**: Design documents from `specs/002-csa-box-swaps-v2/`
**Prerequisites**: plan.md, spec.md (with Clarifications), research.md (V2-1 to V2-8), data-model.md,
contracts/

**Tests**: Domain-rule unit tests (Vitest) are included, as in V1; they are FR-level evidence for the
V2 traceability matrix.

**Scope**: Only V2 changes. V1 behavior not listed here must remain unchanged (regression via the
existing tests). Paths are relative to `frontend/src/` unless stated.

## Phase 1: Setup

- [ ] T001 Confirm `build:v2` script (`APP_VERSION=v2`, base `/ReqsforInfoSys/v2/`, outDir `../v2`) in frontend/package.json and frontend/vite.config.ts; confirm the localStorage key includes the version in state/store.tsx

## Phase 2: Foundational (blocks all stories)

- [ ] T002 Add `publishedLines?: PlanLine[]` ("snapshot at first publish; baseline for estimate changes") and `publishedAt?: DateTime` to `BoxPlan` in domain/types.ts
- [ ] T003 Change `computeCutoff` in domain/schedule.ts to return `{proposalA, proposalB, proposalC, cutoff}` with proposalC = pickup − 48h and `cutoff = proposalB` (D-2, Wednesday 20:00); keep `phaseAt` semantics (FR-009, V2-1, V2-2)
- [ ] T004 Update domain/schedule.test.ts: cutoff = `2026-11-11T20:00`; proposalC = `2026-11-11T09:00`; Wed 12:00 is `open`; Wed 20:00 is `locked`
- [ ] T005 In state/reducer.ts `publish`, snapshot `publishedLines` and `publishedAt = clock` (FR-008, FR-023, V2-3)

## Phase 3: User Story 1 — Lucia plans and publishes (P1)

**Independent test**: while Draft the planner warns about swaps and shows time to the Wed 20:00 cutoff.

- [ ] T006 [US1] Add Draft warning to components/PlannerView.tsx: "Members can't request swaps until you publish" + time remaining until cutoff formatted as days and hours (e.g., "2 d 11 h"), or "the swap cutoff has passed" (FR-023, V2-8)
- [ ] T007 [P] [US1] Update components/CutoffNotice.tsx detailed list: D-2 cutoff; Proposal A "24 h before packing — no interview evidence"; Proposal B "Wednesday evening — Hank"; Proposal C "48 h before pickup — Raj, information deadline"; provisional label (FR-009)

## Phase 4: User Story 2 — Member sees dependable info (P1)

**Independent test**: estimate edits are marked while provisional; confirmed view shows "Different from the first estimate" and "Your approved swap".

- [ ] T008 [US2] In domain/memberBox.ts add `diffLines(from, to)`, `estimateChanges(state)`, `confirmedVsEstimate(state)`, `laterChanges(state)`, `formatQty(line, items)`; mark swaps via `swappedFrom` only; remove `memberChanges` (FR-008, V2-3, V2-4, V2-5)
- [ ] T009 [P] [US2] Rewrite domain/memberBox.test.ts: provisional edit after publish appears in `estimateChanges`; confirmed summary lists published→confirmed diffs; post-confirmation edit appears in `laterChanges`; swap approved before confirmation keeps `swappedFrom`
- [ ] T010 [US2] Update components/MemberView.tsx box list: provisional markers "Changed since first estimate: was <qty unit item>" (+ removed items); confirmed "Different from the first estimate" summary; "Changed after confirmation: was …"; "Your approved swap (replaces <qty unit item>)" (FR-008)

## Phase 5: User Story 3 — Swap request and decision (P2)

**Independent test**: Wed 12:00 swaps open; Wed 21:00 closed-message without "locked"; late request declined with new wording; live status message.

- [ ] T011 [US3] In domain/swaps.ts change `lateReason` to "Received after the swap cutoff (<time>)." and add `closedMessage(state)` = "Swap requests closed — the farm is finishing decisions on earlier requests; the packing list locks at <packingStart>." (FR-014, FR-024, V2-7)
- [ ] T012 [P] [US3] Update domain/swaps.test.ts and state/reducer.test.ts for the new cutoff (late at/after Wed 20:00) and wording; add "published after cutoff" case
- [ ] T013 [US3] In state/reducer.ts and components/MemberView.tsx make the submit message track the member's most recently submitted request (last request for that member in state) and render its current `effectiveStatus` (FR-013, V2-6)
- [ ] T014 [US3] In components/MemberView.tsx show `closedMessage` between cutoff and packing, packing-locked text during packing, and "Swap requests were not available this week." when `publishedAt >= cutoff`; remove the "(FR-014)" text (FR-022, FR-023, FR-024)

## Phase 6: User Story 4 — Packing (P2)

- [ ] T015 [US4] Regression only: verify domain/packing.test.ts still passes; no code change expected (FR-015 to FR-017)

## Phase 7: Polish & Deploy

- [ ] T016 Update components/Header.tsx presets: Mon 09:00, Tue 12:00, Wed 12:00, Cutoff (computed), Wed 21:00, Packing starts; phase label `locked` → "Requests closed"
- [ ] T017 Grep frontend/src/components for `FR-` in rendered strings; none may remain (FR-022)
- [ ] T018 Run `npm test`, `npx tsc --noEmit`, `npm run build:v2`; verify v2/index.html asset paths use /ReqsforInfoSys/v2/ and `git status v1/` shows no changes
- [ ] T019 Walk through specs/002-csa-box-swaps-v2/quickstart.md on the local build and fix defects against the spec
- [ ] T020 Commit v2/ build, tag `v2`, create `v2` branch, push; verify https://jyeh2.github.io/ReqsforInfoSys/v2/ and that /v1/ is unchanged

## Dependencies

- Phase 2 (T002–T005) blocks all stories. US2 (T008) depends on T002/T005. US3 depends on T003.
- US1, US2 and US3 touch different files except MemberView.tsx (T010, T013, T014). Do those in order.

## Parallel examples

- T007 alongside T006; T009 alongside T008; T012 alongside T011.

## Implementation strategy

Foundational first (cutoff + snapshot), then US2 (the main requirements-level improvement, O-1), then
US1 and US3 messaging, then polish and deploy. Every V1 test must still pass, apart from the ones
whose expected values change by design (cutoff time, wording).
