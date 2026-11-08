# Feature Specification: CSA Weekly Box Planning and Member Swaps (V1)

**Feature Branch**: `001-csa-box-swaps`

**Created**: 2026-11-08

**Status**: Draft (V1)

**Input**: User description: "CSA weekly box planning and member swap prototype (V1), implementing the
sprint goal model in docs/goalmodel/goal-model.md (SG-1 subtree). Lucia plans boxes from mock harvest
quantities to meet the promised share value; members see a provisional estimate, then confirmed
contents with changes indicated; members request swaps from farm-approved substitutes before a
displayed provisional cutoff (D-1); Lucia approves or declines; status visible to both; late
requests are explained without altering a locked list; approved swaps update the packing list;
packers check each box against the current list."

**Goal model**: [`docs/goalmodel/goal-model.md`](../../docs/goalmodel/goal-model.md). Every functional requirement
cites the SG goal(s) it implements in square brackets, e.g. `[SG-6]`.

## User Scenarios & Testing *(mandatory)*

The four stories follow the sprint workflow: **plan → publish → swap → pack**. Each story is
demonstrable on its own using the mock data and the demo clock (see Assumptions).

### User Story 1 - Lucia plans and publishes this week's box (Priority: P1)

Lucia, the farm planner, looks at this week's mock harvest quantities, chooses which items and how
much of each go into the standard CSA box, and sees whether the box meets the promised share value
and whether the harvest is enough for every member. She first publishes the plan as a provisional
estimate, then later confirms it.

**Why this priority**: Core (SG-2). Nothing can be shown to members, swapped or packed until a box
plan exists (dependency SG-2 → SG-5).

**Independent Test**: As Lucia, build a plan from the mock harvest, publish it as provisional, then
confirm it. Delivers a feasible weekly plan on its own.

**Acceptance Scenarios**:

1. **Given** this week's mock harvest is loaded, **When** Lucia opens the planner, **Then** she
   sees every available item with its available quantity and unit value. (FR-001)
2. **Given** Lucia adds items to the box, **When** the box total value is below the promised share
   value, **Then** the planner shows the shortfall and does not allow publishing. (FR-002, FR-004)
3. **Given** Lucia sets a per-box quantity, **When** that quantity × number of members exceeds the
   available harvest for the item, **Then** the planner flags the item as infeasible and does not
   allow publishing. (FR-003, FR-004)
4. **Given** a feasible plan that meets the share value, **When** Lucia publishes it, **Then** the
   box status becomes "Provisional estimate". (FR-004)
5. **Given** a provisional box, **When** Lucia confirms it, **Then** the box status becomes
   "Confirmed". (FR-005)

---

### User Story 2 - Member sees dependable box information (Priority: P1)

A CSA member (e.g., Raj) checks what will be in this week's box. Before confirmation they see an
early estimate that is clearly marked as provisional. After confirmation they see the confirmed
contents, and any later change (an edit by Lucia or their own approved swap) is clearly indicated.

**Why this priority**: User-facing (SG-5). Members need to know what to expect before pickup, and
must be able to tell an estimate from a commitment (R-1).

**Independent Test**: As a member, view the box while it is provisional, then after confirmation,
then after a change. Delivers reliable member-facing information on its own.

**Acceptance Scenarios**:

1. **Given** the box is "Draft" (not yet published), **When** a member opens their box, **Then**
   they see a message that this week's box has not been published yet and no contents. (FR-006)
2. **Given** the box is "Provisional estimate", **When** a member opens their box, **Then** every
   item is shown and the page clearly states the contents are provisional and may change. (FR-006)
3. **Given** the box is "Confirmed", **When** a member opens their box, **Then** the contents are
   shown as confirmed with the confirmation time. (FR-007)
4. **Given** the box was confirmed and an item later changed, **When** the member opens their box,
   **Then** the changed item is marked and shows what it replaced. (FR-008)

---

