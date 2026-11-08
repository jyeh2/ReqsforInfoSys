import { describe, expect, it } from 'vitest';
import { createMockState } from '../data/mockWeek';
import { boxValue, canEditPlan, canPublish, infeasibleItems, setLineQty } from './plan';

describe('plan rules (FR-002–FR-004, FR-018)', () => {
  const s = createMockState();
  it('starter plan meets share value and is publishable', () => {
    expect(boxValue(s.plan.lines, s.items)).toBe(26);
    expect(canPublish(s.plan, s.items, 4).ok).toBe(true);
  });
  it('blocks publish on shortfall', () => {
    const lines = setLineQty(s.plan.lines, 'salad', 0);
    const r = canPublish({ ...s.plan, lines }, s.items, 4);
    expect(r.ok).toBe(false);
    expect(r.reasons[0]).toMatch(/below the share value/);
  });
  it('flags and blocks infeasible quantities', () => {
    const lines = setLineQty(s.plan.lines, 'tomatoes', 2); // 8 > 6
    expect(infeasibleItems(lines, s.items, 4)).toEqual(['tomatoes']);
    expect(canPublish({ ...s.plan, lines }, s.items, 4).ok).toBe(false);
  });
  it('blocks edits of a confirmed box after the cutoff', () => {
    const plan = { ...s.plan, status: 'confirmed' as const };
    expect(canEditPlan(plan, 'open').ok).toBe(true);
    expect(canEditPlan(plan, 'locked').ok).toBe(false);
    expect(canEditPlan({ ...s.plan }, 'packing').ok).toBe(false);
  });
});
