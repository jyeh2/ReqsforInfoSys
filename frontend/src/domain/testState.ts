import { createMockState } from '../data/mockWeek';
import type { AppState, SwapRequest } from './types';

export function confirmedState(): AppState {
  const s = createMockState();
  s.plan = { ...s.plan, status: 'confirmed', confirmedAt: s.clock, confirmedLines: s.plan.lines.map((l) => ({ ...l })) };
  return s;
}

export function req(partial: Partial<SwapRequest>): SwapRequest {
  return {
    id: 'r1', memberId: 'raj', originalItemId: 'potatoes', substituteItemId: 'sweetpotatoes',
    qty: 2, submittedAt: '2026-11-09T10:00', status: 'pending', ...partial,
  };
}
