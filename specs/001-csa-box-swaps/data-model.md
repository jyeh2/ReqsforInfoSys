# Data Model: 001-csa-box-swaps (V1)

## Entities

### HarvestItem (FR-001)
| Field | Type | Notes |
|---|---|---|
| id | string | e.g. `carrots` |
| name | string | |
| unit | string | bunch, lb, each, bag, head |
| available | number | weekly quantity (mock, A-3) |
| unitValue | number | dollars per unit (mock) |
| isSubstitute | boolean | farm-approved substitute this week (FR-010) |

### Member (FR-019)
`id`, `name`. One standard share each (A-5).

### WeekSchedule (FR-009)
| Field | Value (mock) |
|---|---|
| pickup | `2026-11-13T09:00` (Friday) |
| packingStart | `2026-11-12T08:00` (Thursday, A-1) |
| proposalA | packingStart − 24h = `2026-11-11T08:00` |
| proposalB | Wednesday 20:00 = `2026-11-11T20:00` |
| cutoff | earlier of A and B = `2026-11-11T08:00` (D-1) |

### BoxPlan (FR-002–FR-005, FR-018)
| Field | Type | Notes |
|---|---|---|
| lines | `{itemId, qty}[]` | per-box quantities; qty > 0 |
| status | `draft \| provisional \| confirmed` | |
| shareValue | number | 25 (mock) |
| confirmedAt | string? | demo-clock time at confirmation |
| confirmedLines | `{itemId, qty}[]`? | snapshot used for change marking (FR-008) |

### SwapRequest (FR-011–FR-014)
| Field | Type | Notes |
|---|---|---|
| id | string | |
| memberId | string | |
| originalItemId | string | must be in current plan |
| substituteItemId | string | approved substitute, not in plan (I-8) |
| qty | number | = original per-box qty (I-7) |
| submittedAt | string | demo-clock time |
| status | `pending \| approved \| declined` | stored |
| reason | string? | e.g. "item no longer in box" |
| decidedAt | string? | |

**Derived status** (FR-013, FR-017): `pending` with clock ≥ packingStart → `not_reviewed`.

### PackingCheck (FR-016)
Map `memberId → Set<itemId>` of checked lines, plus `memberId → boxMarked` flag.

## Derived values

- **boxValue** = Σ qty × unitValue (FR-002); **shortfall** = max(0, shareValue − boxValue).
- **infeasible(item)** = qty × memberCount > available (FR-003).
- **substituteRemaining(s)** = available − planQty(s) × memberCount − Σ approved swap qty for s
  (FR-010, FR-012).
- **memberBox(m)** = plan lines with m's approved swaps applied (FR-007, FR-015).
- **changes(m)** = differences between `confirmedLines` and memberBox(m), each with reason `edit`
  or `swap` (FR-008).
- **phase(clock)** = `open` (< cutoff) · `locked` (≥ cutoff, < packingStart) · `packing`
  (≥ packingStart) (FR-014, FR-017, FR-018).

## State transitions

```text
BoxPlan:   draft --publish [valid]--> provisional --confirm--> confirmed
           (edits allowed in draft/provisional; in confirmed only while phase = open)

SwapRequest: (submit, phase=open, no active request for item) --> pending
             pending --approve [phase != packing, remaining ≥ qty]--> approved
             pending --decline [phase != packing]--> declined
             pending/approved --original removed by edit--> declined ("item no longer in box")
             pending + phase=packing --> shown as not_reviewed (derived)
```
