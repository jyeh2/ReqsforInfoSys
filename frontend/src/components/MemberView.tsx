// Member — box info and swaps: FR-006 to FR-011, FR-013, FR-014, FR-023, FR-024 (V2)
import { useState } from 'react';
import { confirmedVsEstimate, estimateChanges, formatQty, laterChanges, memberBox, type Change } from '../domain/memberBox';
import { itemById } from '../domain/plan';
import { formatDateTime, phaseAt } from '../domain/schedule';
import {
  closedMessage,
  effectiveStatus,
  STATUS_LABEL,
  substituteOptions,
  swapsUnavailableThisWeek,
  validateRequest,
} from '../domain/swaps';
import { useStore } from '../state/store';
import { CutoffNotice } from './CutoffNotice';

export function MemberView({ memberId }: { memberId: string }) {
  const { state, dispatch } = useStore();
  const { plan, items } = state;
  const member = state.members.find((m) => m.id === memberId)!;
  const item = (id: string) => itemById(items, id);
  const [original, setOriginal] = useState('');
  const [substitute, setSubstitute] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showLast, setShowLast] = useState(false);

  if (plan.status === 'draft') {
    return (
      <section>
        <h2>{member.name}'s box</h2>
        <p className="notice">This week's box has not been published yet. Check back soon.</p>
      </section>
    );
  }

  const box = memberBox(state, memberId);
  // V2 FR-008: estimate changes while provisional; later changes after confirmation.
  const farmChanges = plan.status === 'provisional' ? estimateChanges(state) : laterChanges(state);
  const changeLabel = plan.status === 'provisional' ? 'Changed since first estimate' : 'Changed after confirmation';
  const changeFor = new Map(farmChanges.filter((c) => c.to).map((c) => [c.itemId, c]));
  const removed = farmChanges.filter((c) => !c.to);
  const vsEstimate = confirmedVsEstimate(state);
  const phase = phaseAt(state.clock, state.schedule);
  const unavailable = swapsUnavailableThisWeek(state);
  const myRequests = state.requests.filter((r) => r.memberId === memberId);
  // V2 FR-013 / O-9: the confirmation always shows the request's *current* status.
  const lastRequest = showLast ? myRequests[myRequests.length - 1] : undefined;
  const options = original ? substituteOptions(state, original) : [];
  const swappable = box.filter((l) => !l.swappedFrom);

  const describe = (c: Change) =>
    c.from && c.to ? `was ${formatQty(c.from, items)}` : c.to ? 'added' : 'removed';

  function submit() {
    const check = validateRequest(state, memberId, original, substitute, state.clock);
    if (!check.ok && !check.late) {
      setError(check.reason ?? 'Request not accepted.');
      setShowLast(false);
      return;
    }
    dispatch({ type: 'submitRequest', memberId, originalItemId: original, substituteItemId: substitute });
    setError(null);
    setShowLast(true);
    setOriginal('');
    setSubstitute('');
  }

  return (
    <section>
      <div className="section-head">
        <h2>{member.name}'s box</h2>
        {plan.status === 'provisional' ? (
          <span className="badge status-provisional">Provisional — may change</span>
        ) : (
          <span className="badge status-confirmed">Confirmed {plan.confirmedAt && `at ${formatDateTime(plan.confirmedAt)}`}</span>
        )}
      </div>
      {plan.status === 'provisional' && (
        <p className="notice">This is an early estimate. Contents may change before the farm confirms the box.</p>
      )}

      {vsEstimate.length > 0 && (
        <div className="notice">
          <strong>Different from the first estimate</strong>
          <ul>
            {vsEstimate.map((c) => (
              <li key={c.itemId}>
                {c.from && c.to
                  ? `${formatQty(c.from, items)} → ${formatQty(c.to, items)}`
                  : c.to
                    ? `Added: ${formatQty(c.to, items)}`
                    : `Removed: ${formatQty(c.from!, items)}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="box-list">
        {box.map((l) => {
          const c = changeFor.get(l.swappedFrom ?? l.itemId);
          return (
            <li key={l.itemId} className={c || l.swappedFrom ? 'changed' : ''}>
              <span>{formatQty(l, items)}</span>
              {l.swappedFrom ? (
                <span className="change-tag">
                  Your approved swap (replaces {formatQty({ itemId: l.swappedFrom, qty: plan.lines.find((p) => p.itemId === l.swappedFrom)?.qty ?? l.qty }, items)})
                </span>
              ) : (
                c && <span className="change-tag">{changeLabel}: {describe(c)}</span>
              )}
            </li>
          );
        })}
        {removed.map((c) => (
          <li key={`rm-${c.itemId}`} className="changed removed">
            <span>{formatQty(c.from!, items)}</span>
            <span className="change-tag">{changeLabel}: removed by the farm</span>
          </li>
        ))}
      </ul>

      <h3>Request a swap</h3>
      <CutoffNotice />
      {unavailable ? (
        <p className="warn">Swap requests were not available this week: the box was published after the swap cutoff.</p>
      ) : phase === 'locked' ? (
        <p className="warn">{closedMessage(state)} Requests submitted now will be declined.</p>
      ) : phase === 'packing' ? (
        <p className="warn">Packing has started — the packing list is locked. Requests submitted now will be declined.</p>
      ) : null}
      <div className="swap-form">
        <label>
          Replace
          <select value={original} onChange={(e) => { setOriginal(e.target.value); setSubstitute(''); setError(null); setShowLast(false); }}>
            <option value="">Choose an item…</option>
            {swappable.map((l) => <option key={l.itemId} value={l.itemId}>{item(l.itemId).name}</option>)}
          </select>
        </label>
        <label>
          With (farm-approved)
          <select value={substitute} disabled={!original} onChange={(e) => setSubstitute(e.target.value)}>
            <option value="">{original && options.length === 0 ? 'No substitutes available' : 'Choose a substitute…'}</option>
            {options.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </label>
        <button className="primary" disabled={!original || !substitute} onClick={submit}>Submit request</button>
      </div>
      {error && <p className="warn">{error}</p>}
      {lastRequest && (() => {
        const s = effectiveStatus(lastRequest, state.clock, state.schedule);
        return (
          <p className="notice">
            Your request ({item(lastRequest.originalItemId).name} → {item(lastRequest.substituteItemId).name}) — status:{' '}
            <strong>{STATUS_LABEL[s]}</strong>
            {lastRequest.reason && ` — ${lastRequest.reason}`}
            {s === 'declined' && ' Your box stays as shown.'}
          </p>
        );
      })()}

      <h3>My requests</h3>
      {myRequests.length === 0 ? (
        <p className="muted">No requests.</p>
      ) : (
        <ul className="box-list">
          {myRequests.map((r) => {
            const s = effectiveStatus(r, state.clock, state.schedule);
            return (
              <li key={r.id}>
                <span>{item(r.originalItemId).name} → {item(r.substituteItemId).name}</span>
                <span>
                  <span className={`badge req-${s}`}>{STATUS_LABEL[s]}</span>
                  {r.reason && <span className="muted small-text"> {r.reason}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
