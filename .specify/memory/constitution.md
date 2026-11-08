# CSA Box Planner Constitution

ABC Design Services — 17-626 Assignment 3. A spec-driven prototype for weekly CSA box planning,
member swap requests, and packing, derived from the group's merged stakeholder goal model.

## Core Principles

### I. Requirements Traceability

- Every functional requirement in a spec MUST carry an ID (`FR-###`) and MUST cite the SG leaf
  goal(s) it implements (e.g., `[SG-6]`).
- Every SG goal MUST map to its source A2 member goal IDs via the crosswalk in
  `docs/goalmodel/goal-model.md`.
- Every SG leaf goal MUST cite stakeholder interview evidence (transcript + location) or be
  explicitly labeled an analyst assumption.
- Every acceptance scenario MUST reference the `FR-###` it verifies.

**Rationale**: The Requirements Traceability Matrix (interview → goal → requirement → code) must be
derivable directly from the artifacts, not reconstructed after the fact.

### II. Sprint Scope Discipline

- Only goals in the selected sprint scope MUST be implemented: the SG-2, SG-5, SG-8 and SG-13
  subtrees under SG-1.
- Out-of-scope needs (restaurant ordering, market sales, offline synchronization, lot
  traceability reports) MUST be recorded as out of scope in the spec, and MUST NOT be built.
- Any plan or task that introduces behavior not traceable to an in-scope SG goal MUST be
  flagged and removed or justified before implementation.

**Rationale**: The prototype exists to validate selected requirements, not to build the whole
farm system; scope creep from the SE agent undermines evaluation.

### III. Specification Before Code

- Any change to intended behavior MUST be made in the spec first, then propagated to plan and
  tasks, then to code.
- Code changes that alter behavior without a corresponding spec change are defects.
- Version 1 and Version 2 MUST be preserved as separate git tags/branches (`v1`, `v2`), with V2
  building on V1 so history is retained.

**Rationale**: Spec-driven development keeps requirements and implementation consistent and makes
the V1 → V2 requirements-level improvement visible.

### IV. Conflicts Are Preserved, Not Removed

- Conflicting or overlapping stakeholder goals (e.g., the swap request cutoff) MUST be documented
  with the decision taken: prioritization, compromise, or provisional assumption.
- Conflicting goals or requirements MUST NOT be silently deleted from the goal model or spec.
- Conflicts that cannot be resolved without stakeholders MUST be marked
  `NEEDS STAKEHOLDER CLARIFICATION` and remain visible in both the goal model and spec.

**Rationale**: The reasoning behind trade-offs is a primary deliverable; losing it loses the human
judgment the process depends on.

### V. Explicit Assumptions

- Any requirement, rule, value, or workflow detail not grounded in interview evidence MUST be
  labeled as an assumption in the spec.
- Mock data values (quantities, prices, share values, dates) MUST be treated as assumptions,
  not stakeholder facts.

**Rationale**: Distinguishing stakeholder needs from analyst or agent inventions allows
"additional needs" to be validated rather than assumed.

### VI. Prototype Simplicity

- The prototype MUST be a static web frontend using mock data only: no backend, database,
  authentication, or external services.
- Interactions MAY be simplified (e.g., role switcher instead of login) when the simplification
  does not change the requirement being demonstrated.
- The build MUST be deployable as two independent deployments (V1 and V2).

**Rationale**: The evaluation emphasizes requirements engineering and traceability, not technical
complexity; simplicity keeps both versions deployable and comparable.

### VII. Honest Claims

- The prototype MUST NOT present mock data as guaranteeing allergen, cross-contact, or food-safety
  properties.
- The prototype MUST NOT present provisional or assumed rules (e.g., the swap cutoff) as agreed
  stakeholder policy; such rules MUST be labeled provisional in the UI or spec.

**Rationale**: Overclaiming misleads evaluators and stakeholders about what has been validated.

## Prototype Constraints

- **Frontend**: static web app in `frontend/`. Default stack Vite + React (TODO: confirm with
  group).
- **Data**: mock JSON/TS data checked into `frontend/`.
- **Artifacts**: Spec Kit artifacts in `specs/`; goal model, traceability matrix, and learning log
  in `docs/` (`goalmodel/goal-model.md`, `traceability.md`, `learning-log.md`).
- **Users represented**: Lucia (farm planner), CSA member (e.g., Raj), packing crew.

## Development Workflow & Quality Gates

1. Goal model and scope decisions recorded in `docs/goalmodel/goal-model.md` before `/speckit-specify`.
2. `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` →
   `/speckit-implement`, with a human review between each step.
3. The plan's Constitution Check MUST pass (or violations be justified) before tasks are generated.
4. `/speckit-analyze` SHOULD be run before implementation to check spec/plan/tasks consistency.
5. Each Spec Kit step SHOULD be committed separately so the development history is preserved.
6. The learning log (`docs/learning-log.md`) is authored by group members only; the SE agent MUST
   NOT write or edit it.

## Governance

- This constitution supersedes conflicting practices in plans, tasks, or agent output.
- Amendments require group agreement and MUST be recorded in git history with a version bump.
- Versioning follows semantic versioning: MAJOR for removed or redefined principles, MINOR for
  added or materially expanded principles/sections, PATCH for clarifications.
- Reviews of specs, plans, and tasks MUST verify compliance with Principles I–VII.

**Version**: 1.0.0 | **Ratified**: 2026-11-08 | **Last Amended**: 2026-11-08
