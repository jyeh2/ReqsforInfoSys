# Requirements Traceability Matrix — Prototype V1

**Evaluated build**: V1 (`v1` tag) at https://jyeh2.github.io/ReqsforInfoSys/v1/
**Evaluation date**: 2026-11-08
**Method**: Full walkthrough of the deployed site in all three roles (Lucia, members Raj/Mei/Sam/Dana,
packer) across the demo-clock phases (Mon 09:00 → Tue 12:00 → cutoff Wed 08:00 → Wed 21:00 → packing
Thu 08:00), following [`quickstart.md`](../specs/001-csa-box-swaps/quickstart.md); plus the 26 domain
unit tests in `frontend/src/**/*.test.ts`. Interview evidence was checked against all ten transcripts.

## How to read this matrix

- **Requirement**: ID in [`spec.md`](../specs/001-csa-box-swaps/spec.md) (V1).
- **Interview evidence**: `<set>/<stakeholder>:<line>` — line number in the CSV listed in
  [`transcripts/README.md`](../transcripts/README.md).
- **Goal**: SG ID in [`goal-model.md`](goalmodel/goal-model.md).
- **Code**: path under `frontend/src/`.
- **Status** compares the running prototype with the requirement *and* the stakeholder need behind
  it:
  - **Fully satisfied**: matches the spec and the evidence.
  - **Partially satisfied**: matches the spec, but the evaluation found an implementation defect or a gap
    between the spec and the stakeholder need. See the linked observation (O-x).
  - **Not satisfied**: not implemented.

## 1. Sprint requirements

