// Lucia — planning: FR-001 to FR-005, FR-018
import { boxValue, canEditPlan, canPublish, infeasibleItems } from '../domain/plan';
import { computeCutoff, formatDateTime, phaseAt, timeUntil } from '../domain/schedule';
import { useStore } from '../state/store';
import { CutoffNotice } from './CutoffNotice';

export const STATUS_TEXT = { draft: 'Draft', provisional: 'Provisional estimate', confirmed: 'Confirmed' } as const;

export function PlannerView() {
  const { state, dispatch } = useStore();
  const { plan, items, members } = state;
  const value = boxValue(plan.lines, items);
  const shortfall = Math.max(0, plan.shareValue - value);
  const infeasible = new Set(infeasibleItems(plan.lines, items, members.length));
  const publish = canPublish(plan, items, members.length);
  const edit = canEditPlan(plan, phaseAt(state.clock, state.schedule));
  const qtyOf = (id: string) => plan.lines.find((l) => l.itemId === id)?.qty ?? 0;

  return (
    <section>
      <div className="section-head">
        <h2>This week's box plan</h2>
        <span className={`badge status-${plan.status}`}>{STATUS_TEXT[plan.status]}</span>
      </div>
      {plan.status === 'draft' && (() => {
        // V2 FR-023: warn while the box is still a draft.
        const left = timeUntil(state.clock, computeCutoff(state.schedule).cutoff);
        return (
          <p className="warn">
            Members can't request swaps until you publish this box.{' '}
            {left ? `${left} left until the swap cutoff.` : 'The swap cutoff has passed — members will be told swaps are not available this week.'}
          </p>
        );
      })()}
      <CutoffNotice detailed />
      {!edit.ok && <p className="warn">{edit.reason}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Item</th><th>Available</th><th>Unit value</th><th>Per box</th><th>Needed ({members.length} members)</th><th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => {
              const q = qtyOf(i.id);
              return (
                <tr key={i.id} className={infeasible.has(i.id) ? 'row-bad' : q > 0 ? 'row-in' : ''}>
                  <td>{i.name}{i.isSubstitute && <span className="tag">substitute</span>}</td>
                  <td>{i.available} {i.unit}</td>
                  <td>${i.unitValue.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      aria-label={`${i.name} per box`}
                      value={q}
                      disabled={!edit.ok}
                      onChange={(e) => dispatch({ type: 'setQty', itemId: i.id, qty: Number(e.target.value) })}
                    />
                  </td>
                  <td>{q * members.length} {i.unit}</td>
                  <td>{infeasible.has(i.id) && <span className="bad">Not enough harvest</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="summary">
        <div>
          Box value <strong>${value.toFixed(2)}</strong> / share value ${plan.shareValue.toFixed(2)}
          {shortfall > 0 ? <span className="bad"> — short by ${shortfall.toFixed(2)}</span> : <span className="good"> — meets share value</span>}
        </div>
        {plan.status === 'confirmed' && plan.confirmedAt && <div className="muted">Confirmed at {formatDateTime(plan.confirmedAt)}</div>}
      </div>

      <div className="actions">
        {plan.status === 'draft' && (
          <button className="primary" disabled={!publish.ok} onClick={() => dispatch({ type: 'publish' })}>
            Publish as provisional estimate
          </button>
        )}
        {plan.status === 'provisional' && (
          <button className="primary" onClick={() => dispatch({ type: 'confirm' })}>Confirm box</button>
        )}
      </div>
      {plan.status === 'draft' && !publish.ok && (
        <ul className="reasons">{publish.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
      )}
    </section>
  );
}
