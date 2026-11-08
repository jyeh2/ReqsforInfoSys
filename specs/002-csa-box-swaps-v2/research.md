# Research & Decisions: 001-csa-box-swaps (V1)

No `NEEDS CLARIFICATION` items remained in Technical Context. This file records technology choices
and **interpretations of points the spec leaves silent**. Interpretations are flagged so they can be
evaluated in Step 4 as possible requirements issues (Constitution III).

## Technology

### T-1 Vite + React + TypeScript
- **Decision**: Vite 5, React 18, TypeScript.
- **Rationale**: Static build, fast dev server, sub-path `base` support for side-by-side V1/V2.
- **Alternatives**: Plain HTML/JS (less structure for 4 role views); Next.js (server features unused).

### T-2 State and persistence
- **Decision**: One reducer holding all demo state; persisted to `localStorage` in try/catch; "Reset
  demo" restores seed data.
- **Rationale**: All roles share one browser in a demo (A-7); no backend allowed (Constitution VI).
- **Alternatives**: In-memory only (loses state on reload during a walkthrough).

### T-3 Time representation
- **Decision**: Local date-time strings `YYYY-MM-DDTHH:mm` for the demo week; compared as strings.
- **Rationale**: Avoids time-zone shifts between viewers; the demo clock is simulated anyway.
- **Mock week**: pickup Fri 2026-11-13; packing starts Thu 2026-11-12 08:00 (A-1).

### T-4 Hosting
- **Decision**: `APP_VERSION=v1` → `base: /ReqsforInfoSys/v1/`, `outDir: ../v1`; commit build;
  `.nojekyll` at repo root.
- **Rationale**: Pages is in branch mode serving `main` root (group decision).

## Rule decisions

### D-1 computation (FR-009)
- **Decision**: `cutoff = min(packingStart − 24h, Wednesday 20:00 of pickup week)` → Wed 2026-11-11
  08:00.
- **Rationale**: Goal model decision D-1; both inputs shown in the UI so the conflict stays visible.

## Interpretations of silent spec points (review in Step 4)

| ID | Spec gap | V1 interpretation | Related FR |
|---|---|---|---|
| I-1 | When may packers check items? | Any time after confirmation. | FR-015, FR-016 |
| I-2 | A line changes after a packer checked it (swap approved before packing starts) | The new line starts unchecked; box "Checked" is shown only while every current line is checked. | FR-016 |
| I-3 | Lucia removes an item that has an **approved** swap | Treated like pending: status becomes "Declined — item no longer in box". | FR-018, edge case |
| I-4 | Edits to a provisional box | Applied live to the estimate; no re-publish step. | FR-004, FR-006 |
| I-5 | Edits to a confirmed box that break share value/feasibility | Warnings shown; edit is not blocked (spec validates only on publish). | FR-004, FR-018 |
| I-6 | Moving the demo clock backwards | Derived statuses (late, not reviewed) recompute from the clock. | FR-020 |
| I-7 | Substitute quantity per swap | Equal to the original item's per-box quantity (A-4). | FR-010, FR-012 |
| I-8 | Can a member choose a substitute already in the base box? | No; only approved substitutes not already in the box. | FR-010 |
