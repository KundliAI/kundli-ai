// Pure rules shared by the screens. Mirrored in apps/mobile/lib/core/rules.dart.
import type { ChartStyle, DayPart } from "./types.ts";

/** States whose people usually read the South Indian chart. */
export const SOUTH_STATES = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Puducherry"];

export function defaultChartStyle(region: string): ChartStyle {
  return SOUTH_STATES.some((s) => region.toLowerCase().includes(s.toLowerCase())) ? "south" : "north";
}

/** Indian mobile: 10 digits starting 6-9, with or without +91 / 0. Returns E.164 or null. */
export function normaliseIndianPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2)
    : digits.length === 11 && digits.startsWith("0") ? digits.slice(1)
    : digits;
  return /^[6-9]\d{9}$/.test(local) ? `+91${local}` : null;
}

export type DobError = "invalid" | "future" | null;

/** Validates YYYY-MM-DD: rejects impossible dates (Feb 31) and dates after `today`. */
export function checkBirthDate(iso: string, today: Date = new Date()): DobError {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "invalid";
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return "invalid";
  if (y < 1900) return "invalid";
  const t = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return dt.getTime() > t ? "future" : null;
}

export function dayPartOf(hour: number): DayPart {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

/** Credit bar band: over 20% normal, 20% or less low (one nudge), 0 empty. */
export function creditBand(fraction: number): "ok" | "low" | "empty" {
  if (fraction <= 0) return "empty";
  return fraction <= 0.2 ? "low" : "ok";
}

// ---- Chart geometry ----

/**
 * North Indian chart: houses are fixed in place, signs move.
 * Returns the label anchor of each house (1..12) in a 0..100 square.
 * House 1 is the top centre diamond, then counter-clockwise.
 */
export const NORTH_HOUSE_ANCHORS: ReadonlyArray<readonly [number, number]> = [
  [50, 25], [25, 10], [10, 25], [25, 50], [10, 75], [25, 90],
  [50, 75], [75, 90], [90, 75], [75, 50], [90, 25], [75, 10],
];

/** North Indian: where the sign number sits for each house (near the inner corner). */
export const NORTH_SIGN_ANCHORS: ReadonlyArray<readonly [number, number]> = [
  [50, 42], [25, 20], [20, 25], [42, 50], [20, 75], [25, 80],
  [50, 58], [75, 80], [80, 75], [58, 50], [80, 25], [75, 20],
];

/**
 * South Indian chart: signs are fixed in place, Pisces top-left, running clockwise.
 * Returns [col, row] in a 4x4 grid for signs 1..12 (Aries = 1).
 */
export const SOUTH_SIGN_CELLS: ReadonlyArray<readonly [number, number]> = [
  [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3],
  [2, 3], [1, 3], [0, 3], [0, 2], [0, 1], [0, 0],
];

/** Sign in a given house, counting from the ascendant sign. */
export function signOfHouse(ascSign: number, house: number): number {
  return ((ascSign - 1 + house - 1) % 12) + 1;
}
