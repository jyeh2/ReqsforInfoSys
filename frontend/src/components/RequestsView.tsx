// Lucia — swap requests: FR-012, FR-013
import { itemById } from '../domain/plan';
import { formatDateTime } from '../domain/schedule';
import { canApprove, canDecline, effectiveStatus, remainingQty, STATUS_LABEL } from '../domain/swaps';
import { useStore } from '../state/store';
import { CutoffNotice } from './CutoffNotice';

export function RequestsView() {
  const { state, dispatch } = useStore();
  const name = (id: string) => itemById(state.items, id).name;
  const member = (id: string) => state.members.find((m) => m.id === id)?.name ?? id;

  return (
    <section>
      <h2>Swap requests</h2>
      <CutoffNotice />
      {state.requests.length === 0 ? (
        <p className="muted">No swap requests yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Swap</th><th>Submitted</th><th>Status</th><th>Decision</th></tr>
            </thead>
            <tbody>
              {state.requests.map((r) => {
                const status = effectiveStatus(r, state.clock, state.schedule);
                const approve = canApprove(state, r.id, state.clock);
                const decline = canDecline(state, r.id, state.clock);
                return (
                  <tr key={r.id}>
                    <td>{member(r.memberId)}</td>
                    <td>
                      {name(r.originalItemId)} → {name(r.substituteItemId)} ({r.qty})
                      <div className="muted small-text">{remainingQty(state, r.substituteItemId)} {name(r.substituteItemId)} remaining</div>
                    </td>
                    <td>{formatDateTime(r.submittedAt)}</td>
                    <td>
                      <span className={`badge req-${status}`}>{STATUS_LABEL[status]}</span>
                      {r.reason && <div className="muted small-text">{r.reason}</div>}
                    </td>
                    <td>
                      {status === 'pending' ? (
                        <div className="actions tight">
                          <button className="small primary" disabled={!approve.ok} title={approve.reason} onClick={() => dispatch({ type: 'approve', id: r.id })}>Approve</button>
                          <button className="small" disabled={!decline.ok} onClick={() => dispatch({ type: 'decline', id: r.id })}>Decline</button>
                          {!approve.ok && <div className="warn small-text">{approve.reason}</div>}
                        </div>
                      ) : (
                        r.decidedAt && <span className="muted">{formatDateTime(r.decidedAt)}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
