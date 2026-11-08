// Schedule rules — FR-009 (cutoff via decision D-1), FR-014/FR-017 (phases).
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
  /** Proposal A (C-1): 24 hours before packing starts. */
  proposalA: DateTime;
  /** Proposal B (C-1): Wednesday 20:00 of the pickup week (A-1: "evening" = 20:00). */
  proposalB: DateTime;
  /** D-1: the earlier of A and B. */
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
  return { proposalA, proposalB, cutoff: proposalA < proposalB ? proposalA : proposalB };
}

/** open: swaps accepted · locked: at/after cutoff · packing: at/after packing start. */
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
