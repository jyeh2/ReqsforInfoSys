// Member — box info and swaps: FR-006 to FR-011, FR-013, FR-014
import { useState } from 'react';
import { memberBox, memberChanges } from '../domain/memberBox';
import { itemById } from '../domain/plan';
import { formatDateTime, phaseAt } from '../domain/schedule';
import { effectiveStatus, lateReason, STATUS_LABEL, substituteOptions, validateRequest } from '../domain/swaps';
import { useStore } from '../state/store';
import { CutoffNotice } from './CutoffNotice';

export function MemberView({ memberId }: { memberId: string }) {
  const { state, dispatch } = useStore();
  const { plan } = state;
  const member = state.members.find((m) => m.id === memberId)!;
  const item = (id: string) => itemById(state.items, id);
  const [original, setOriginal] = useState('');
  const [substitute, setSubstitute] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  if (plan.status === 'draft') {
    return (
      <section>
        <h2>{member.name}'s box</h2>
        <p className="notice">This week's box has not been published yet. Check back soon.</p>
      </section>
    );
  }

  const box = memberBox(state, memberId);
  const changes = memberChanges(state, memberId);
  const changedTo = new Map(changes.filter((c) => c.to).map((c) => [c.to!.itemId, c]));
  const removed = changes.filter((c) => !c.to);
  const phase = phaseAt(state.clock, state.schedule);
  const myRequests = state.requests.filter((r) => r.memberId === memberId);
  const options = original ? substituteOptions(state, original) : [];
  const swappable = box.filter((l) => !l.swappedFrom);

  function submit() {
    const check = validateRequest(state, memberId, original, substitute, state.clock);
    if (!check.ok && !check.late) {
      setMessage(check.reason ?? 'Request not accepted.');
      return;
    }
    dispatch({ type: 'submitRequest', memberId, originalItemId: original, substituteItemId: substitute });
    setMessage(check.late ? `Request declined — ${check.reason} Your box stays as shown.` : 'Request submitted — status: Pending.');
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

      <ul className="box-list">
        {box.map((l) => {
          const c = changedTo.get(l.itemId);
          return (
            <li key={l.itemId} className={c ? 'changed' : ''}>
              <span>{l.qty} {item(l.itemId).unit} {item(l.itemId).name}</span>
              {c && (
                <span className="change-tag">
                  Changed{c.from ? `: replaces ${c.from.qty} ${item(c.from.itemId).name}` : ': added'} ({c.reason === 'swap' ? 'your approved swap' : 'farm edit'})
                </span>
              )}
            </li>
          );
        })}
        {removed.map((c) => (
          <li key={`rm-${c.from!.itemId}`} className="changed removed">
            <span>{item(c.from!.itemId).name}</span>
            <span className="change-tag">Removed by the farm</span>
          </li>
        ))}
      </ul>

      <h3>Request a swap</h3>
      <CutoffNotice />
      {phase !== 'open' && (
        <p className="warn">
          The swap cutoff has passed. Requests submitted now will be declined automatically (FR-014): {lateReason(state)}
        </p>
      )}
        <div className="swap-form">
          <label>
            Replace
            <select value={original} onChange={(e) => { setOriginal(e.target.value); setSubstitute(''); setMessage(null); }}>
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
      {message && <p className="notice">{message}</p>}

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
