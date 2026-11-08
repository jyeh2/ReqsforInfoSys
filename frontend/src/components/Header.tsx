// FR-019 role switcher · FR-020 demo clock · FR-021 reset · FR-022 no safety claims
import { computeCutoff, formatDateTime, phaseAt } from '../domain/schedule';
import { useStore } from '../state/store';

export type Role = 'lucia' | 'member' | 'packer';

const PHASE_LABEL = { open: 'Swaps open', locked: 'Requests closed', packing: 'Packing — list locked' } as const;

interface Props {
  role: Role;
  setRole: (r: Role) => void;
  memberId: string;
  setMemberId: (id: string) => void;
}

export function Header({ role, setRole, memberId, setMemberId }: Props) {
  const { state, dispatch } = useStore();
  const { cutoff } = computeCutoff(state.schedule);
  const phase = phaseAt(state.clock, state.schedule);
  const presets = [
    { label: 'Mon 09:00', value: '2026-11-09T09:00' },
    { label: 'Tue 12:00', value: '2026-11-10T12:00' },
    { label: 'Wed 12:00', value: '2026-11-11T12:00' },
    { label: `Cutoff (${formatDateTime(cutoff)})`, value: cutoff },
    { label: 'Wed 21:00', value: '2026-11-11T21:00' },
    { label: 'Packing starts', value: state.schedule.packingStart },
  ];

  return (
    <header className="header">
      <div className="banner">
        Prototype {__APP_VERSION__.toUpperCase()} · mock data only · not a food-safety or allergen guarantee
      </div>
      <div className="header-row">
        <h1>CSA Box Planner</h1>
        <div className="roles" role="tablist" aria-label="Role">
          {(['lucia', 'member', 'packer'] as Role[]).map((r) => (
            <button key={r} role="tab" aria-selected={role === r} className={role === r ? 'tab active' : 'tab'} onClick={() => setRole(r)}>
              {r === 'lucia' ? 'Lucia (planner)' : r === 'member' ? 'Member' : 'Packer'}
            </button>
          ))}
          {role === 'member' && (
            <select aria-label="Member" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
              {state.members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="header-row clock">
        <span>
          Demo clock: <strong>{formatDateTime(state.clock)}</strong>{' '}
          <span className={`badge phase-${phase}`}>{PHASE_LABEL[phase]}</span>
        </span>
        <div className="presets">
          {presets.map((p) => (
            <button key={p.label} className="small" onClick={() => dispatch({ type: 'setClock', clock: p.value })}>
              {p.label}
            </button>
          ))}
          <input
            type="datetime-local"
            aria-label="Set demo time"
            value={state.clock}
            min="2026-11-09T00:00"
            max="2026-11-13T23:59"
            onChange={(e) => e.target.value && dispatch({ type: 'setClock', clock: e.target.value })}
          />
          <button className="small danger" onClick={() => dispatch({ type: 'reset' })}>Reset demo</button>
        </div>
      </div>
    </header>
  );
}
