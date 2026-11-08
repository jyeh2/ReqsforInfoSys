import { describe, expect, it } from 'vitest';
import { canApprove, declineRequestsForRemovedItems, effectiveStatus, substituteOptions, validateRequest } from './swaps';
import { confirmedState, req } from './testState';

describe('swap rules (FR-010–FR-014, FR-017)', () => {
  it('offers only approved substitutes with enough remaining', () => {
    const s = confirmedState();
    // potatoes qty 2 per box → spinach (3) has enough, all 4 substitutes offered
    expect(substituteOptions(s, 'potatoes').map((i) => i.id)).toEqual(['beets', 'spinach', 'leeks', 'sweetpotatoes']);
    s.requests = [req({ substituteItemId: 'spinach', status: 'approved' })];
    expect(substituteOptions(s, 'potatoes').map((i) => i.id)).not.toContain('spinach');
  });
  it('accepts a valid request before the cutoff', () => {
    const s = confirmedState();
    expect(validateRequest(s, 'raj', 'potatoes', 'sweetpotatoes', '2026-11-10T12:00').ok).toBe(true);
  });
  it('marks otherwise-valid requests at or after the cutoff as late (FR-014)', () => {
    const s = confirmedState();
    const r = validateRequest(s, 'raj', 'potatoes', 'sweetpotatoes', '2026-11-11T08:00');
    expect(r.ok).toBe(false);
    expect(r.late).toBe(true);
    expect(r.reason).toMatch(/Received after the cutoff.*locked for packing/);
  });
  it('does not mark invalid late requests as late', () => {
    const s = confirmedState();
    expect(validateRequest(s, 'raj', 'beets', 'sweetpotatoes', '2026-11-11T09:00').late).toBeUndefined();
  });
  it('rejects a second active request for the same item', () => {
    const s = confirmedState();
    s.requests = [req({})];
    expect(validateRequest(s, 'raj', 'potatoes', 'beets', '2026-11-10T12:00').ok).toBe(false);
  });
  it('rejects requests before publishing', () => {
    const s = confirmedState();
    s.plan.status = 'draft';
    expect(validateRequest(s, 'raj', 'potatoes', 'beets', '2026-11-10T12:00').ok).toBe(false);
  });
  it('blocks approval when substitute is insufficient', () => {
    const s = confirmedState();
    s.requests = [
      req({ id: 'a', memberId: 'mei', substituteItemId: 'spinach', status: 'approved' }),
      req({ id: 'b', substituteItemId: 'spinach' }),
    ];
    expect(canApprove(s, 'b', '2026-11-10T12:00').ok).toBe(false);
  });
  it('shows pending requests as not reviewed once packing starts', () => {
    const s = confirmedState();
    expect(effectiveStatus(req({}), '2026-11-12T08:00', s.schedule)).toBe('not_reviewed');
    expect(effectiveStatus(req({}), '2026-11-11T09:00', s.schedule)).toBe('pending');
  });
  it('declines requests for items removed from the box', () => {
    const s = confirmedState();
    s.requests = [req({})];
    s.plan.lines = s.plan.lines.filter((l) => l.itemId !== 'potatoes');
    expect(declineRequestsForRemovedItems(s, '2026-11-10T12:00')[0].status).toBe('declined');
  });
});
