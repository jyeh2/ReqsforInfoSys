import { describe, expect, it } from 'vitest';
import { memberBox, memberChanges } from './memberBox';
import { confirmedState, req } from './testState';

describe('member box (FR-007, FR-008)', () => {
  it('applies only that member’s approved swaps', () => {
    const s = confirmedState();
    s.requests = [req({ status: 'approved' }), req({ id: 'r2', memberId: 'mei', status: 'declined' })];
    expect(memberBox(s, 'raj').find((l) => l.swappedFrom === 'potatoes')?.itemId).toBe('sweetpotatoes');
    expect(memberBox(s, 'mei').some((l) => l.swappedFrom)).toBe(false);
  });
  it('marks swaps and farm edits after confirmation', () => {
    const s = confirmedState();
    s.requests = [req({ status: 'approved' })];
    s.plan.lines = s.plan.lines.map((l) => (l.itemId === 'apples' ? { ...l, qty: 3 } : l));
    const reasons = memberChanges(s, 'raj').map((c) => c.reason).sort();
    expect(reasons).toEqual(['edit', 'swap']);
  });
  it('reports no changes before confirmation', () => {
    const s = confirmedState();
    s.plan.status = 'provisional';
    expect(memberChanges(s, 'raj')).toEqual([]);
  });
});
