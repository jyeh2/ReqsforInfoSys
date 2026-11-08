// Domain types — see specs/001-csa-box-swaps/data-model.md

/** Local date-time string `YYYY-MM-DDTHH:mm` (research T-3). Compared lexicographically. */
export type DateTime = string;

export interface HarvestItem {
  id: string;
  name: string;
  unit: string;
  available: number;
  unitValue: number;
  /** Farm-approved substitute this week (FR-010). */
  isSubstitute: boolean;
}

export interface Member {
  id: string;
  name: string;
}

export interface WeekSchedule {
  pickup: DateTime;
  packingStart: DateTime;
}

export interface PlanLine {
  itemId: string;
  qty: number;
}

export type PlanStatus = 'draft' | 'provisional' | 'confirmed';

export interface BoxPlan {
  lines: PlanLine[];
  status: PlanStatus;
  shareValue: number;
  confirmedAt?: DateTime;
  /** Snapshot taken at confirmation, used to mark later changes (FR-008). */
  confirmedLines?: PlanLine[];
}

export type StoredRequestStatus = 'pending' | 'approved' | 'declined';
export type RequestStatus = StoredRequestStatus | 'not_reviewed';

export interface SwapRequest {
  id: string;
  memberId: string;
  originalItemId: string;
  substituteItemId: string;
  qty: number;
  submittedAt: DateTime;
  status: StoredRequestStatus;
  reason?: string;
  decidedAt?: DateTime;
}

export interface AppState {
  items: HarvestItem[];
  members: Member[];
  schedule: WeekSchedule;
  plan: BoxPlan;
  requests: SwapRequest[];
  clock: DateTime;
  /** memberId → checked itemIds (FR-016). */
  packingChecks: Record<string, string[]>;
  /** memberId → box marked "Checked" by packer (FR-016). */
  packingMarked: Record<string, boolean>;
}

export type Phase = 'open' | 'locked' | 'packing';

export interface Check {
  ok: boolean;
  reason?: string;
}