### User Story 3 - Member requests a swap and Lucia decides (Priority: P2)

A member asks to replace one item in their box with one of this week's farm-approved substitutes.
The member sees the provisional change cutoff before requesting. Lucia sees each request, approves
or declines it, and both see the current status. Requests after the cutoff are explained and do not
change the box.

**Why this priority**: Uncertain (SG-8). Stakeholders disagree on which changes are practical and
when to stop accepting them (conflict C-1); building this exposes those questions.

**Independent Test**: As a member, submit a swap before the cutoff; switch to Lucia and approve or
decline; switch back and see the status. Move the demo clock past the cutoff and try again.

**Acceptance Scenarios**:

1. **Given** a published box, **When** a member opens their box, **Then** they see the change
   cutoff date and time labeled "Provisional cutoff — pending stakeholder agreement". (FR-009)
2. **Given** a published box and the current time is before the cutoff, **When** the member picks
   an item and a substitute, **Then** only that week's farm-approved substitutes are offered.
   (FR-010)
3. **Given** the member submits a request before the cutoff, **When** the request is saved,
   **Then** it shows status "Pending" to the member and appears in Lucia's request queue. (FR-011,
   FR-013)
4. **Given** a pending request, **When** Lucia approves it, **Then** the status becomes "Approved"
   for both Lucia and the member, and the member's box shows the substitute in place of the
   original item. (FR-012, FR-013, FR-008)
5. **Given** a pending request, **When** Lucia declines it, **Then** the status becomes "Declined"
   for both, and the member's box is unchanged. (FR-012, FR-013)
6. **Given** the current time is at or after the cutoff, **When** a member tries to request a swap,
   **Then** the request is not accepted, the member sees why (the cutoff time and that the list is
   locked for packing), and their box is unchanged. (FR-014)
7. **Given** a request would need more of a substitute than remains in the harvest, **When**
   Lucia reviews it, **Then** she sees that approving it is not possible and can only decline.
   (FR-012)

---

### User Story 4 - Packers pack each box from the current list (Priority: P2)

The packing crew sees one packing list per member that includes the confirmed contents plus that
member's approved swaps. They check off each item and mark the box as checked.

**Why this priority**: Core (SG-13). An approved swap has value only if it reaches the physical box
(dependency SG-11 → SG-14 → SG-15).

**Independent Test**: As a packer, open the packing lists after a swap was approved and verify the
member's list includes the substitute; check all items and mark the box done.

**Acceptance Scenarios**:

1. **Given** a confirmed box and an approved swap for member M, **When** the packer opens M's
   packing list, **Then** it shows the substitute instead of the original item and marks the line
   as a swap. (FR-015)
2. **Given** a packing list, **When** the packer checks every item, **Then** the packer can mark
   the box "Checked"; until every item is checked, the box cannot be marked "Checked". (FR-016)
3. **Given** packing has started, **When** anyone views the packing list, **Then** no pending,
   late or new request changes it. (FR-014, FR-017)
4. **Given** the box is not yet confirmed, **When** a packer opens packing, **Then** they see that
   packing lists are not available until the box is confirmed. (FR-015)

---

### Edge Cases

- **Request pending when packing starts**: a request submitted before the cutoff that Lucia has not
  decided by the time packing starts is shown as "Not reviewed before packing" and does not change
  the box. (FR-017)
- **Duplicate request**: a member may have at most one active (pending or approved) swap per
  original item; requesting another for the same item is blocked with an explanation. (FR-011)
- **Substitute runs out**: approving swaps reduces the remaining quantity of the substitute; once
  none remains, it is no longer offered and remaining pending requests for it can only be declined.
  (FR-010, FR-012)
- **Lucia edits a confirmed box**: allowed only before the cutoff; every member sees the change
  marked. Pending swap requests on an item that was removed become "Declined — item no longer in
  box". (FR-008, FR-018)
