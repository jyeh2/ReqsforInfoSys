# A3 Prototype V1 — Scoped Group Goal Model

**Status:** Proposed for group review, not yet a confirmed team or stakeholder decision.

**Files:** `goal_model_sprint.py` generates the editable Mermaid source `goal_model_sprint.mmd` and a Mermaid Live Editor link. Export the latter as `goal_model_sprint.svg`.

## 1. System boundary and selected goals

Our V1 prototype covers **weekly CSA box planning, informing members, processing restricted substitutions, and updating the packing checklist**. The four main goals are:

| Group ID | Selected goal | Why it is in V1 |
| --- | --- | --- |
| SG-2 | Create a feasible weekly CSA box plan | **Core:** a box plan is needed before previews, requests, and packing. Mock harvest quantities are sufficient for testing. |
| SG-5 | Members see reliable box information | **User-facing:** members need to distinguish an early estimate from the current confirmed contents. |
| SG-8 | Handle swaps within farm limits | **Uncertain:** requests must balance member flexibility with available produce and the packing deadline. |
| SG-13 | Pack the correct box for each member | **Core:** approval must actually reach the packing list; otherwise a swap status alone is insufficient. |

V1 uses sample members and mock harvest data. **Out of scope:** full restaurant ordering, Saturday market accounting, offline synchronization, and organic-certification lot reports. We are deferring them because they do not need to be implemented to evaluate this short CSA workflow. Food-allergen and cross-contact safety cannot be validated with mock item labels; do not describe V1 as safety-certified.

## 2. Crosswalk: different Assignment 2 goal IDs

All three team members independently reused `G-1`, `G-2`, and other numbers. **The same G-number is not the same goal across files.** We therefore assign fresh group IDs `SG-*` and keep a mapping to the original files. The references below identify *related source goals*, not necessarily exact one-to-one duplicates.

| Group goal | Your A2 model | Detailed teammate model (A2 catalogue) | Smaller teammate model |
| --- | --- | --- | --- |
| SG-2: box planning | G-27, G-28, G-29, G-30 | G-2, G-7, G-18 | G-13, G-17 |
| SG-5: early vs confirmed information | G-41, G-42, G-44, G-56; Raj G-57–G-61 | G-40, G-41, G-42, G-43 | Related stakeholder-information goals; inspect original files before assigning exact IDs |
| SG-8: approved swaps and status | G-62, G-64, G-65, G-66 | G-46, G-47, G-49, G-93, G-94 | G-19, G-30, G-32 |
| SG-13: correct packing | G-31, G-32, G-33, G-34 | G-2, G-10, G-11, G-20 | G-20, G-24 |

**Mapping rule:** any V1 specification references `SG-*` as the stable group ID, and this table points back to the A2 model and its interview evidence. We have not silently renamed a teammate's G-ID as though the IDs matched.

## 3. Step 2: overlaps, dependencies, and decisions

### Overlap: reliable box information

Lucia and Raj both want members to receive dependable box contents. We combine this need under SG-5, but **do not merge the distinct actions**: SG-6 explicitly marks an early preview as provisional, while SG-7 displays confirmed contents and subsequent changes. A provisional estimate should not be presented as a guaranteed box.

### Dependency: an approved swap must reach packing

SG-2 produces the box plan, which SG-5 publishes. SG-10 offers only the farm-approved alternatives available that week. Lucia makes the approval decision (SG-11), its status is shown (SG-12), and an approved change must update the packing list (SG-14). The packer verifies against the current list (SG-15). The dashed arrows in the graph highlight these cross-branch dependencies; the solid arrows show goal refinement.

### C-1: conflicting cutoff proposals

Two A2 versions describe different operational deadlines:

- **Proposal A:** stop member changes **24 hours before packing begins** (detailed teammate model, G-94).
- **Proposal B:** use **Wednesday evening for a Friday pickup** (smaller teammate model, G-30 after reconciliation). The precise Wednesday hour is a proposed interpretation, not a verified stakeholder agreement.

