# UI Contracts (per role)

## Header (all roles) — FR-019, FR-020, FR-021, FR-022
- Role switcher: Lucia (planner) · Member (select member) · Packer.
- Demo clock: current simulated time + presets (Mon 09:00, Tue 12:00, Wed 08:00 cutoff, Wed 21:00,
  Thu 08:00 packing starts) + free date-time input.
- Phase badge: "Swaps open" / "Locked for packing" / "Packing".
- "Reset demo" button.
- Banner: "Prototype — mock data. Not a food-safety or allergen guarantee."

## Lucia — Planner (FR-001–FR-005, FR-018)
- Harvest table: item, unit, available, unit value, per-box qty input, total needed, infeasible flag.
- Box summary: value vs share value, shortfall, status badge.
- Buttons: Publish as provisional (disabled with reasons), Confirm, edit lock message after cutoff.
- Cutoff panel: Proposal A, Proposal B, chosen cutoff, "Provisional — pending stakeholder
  agreement" (FR-009).

## Lucia — Requests (FR-012, FR-013)
- Queue of requests: member, original → substitute, submitted time, effective status.
- Approve / Decline on pending; approve disabled with reason when substitute insufficient or packing.

## Member — My box (FR-006–FR-011, FR-013, FR-014)
- Draft: "Not published yet".
- Provisional: contents + persistent "Provisional — may change" label.
- Confirmed: "Confirmed at …"; changed lines marked "Changed: X → Y (swap|farm edit)".
- Cutoff notice (provisional label).
- Swap form (open phase only): pick item in box, pick approved substitute; submit.
- Late attempt: explanation with cutoff time and "list locked for packing"; box unchanged.
- My requests: list with status.

## Packer — Packing (FR-015–FR-017)
- Not confirmed: "Packing lists available after the box is confirmed".
- One card per member: lines (swapped lines marked), checkbox per line, "Mark box checked"
  (enabled only when all lines checked), "Checked" badge.
- After packing starts: note "Lists locked — no further changes".