- **Request exactly at the cutoff time**: treated as late. (FR-014)
- **No substitutes defined**: the member sees that no swaps are offered this week. (FR-010)

## Requirements *(mandatory)*

### Functional Requirements

**Box planning — SG-2**

- **FR-001** [SG-3]: The system MUST show Lucia this week's harvest items with available quantity,
  unit, and unit value.
- **FR-002** [SG-4]: The system MUST let Lucia set a per-box quantity for each item and MUST show
  the box total value against the promised share value, including any shortfall.
- **FR-003** [SG-3, SG-4]: The system MUST flag any item whose per-box quantity × number of members
  exceeds its available harvest quantity.
- **FR-004** [SG-2, SG-6]: The system MUST allow Lucia to publish the plan as a "Provisional
  estimate" only when the box total meets or exceeds the share value and no item is flagged
  infeasible.
- **FR-005** [SG-7]: The system MUST allow Lucia to confirm a provisional box, recording the
  confirmation time; the box status becomes "Confirmed".

**Member box information — SG-5**

- **FR-006** [SG-6]: Before confirmation, the member view MUST show either "not yet published"
  (Draft) or the estimated contents with a clear, persistent "Provisional — may change" label.
- **FR-007** [SG-7]: After confirmation, the member view MUST show the contents labeled
  "Confirmed" with the confirmation time.
- **FR-008** [SG-7]: Any change to a member's contents after confirmation (an edit by Lucia or
  the member's approved swap) MUST be marked in the member view, showing the new item and the item
  it replaced.

**Swaps — SG-8**

- **FR-009** [SG-16]: The system MUST display this week's change cutoff (date and time) to members
  and to Lucia, labeled as provisional and pending stakeholder agreement. The cutoff value MUST be
  computed by decision D-1 (see Conflicts & Decisions).
- **FR-010** [SG-10]: When requesting a swap, the system MUST offer only this week's farm-approved
  substitutes that still have remaining quantity.
- **FR-011** [SG-9]: Before the cutoff, a member MUST be able to request replacing one item in
  their box with one approved substitute; at most one active request per original item.
- **FR-012** [SG-11]: Lucia MUST be able to approve or decline each pending request. Approval MUST
  be blocked when the substitute's remaining quantity is insufficient.
- **FR-013** [SG-12]: Each request's status (Pending, Approved, Declined, Not reviewed before
  packing) MUST be visible to the requesting member and to Lucia.
- **FR-014** [SG-17, SG-9]: At or after the cutoff, the system MUST NOT accept new swap requests;
  it MUST tell the member the cutoff time and that the list is locked for packing, and MUST leave
  the box unchanged.

**Packing — SG-13**

- **FR-015** [SG-14]: Once the box is confirmed, the system MUST show one packing list per member
  consisting of the confirmed contents with that member's approved swaps applied, marking swapped
  lines.
- **FR-016** [SG-15]: Packers MUST be able to check off each item and mark a box "Checked" only
  when all items are checked.
- **FR-017** [SG-17, SG-15]: When packing starts, the packing lists MUST be locked: requests still
  pending become "Not reviewed before packing", and no request, edit or approval changes a list
  after that point.
- **FR-018** [SG-7, SG-17]: Lucia MUST be able to edit a confirmed box only before the cutoff;
  after the cutoff, box edits MUST be blocked with an explanation.

**Prototype support** (not goals; needed to demonstrate them)

- **FR-019**: The prototype MUST provide a role switcher (Lucia, member — choose which member,
  packer) instead of login.
- **FR-020**: The prototype MUST provide a demo clock showing the simulated current day and time,
  which can be moved to before the cutoff, after the cutoff, and to packing start.
- **FR-021**: The prototype MUST provide a "Reset demo" action that restores the original mock
  data.
- **FR-022** [Constitution VII]: The prototype MUST NOT state or imply allergen, cross-contact or
  food-safety guarantees about any item.

### Key Entities

