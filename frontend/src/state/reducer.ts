// State transitions — each action delegates rule checks to src/domain (FR references inline).
import { createMockState } from '../data/mockWeek';
import { canEditPlan, canPublish, setLineQty } from '../domain/plan';
import { phaseAt } from '../domain/schedule';
import { canApprove, canDecline, declineRequestsForRemovedItems, validateRequest } from '../domain/swaps';
import type { AppState, DateTime } from '../domain/types';

export type Action =
  | { type: 'reset' }                                                       // FR-021
  | { type: 'setClock'; clock: DateTime }                                   // FR-020
  | { type: 'setQty'; itemId: string; qty: number }                         // FR-002, FR-018
  | { type: 'publish' }                                                     // FR-004
  | { type: 'confirm' }                                                     // FR-005
  | { type: 'submitRequest'; memberId: string; originalItemId: string; substituteItemId: string } // FR-011
  | { type: 'approve'; id: string }                                         // FR-012
  | { type: 'decline'; id: string }                                         // FR-012
  | { type: 'toggleCheck'; memberId: string; itemId: string }               // FR-016
  | { type: 'markChecked'; memberId: string; value: boolean };              // FR-016

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'reset':
      return createMockState();

    case 'setClock':
      return { ...state, clock: action.clock };

    case 'setQty': {
      if (!canEditPlan(state.plan, phaseAt(state.clock, state.schedule)).ok) return state;
      const lines = setLineQty(state.plan.lines, action.itemId, Math.max(0, Math.floor(action.qty)));
      const next = { ...state, plan: { ...state.plan, lines } };
      return { ...next, requests: declineRequestsForRemovedItems(next, state.clock) };
    }

    case 'publish':
      if (!canPublish(state.plan, state.items, state.members.length).ok) return state;
      // V2 FR-008/FR-023: snapshot the first published estimate and the publish time.
      return {
        ...state,
        plan: {
          ...state.plan,
          status: 'provisional',
          publishedLines: state.plan.lines.map((l) => ({ ...l })),
          publishedAt: state.clock,
        },
      };

    case 'confirm':
      if (state.plan.status !== 'provisional') return state;
      return {
        ...state,
        plan: {
          ...state.plan,
          status: 'confirmed',
          confirmedAt: state.clock,
          confirmedLines: state.plan.lines.map((l) => ({ ...l })),
        },
      };

    case 'submitRequest': {
      const { memberId, originalItemId, substituteItemId } = action;
      const check = validateRequest(state, memberId, originalItemId, substituteItemId, state.clock);
      if (!check.ok && !check.late) return state;
      const qty = state.plan.lines.find((l) => l.itemId === originalItemId)!.qty;
      const id = `req-${state.requests.length + 1}-${memberId}`;
      const base = { id, memberId, originalItemId, substituteItemId, qty, submittedAt: state.clock };
      // FR-014: late requests are recorded as Declined with a reason; the box is unchanged.
      const request = check.late
        ? { ...base, status: 'declined' as const, reason: check.reason, decidedAt: state.clock }
        : { ...base, status: 'pending' as const };
      return { ...state, requests: [...state.requests, request] };
    }

    case 'approve':
    case 'decline': {
      const check = action.type === 'approve' ? canApprove(state, action.id, state.clock) : canDecline(state, action.id, state.clock);
      if (!check.ok) return state;
      const status = action.type === 'approve' ? 'approved' : 'declined';
      return {
        ...state,
        requests: state.requests.map((r) => (r.id === action.id ? { ...r, status, decidedAt: state.clock } : r)),
      };
    }

    case 'toggleCheck': {
      const current = new Set(state.packingChecks[action.memberId] ?? []);
      if (current.has(action.itemId)) current.delete(action.itemId);
      else current.add(action.itemId);
      return { ...state, packingChecks: { ...state.packingChecks, [action.memberId]: [...current] } };
    }

    case 'markChecked':
      return { ...state, packingMarked: { ...state.packingMarked, [action.memberId]: action.value } };
  }
}
