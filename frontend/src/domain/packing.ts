// Packing rules — FR-015, FR-016.
import { memberBox, type MemberLine } from './memberBox';
import type { AppState } from './types';

/** FR-015: per-member packing list, available only once the box is confirmed. */
export function packingList(state: AppState, memberId: string): MemberLine[] | null {
  if (state.plan.status !== 'confirmed') return null;
  return memberBox(state, memberId);
}

/** FR-016 (+ I-2): "Checked" only while marked and every current line is checked. */
export function allLinesChecked(state: AppState, memberId: string): boolean {
  const list = packingList(state, memberId);
  if (!list || list.length === 0) return false;
  const checked = new Set(state.packingChecks[memberId] ?? []);
  return list.every((l) => checked.has(l.itemId));
}

export function isBoxChecked(state: AppState, memberId: string): boolean {
  return !!state.packingMarked[memberId] && allLinesChecked(state, memberId);
}
