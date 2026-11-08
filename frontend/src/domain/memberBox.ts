// Member view rules — FR-007, FR-008.
import type { AppState, PlanLine } from './types';

export interface MemberLine extends PlanLine {
  /** Set when this line is the result of an approved swap. */
  swappedFrom?: string;
}

/** Box contents for one member: plan lines with that member's approved swaps applied. */
export function memberBox(state: AppState, memberId: string): MemberLine[] {
  const approved = state.requests.filter((r) => r.memberId === memberId && r.status === 'approved');
  return state.plan.lines.map((line) => {
    const swap = approved.find((r) => r.originalItemId === line.itemId);
    return swap ? { itemId: swap.substituteItemId, qty: swap.qty, swappedFrom: line.itemId } : { ...line };
  });
}

export interface Change {
  from?: PlanLine;
  to?: PlanLine;
  reason: 'swap' | 'edit';
}

/** FR-008: differences between the confirmed snapshot and the member's current box. */
export function memberChanges(state: AppState, memberId: string): Change[] {
  const snapshot = state.plan.confirmedLines;
  if (state.plan.status !== 'confirmed' || !snapshot) return [];
  const current = memberBox(state, memberId);
  const changes: Change[] = [];

  for (const line of current) {
    if (line.swappedFrom) {
      const orig = snapshot.find((s) => s.itemId === line.swappedFrom);
      changes.push({ from: orig ?? { itemId: line.swappedFrom, qty: line.qty }, to: line, reason: 'swap' });
      continue;
    }
    const before = snapshot.find((s) => s.itemId === line.itemId);
    if (!before) changes.push({ to: line, reason: 'edit' });
    else if (before.qty !== line.qty) changes.push({ from: before, to: line, reason: 'edit' });
  }
  const planIds = new Set(state.plan.lines.map((l) => l.itemId));
  for (const before of snapshot) {
    if (!planIds.has(before.itemId)) changes.push({ from: before, reason: 'edit' });
  }
  return changes;
}
