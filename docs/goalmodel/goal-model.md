# A3 Prototype — Scoped Group Goal Model (V2)

**Status:** V2, revised in Step 5 after evaluating Prototype V1 (see §7 and [`../traceability.md`](../traceability.md)). The V1 version of this file is preserved at the `v1` tag.

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

**V2 update — D-1 superseded by D-2.** Checking every transcript during the V1 evaluation (observation O-2) changed our understanding of C-1:

- **Proposal A has no interview evidence.** It appears only in an A2 goal model (G-94). No stakeholder said "24 hours before packing".
- **Proposal B is stated by Hank:** "for a Friday box, we'd want the pause or swap by Wednesday evening" (T3/Hank-b:65).
- **Proposal C (new) from Raj:** he wants to know "at least 48 hours before pickup" (T3/Raj:98) and wants swaps kept open "until packing is finalized" (T1/Raj:21).
- **Lucia's timeline:** she sends the contents "by Wednesday" so members can request swaps before packing (T3/Lucia:41). D-1's Wednesday 08:00 could therefore close swaps before members had seen the box.

**D-2 — provisional V2 rule:** the cutoff is **Wednesday 20:00 for a Friday pickup**, and the box must be published before the cutoff. This is the only farm-side deadline a stakeholder actually stated. It meets Raj's 48-hour expectation for a morning pickup and leaves Thursday packing intact (SG-13). Proposals A and C stay in the model; D-1 stays as a superseded decision. **Still requires confirmation from Lucia and Hank.**

### Other conflict and scope notes

The wider A2 models disagree about whether CSA or restaurant promises take precedence when produce is short. This remains relevant to the full system, but we are **not implementing restaurant allocation in V1**. We will not infer that a restaurant-first or CSA-first policy has been agreed. Mock stock available for the box plan is a prototype input, not a solution to the wider conflict.

## 4. How to read the diagram

- `SG-1` is the top-level result; `SG-2`, `SG-5`, `SG-8`, and `SG-13` are the four selected areas.
- **Solid arrows** break a broad goal into supporting smaller goals.
- **Dashed arrows** indicate an interaction or dependency between branches.
- **C-1** shows three cutoff alternatives (A, B and C), each labeled with its source.
- **D-1** (grey, dashed) is the superseded V1 rule. **D-2** is our **proposed V2 rule**, not an approved final decision.
- The red **Open** note makes the remaining schedule/approval question visible.

This document explains the model. **The assignment-required learning log** is still `learning-log.md`, which includes a concise summary of our Step 1 and Step 2 reasoning.

## 5. Schedule assumption (needed to compute the cutoff)

A concrete deadline needs a packing time. We assume (**analyst assumption A-1**; Thursday packing is supported by T2/Lucia:10, but the hour is not confirmed):

| Input | V1 | V2 |
| --- | --- | --- |
| Pickup | Friday | Friday 09:00 |
| Packing starts | Thursday 08:00 | Thursday 08:00 |
| Proposal A (24 h before packing) | Wednesday 08:00 | Wednesday 08:00 (no interview evidence) |
| Proposal B (Wednesday evening) | Wednesday 20:00 | Wednesday 20:00 |
| Proposal C (48 h before pickup) | — | Wednesday 09:00 (an information deadline, not a cutoff) |
| **Cutoff** | **D-1: Wednesday 08:00** | **D-2: Wednesday 20:00**, shown in the app as provisional |

If stakeholders give a different packing time, update this table and spec assumption A-1 first.

## 6. Responsibilities (agents)

| Agent | Responsible for |
| --- | --- |
| Lucia (farm planner) | SG-3, SG-4, SG-11 |
| CSA member (e.g., Raj) | SG-9 (submitting a request) |
| Packing crew | SG-15 |
| CSA prototype (software) | SG-6, SG-7, SG-10, SG-12, SG-14, SG-16, SG-17 |

## 7. Changes from V1 to V2

| Change | Why (V1 evaluation) |
| --- | --- |
| C-1 now records the source and evidence of each proposal, and adds Proposal C (Raj). | O-2: Proposal A had no interview support; Raj's and Lucia's timelines were not modeled. |
| D-1 superseded by D-2 (Wednesday 20:00; box published before cutoff). D-1 kept, marked superseded. | O-2 |
| SG-17 now separates "requests closed" (cutoff) from "list locked" (packing start). | O-3: V1 told members the list was locked while Lucia could still approve requests. |
| SG-6 now also covers marking changes to the provisional estimate. | O-1: estimate changes were invisible to members (T2/Lucia:40, T1/Raj:21). |

Goal satisfaction after V1: SG-2 and SG-13 satisfied; SG-5, SG-8 partially satisfied (see the traceability matrix). Deferred goals and needs (decline reasons and alternatives, pre-packing warning, swap value, substitute quantities, standing preferences) remain recorded in [`../traceability.md`](../traceability.md) §3–§4.
