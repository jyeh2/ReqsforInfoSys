// Box planning rules — FR-002, FR-003, FR-004, FR-018.
import type { BoxPlan, Check, HarvestItem, Phase, PlanLine } from './types';

export function itemById(items: HarvestItem[], id: string): HarvestItem {
  const item = items.find((i) => i.id === id);
  if (!item) throw new Error(`Unknown item ${id}`);
  return item;
}

/** FR-002: total value of one box. */
export function boxValue(lines: PlanLine[], items: HarvestItem[]): number {
  return lines.reduce((sum, l) => sum + l.qty * itemById(items, l.itemId).unitValue, 0);
}

/** FR-003: items whose per-box qty × member count exceeds available harvest. */
export function infeasibleItems(lines: PlanLine[], items: HarvestItem[], memberCount: number): string[] {
  return lines
    .filter((l) => l.qty * memberCount > itemById(items, l.itemId).available)
    .map((l) => l.itemId);
}

/** FR-004: publish only when share value is met and every item is feasible. */
export function canPublish(plan: BoxPlan, items: HarvestItem[], memberCount: number): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (plan.status !== 'draft') reasons.push('Box is already published.');
  if (plan.lines.length === 0) reasons.push('Box is empty.');
  const value = boxValue(plan.lines, items);
  if (value < plan.shareValue) {
    reasons.push(`Box value $${value.toFixed(2)} is below the share value $${plan.shareValue.toFixed(2)}.`);
  }
  for (const id of infeasibleItems(plan.lines, items, memberCount)) {
    reasons.push(`Not enough ${itemById(items, id).name} for every member.`);
  }
  return { ok: reasons.length === 0, reasons };
}

/** FR-018: confirmed boxes may be edited only before the cutoff. */
export function canEditPlan(plan: BoxPlan, phase: Phase): Check {
  if (phase === 'packing') return { ok: false, reason: 'Packing has started; the box is locked.' };
  if (plan.status === 'confirmed' && phase !== 'open') {
    return { ok: false, reason: 'The change cutoff has passed; the confirmed box can no longer be edited.' };
  }
  return { ok: true };
}

/** Set an item's per-box qty (0 removes it). */
export function setLineQty(lines: PlanLine[], itemId: string, qty: number): PlanLine[] {
  const rest = lines.filter((l) => l.itemId !== itemId);
  if (qty <= 0) return rest;
  const existing = lines.findIndex((l) => l.itemId === itemId);
  const line = { itemId, qty };
  if (existing === -1) return [...lines, line];
  const copy = [...lines];
  copy[existing] = line;
  return copy;
}
