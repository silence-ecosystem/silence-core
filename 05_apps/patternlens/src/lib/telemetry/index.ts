/**
 * apps/patternlens/src/lib/telemetry/index.ts
 *
 * DIR-09: trackSilenceEvent() — public API
 */

export { trackSilenceEvent, flushTelemetry, TelemetryClient } from './client.js';
export { DEFAULT_TELEMETRY_CONFIG } from './types.js';
export type { TelemetryConfig, FlushResult, SilenceEventV2 } from './types.js';
