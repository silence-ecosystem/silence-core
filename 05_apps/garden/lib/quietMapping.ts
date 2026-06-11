/**
 * [PATH]: 05_apps/garden/lib/quietMapping.ts
 *
 * Deterministic cold-start seed: maps quiet level (0–4) to initial layout density and pace.
 * Based on legacy quietMapping.ts from Silence-Experience-main.
 */

export type InitialDensity = 'silent' | 'light' | 'standard';
export type InitialPace = 'slow' | 'neutral' | 'fast';

export interface InitialLayoutConfig {
  density: InitialDensity;
  pace: InitialPace;
}

export function deriveInitialLayoutFromQuietLevel(
  level: 0 | 1 | 2 | 3 | 4
): InitialLayoutConfig {
  if (level <= 1) return { density: 'silent', pace: 'slow' };
  if (level === 2) return { density: 'light', pace: 'neutral' };
  return { density: 'standard', pace: 'neutral' };
}

export function getInitialDashboardConfig(
  level: number | null
): InitialLayoutConfig {
  if (level == null) return { density: 'light', pace: 'neutral' };
  const clamped = Math.max(0, Math.min(4, level)) as 0 | 1 | 2 | 3 | 4;
  return deriveInitialLayoutFromQuietLevel(clamped);
}
