# Implementation Plan: CSA Weekly Box Planning and Member Swaps (V2)

**Branch**: `002-csa-box-swaps-v2` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-csa-box-swaps-v2/spec.md` (revises
`specs/001-csa-box-swaps/`, frozen at tag `v1`)

## Summary

V2 keeps the V1 architecture and changes only what the revised spec requires after the V1
evaluation (`docs/traceability.md`):

- **D-2 cutoff (O-2):** the cutoff moves to Wednesday 20:00 for a Friday pickup. All three C-1
  proposals are still shown.
- **Draft warning (FR-023):** Lucia is warned while the box is still a draft.
- **Closed vs locked (FR-024, O-3):** "requests closed" at the cutoff and "list locked" at packing start
  are separate moments.
- **Estimate changes (FR-008, O-1):** changes to the provisional estimate are marked against a
  published snapshot, and the confirmed box gets a "Different from the first estimate" summary.
- **Approved swaps (O-10):** always marked, whenever they were approved.
- **Defect fixes (O-7, O-8, O-9):** no requirement IDs in the UI, units in change markers, and status
  messages that stay current.

V2 is built to `v2/` and served at `https://jyeh2.github.io/ReqsforInfoSys/v2/`. `v1/` is not touched.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20+ (unchanged from V1)

**Primary Dependencies**: React 18, Vite 5 (unchanged)

**Storage**: Browser `localStorage`, keyed per version (`csa-box-planner-v2`) so V1 and V2 demos on
the same origin do not share state

**Testing**: Vitest domain-rule tests (V1 suite updated, plus V2 cases)

**Target Platform**: Static hosting, GitHub Pages branch mode, sub-path `/ReqsforInfoSys/v2/`

**Project Type**: Static web application (frontend only)

**Performance Goals**: Not a concern at prototype scale

**Constraints**: `v1/` build output and the `v1` tag must stay unchanged; V2 builds with
`APP_VERSION=v2`

**Scale/Scope**: Same 4 screens. The changes touch `schedule.ts`, `memberBox.ts`, `swaps.ts`,
`reducer.ts`, `types.ts`, `PlannerView.tsx`, `MemberView.tsx`, `CutoffNotice.tsx` and `Header.tsx`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|---|---|---|
| I. Traceability | New and changed FRs cite SG goals and the V1 observation (O-x) | PASS — FR-023 [SG-16, SG-6], FR-024 [SG-17, SG-12]; changes tagged [V2] with O-IDs |
| II. Sprint scope | No new goals; deferred items (O-4, O-5, O-6, O-11, O-12) stay unbuilt | PASS |
| III. Spec before code | Spec and goal model revised and clarified before this plan; V1 frozen at tag `v1` | PASS |
| IV. Conflicts preserved | C-1 keeps Proposals A, B and C; D-1 kept as superseded | PASS |
| V. Assumptions explicit | A-1 updated with evidence; D-2 still labeled provisional | PASS |
| VI. Simplicity | Same static stack; second deployment slot `v2/` | PASS |
| VII. Honest claims | Cutoff still labeled provisional; no safety claims | PASS |

**Post-design re-check**: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/002-csa-box-swaps-v2/
├── plan.md              # This file (V2)
├── research.md          # V2 decisions (V2-1 … V2-8) + carried-over V1 decisions
├── data-model.md        # V2 entity/derived-value changes
├── quickstart.md        # V2 validation walkthrough
├── contracts/
│   ├── domain.md        # Domain functions (changed ones marked V2)
│   └── ui.md            # Screen contracts (changed ones marked V2)
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
frontend/src/
├── domain/
│   ├── types.ts         # V2: BoxPlan.publishedLines, publishedAt
│   ├── schedule.ts      # V2: D-2, proposal C, formatting helpers
│   ├── memberBox.ts     # V2: estimateChanges, confirmedVsEstimate, laterChanges, formatQty
│   ├── swaps.ts         # V2: late reason wording, closedMessage
│   └── *.test.ts
├── state/reducer.ts     # V2: publish snapshot; submit returns request id
└── components/
    ├── Header.tsx       # V2: presets around the new cutoff
    ├── CutoffNotice.tsx # V2: D-2 + three proposals
    ├── PlannerView.tsx  # V2: draft warning (FR-023)
    └── MemberView.tsx   # V2: estimate markers, summary, closed vs locked, live status message

v2/                      # V2 build output (new); v1/ unchanged
```

**Structure Decision**: Same single-frontend structure as V1. V1's source is preserved by the `v1` tag
and its build by `v1/`. V2 changes the shared `frontend/` source and builds to `v2/`.

## Complexity Tracking

No constitution violations to justify.
