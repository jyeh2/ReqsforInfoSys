# Research & Decisions: 002-csa-box-swaps-v2

No `NEEDS CLARIFICATION` items remain: the three spec questions were answered in `/speckit-clarify`
(spec § Clarifications). Technology decisions T-1 to T-4 from V1
(`specs/001-csa-box-swaps/research.md`) still apply. T-4 is extended to a second slot:
`APP_VERSION=v2` → base `/ReqsforInfoSys/v2/`, output `../v2`.

## V2 decisions

| ID | Decision | Rationale | Alternatives considered |
|---|---|---|---|
| V2-1 | `computeCutoff` returns Proposals A, B and C plus `cutoff = B` (Wednesday 20:00 of the pickup week). | D-2. Showing all three keeps C-1 visible (Constitution IV). | Drop A and C from the UI: would hide the conflict. |
| V2-2 | Proposal C = pickup − 48 h, shown as an *information* deadline, not as the cutoff. | Raj's 48 h is about knowing contents (T3/Raj:98), not about closing swaps. | Use C as the cutoff: unsupported by the farm side. |
| V2-3 | Store `publishedLines` + `publishedAt` on publish. While provisional, mark differences between current lines and `publishedLines`. | FR-008 / O-1: needs a baseline that does not move with every edit. | Diff against the previous edit: members would miss earlier changes. |
| V2-4 | Confirmed view: "Different from the first estimate" = diff(`publishedLines`, `confirmedLines`); later changes = diff(`confirmedLines`, current lines). Swaps are marked separately from both. | Clarification Q1, Q2. Keeps three kinds of change apart: estimate drift, post-confirmation edits, and the member's own swaps. | One merged list: mixes the member's choices with farm changes. |
| V2-5 | Format quantities with units everywhere (`2 lb Potatoes`). | O-8. | — |
| V2-6 | The member's submit message shows the *current* status of the submitted request (looked up by id), not a fixed string. | O-9 / FR-013. | Clear the message on clock change: loses the confirmation entirely. |
| V2-7 | Phase texts: `locked` (cutoff ≤ t < packing) = "Swap requests closed … the packing list locks at <packing>". Late reason = "Received after the swap cutoff (<time>)". | FR-014, FR-024 / O-3. | — |
| V2-8 | Draft warning in the planner while status is `draft`: time left until cutoff, or "cutoff has passed". Member view says swaps were not available when `publishedAt ≥ cutoff`. | FR-023 + Clarification Q3. | Auto-extend the cutoff: rejected in Q3. |

## V1 interpretations carried forward

I-1 to I-8 from V1 still apply, with these changes:
- **I-3** (removed item with an approved swap → declined) is unchanged.
- **I-4** (edits to a provisional box apply live) now comes with change marking (V2-3).
