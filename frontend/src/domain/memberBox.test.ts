import { describe, expect, it } from 'vitest';
import { createMockState } from '../data/mockWeek';
import { reducer } from '../state/reducer';
import { confirmedVsEstimate, estimateChanges, formatQty, laterChanges, memberBox } from './memberBox';
import { confirmedState, req } from './testState';

describe('member box (FR-007, FR-008)', () => {
  it('applies only that member’s approved swaps', () => {
    const s = confirmedState();
    s.requests = [req({ status: 'approved' }), req({ id: 'r2', memberId: 'mei', status: 'declined' })];
    expect(memberBox(s, 'raj').find((l) => l.swappedFrom === 'potatoes')?.itemId).toBe('sweetpotatoes');
    expect(memberBox(s, 'mei').some((l) => l.swappedFrom)).toBe(false);
  });

  it('V2: marks provisional edits against the first published estimate (O-1)', () => {
    let s = reducer(createMockState(), { type: 'publish' });
    expect(estimateChanges(s)).toEqual([]);
    s = reducer(s, { type: 'setQty', itemId: 'apples', qty: 3 });
    s = reducer(s, { type: 'setQty', itemId: 'garlic', qty: 0 });
    const changes = estimateChanges(s);
    expect(changes).toContainEqual({ itemId: 'apples', from: { itemId: 'apples', qty: 2 }, to: { itemId: 'apples', qty: 3 } });
    expect(changes).toContainEqual({ itemId: 'garlic', from: { itemId: 'garlic', qty: 1 } });
  });

  it('V2: confirmed view lists differences from the first estimate, separately from later edits', () => {
    let s = reducer(createMockState(), { type: 'publish' });
    s = reducer(s, { type: 'setQty', itemId: 'apples', qty: 3 });
    s = reducer(s, { type: 'confirm' });
    expect(confirmedVsEstimate(s).map((c) => c.itemId)).toEqual(['apples']);
    expect(laterChanges(s)).toEqual([]);
    s = reducer(s, { type: 'setQty', itemId: 'kale', qty: 2 });
    expect(laterChanges(s).map((c) => c.itemId)).toEqual(['kale']);
    expect(estimateChanges(s)).toEqual([]);
  });

  it('V2: a swap approved before confirmation stays marked after confirmation (O-10)', () => {
    let s = reducer(createMockState(), { type: 'publish' });
    s = reducer(s, { type: 'setClock', clock: '2026-11-10T12:00' });
    s = reducer(s, { type: 'submitRequest', memberId: 'raj', originalItemId: 'potatoes', substituteItemId: 'sweetpotatoes' });
    s = reducer(s, { type: 'approve', id: s.requests[0].id });
    s = reducer(s, { type: 'confirm' });
    expect(memberBox(s, 'raj').find((l) => l.itemId === 'sweetpotatoes')?.swappedFrom).toBe('potatoes');
    expect(laterChanges(s)).toEqual([]);
  });

  it('V2: formats quantity with unit (O-8)', () => {
    expect(formatQty({ itemId: 'potatoes', qty: 2 }, createMockState().items)).toBe('2 lb Potatoes');
  });
});
