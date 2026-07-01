/**
 * [PATH]: 04_packages/@silence/contracts/src/events/pulseTap.ts
 *
 * Pulse Tap — labeled behavioral sample pipeline.
 * L0 raw sample → L1 canonical sample → L2 session summary.
 * Deterministic, S11-clean, operational vocabulary only.
 */

export const PULSE_TAP_EVENT_TYPES = {
  PROMPT_OPENED: 'JITAI.PULSE_TAP.PROMPT_OPENED',
  FIRST_TAP_MEASURED: 'JITAI.PULSE_TAP.FIRST_TAP_MEASURED',
  SAMPLE_RECORDED: 'JITAI.PULSE_TAP.SAMPLE_RECORDED',
  SEQUENCE_COMPLETED: 'JITAI.PULSE_TAP.SEQUENCE_COMPLETED',
  DAMPING_APPLIED: 'JITAI.PULSE_TAP.DAMPING_APPLIED',
  SESSION_SAVED: 'JITAI.PULSE_TAP.SESSION_SAVED',
} as const;

export type PulseTapEventType =
  (typeof PULSE_TAP_EVENT_TYPES)[keyof typeof PULSE_TAP_EVENT_TYPES];

export interface PulseTapPrompt {
  readonly session_id: string;
  readonly prompt_opened_epoch_ms: number;
  readonly expected_sequence_length: number;
  readonly phi_slot_interval_ms: number;
}

export interface PulseTapRawSample {
  readonly session_id: string;
  readonly tap_index: number;
  readonly tap_epoch_ms: number;
  readonly time_to_first_tap_raw_ms: number | null;
  readonly pointer_pressure_raw: number | null;
}

export interface PulseTapCanonicalSample {
  readonly session_id: string;
  readonly tap_index: number;
  readonly tap_epoch_ms: number;
  readonly slot_epoch_ms: number;
  readonly inter_tap_interval_ms: number | null;
  readonly inter_tap_interval_drift_ms: number | null;
  readonly phi_ratio: number | null;
  readonly qualified: boolean;
}

export interface PulseTapSessionSummary {
  readonly session_id: string;
  readonly prompt_opened_epoch_ms: number;
  readonly time_to_first_tap_raw_ms: number | null;
  readonly qualified_tap_count: number;
  readonly off_grid_tap_count: number;
  readonly completion_rate: number;
  readonly regularity_score: number;
  readonly drift_score: number;
  readonly completion_score: number;
  readonly phicompliancescore: number;
  readonly damping_intensity: number;
  readonly intervention_silence_until_epoch_ms: number | null;
  readonly growth_eligible: boolean;
}
