// Member view rules — FR-007, FR-008 (V2: estimate changes, confirmed-vs-estimate summary).
import { itemById } from './plan';
import type { AppState, HarvestItem, PlanLine } from './types';

export interface MemberLine extends PlanLine {
  /** Set when this line is the member's approved swap (always marked, V2 / O-10). */
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

/** One farm-side difference between two versions of the box plan. */
export interface Change {
  itemId: string;
  /** Line before the change (absent when the item was added). */
  from?: PlanLine;
  /** Line after the change (absent when the item was removed). */
  to?: PlanLine;
}

/** Differences between two plan versions, item by item (farm edits only; swaps are separate). */
export function diffLines(from: PlanLine[], to: PlanLine[]): Change[] {
  const changes: Change[] = [];
  for (const after of to) {
    const before = from.find((l) => l.itemId === after.itemId);
    if (!before) changes.push({ itemId: after.itemId, to: after });
    else if (before.qty !== after.qty) changes.push({ itemId: after.itemId, from: before, to: after });
  }
  for (const before of from) {
    if (!to.some((l) => l.itemId === before.itemId)) changes.push({ itemId: before.itemId, from: before });
  }
  return changes;
}

/** V2 FR-008 / O-1: while provisional, changes since the estimate was first published. */
export function estimateChanges(state: AppState): Change[] {
  const { plan } = state;
  if (plan.status !== 'provisional' || !plan.publishedLines) return [];
  return diffLines(plan.publishedLines, plan.lines);
}

/** V2 FR-008 (Clarification Q1): how the confirmed box differs from the first published estimate. */
export function confirmedVsEstimate(state: AppState): Change[] {
  const { plan } = state;
  if (plan.status !== 'confirmed' || !plan.publishedLines || !plan.confirmedLines) return [];
  return diffLines(plan.publishedLines, plan.confirmedLines);
}

/** FR-008: farm edits made after confirmation. */
export function laterChanges(state: AppState): Change[] {
  const { plan } = state;
  if (plan.status !== 'confirmed' || !plan.confirmedLines) return [];
  return diffLines(plan.confirmedLines, plan.lines);
}

/** V2 FR-008 / O-8: "2 lb Potatoes". */
export function formatQty(line: PlanLine, items: HarvestItem[]): string {
  const item = itemById(items, line.itemId);
  return `${line.qty} ${item.unit} ${item.name}`;
}
