# Domain Contracts (pure functions, `frontend/src/domain/`)

All functions are pure: same inputs → same outputs, no I/O. Each is unit-tested.

| Function | Module | Returns | FR |
|---|---|---|---|
| `computeCutoff(schedule)` | schedule.ts | `{proposalA, proposalB, cutoff}` — cutoff = earlier (D-1) | FR-009 |
| `phaseAt(clock, schedule)` | schedule.ts | `'open' \| 'locked' \| 'packing'` | FR-014, FR-017 |
| `boxValue(lines, items)` | plan.ts | number | FR-002 |
| `infeasibleItems(lines, items, memberCount)` | plan.ts | itemId[] | FR-003 |
| `canPublish(plan, items, memberCount)` | plan.ts | `{ok, reasons[]}` | FR-004 |
| `canEditPlan(plan, phase)` | plan.ts | `{ok, reason?}` | FR-018 |
| `substituteOptions(state, memberId, originalItemId)` | swaps.ts | HarvestItem[] with remaining ≥ needed qty | FR-010 |
| `validateRequest(state, memberId, originalItemId, substituteId, clock)` | swaps.ts | `{ok, reason?, late?}` (not published, not in box, duplicate, unavailable; `late` checked last so a late but otherwise valid request is recorded as Declined) | FR-011, FR-014 |
| `canApprove(state, requestId, clock)` | swaps.ts | `{ok, reason?}` | FR-012 |
| `effectiveStatus(request, clock, schedule)` | swaps.ts | status incl. `not_reviewed` | FR-013, FR-017 |
| `memberBox(state, memberId)` | memberBox.ts | lines with swaps applied, swap flags | FR-007, FR-015 |
| `memberChanges(state, memberId)` | memberBox.ts | `{from, to, reason}[]` vs confirmed snapshot | FR-008 |
| `packingList(state, memberId)` | packing.ts | lines (null if not confirmed) | FR-015 |
| `isBoxChecked(state, memberId)` | packing.ts | boolean — marked and all current lines checked | FR-016 |