- **Harvest item**: produce available this week — name, unit (e.g., bunch, lb), available
  quantity, unit value, whether it is an approved substitute.
- **Box plan**: this week's standard box — list of (item, per-box quantity), status (Draft,
  Provisional estimate, Confirmed), confirmation time, promised share value.
- **Member**: a CSA subscriber with one standard share — name.
- **Swap request**: member, original item, substitute item, submission time, status, decision
  time.
- **Packing list**: derived per member from the box plan plus that member's approved swaps; has a
  checked state per line and a box-level "Checked" state.
- **Week schedule**: pickup day, packing start time, and the computed cutoff (D-1).
- **Change record**: what changed after confirmation (old item → new item, reason: edit or swap).

## Conflicts & Decisions

These are preserved from the goal model; they are not removed from scope.

- **C-1 — Change-request cutoff (conflict)**: Source models proposed (A) stop changes 24 hours
  before packing, and (B) Wednesday evening for Friday pickup.
- **D-1 — Provisional V1 rule (compromise)**: use the **earlier** of the two deadlines, because it
  protects packing (SG-13) under either proposal. Cost: members get less time than Proposal B. With
  assumption A-1 (packing Thursday 08:00), A = Wednesday 08:00, B = Wednesday 20:00, so the V1
  cutoff is **Wednesday 08:00**. Displayed as provisional (FR-009).
  **Status: NEEDS STAKEHOLDER CLARIFICATION** — actual packing schedule and agreed deadline.
- **R-1 — Estimate vs confirmed (overlap)**: kept as separate states (FR-006, FR-007) because
  merging them hides the difference members rely on.
- **R-2 — Swap workflow steps (overlap)**: request, decision, status and packing update are
  separate requirements (FR-011, FR-012, FR-013, FR-015) with different responsible agents.
- **R-4 — Approved substitutes only (dependency)**: no free-text requests in V1 (FR-010).
- **R-6 — Late requests vs packing (conflict)**: late requests are explained and never alter a
  locked list (FR-014, FR-017).

## Out of Scope

Restaurant ordering; market sales; offline synchronization; lot-traceability reports;
allergen/cross-contact guarantees; multiple share sizes; payments; notifications (email/SMS);
real authentication; multiple weeks or history.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Starting from the mock harvest, Lucia can build, publish and confirm a box that meets
  the share value in under 5 minutes.
- **SC-002**: In a walkthrough, a viewer can correctly say whether the box shown is provisional or
  confirmed in 100% of states (Draft, Provisional, Confirmed, Confirmed-with-changes).
- **SC-003**: A member can submit a swap request in under 1 minute and find its status in under 10
  seconds.
- **SC-004**: 100% of approved swaps appear on that member's packing list; 0 declined, late or
  unreviewed requests appear on any packing list.
- **SC-005**: 0 swap requests are accepted at or after the displayed cutoff.
- **SC-006**: Every functional requirement FR-001–FR-018 can be traced to an SG goal and
  demonstrated through at least one acceptance scenario.

## Assumptions

- **A-1** (analyst, for D-1): pickup is Friday; packing starts Thursday 08:00; "Wednesday evening"
  means Wednesday 20:00.
- **A-2** (analyst): SG-16 and SG-17 were added during goal analysis and are not yet confirmed by
  stakeholders.
- **A-3**: all harvest items, quantities, unit values, the share value ($25), members and
  substitutes are mock data, not stakeholder facts.
- **A-4** (analyst): one swap replaces one item (its full per-box quantity) with one unit-for-unit
  substitute; substitute value is not required to match.
- **A-5**: one standard share size; every member's base box is the same.
- **A-6**: requests submitted before the cutoff can still be decided by Lucia until packing starts.
- **A-7**: all roles use the same browser during a demo; state may be kept in that browser and is
  restored by "Reset demo".
- **Dependency**: goal model `docs/goalmodel/goal-model.md` (SG IDs, crosswalk, C-1, D-1).
