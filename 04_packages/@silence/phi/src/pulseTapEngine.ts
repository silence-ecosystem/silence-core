/**
 * [PATH]: 04_packages/@silence/phi/src/pulseTapEngine.ts
 *
 * Pure functions for Pulse Tap L0 → L1 → L2 pipeline.
 * Deterministic: all time values are inputs, no Date.now(), no Math.random().
 */

import type {
  PulseTapCanonicalSample,
  PulseTapPrompt,
  PulseTapRawSample,
  PulseTapSessionSummary,
} from '@silence/contracts';
import {
  GOLDENSECOND,
  INTERVENTION_WINDOW_MS,
  VALIDATION_WINDOW_MS,
} from './constants';

export const PULSE_TAP_SEQUENCE_LENGTH = 5 as const;
export const PHI_COMPLIANCE_SCORE_GROWTH_THRESHOLD = 0.99 as const;

/**
 * Build deterministic phi-aligned tap slots from a prompt start epoch.
 */
export function buildPhiTimeGrid(
  prompt_opened_epoch_ms: number,
  expected_sequence_length: number,
  phi_slot_interval_ms: number
): readonly number[] {
  return Array.from(
    { length: expected_sequence_length },
    (_, index) => prompt_opened_epoch_ms + index * phi_slot_interval_ms
  );
}

/**
 * Create an L0 raw sample from a detected tap.
 */
export function buildRawSample(
  session_id: string,
  prompt_opened_epoch_ms: number,
  tap_index: number,
  tap_epoch_ms: number,
  pointer_pressure_raw: number | null = null
): PulseTapRawSample {
  return {
    session_id,
    tap_index,
    tap_epoch_ms,
    time_to_first_tap_raw_ms:
      tap_index === 0 ? Math.max(0, tap_epoch_ms - prompt_opened_epoch_ms) : null,
    pointer_pressure_raw,
  };
}

/**
 * Canonicalize a raw sample against its expected phi slot and the previous tap.
 */
export function canonicalizeSample(
  raw: PulseTapRawSample,
  previousRaw: PulseTapRawSample | null,
  slot_epoch_ms: number
): PulseTapCanonicalSample {
  const inter_tap_interval_ms =
    previousRaw !== null
      ? Math.max(0, raw.tap_epoch_ms - previousRaw.tap_epoch_ms)
      : null;
  const inter_tap_interval_drift_ms =
    inter_tap_interval_ms !== null
      ? Math.abs(inter_tap_interval_ms - GOLDENSECOND)
      : null;
  const phi_ratio =
    inter_tap_interval_ms !== null ? inter_tap_interval_ms / GOLDENSECOND : null;
  const qualified = Math.abs(raw.tap_epoch_ms - slot_epoch_ms) <= GOLDENSECOND;

  return {
    session_id: raw.session_id,
    tap_index: raw.tap_index,
    tap_epoch_ms: raw.tap_epoch_ms,
    slot_epoch_ms,
    inter_tap_interval_ms,
    inter_tap_interval_drift_ms,
    phi_ratio,
    qualified,
  };
}

function clamp01(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return Math.round(value * 1_000_000) / 1_000_000;
}

/**
 * Regularity score: 1 − mean drift / GOLDENSECOND.
 */
export function scoreRegularity(
  samples: readonly PulseTapCanonicalSample[]
): number {
  const eligible = samples.filter(
    (sample) => sample.inter_tap_interval_drift_ms !== null
  );
  if (eligible.length === 0) return 0;
  const meanDrift =
    eligible.reduce(
      (sum, sample) => sum + (sample.inter_tap_interval_drift_ms ?? 0),
      0
    ) / eligible.length;
  return clamp01(1 - meanDrift / GOLDENSECOND);
}

/**
 * Drift stability score: lower variance of ITI drifts → higher score.
 */
export function scoreDrift(
  samples: readonly PulseTapCanonicalSample[]
): number {
  const drifts = samples
    .map((sample) => sample.inter_tap_interval_drift_ms)
    .filter((value): value is number => value !== null);
  if (drifts.length === 0) return 0;
  if (drifts.length === 1) {
    return clamp01(1 - drifts[0] / GOLDENSECOND);
  }
  const mean = drifts.reduce((sum, value) => sum + value, 0) / drifts.length;
  const variance =
    drifts.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    drifts.length;
  const normalized = Math.sqrt(variance) / GOLDENSECOND;
  return clamp01(1 - normalized);
}

/**
 * Completion score: qualified taps / expected sequence length.
 */
export function scoreCompletion(
  samples: readonly PulseTapCanonicalSample[]
): number {
  const qualified = samples.filter((sample) => sample.qualified).length;
  return clamp01(qualified / PULSE_TAP_SEQUENCE_LENGTH);
}

/**
 * Damping intensity: ratio of too-fast or off-grid taps.
 * VALIDATION_WINDOW_MS (382 ms) is used as the fast-tap threshold.
 */
export function computeDampingIntensity(
  samples: readonly PulseTapCanonicalSample[]
): number {
  const fastOrOffGrid = samples.filter((sample) => {
    const tooFast =
      sample.inter_tap_interval_ms !== null &&
      sample.inter_tap_interval_ms < VALIDATION_WINDOW_MS;
    return tooFast || !sample.qualified;
  }).length;
  return clamp01(fastOrOffGrid / Math.max(1, samples.length));
}

/**
 * Reduce a complete Pulse Tap session to its L2 summary.
 */
export function summarizePulseTapSession(
  prompt: PulseTapPrompt,
  rawSamples: readonly PulseTapRawSample[],
  canonicalSamples: readonly PulseTapCanonicalSample[]
): PulseTapSessionSummary {
  const qualified_tap_count = canonicalSamples.filter(
    (sample) => sample.qualified
  ).length;
  const off_grid_tap_count = canonicalSamples.length - qualified_tap_count;
  const completion_rate = scoreCompletion(canonicalSamples);
  const regularity_score = scoreRegularity(canonicalSamples);
  const drift_score = scoreDrift(canonicalSamples);
  const completion_score = completion_rate;
  const phicompliancescore = clamp01(
    regularity_score * 0.4 + drift_score * 0.3 + completion_score * 0.3
  );
  const damping_intensity = computeDampingIntensity(canonicalSamples);
  const intervention_silence_until_epoch_ms =
    damping_intensity > 0
      ? prompt.prompt_opened_epoch_ms + INTERVENTION_WINDOW_MS
      : null;

  return {
    session_id: prompt.session_id,
    prompt_opened_epoch_ms: prompt.prompt_opened_epoch_ms,
    time_to_first_tap_raw_ms: rawSamples[0]?.time_to_first_tap_raw_ms ?? null,
    qualified_tap_count,
    off_grid_tap_count,
    completion_rate,
    regularity_score,
    drift_score,
    completion_score,
    phicompliancescore,
    damping_intensity,
    intervention_silence_until_epoch_ms,
    growth_eligible:
      phicompliancescore >= PHI_COMPLIANCE_SCORE_GROWTH_THRESHOLD,
  };
}
