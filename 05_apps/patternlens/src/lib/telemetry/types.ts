/**
 * apps/patternlens/src/lib/telemetry/types.ts
 *
 * DIR-09: trackSilenceEvent() — telemetry types
 *
 * Local type aliases and config for the telemetry module.
 * Keeps the public API surface clean.
 *
 * S11: no pathologizing terms.
 */

/** Canonical telemetry event shape used by the PatternLens app */
export interface SilenceEventV2 {
  readonly event_id: string;
  readonly event_type: string;
  readonly session_id: string;
  readonly timestamp: string;
  readonly app_version: string;
  readonly platform: string;
  readonly payload: Record<string, unknown>;
  readonly phi_score?: number;
  readonly metadata?: Record<string, unknown>;
}

/** Config for the telemetry batch flush behaviour */
export interface TelemetryConfig {
  /** Debounce window before flushing a batch (ms). Default: 500. */
  readonly debounceMs: number;
  /** Maximum events per batch insert. Default: 20. */
  readonly maxBatchSize: number;
}

export const DEFAULT_TELEMETRY_CONFIG: TelemetryConfig = {
  debounceMs: 500,
  maxBatchSize: 20,
};

/** Result of a flush operation */
export interface FlushResult {
  readonly flushed: number;
  readonly errors: number;
}
