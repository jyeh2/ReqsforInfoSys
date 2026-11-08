// Swap rules — FR-010 to FR-014, FR-017, FR-018.
import { itemById } from './plan';
import { computeCutoff, formatDateTime, phaseAt } from './schedule';
import type { AppState, Check, DateTime, HarvestItem, RequestStatus, SwapRequest, WeekSchedule } from './types';

/** FR-010: remaining quantity of an item after the base plan and approved swaps. */
export function remainingQty(state: AppState, itemId: string): number {
  const item = itemById(state.items, itemId);
  const planQty = state.plan.lines.find((l) => l.itemId === itemId)?.qty ?? 0;
  const swapped = state.requests
    .filter((r) => r.status === 'approved' && r.substituteItemId === itemId)
    .reduce((s, r) => s + r.qty, 0);
  return item.available - planQty * state.members.length - swapped;
}

function planQtyOf(state: AppState, itemId: string): number {
  return state.plan.lines.find((l) => l.itemId === itemId)?.qty ?? 0;
}

/** FR-010: approved substitutes, not already in the box (I-8), with enough remaining (I-7). */
export function substituteOptions(state: AppState, originalItemId: string): HarvestItem[] {
  const needed = planQtyOf(state, originalItemId);
  const inBox = new Set(state.plan.lines.map((l) => l.itemId));
  return state.items.filter(
    (i) => i.isSubstitute && !inBox.has(i.id) && remainingQty(state, i.id) >= needed,
  );
}

function isActive(r: SwapRequest): boolean {
  return r.status === 'pending' || r.status === 'approved';
}

/** FR-014 (V2 wording, O-3): reason recorded on a request submitted at or after the cutoff. */
export function lateReason(state: AppState): string {
  const { cutoff } = computeCutoff(state.schedule);
  return `Received after the swap cutoff (${formatDateTime(cutoff)}).`;
}

/** V2 FR-024 (O-3): shown to members between the cutoff and packing start. */
export function closedMessage(state: AppState): string {
  return `Swap requests closed — the farm is finishing decisions on earlier requests; the packing list locks at ${formatDateTime(state.schedule.packingStart)}.`;
}

/**
 * FR-011, FR-014: may this member submit this request now?
 * Lateness is checked last: `late: true` means the request is otherwise valid and is recorded
 * as Declined with `lateReason` instead of being accepted.
 */
export function validateRequest(
  state: AppState,
  memberId: string,
  originalItemId: string,
  substituteItemId: string,
  clock: DateTime,
): Check & { late?: boolean } {
  if (state.plan.status === 'draft') return { ok: false, reason: "This week's box has not been published yet." };
  if (planQtyOf(state, originalItemId) === 0) return { ok: false, reason: 'That item is not in your box.' };
  if (state.requests.some((r) => r.memberId === memberId && r.originalItemId === originalItemId && isActive(r))) {
    return { ok: false, reason: 'You already have an active swap request for this item.' };
  }
  if (!substituteOptions(state, originalItemId).some((i) => i.id === substituteItemId)) {
    return { ok: false, reason: 'That substitute is not available.' };
  }
  if (phaseAt(clock, state.schedule) !== 'open') return { ok: false, late: true, reason: lateReason(state) };
  return { ok: true };
}

/** FR-012: approve only pending requests, before packing, with enough substitute remaining. */
export function canApprove(state: AppState, requestId: string, clock: DateTime): Check {
  const r = state.requests.find((x) => x.id === requestId);
  if (!r || r.status !== 'pending') return { ok: false, reason: 'Request is not pending.' };
  if (phaseAt(clock, state.schedule) === 'packing') return { ok: false, reason: 'Packing has started.' };
  if (remainingQty(state, r.substituteItemId) < r.qty) {
    return { ok: false, reason: `Not enough ${itemById(state.items, r.substituteItemId).name} remaining.` };
  }
  return { ok: true };
}

export function canDecline(state: AppState, requestId: string, clock: DateTime): Check {
  const r = state.requests.find((x) => x.id === requestId);
  if (!r || r.status !== 'pending') return { ok: false, reason: 'Request is not pending.' };
  if (phaseAt(clock, state.schedule) === 'packing') return { ok: false, reason: 'Packing has started.' };
  return { ok: true };
}

/** FR-013, FR-017: pending requests at packing start are shown as not reviewed. */
export function effectiveStatus(r: SwapRequest, clock: DateTime, schedule: WeekSchedule): RequestStatus {
  if (r.status === 'pending' && clock >= schedule.packingStart) return 'not_reviewed';
  return r.status;
}

export const STATUS_LABEL: Record<RequestStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  declined: 'Declined',
  not_reviewed: 'Not reviewed before packing',
};

/** Edge case + I-3: requests on items removed from the box are declined. */
export function declineRequestsForRemovedItems(state: AppState, clock: DateTime): SwapRequest[] {
  const inBox = new Set(state.plan.lines.map((l) => l.itemId));
  return state.requests.map((r) =>
    isActive(r) && !inBox.has(r.originalItemId)
      ? { ...r, status: 'declined', reason: 'Item no longer in box', decidedAt: clock }
      : r,
  );
}

/** V2 FR-023 (Clarification Q3): box first published at/after the cutoff → no swaps this week. */
export function swapsUnavailableThisWeek(state: AppState): boolean {
  const { publishedAt } = state.plan;
  return !!publishedAt && publishedAt >= computeCutoff(state.schedule).cutoff;
}
