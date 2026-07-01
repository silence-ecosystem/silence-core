/**
 * [PATH]: 04_packages/@silence/sdk/src/index.ts
 * @silence/sdk
 *
 * Public Silence SDK — deterministic facade for application layer.
 *
 * DESIGN:
 * - Zero business logic. This package is a thin re-export layer.
 * - No imports from 03_ee/ (enterprise) — boundary violation = WORLDHALT.
 * - Public surface: contracts, core, events, jitai, phi, telemetry, types.
 *
 * STATUS: active
 */

// ─── Canonical contracts ───────────────────────────────────────
export * from '@silence/contracts';

// ─── Core primitives ───────────────────────────────────────────
export * from '@silence/core';

// ─── Event bus ─────────────────────────────────────────────────
export { SilenceEventBus, EventEmitter } from '@silence/events';

// ─── JITAI decision engine ─────────────────────────────────────
export * from '@silence/jitai';

// ─── Telemetry ─────────────────────────────────────────────────
export {
  trackSilenceEvent,
  setTelemetryAdapter,
  setTelemetryContext,
  resetSessionId,
  consoleAdapter,
  noopAdapter,
  batchAdapter,
} from '@silence/telemetry';
export type { TelemetryAdapter, SilenceEventV1, SilenceEventType } from '@silence/telemetry';

// ─── Shared types (S11, metering) ──────────────────────────────
export * from '@silence/types';

// ─── Phi-derived mathematics and timing ────────────────────────
export * from '@silence/phi';