| Requirement | Interview evidence | Goal | Code / Implementation | Status |
|---|---|---|---|---|
| **FR-001** Show harvest items with available qty and unit value | T2/Lucia:10 ("check what the growers expect to harvest and draft a box list"); T3/Lucia:30 (plans from "Hank's harvest estimate, the cooler stock") | SG-3 | `components/PlannerView.tsx` harvest table; `data/mockWeek.ts` | Fully satisfied |
| **FR-002** Box value vs promised share value, with shortfall | T3/Lucia:15 (box must "reach the minimum retail value we advertised"); T3/Lucia:22 (wants the total calculated, "warning me early if it was under") | SG-4 | `domain/plan.ts` `boxValue`; `PlannerView.tsx` summary | Fully satisfied |
| **FR-003** Flag items whose qty × members exceeds harvest | T1/Lucia:41 (compare harvest "with the CSA allocations before packing starts"); T1/Lucia:16 (flag shortages) | SG-3, SG-4 | `domain/plan.ts` `infeasibleItems`; row highlight "Not enough harvest" | Fully satisfied |
| **FR-004** Publish as provisional only when valid | T2/Lucia:40 (members "see the first post and assume it's final") | SG-2, SG-6 | `domain/plan.ts` `canPublish`; `state/reducer.ts` `publish` | Fully satisfied |
| **FR-005** Confirm box, record time | T2/Lucia:35 ("publish the finalized box contents … from one place") | SG-7 | `state/reducer.ts` `confirm` (snapshot `confirmedLines`) | Fully satisfied |
| **FR-006** Member sees Draft / "Provisional — may change" | T2/Lucia:40; T2/Raj:91 ("best current estimate … with a notification when something changes") | SG-6 | `components/MemberView.tsx` status badge + notice | Partially satisfied — O-1 |
| **FR-007** Member sees confirmed contents and time | T3/Raj:67 ("knowing the final box contents early enough to plan meals") | SG-7 | `domain/memberBox.ts` `memberBox`; `MemberView.tsx` | Fully satisfied |
| **FR-008** Changes after confirmation marked (new + replaced item) | T2/Lucia:35 ("clearly mark any changes"); T3/Raj:96 ("what was replaced, why") | SG-7 | `domain/memberBox.ts` `memberChanges`; change tag in `MemberView.tsx` | Partially satisfied — O-8, O-10 |
| **FR-009** Display provisional cutoff computed by D-1 | T3/Hank-b:65 ("for a Friday box, we'd want the pause or swap by Wednesday evening"); T3/Raj:72 ("the farm sets a clear cutoff"); T3/Raj:98 ("at least 48 hours before pickup"). **No transcript supports Proposal A (24 h before packing).** | SG-16 | `domain/schedule.ts` `computeCutoff`; `components/CutoffNotice.tsx` | Partially satisfied — O-2 |
| **FR-010** Offer only farm-approved substitutes with stock | T3/Hank-b:63 (swapping "gets unrealistic when we're already sorting a short harvest"); T3/Raj:72 ("limited by what's actually available") | SG-10 | `domain/swaps.ts` `substituteOptions`, `remainingQty` | Partially satisfied — O-4, O-11 |
| **FR-011** Member requests a swap before cutoff | T1/Raj:19 ("let me swap an item before packing is finalized"); T2/Raj:52 ("a cutoff for requesting substitutions") | SG-9 | `domain/swaps.ts` `validateRequest`; swap form in `MemberView.tsx` | Fully satisfied |
| **FR-012** Lucia approves / declines; approve blocked if stock short | T3/Lucia:65 ("one member record showing the request, whether I approved it"); T3/Lucia:68 (promised a swap without checking stock) | SG-11 | `domain/swaps.ts` `canApprove`, `canDecline`; `components/RequestsView.tsx` | Partially satisfied — O-5, O-12 |
| **FR-013** Status visible to member and Lucia | T2/Raj:100 ("pending, approved, or unavailable"); T3/Raj:65 (wants "a confirmation showing that the swap was accepted") | SG-12 | `domain/swaps.ts` `effectiveStatus`, `STATUS_LABEL`; `MemberView.tsx`, `RequestsView.tsx` | Partially satisfied — O-5, O-9 |
| **FR-014** Late requests recorded as Declined with reason | T3/Hank-b:65 (later changes "throw off the whole count"); T3/Lucia:63 (last-minute swaps after packing) | SG-17, SG-9 | `domain/swaps.ts` `lateReason`, `validateRequest`; `state/reducer.ts` `submitRequest` | Partially satisfied — O-3, O-7 |
| **FR-015** Per-member packing list with approved swaps applied | T3/Lucia:81 ("one shared packing list that updates when I approve a swap"); T1/Lucia:62 (swap missed because the printed list was stale) | SG-14 | `domain/packing.ts` `packingList`; `components/PackingView.tsx` | Fully satisfied |
| **FR-016** Check each line; box "Checked" only when all checked | T2/Lucia:10 ("a checklist for each member so swaps or special notes don't get missed"); T3/Lucia:84 | SG-15 | `domain/packing.ts` `allLinesChecked`, `isBoxChecked`; `PackingView.tsx` | Fully satisfied |
| **FR-017** Lists lock at packing; pending → "Not reviewed before packing" | T3/Lucia:81 ("Before Thursday packing starts, I'd like a warning if a member's request hasn't been included") | SG-17, SG-15 | `domain/swaps.ts` `effectiveStatus`; `canApprove` (packing phase) | Partially satisfied — O-6 |
| **FR-018** Confirmed box editable only before cutoff | T3/Hank-b:65; T3/Lucia:63 | SG-7, SG-17 | `domain/plan.ts` `canEditPlan`; disabled inputs + message in `PlannerView.tsx` | Fully satisfied |
| **FR-019** Role switcher (prototype support) | — (prototype support) | — | `components/Header.tsx` | Fully satisfied |
| **FR-020** Demo clock (prototype support) | — | — | `components/Header.tsx` presets + date-time input | Fully satisfied |
| **FR-021** Reset demo (prototype support) | — | — | `state/reducer.ts` `reset`; `state/store.tsx` | Fully satisfied |
| **FR-022** No allergen / food-safety claims | T2/Raj:38 (child's nut allergy; wants allergen info before pickup) | Constitution VII | Banner in `components/Header.tsx`; no allergen fields in data | Fully satisfied (as a limit; the need itself is out of scope, see §2) |

## 2. Elicited needs outside the V1 sprint scope

These were deliberately left out of scope (goal model §1). They are listed so the matrix covers every
stakeholder need we found, not only the ones we built.

| Need | Interview evidence | Goal model | Code / Implementation | Status |
|---|---|---|---|---|
| Push / email notification when the box changes | T1/Raj:15, T1/Raj:21, T3/Raj:96 | Not modeled in V1 scope (spec "Out of Scope") | Not implemented | Not satisfied |
| Standing preferences (e.g., "never beets") | T1/Raj:49, T2/Raj:31, T3/Raj:79 | Not in V1 scope | Not implemented | Not satisfied |
| Small and large share sizes | T3/Lucia:41, T1/Lucia:41 | Not in V1 scope (spec A-5) | Not implemented (one share size) | Not satisfied |
| Packing grouped by pickup route | T3/Lucia:41, T3/Lucia:73 | Not in V1 scope | Not implemented | Not satisfied |
| Allergen / cross-contact information | T2/Raj:38, T2/Raj:46 | Out of scope (goal model §1) | Explicitly not claimed (FR-022) | Not satisfied |
| Box holds / pauses and pickup redirection | T3/Lucia:41, T3/Raj:44 | Not in V1 scope | Not implemented | Not satisfied |
| Phone or tablet use with unreliable internet in the packing shed | T3/Lucia:90 | Out of scope (offline sync) | Static web app; no offline mode | Not satisfied |

## 3. Evaluation observations

Each observation is either:

- an **implementation defect**: the prototype does not do what the spec clearly says, or
- a **requirements issue**: the spec is missing, ambiguous, inconsistent or wrong compared with what
  stakeholders need.

| ID | What we observed (walkthrough step) | Type | Evidence | What needs to change |
|---|---|---|---|---|
| **O-1** | Lucia changed the provisional box from 2 lb to 3 lb apples. Raj's view showed 3 lb with no change marker. FR-008 marks changes only after confirmation, so changes to the estimate go unnoticed. | Requirements issue | T2/Lucia:40, T2/Lucia:35, T1/Raj:21, T2/Raj:91 | **Spec change.** Mark changes since the last published estimate too, not only since confirmation. |
| **O-2** | The cutoff is Wed 08:00 because Proposal A (24 h before packing) is earlier than Hank's "Wednesday evening". No interview supports Proposal A. It came only from an A2 goal model. Lucia sends the contents "by Wednesday" (T3/Lucia:41), so the cutoff can fall before members see the box they would swap from. | Requirements issue | T3/Hank-b:65, T3/Lucia:41, T3/Raj:98, T1/Raj:21 | **Stakeholder clarification + spec/goal-model change.** Revisit D-1 and C-1 with the evidence. Require the box to be published before the cutoff. |
| **O-3** | After the cutoff the member is told "the list is locked for packing", yet Lucia can still approve pending requests until Thursday 08:00 (assumption A-6), which changes the packing list. The spec contradicts itself (FR-014 vs FR-012/A-6). | Requirements issue | T3/Lucia:81 ("pending, packed, or too late to change") | **Spec change.** Separate "requests closed" (cutoff) from "list locked" (packing start), and say so in the UI. |
| **O-4** | A swap replaces the original qty unit-for-unit (A-4), so 2 lb Potatoes → 2 *bunches* of Spinach and 3 lb Apples → 3 *each* Leeks. Units and values don't match. | Requirements issue | T3/Lucia:22 (values by quantity), T3/Lucia:77 ("check the quantities and value again") | **Stakeholder clarification.** Lucia should define each substitute's quantity. Update A-4. |
| **O-5** | Lucia can only Approve or Decline, with no reason and no way to offer an alternative. The member sees a bare "Declined". | Requirements issue | T2/Raj:100 ("unavailable"), T3/Raj:72 and T3/Raj:104 ("offer the available alternatives") | **Spec change.** Add a decline reason / "Unavailable" status and show the remaining alternatives. |
| **O-6** | Dana's request was never reviewed. Nothing warned Lucia before packing started. The request only became "Not reviewed before packing" afterwards. | Requirements issue | T3/Lucia:81 ("Before Thursday packing starts, I'd like a warning if a member's request hasn't been included") | **Spec change.** Warn Lucia about pending requests between the cutoff and packing start. |
| **O-7** | The member-facing warning shows the spec ID: "…declined automatically (FR-014): …". | Implementation defect | — | **Implementation fix.** Remove the requirement ID from the UI text. |
| **O-8** | The change marker reads "replaces 2 Potatoes" without the unit (should be "2 lb Potatoes"). | Implementation defect | T3/Raj:96 ("what was replaced") | **Implementation fix.** Include the unit. |
| **O-9** | After the clock moved to packing start, Dana's request read "Not reviewed before packing", but the confirmation message "Request submitted — status: Pending" stayed on screen. | Implementation defect | T3/Raj:104 (card must match reality) | **Implementation fix.** Clear the message when the status changes or the clock moves. |
| **O-10** | Raj's swap was approved *before* confirmation, yet after confirmation it shows as "Changed … (your approved swap)". FR-008 says changes *after* confirmation. The marker is arguably helpful (T3/Raj:65 wants confirmation the swap is "included in the final box"), but it doesn't match the spec. | Implementation defect (spec wording to confirm) | T3/Raj:65 | **Clarify, then fix.** Decide whether approved swaps are always marked, then align spec and code. |
| **O-11** | Raj, whose household won't eat beets, is offered Beets as a substitute. Expected, because standing preferences are out of scope, but it is the exact case Raj described. | Requirements issue (scope) | T1/Raj:49, T3/Raj:79 | **Keep deferred, but record it.** Candidate for a later sprint. |
| **O-12** | Approving a swap changes that member's box value (potatoes $4 → sweet potatoes $6), but nothing shows Lucia the new value or warns if it drops below the share value. | Requirements issue | T3/Lucia:81 ("or if a box is under its minimum value"), T3/Lucia:77 | **Spec change.** Show the per-member box value on approval and in the pre-packing check. |

### What worked as specified

- Publishing is blocked by infeasible quantities and by a shortfall against the share value.
- The provisional and confirmed labels display correctly.
- An approved swap reaches only that member's packing list. Declined, late and unreviewed requests leave the
  lists unchanged.
- Late requests are recorded as Declined with a reason.
- Box edits are blocked after the cutoff.
- A box can be marked "Checked" only when every line is ticked.

## 4. Candidates for V2 (requirements-level)

Ranked by stakeholder impact. **The team decides** which ones go into the V2 spec.

1. **O-2 + O-3: cutoff and lock rules.** Revisit D-1 now that the interview evidence is known, and
   separate "requests closed" from "list locked".
2. **O-1: mark changes to the provisional estimate.** Directly addresses the main complaint from
   Raj and Lucia.
3. **O-5 + O-6 + O-12: decision quality for Lucia and Raj.** Decline reasons and alternatives, and a
   pre-packing warning for pending requests and boxes under the share value.
4. **O-4: substitute quantities.** Needs Lucia's input before it can be specified.
5. **O-7 to O-10: implementation fixes.** No spec change needed, except deciding O-10.

## 5. V2 re-evaluation

**Evaluated build**: V2 (`v2` tag) at https://jyeh2.github.io/ReqsforInfoSys/v2/. Spec:
[`specs/002-csa-box-swaps-v2/spec.md`](../specs/002-csa-box-swaps-v2/spec.md). Method: the V2
[`quickstart.md`](../specs/002-csa-box-swaps-v2/quickstart.md) walkthrough on the built site, plus 33 unit
tests. Only rows whose status changed are listed; all other rows in §1 are unchanged.

| Requirement | Interview evidence | Goal | Code / Implementation (V2) | V1 status → V2 status |
|---|---|---|---|---|
| **FR-006 / FR-008** Estimate changes marked; confirmed-vs-estimate summary; units | T2/Lucia:35, T2/Lucia:40, T1/Raj:21, T3/Raj:96 | SG-6, SG-7 | `domain/memberBox.ts` `estimateChanges`, `confirmedVsEstimate`, `laterChanges`, `formatQty`; `MemberView.tsx` | Partially → **Fully satisfied** (O-1, O-8, O-10 resolved) |
| **FR-009** Cutoff by D-2 (Wed 20:00); Proposals A, B and C shown with sources | T3/Hank-b:65, T3/Raj:98, T3/Lucia:41 | SG-16 | `domain/schedule.ts` `computeCutoff`; `CutoffNotice.tsx` | Partially → **Partially satisfied** (O-2 still open: D-2 is unconfirmed, and publishing before Raj's 48 h is only encouraged by a warning, not required) |
| **FR-013** Status message matches current status | T3/Raj:104 | SG-12 | `MemberView.tsx` (last request + `effectiveStatus`) | Partially → **Partially satisfied** (O-9 fixed; O-5 decline reasons deferred) |
| **FR-014** Late requests: "Received after the swap cutoff" | T3/Hank-b:65 | SG-17, SG-9 | `domain/swaps.ts` `lateReason` | Partially → **Fully satisfied** (O-3, O-7 resolved) |
| **FR-023** (new) Draft warning; "not available this week" | T3/Lucia:41, T3/Raj:98 | SG-16, SG-6 | `PlannerView.tsx`; `domain/schedule.ts` `timeUntil`; `domain/swaps.ts` `swapsUnavailableThisWeek` | — → **Fully satisfied** |
| **FR-024** (new) Requests closed vs list locked | T3/Lucia:81 | SG-17, SG-12 | `domain/swaps.ts` `closedMessage`; `MemberView.tsx` | — → **Fully satisfied** |
| FR-010, FR-012, FR-017 | (see §1) | | unchanged | Partially (O-4, O-5, O-6, O-12 deferred) |

**Observation status after V2**: resolved O-1, O-3, O-7, O-8, O-9, O-10. **Improved but still open: O-2**
(evidence-based D-2 adopted; needs Lucia/Hank confirmation). Deferred, still recorded: O-4, O-5, O-6,
O-11, O-12.
