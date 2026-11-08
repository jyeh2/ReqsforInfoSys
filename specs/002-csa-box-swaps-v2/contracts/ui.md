# UI Contracts (per role) — V2

Changes from V1 are marked **[V2]**. User-facing text never shows requirement IDs (**[V2]** FR-022).

## Header (all roles): FR-019, FR-020, FR-021, FR-022
- Role switcher: Lucia (planner) · Member (select member) · Packer.
- Demo clock with presets **[V2]** Mon 09:00, Tue 12:00, Wed 12:00, Cutoff (Wed 20:00), Wed 21:00,
  Packing starts; plus a free date-time input.
- Phase badge: "Swaps open" / **[V2]** "Requests closed" / "Packing".
- "Reset demo" button; mock-data banner showing the version.

## Lucia: Planner (FR-001 to FR-005, FR-018, FR-023)
- Harvest table, value vs share value, infeasible flags, Publish / Confirm (as in V1).
- **[V2]** While Draft: warning "Members can't request swaps until you publish — <time> left until
  the swap cutoff" (or "the cutoff has passed").
- Cutoff panel **[V2]**: D-2 cutoff; Proposals A, B and C with their source; provisional label.

## Lucia: Requests (FR-012, FR-013): unchanged

## Member: My box (FR-006 to FR-011, FR-013, FR-014, FR-024)
- Draft: "Not published yet".
- Provisional: contents + "Provisional — may change"; **[V2]** changed lines marked "Changed since first
  estimate: was <qty unit item>", removed items listed.
- Confirmed: "Confirmed at …"; **[V2]** "Different from the first estimate" summary; later changes marked
  "Changed after confirmation: was <qty unit item>"; approved swap marked "Your approved swap
  (replaces <qty unit item>)".
- **[V2]** Published after the cutoff: "Swap requests were not available this week."
- Swap form (once published). **[V2]** Between the cutoff and packing: "Swap requests closed — the farm is
  finishing decisions on earlier requests; the packing list locks at <time>." A submission is recorded
  as Declined: "Received after the swap cutoff (<time>)".
- **[V2]** The submit confirmation shows the request's current status.
- My requests: list with status.

## Packer: Packing (FR-015 to FR-017): unchanged
