import { describe, expect, it } from 'vitest';
import { computeCutoff, phaseAt } from './schedule';

const schedule = { pickup: '2026-11-13T09:00', packingStart: '2026-11-12T08:00' };

describe('computeCutoff (FR-009, D-1)', () => {
  it('computes both proposals and picks the earlier', () => {
    expect(computeCutoff(schedule)).toEqual({
      proposalA: '2026-11-11T08:00',
      proposalB: '2026-11-11T20:00',
      cutoff: '2026-11-11T08:00',
    });
  });
  it('picks Proposal B when packing is later', () => {
    expect(computeCutoff({ pickup: '2026-11-13T09:00', packingStart: '2026-11-13T06:00' }).cutoff).toBe('2026-11-11T20:00');
  });
});

describe('phaseAt (FR-014, FR-017)', () => {
  it('is open before the cutoff', () => expect(phaseAt('2026-11-11T07:59', schedule)).toBe('open'));
  it('treats exactly the cutoff as late', () => expect(phaseAt('2026-11-11T08:00', schedule)).toBe('locked'));
  it('is packing from packing start', () => expect(phaseAt('2026-11-12T08:00', schedule)).toBe('packing'));
});
