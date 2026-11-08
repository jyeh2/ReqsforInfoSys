# Implementation Plan: CSA Weekly Box Planning and Member Swaps (V1)

**Branch**: `001-csa-box-swaps` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-csa-box-swaps/spec.md`

## Summary

A static single-page prototype that demonstrates the sprint workflow plan → publish → swap → pack
for one mock week. Lucia builds and confirms a box plan (SG-2), members see provisional vs
confirmed contents with changes marked (SG-5), members request swaps from approved substitutes
before the provisional D-1 cutoff and Lucia decides (SG-8), and packers check per-member lists that
include approved swaps (SG-13). Business rules live in pure, unit-tested domain functions; the UI is
a thin layer with a role switcher and a demo clock. Built to `v1/` and served by GitHub Pages at
`https://jyeh2.github.io/ReqsforInfoSys/v1/`.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20+ for tooling (local: Node 24)

**Primary Dependencies**: React 18, Vite 5 (build/dev server)

**Storage**: Browser `localStorage` for demo state (wrapped in try/catch; app works without it);
mock seed data in TypeScript modules

**Testing**: Vitest for domain-rule unit tests

**Target Platform**: Modern desktop and mobile browsers; static hosting (GitHub Pages, branch mode)

**Project Type**: Static web application (frontend only)

**Performance Goals**: Not a concern at prototype scale (one week, ~12 items, 4 members)

**Constraints**: No backend, auth or external services (Constitution VI); must build to a sub-path
(`/ReqsforInfoSys/v1/`) so V1 and V2 deploy side by side

**Scale/Scope**: 4 screens (Planner, Member box, Requests, Packing) + shared header (role switcher,
demo clock, reset)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|---|---|---|
| I. Traceability | Every FR in spec cites an SG goal; tasks and code comments reference FR IDs | PASS — FR-001–FR-018 cite SGs; FR-019–FR-022 labeled prototype-support / Constitution VII |
| II. Sprint scope | Nothing built outside SG-2/5/8/13 subtrees except labeled demo support | PASS — role switcher, demo clock, reset are demo support only |
| III. Spec before code | Plan introduces no behavior absent from spec | PASS — interpretations of silent spec points are recorded in research.md as R-decisions, to be reviewed in Step 4 |
| IV. Conflicts preserved | C-1/D-1 shown in UI and spec | PASS — cutoff computed by D-1 and labeled provisional (FR-009) |
| V. Assumptions explicit | Mock data and A-1 schedule labeled | PASS — mock data banner; schedule shown with "assumption" label |
| VI. Simplicity | Static, mock data, deployable twice | PASS — Vite build with configurable output dir and base path |
| VII. Honest claims | No food-safety claims; provisional rules labeled | PASS — FR-022; no allergen fields in data model |

**Post-design re-check**: PASS (no new violations introduced by data model or contracts).

## Project Structure

### Documentation (this feature)

```text
specs/001-csa-box-swaps/
├── plan.md              # This file
├── research.md          # Phase 0: decisions and spec interpretations
├── data-model.md        # Phase 1: entities, derived values, state transitions
├── quickstart.md        # Phase 1: run + validation walkthrough
├── contracts/
│   ├── domain.md        # Pure domain function contracts (FR-mapped)
│   └── ui.md            # Screen contracts per role (FR-mapped)
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
frontend/
├── index.html
├── package.json
├── vite.config.ts           # base + outDir from APP_VERSION (v1 → ../v1)
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx              # layout, role routing
    ├── styles.css
    ├── data/
    │   └── mockWeek.ts      # harvest, members, schedule, starter plan (A-3)
    ├── domain/
    │   ├── types.ts
    │   ├── schedule.ts      # D-1 cutoff, clock phase
    │   ├── plan.ts          # value, feasibility, publish/confirm rules
    │   ├── swaps.ts         # substitutes, request validation, transitions
    │   ├── memberBox.ts     # member view + change marking
    │   ├── packing.ts       # packing list derivation, check rules
    │   └── *.test.ts        # Vitest unit tests
    ├── state/
    │   ├── reducer.ts       # actions → domain calls
    │   └── store.tsx        # context + localStorage persistence
    └── components/
        ├── Header.tsx       # role switcher, demo clock, reset, mock-data banner
        ├── PlannerView.tsx  # Lucia: plan, publish, confirm, edit
        ├── RequestsView.tsx # Lucia: swap queue
        ├── MemberView.tsx   # member: box, cutoff, request form, statuses
        └── PackingView.tsx  # packer: per-member lists, checks

v1/                          # build output served by GitHub Pages (committed)
.nojekyll                    # disable Jekyll so built assets are served as-is
```

**Structure Decision**: Single frontend project in `frontend/`. Domain rules are isolated in
`src/domain/` as pure functions so each FR can be unit-tested and traced to code for the Step 4
traceability matrix. Build output goes to the repo-root `v1/` folder (later `v2/`) because Pages is
configured to serve `main` from the repository root.

## Complexity Tracking

No constitution violations to justify.
