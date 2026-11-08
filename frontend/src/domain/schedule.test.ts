import { describe, expect, it } from 'vitest';
import { computeCutoff, phaseAt, timeUntil } from './schedule';

const schedule = { pickup: '2026-11-13T09:00', packingStart: '2026-11-12T08:00' };

describe('computeCutoff (FR-009, D-2)', () => {
  it('returns all three C-1 proposals and uses Proposal B as the cutoff', () => {
    expect(computeCutoff(schedule)).toEqual({
      proposalA: '2026-11-11T08:00',
      proposalB: '2026-11-11T20:00',
      proposalC: '2026-11-11T09:00',
      cutoff: '2026-11-11T20:00',
    });
  });
});

describe('phaseAt (FR-014, FR-017, FR-024)', () => {
  it('is still open on Wednesday midday (V1 would have closed at 08:00)', () => expect(phaseAt('2026-11-11T12:00', schedule)).toBe('open'));
  it('treats exactly the cutoff as closed', () => expect(phaseAt('2026-11-11T20:00', schedule)).toBe('locked'));
  it('is packing from packing start', () => expect(phaseAt('2026-11-12T08:00', schedule)).toBe('packing'));
});

describe('timeUntil (FR-023)', () => {
  it('formats days and hours', () => expect(timeUntil('2026-11-09T09:00', '2026-11-11T20:00')).toBe('2 d 11 h'));
  it('formats hours and minutes', () => expect(timeUntil('2026-11-11T18:30', '2026-11-11T20:00')).toBe('1 h 30 min'));
  it('returns null once passed', () => expect(timeUntil('2026-11-11T20:00', '2026-11-11T20:00')).toBeNull());
});
