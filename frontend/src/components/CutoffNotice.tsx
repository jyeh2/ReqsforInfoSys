// FR-009: cutoff shown with both C-1 proposals and the D-1 rule, labeled provisional.
import { computeCutoff, formatDateTime } from '../domain/schedule';
import { useStore } from '../state/store';

export function CutoffNotice({ detailed = false }: { detailed?: boolean }) {
  const { state } = useStore();
  const { proposalA, proposalB, cutoff } = computeCutoff(state.schedule);
  return (
    <div className="notice">
      <strong>Swap cutoff: {formatDateTime(cutoff)}</strong>{' '}
      <span className="badge provisional">Provisional cutoff — pending stakeholder agreement</span>
      {detailed && (
        <ul className="muted">
          <li>Proposal A — 24 h before packing: {formatDateTime(proposalA)}</li>
          <li>Proposal B — Wednesday evening: {formatDateTime(proposalB)}</li>
          <li>V1 rule (D-1): use the earlier deadline. Assumes packing starts {formatDateTime(state.schedule.packingStart)} (A-1).</li>
        </ul>
      )}
    </div>
  );
}
