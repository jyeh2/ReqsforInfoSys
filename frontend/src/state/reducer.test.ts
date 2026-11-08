// End-to-end walkthrough of specs/001-csa-box-swaps/quickstart.md at the state level.
import { describe, expect, it } from 'vitest';
import { createMockState } from '../data/mockWeek';
import { memberChanges } from '../domain/memberBox';
import { isBoxChecked, packingList } from '../domain/packing';
import { effectiveStatus } from '../domain/swaps';
import { reducer, type Action } from './reducer';

const run = (actions: Action[], s = createMockState()) => actions.reduce(reducer, s);

describe('quickstart walkthrough', () => {
  it('plan → publish → swap → pack', () => {
    let s = run([{ type: 'publish' }, { type: 'confirm' }]);
    expect(s.plan.status).toBe('confirmed');

    s = run([
      { type: 'setClock', clock: '2026-11-10T12:00' },
      { type: 'submitRequest', memberId: 'raj', originalItemId: 'potatoes', substituteItemId: 'sweetpotatoes' },
      { type: 'submitRequest', memberId: 'mei', originalItemId: 'kale', substituteItemId: 'spinach' },
    ], s);
    const [rajReq, meiReq] = s.requests;
    s = run([{ type: 'approve', id: rajReq.id }, { type: 'decline', id: meiReq.id }], s);

    expect(memberChanges(s, 'raj')[0].reason).toBe('swap');
    expect(packingList(s, 'raj')!.some((l) => l.itemId === 'sweetpotatoes')).toBe(true);
    expect(packingList(s, 'mei')!.some((l) => l.itemId === 'kale')).toBe(true);

    // late request recorded as Declined with a reason; box unchanged (US3-6, FR-014)
    const late = run([
      { type: 'setClock', clock: '2026-11-11T08:00' },
      { type: 'submitRequest', memberId: 'sam', originalItemId: 'kale', substituteItemId: 'beets' },
    ], s);
    expect(late.requests).toHaveLength(3);
    expect(late.requests[2]).toMatchObject({ status: 'declined', memberId: 'sam' });
    expect(late.requests[2].reason).toMatch(/Received after the cutoff/);
    expect(packingList(late, 'sam')!.some((l) => l.itemId === 'kale')).toBe(true);

    // pending at packing start → not reviewed, list unchanged (edge case)
    s = run([{ type: 'submitRequest', memberId: 'dana', originalItemId: 'apples', substituteItemId: 'beets' }], s);
    s = run([{ type: 'setClock', clock: '2026-11-12T08:00' }], s);
    expect(effectiveStatus(s.requests[2], s.clock, s.schedule)).toBe('not_reviewed');
    expect(run([{ type: 'approve', id: s.requests[2].id }], s).requests[2].status).toBe('pending');

    // packer checks every line (US4-2)
    for (const l of packingList(s, 'raj')!) s = reducer(s, { type: 'toggleCheck', memberId: 'raj', itemId: l.itemId });
    s = reducer(s, { type: 'markChecked', memberId: 'raj', value: true });
    expect(isBoxChecked(s, 'raj')).toBe(true);
  });

  it('blocks publishing an invalid plan', () => {
    const s = run([{ type: 'setQty', itemId: 'tomatoes', qty: 2 }, { type: 'publish' }]);
    expect(s.plan.status).toBe('draft');
  });
});
