// Packer — FR-015, FR-016, FR-017
import { itemById } from '../domain/plan';
import { phaseAt } from '../domain/schedule';
import { allLinesChecked, isBoxChecked, packingList } from '../domain/packing';
import { useStore } from '../state/store';

export function PackingView() {
  const { state, dispatch } = useStore();
  const item = (id: string) => itemById(state.items, id);
  const packing = phaseAt(state.clock, state.schedule) === 'packing';

  if (state.plan.status !== 'confirmed') {
    return (
      <section>
        <h2>Packing lists</h2>
        <p className="notice">Packing lists are available after the box is confirmed.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Packing lists</h2>
      {packing && <p className="notice">Lists locked — packing has started, no further changes.</p>}
      <div className="cards">
        {state.members.map((m) => {
          const list = packingList(state, m.id)!;
          const checked = new Set(state.packingChecks[m.id] ?? []);
          const done = isBoxChecked(state, m.id);
          return (
            <div key={m.id} className={`card ${done ? 'card-done' : ''}`}>
              <div className="section-head">
                <h3>{m.name}</h3>
                {done && <span className="badge status-confirmed">Checked</span>}
              </div>
              <ul className="check-list">
                {list.map((l) => (
                  <li key={l.itemId}>
                    <label>
                      <input type="checkbox" checked={checked.has(l.itemId)} onChange={() => dispatch({ type: 'toggleCheck', memberId: m.id, itemId: l.itemId })} />
                      {l.qty} {item(l.itemId).unit} {item(l.itemId).name}
                      {l.swappedFrom && <span className="tag">swap for {item(l.swappedFrom).name}</span>}
                    </label>
                  </li>
                ))}
              </ul>
              <button
                className="small"
                disabled={!allLinesChecked(state, m.id) && !state.packingMarked[m.id]}
                onClick={() => dispatch({ type: 'markChecked', memberId: m.id, value: !state.packingMarked[m.id] })}
              >
                {state.packingMarked[m.id] ? 'Unmark box' : 'Mark box checked'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
