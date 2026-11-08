// FR-009: cutoff (V2: D-2) shown with all C-1 proposals, labeled provisional.
import { computeCutoff, formatDateTime } from '../domain/schedule';
import { useStore } from '../state/store';

export function CutoffNotice({ detailed = false }: { detailed?: boolean }) {
  const { state } = useStore();
  const { proposalA, proposalB, proposalC, cutoff } = computeCutoff(state.schedule);
  return (
    <div className="notice">
      <strong>Swap cutoff: {formatDateTime(cutoff)}</strong>{' '}
      <span className="badge provisional">Provisional cutoff — pending stakeholder agreement</span>
      {detailed && (
        <ul className="muted">
          <li>Proposal A — 24 h before packing: {formatDateTime(proposalA)} (from an earlier goal model; no stakeholder said this)</li>
          <li>Proposal B — Wednesday evening, Hank: {formatDateTime(proposalB)} ← used as the cutoff</li>
          <li>Proposal C — know the contents 48 h before pickup, Raj: {formatDateTime(proposalC)} (publish by then to meet it)</li>
          <li>Assumes Friday pickup and packing starting {formatDateTime(state.schedule.packingStart)}. Pending confirmation by Lucia and Hank.</li>
        </ul>
      )}
    </div>
  );
}
