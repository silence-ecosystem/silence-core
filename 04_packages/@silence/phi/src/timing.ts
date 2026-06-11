/**
 * [PATH]: 04_packages/@silence/phi/src/timing.ts
 *
 * Timing computations using phi-derived windows.
 * All functions are deterministic and use only constants from constants.ts.
 */

import {
  GOLDENSECOND,
  PHI_INV_NUM,
  PHI_INV_DEN,
  VALIDATION_WINDOW_MS,
  BREATH_CYCLE_MS,
  INTERVENTION_WINDOW_MS,
} from './constants';

/**
 * Compute next window using fixed-point phi-inverse exponentiation.
 * interval = GOLDENSECOND × (PHI_INV)^depth
 */
export function computeIntervalMs(depth: number): number {
  if (depth < 1 || depth > 5) {
    throw new Error(`Invalid depth: ${depth}. Must be 1-5.`);
  }
  let interval = GOLDENSECOND;
  for (let i = 0; i < depth; i++) {
    interval = Math.floor((interval * PHI_INV_NUM) / PHI_INV_DEN);
  }
  return interval;
}

/**
 * Generate schedule timestamps for a given base time and attention depth.
 * Returns sorted array of timestamps.
 */
export function generateSchedule(
  baseTimestampMs: number,
  depth: number,
  slotCount: number
): number[] {
  const interval = computeIntervalMs(depth);
  const slots: number[] = [];
  for (let i = 1; i <= slotCount; i++) {
    slots.push(baseTimestampMs + interval * i);
  }
  return slots.sort((a, b) => a - b);
}

/**
 * Check if a timestamp falls within the intervention window from a reference time.
 */
export function isWithinInterventionWindow(
  referenceMs: number,
  targetMs: number
): boolean {
  const delta = targetMs - referenceMs;
  return delta >= 0 && delta <= INTERVENTION_WINDOW_MS;
}

/**
 * Check if schedule span exceeds validation window.
 */
export function exceedsValidationWindow(spanMs: number): boolean {
  return spanMs > VALIDATION_WINDOW_MS;
}

/**
 * Compute phase within breath cycle (0.0 to 1.0).
 */
export function breathCyclePhase(timestampMs: number): number {
  return (timestampMs % BREATH_CYCLE_MS) / BREATH_CYCLE_MS;
}
