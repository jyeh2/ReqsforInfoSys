# What Changed from V1 to V2

| | V1 | V2 |
|---|---|---|
| Code | [`v1` branch](../../../tree/v1) | [`v2` branch](../../../tree/v2) |
| Prototype | https://jyeh2.github.io/ReqsforInfoSys/v1/ | https://jyeh2.github.io/ReqsforInfoSys/v2/ |
| Spec Kit artifacts | [`specs/001-csa-box-swaps/`](../specs/001-csa-box-swaps/) | [`specs/002-csa-box-swaps-v2/`](../specs/002-csa-box-swaps-v2/) (copied from 001, then revised) |
| Goal model | `docs/goalmodel/` at tag `v1` | [`docs/goalmodel/goal-model.md`](goalmodel/goal-model.md) §7 lists the changes |

## Requirements-level changes (from the V1 evaluation)

| # | V1 behavior | What the evaluation showed | V2 change | Where |
|---|---|---|---|---|
| 1 | Cutoff = earlier of "24 h before packing" and "Wednesday evening" → **Wed 08:00** | No interview supports "24 h before packing". Lucia sends contents "by Wednesday", so V1 could close swaps before members saw the box (O-2). | Cutoff = **Wed 20:00** (Hank, D-2); all three proposals shown with their source; Lucia warned while the box is a draft | spec D-2, FR-009, FR-023; goal model C-1/D-2 |
| 2 | "List is locked for packing" shown at the cutoff | Lucia could still approve requests until packing, so the message was false (O-3) | "Requests closed" at the cutoff; "list locked" at packing start | FR-014, FR-024 |
| 3 | Changes to the provisional estimate were silent | Raj and Lucia's main complaint: members rely on an outdated estimate (O-1) | Estimate changes marked; confirmed box shows "Different from the first estimate" | FR-008, SC-007 |

## Implementation fixes (spec already clear, or clarified)

- O-7: no requirement IDs in the text users see.
- O-8: change markers include units.
- O-9: the status message stays current.
- O-10: approved swaps are always marked (decided in `/speckit-clarify`).

## Still open (recorded, not built)

- O-4: substitute quantities.
- O-5: decline reasons and alternatives.
- O-6: a warning about pending requests before packing.
- O-11: standing preferences.
- O-12: how a swap changes the box value.
- D-2 itself still needs confirmation from Lucia and Hank.

Full matrix and evidence: [`traceability.md`](traceability.md) (§3 observations, §5 V2 re-evaluation).
