import { describe, expect, it } from 'vitest';
import { canApprove, closedMessage, swapsUnavailableThisWeek, declineRequestsForRemovedItems, effectiveStatus, substituteOptions, validateRequest } from './swaps';
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
  it('V2: accepts requests on Wednesday midday (D-2 cutoff is Wed 20:00)', () => {
    const s = confirmedState();
    expect(validateRequest(s, 'raj', 'potatoes', 'sweetpotatoes', '2026-11-11T12:00').ok).toBe(true);
  });
  it('marks otherwise-valid requests at or after the cutoff as late (FR-014, V2 wording)', () => {
    const s = confirmedState();
    const r = validateRequest(s, 'raj', 'potatoes', 'sweetpotatoes', '2026-11-11T20:00');
    expect(r.ok).toBe(false);
    expect(r.late).toBe(true);
    expect(r.reason).toBe('Received after the swap cutoff (Wed 11-11 20:00).');
    expect(r.reason).not.toMatch(/locked/);
  });
  it('V2: closed message separates requests closed from list locked (FR-024)', () => {
    expect(closedMessage(confirmedState())).toMatch(/Swap requests closed.*packing list locks at Thu 11-12 08:00/);
  });
  it('does not mark invalid late requests as late', () => {
    const s = confirmedState();
    expect(validateRequest(s, 'raj', 'beets', 'sweetpotatoes', '2026-11-11T21:00').late).toBeUndefined();
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
  it('V2: box first published after the cutoff means no swaps this week (FR-023)', () => {
    const s = confirmedState();
    s.plan.publishedAt = '2026-11-11T21:00';
    expect(swapsUnavailableThisWeek(s)).toBe(true);
    s.plan.publishedAt = '2026-11-09T09:00';
    expect(swapsUnavailableThisWeek(s)).toBe(false);
  });
});
