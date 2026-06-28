/**
 * [PATH]: 04_packages/@silence/phi/src/pulseTapEngine.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPhiTimeGrid,
  buildRawSample,
  canonicalizeSample,
  computeDampingIntensity,
  PHI_COMPLIANCE_SCORE_GROWTH_THRESHOLD,
  PULSE_TAP_SEQUENCE_LENGTH,
  scoreCompletion,
  scoreDrift,
  scoreRegularity,
  summarizePulseTapSession,
} from './pulseTapEngine';
import { GOLDENSECOND } from './constants';

const SESSION_ID = 'test-session-01';
const START_MS = 1_000_000;

function makePrompt(overrides?: Partial<{
  session_id: string;
  prompt_opened_epoch_ms: number;
  expected_sequence_length: number;
  phi_slot_interval_ms: number;
}>): {
  readonly session_id: string;
  readonly prompt_opened_epoch_ms: number;
  readonly expected_sequence_length: number;
  readonly phi_slot_interval_ms: number;
} {
  return {
    session_id: overrides?.session_id ?? SESSION_ID,
    prompt_opened_epoch_ms: overrides?.prompt_opened_epoch_ms ?? START_MS,
    expected_sequence_length:
      overrides?.expected_sequence_length ?? PULSE_TAP_SEQUENCE_LENGTH,
    phi_slot_interval_ms: overrides?.phi_slot_interval_ms ?? GOLDENSECOND,
  };
}

describe('pulseTapEngine', () => {
  it('buildPhiTimeGrid is deterministic', () => {
    const prompt = makePrompt();
    const grid = buildPhiTimeGrid(
      prompt.prompt_opened_epoch_ms,
      prompt.expected_sequence_length,
      prompt.phi_slot_interval_ms
    );
    assert.deepEqual(grid, [
      START_MS,
      START_MS + GOLDENSECOND,
      START_MS + 2 * GOLDENSECOND,
      START_MS + 3 * GOLDENSECOND,
      START_MS + 4 * GOLDENSECOND,
    ]);
  });

  it('canonicalizes a perfect on-grid tap', () => {
    const raw = buildRawSample(SESSION_ID, START_MS, 0, START_MS);
    const canonical = canonicalizeSample(raw, null, START_MS);
    assert.equal(canonical.qualified, true);
    assert.equal(canonical.inter_tap_interval_ms, null);
    assert.equal(raw.time_to_first_tap_raw_ms, 0);
  });

  it('canonicalizes an off-grid tap as not qualified', () => {
    const raw = buildRawSample(
      SESSION_ID,
      START_MS,
      0,
      START_MS + GOLDENSECOND + 1
    );
    const canonical = canonicalizeSample(raw, null, START_MS);
    assert.equal(canonical.qualified, false);
  });

  it('computes phi ratio and drift for regular taps', () => {
    const first = buildRawSample(SESSION_ID, START_MS, 0, START_MS);
    const second = buildRawSample(
      SESSION_ID,
      START_MS,
      1,
      START_MS + GOLDENSECOND
    );
    const canonical = canonicalizeSample(second, first, START_MS + GOLDENSECOND);
    assert.equal(canonical.inter_tap_interval_ms, GOLDENSECOND);
    assert.equal(canonical.inter_tap_interval_drift_ms, 0);
    assert.equal(canonical.phi_ratio, 1);
    assert.equal(canonical.qualified, true);
  });

  it('scores a perfect session as growth eligible', () => {
    const prompt = makePrompt();
    const grid = buildPhiTimeGrid(
      prompt.prompt_opened_epoch_ms,
      prompt.expected_sequence_length,
      prompt.phi_slot_interval_ms
    );
    const rawSamples = grid.map((slot, index) =>
      buildRawSample(SESSION_ID, START_MS, index, slot)
    );
    const canonicalSamples = rawSamples.map((raw, index) => {
      const previous = index > 0 ? rawSamples[index - 1] : null;
      return canonicalizeSample(raw, previous, grid[index]);
    });

    const summary = summarizePulseTapSession(
      prompt,
      rawSamples,
      canonicalSamples
    );

    assert.equal(summary.qualified_tap_count, PULSE_TAP_SEQUENCE_LENGTH);
    assert.equal(summary.off_grid_tap_count, 0);
    assert.equal(summary.completion_rate, 1);
    assert.equal(summary.regularity_score, 1);
    assert.equal(summary.drift_score, 1);
    assert.equal(summary.phicompliancescore, 1);
    assert.equal(summary.damping_intensity, 0);
    assert.equal(summary.growth_eligible, true);
    assert.equal(
      summary.intervention_silence_until_epoch_ms,
      null
    );
  });

  it('scores an irregular session as not growth eligible', () => {
    const prompt = makePrompt();
    const grid = buildPhiTimeGrid(
      prompt.prompt_opened_epoch_ms,
      prompt.expected_sequence_length,
      prompt.phi_slot_interval_ms
    );
    // All taps far outside every slot — off-grid and irregular.
    const rawSamples = grid.map((_, index) =>
      buildRawSample(
        SESSION_ID,
        START_MS,
        index,
        START_MS + 10 * GOLDENSECOND + index * 100
      )
    );
    const canonicalSamples = rawSamples.map((raw, index) => {
      const previous = index > 0 ? rawSamples[index - 1] : null;
      return canonicalizeSample(raw, previous, grid[index]);
    });

    const summary = summarizePulseTapSession(
      prompt,
      rawSamples,
      canonicalSamples
    );

    assert.equal(summary.qualified_tap_count, 0);
    assert.equal(summary.growth_eligible, false);
    assert.ok(summary.phicompliancescore < PHI_COMPLIANCE_SCORE_GROWTH_THRESHOLD);
  });

  it('detects fast taps as damping', () => {
    const prompt = makePrompt();
    const grid = buildPhiTimeGrid(
      prompt.prompt_opened_epoch_ms,
      prompt.expected_sequence_length,
      prompt.phi_slot_interval_ms
    );
    // Taps 100 ms apart — much faster than VALIDATION_WINDOW_MS (382 ms).
    const rawSamples = grid.map((slot, index) =>
      buildRawSample(SESSION_ID, START_MS, index, START_MS + index * 100)
    );
    const canonicalSamples = rawSamples.map((raw, index) => {
      const previous = index > 0 ? rawSamples[index - 1] : null;
      return canonicalizeSample(raw, previous, grid[index]);
    });

    assert.ok(computeDampingIntensity(canonicalSamples) > 0);
  });

  it('scoreCompletion clamps at expected sequence length', () => {
    const prompt = makePrompt({ expected_sequence_length: 5 });
    const grid = buildPhiTimeGrid(
      prompt.prompt_opened_epoch_ms,
      prompt.expected_sequence_length,
      prompt.phi_slot_interval_ms
    );
    // Only 2 qualified samples out of 5.
    const rawSamples = [
      buildRawSample(SESSION_ID, START_MS, 0, grid[0]),
      buildRawSample(SESSION_ID, START_MS, 1, grid[1]),
    ];
    const canonicalSamples = [
      canonicalizeSample(rawSamples[0], null, grid[0]),
      canonicalizeSample(rawSamples[1], rawSamples[0], grid[1]),
    ];
    assert.equal(scoreCompletion(canonicalSamples), 0.4);
  });

  it('scoreDrift handles a single sample', () => {
    const sample = canonicalizeSample(
      buildRawSample(SESSION_ID, START_MS, 1, START_MS + GOLDENSECOND + 100),
      buildRawSample(SESSION_ID, START_MS, 0, START_MS),
      START_MS + GOLDENSECOND
    );
    const score = scoreDrift([sample]);
    assert.ok(score > 0 && score < 1);
  });
});
