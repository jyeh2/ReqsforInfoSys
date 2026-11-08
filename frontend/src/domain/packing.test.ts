import { describe, expect, it } from 'vitest';
import { isBoxChecked, packingList } from './packing';
import { confirmedState, req } from './testState';

describe('packing (FR-015, FR-016)', () => {
  it('is unavailable before confirmation', () => {
    const s = confirmedState();
    s.plan.status = 'provisional';
    expect(packingList(s, 'raj')).toBeNull();
  });
  it('includes approved swaps but not pending or declined ones', () => {
    const s = confirmedState();
    s.requests = [req({ status: 'approved' }), req({ id: 'x', memberId: 'mei' }), req({ id: 'y', memberId: 'sam', status: 'declined' })];
    expect(packingList(s, 'raj')!.map((l) => l.itemId)).toContain('sweetpotatoes');
    expect(packingList(s, 'mei')!.map((l) => l.itemId)).toContain('potatoes');
    expect(packingList(s, 'sam')!.map((l) => l.itemId)).toContain('potatoes');
  });
  it('is checked only when marked and all lines checked', () => {
    const s = confirmedState();
    s.packingMarked.raj = true;
    s.packingChecks.raj = ['carrots'];
    expect(isBoxChecked(s, 'raj')).toBe(false);
    s.packingChecks.raj = s.plan.lines.map((l) => l.itemId);
    expect(isBoxChecked(s, 'raj')).toBe(true);
  });
});
