/**
 * [PATH]: 04_packages/@silence/telemetry/src/types.ts
 *
 * Telemetry event types — S11-safe, no diagnostic terminology.
 */

export type SilenceEventType =
  | 'app_open'
  | 'breath_cycle_completed'
  | 'garden_growth_applied'
  | 'jitai_rule_triggered'
  | 'quota_warning_shown'
  | 'quota_blocked_402'
  | 'signal_dismissed'
  | 'signal_override'
  | 'session_started'
  | 'session_ended'
  | 'onboarding_step_completed'
  | 'intent_selected'
  | 'experience_level_selected'
  | 'self_report_submitted'
  | 'consents_accepted'
  | 'quiet_session_completed'
  | 'engine_wasm_loaded'
  | 'engine_wasm_failed';

export interface SilenceEventV1 {
  readonly version: 1;
  readonly eventType: SilenceEventType;
  readonly timestamp: string; // ISO-8601
  readonly observerId: string; // pseudonym, never PII
  readonly sessionId: string;
  readonly payload: Record<string, unknown>;
  readonly appVersion: string;
  readonly environment: 'development' | 'staging' | 'production';
}

export const VALID_EVENT_TYPES = new Set<SilenceEventType>([
  'app_open',
  'breath_cycle_completed',
  'garden_growth_applied',
  'jitai_rule_triggered',
  'quota_warning_shown',
  'quota_blocked_402',
  'signal_dismissed',
  'signal_override',
  'session_started',
  'session_ended',
  'onboarding_step_completed',
  'intent_selected',
  'experience_level_selected',
  'self_report_submitted',
  'consents_accepted',
  'quiet_session_completed',
  'engine_wasm_loaded',
  'engine_wasm_failed',
]);

export interface TelemetryAdapter {
  readonly name: string;
  emit(event: SilenceEventV1): void | Promise<void>;
}
