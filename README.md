# CSA Box Planner: Spec-Driven Development (17-626 Assignment 3)

ABC Design Services. A spec-driven prototype for a CSA farm: weekly box planning, member swap
requests and packing. It was built with GitHub Spec Kit from our merged stakeholder goal model, then
evaluated and revised from Version 1 to Version 2.

## Deliverables

| # | Deliverable | Link |
|---|---|---|
| 1 | **GitHub Version 1**: initial goal model, specification, Spec Kit artifacts, prototype source | [`v1` branch](https://github.com/jyeh2/ReqsforInfoSys/tree/v1) |
| 2 | **GitHub Version 2**: revised goal model, specification, Spec Kit artifacts, prototype source | [`v2` branch](https://github.com/jyeh2/ReqsforInfoSys/tree/v2) |
| 3 | **Prototype V1 URL** | https://jyeh2.github.io/ReqsforInfoSys/v1/ |
| 4 | **Prototype V2 URL** | https://jyeh2.github.io/ReqsforInfoSys/v2/ |
| 5 | **Requirements Analysis and Learning Log** | [`docs/goalmodel/learning-log.md`](docs/goalmodel/learning-log.md) |

Supporting documents:

| Document | Purpose |
|---|---|
| [`docs/goalmodel/goal-model.md`](docs/goalmodel/goal-model.md) | Goal model, A2 crosswalk, goal relationships, conflict C-1 and decisions D-1 → D-2 ([V2 diagram](docs/goalmodel/goal_model_sprint.svg) · [V1 diagram](docs/goalmodel/goal_model_sprint_v1.svg)) |
| [`docs/traceability.md`](docs/traceability.md) | Requirements Traceability Matrix (interview → goal → requirement → code → status), V1 evaluation observations, V2 re-evaluation |
| [`docs/v1-to-v2.md`](docs/v1-to-v2.md) | Summary of what changed between V1 and V2, and why |
| [`transcripts/`](transcripts/) | Interview transcripts (Assignment 1) with a citation index |

## Versions at a glance

| | Version 1 | Version 2 |
|---|---|---|
| Spec Kit artifacts | [`specs/001-csa-box-swaps/`](specs/001-csa-box-swaps/) | [`specs/002-csa-box-swaps-v2/`](specs/002-csa-box-swaps-v2/) |
| Swap cutoff | D-1: earlier of two proposals → Wed 08:00 | D-2: Wed 20:00 (stakeholder-stated), still provisional |
| Key change | — | Members see changes to the provisional estimate; "requests closed" is separate from "list locked"; Lucia is warned to publish before the cutoff |

To try either prototype, use the **role switcher** (Lucia, member or packer) and the **demo clock** in
the header. Use **Reset demo** to start over. All data is mock data.

## Repository structure

```text
├── frontend/                 # Prototype source (Vite + React + TypeScript)
│   └── src/domain/           # Business rules + unit tests (traced to FR IDs)
├── specs/
│   ├── 001-csa-box-swaps/    # V1 Spec Kit artifacts (spec, plan, research, data model, contracts, tasks)
│   └── 002-csa-box-swaps-v2/ # V2 Spec Kit artifacts (copied from V1, then revised)
├── docs/
│   ├── goalmodel/            # Goal model (.md, .py, .mmd, .svg) and learning log
│   ├── traceability.md       # Requirements Traceability Matrix
│   └── v1-to-v2.md           # V1 → V2 change summary
├── transcripts/              # Stakeholder interview transcripts
├── v1/ , v2/                 # Built prototypes served by GitHub Pages
└── .specify/memory/constitution.md   # Spec Kit project constitution
```

## Running locally

```bash
cd frontend
npm install
npm test            # domain rule unit tests
npm run dev         # local dev server
npm run build:v2    # rebuild the V2 deployment into ../v2
```

## Roles and Responsibilities

<!-- TODO(group): replace each row with a member's name and a brief description of their contributions. -->

| Member | Contributions |
|---|---|
| TODO | TODO |
| TODO | TODO |
| TODO | TODO |
