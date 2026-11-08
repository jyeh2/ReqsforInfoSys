// Schedule rules — FR-009 (cutoff via decision D-2), FR-014/FR-017/FR-024 (phases).
import type { DateTime, Phase, WeekSchedule } from './types';

function parse(dt: DateTime): Date {
  const [d, t] = dt.split('T');
  const [y, m, day] = d.split('-').map(Number);
  const [hh, mm] = t.split(':').map(Number);
  return new Date(y, m - 1, day, hh, mm);
}

function format(date: Date): DateTime {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

export interface CutoffInfo {
  /** Proposal A (C-1): 24 hours before packing starts. No interview evidence (A2 model only). */
  proposalA: DateTime;
  /** Proposal B (C-1): Wednesday 20:00 of the pickup week — Hank, T3/Hank-b:65. */
  proposalB: DateTime;
  /** V2 Proposal C (C-1): 48 hours before pickup — Raj, T3/Raj:98 (he also accepts a clear cutoff, T3/Raj:72). */
  proposalC: DateTime;
  /** V2 D-2: the cutoff is Proposal B. */
  cutoff: DateTime;
}

export function computeCutoff(schedule: WeekSchedule): CutoffInfo {
  const packing = parse(schedule.packingStart);
  const a = new Date(packing.getTime() - 24 * 60 * 60 * 1000);

  const pickup = parse(schedule.pickup);
  const wed = new Date(pickup);
  const back = (pickup.getDay() - 3 + 7) % 7; // days back to Wednesday
  wed.setDate(pickup.getDate() - back);
  wed.setHours(20, 0, 0, 0);

  const proposalA = format(a);
  const proposalB = format(wed);
  const proposalC = format(new Date(pickup.getTime() - 48 * 60 * 60 * 1000));
  return { proposalA, proposalB, proposalC, cutoff: proposalB };
}

/** open: swaps accepted · locked: requests closed (at/after cutoff) · packing: list locked (at/after packing start). */
export function phaseAt(clock: DateTime, schedule: WeekSchedule): Phase {
  if (clock >= schedule.packingStart) return 'packing';
  if (clock >= computeCutoff(schedule).cutoff) return 'locked';
  return 'open';
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatDateTime(dt: DateTime): string {
  const d = parse(dt);
  return `${DAYS[d.getDay()]} ${dt.slice(5, 10)} ${dt.slice(11)}`;
}

/** V2 FR-023: "2 d 11 h" until `to`, or null if `to` has passed. */
export function timeUntil(from: DateTime, to: DateTime): string | null {
  const ms = parse(to).getTime() - parse(from).getTime();
  if (ms <= 0) return null;
  const totalH = Math.floor(ms / 3_600_000);
  const d = Math.floor(totalH / 24);
  const h = totalH % 24;
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return d > 0 ? `${d} d ${h} h` : h > 0 ? `${h} h ${m} min` : `${m} min`;
}