These are not necessarily contradictory without knowing the packing schedule. They **can lead to different deadlines**, however, and the team cannot assume one is agreed. The Mermaid diagram preserves *both* options in its `C-1` conflict area instead of deleting either.

**D-1 — provisional V1 compromise (analyst assumption):** Use the **earlier** of (a) `packing start - 24 hours` and (b) **Wednesday 8:00 p.m. for a Friday pickup**. For pickups on other days, apply the 24-hour-before-packing rule until a timetable is agreed. The application should display that week's cutoff (SG-16); requests received afterward are declined with a reason and cannot silently alter the finalized packing list (SG-17).

**Why this compromise?** It prioritizes a stable packing list while still allowing swaps until a published deadline. It may restrict members more than Raj intended, so **group and stakeholder confirmation is still required**. If the packing schedule or stakeholder feedback changes, update D-1 in the specification and goal model *before* implementation changes.

### Other conflict and scope notes

The wider A2 models disagree about whether CSA or restaurant promises take precedence when produce is short. This remains relevant to the full system, but we are **not implementing restaurant allocation in V1**. We will not infer that a restaurant-first or CSA-first policy has been agreed. Mock stock available for the box plan is a prototype input, not a solution to the wider conflict.

## 4. How to read the diagram

- `SG-1` is the top-level result; `SG-2`, `SG-5`, `SG-8`, and `SG-13` are the four selected areas.
- **Solid arrows** break a broad goal into supporting smaller goals.
- **Dashed arrows** indicate an interaction or dependency between branches.
- **C-1** shows two cutoff alternatives from different A2 models.
- **D-1** is our **proposed V1 rule**, not an interview fact or approved final decision.
- The red **Open** note makes the remaining schedule/approval question visible.

This document explains the model. **The assignment-required learning log** is still `learning-log.md`, which includes a concise summary of our Step 1 and Step 2 reasoning.

## 5. V1 schedule assumption (needed to compute D-1)

D-1 cannot produce a concrete deadline without a packing time, so V1 assumes (**analyst assumption A-1, not stakeholder-confirmed**):

| Input | V1 value |
| --- | --- |
| Pickup | Friday |
| Packing starts | Thursday 08:00 |
| Proposal A (24 h before packing) | Wednesday 08:00 |
| Proposal B (Wednesday evening) | Wednesday 20:00 |
| **D-1 cutoff (earlier)** | **Wednesday 08:00**, shown in the app as provisional |

If stakeholders give a different packing time, update this table and spec assumption A-1 first.

## 6. Responsibilities (agents)

| Agent | Responsible for |
| --- | --- |
| Lucia (farm planner) | SG-3, SG-4, SG-11 |
| CSA member (e.g., Raj) | SG-9 (submitting a request) |
| Packing crew | SG-15 |
| CSA prototype (software) | SG-6, SG-7, SG-10, SG-12, SG-14, SG-16, SG-17 |

## 7. Interview evidence per leaf goal (to complete)

Needed for the Step 4 traceability matrix. Leaves without interview support stay labeled as analyst assumptions.

| SG leaf | Interview evidence (transcript, location) |
| --- | --- |
| SG-3 Review available produce | TODO |
| SG-4 Contents meet share value | TODO |
| SG-6 Early estimate labeled provisional | TODO |
| SG-7 Confirmed contents and changes | TODO |
| SG-9 Request before cutoff | TODO |
| SG-10 Farm-approved substitutes | TODO |
| SG-11 Lucia approves or declines | TODO |
| SG-12 Status visible to both | TODO |
| SG-14 Approved swap updates packing list | TODO |
| SG-15 Packers check current list | TODO |
| SG-16 Display provisional cutoff | Analyst assumption (added in Step 2) |
| SG-17 Late requests declined with reason | Analyst assumption (added in Step 2) |
