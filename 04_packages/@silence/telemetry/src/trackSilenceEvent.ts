/**
 * [PATH]: 04_packages/@silence/telemetry/src/trackSilenceEvent.ts
 *
 * Event tracking with adapter pattern.
 * MVP: console adapter + noop adapter + consent-aware kill-switch.
 * Production target: Supabase batch insert, edge function, or analytics provider.
 *
 * SESSION ID POLICY:
 * - No Math.random(), no crypto.getRandomValues().
 * - Session IDs are derived deterministically from a seed context via SHA-256.
 * - The same seed context yields the same session ID (determinism/replay safety).
 */

import { SilenceEventV1, SilenceEventType, TelemetryAdapter, VALID_EVENT_TYPES } from './types.js';

let _adapter: TelemetryAdapter = consoleAdapter();
let _appVersion = '0.1.0-mvp';
let _environment: 'development' | 'staging' | 'production' = 'development';
let _sessionId: string | null = null;
let _sessionIdPromise: Promise<string> | null = null;
let _killSwitchChecked = false;
let _killSwitchActive = false;

async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const digest = new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', data));
  return Array.from(digest)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function generateSessionId(seedContext: string): Promise<string> {
  return (await sha256Hex(seedContext)).slice(0, 16);
}

async function getSessionId(seedContext: string): Promise<string> {
  if (_sessionId !== null) return _sessionId;
  if (_sessionIdPromise === null) {
    _sessionIdPromise = generateSessionId(seedContext).then((id) => {
      _sessionId = id;
      return id;
    });
  }
  return _sessionIdPromise;
}

function checkKillSwitch(): boolean {
  if (_killSwitchChecked) return _killSwitchActive;
  _killSwitchChecked = true;
  try {
    const raw = localStorage.getItem('silence-consents');
    if (raw) {
      const consents = JSON.parse(raw) as Record<string, boolean>;
      _killSwitchActive = !consents.research_accepted;
    }
  } catch {
    // localStorage unavailable — default to enabled
  }
  return _killSwitchActive;
}

export function setTelemetryAdapter(adapter: TelemetryAdapter): void {
  _adapter = adapter;
}

export function setTelemetryContext(
  appVersion: string,
  environment: 'development' | 'staging' | 'production'
): void {
  _appVersion = appVersion;
  _environment = environment;
}

export function resetSessionId(): void {
  _sessionId = null;
  _sessionIdPromise = null;
}

interface TrackOptions {
  eventType: SilenceEventType;
  timestamp: string;
  observerId?: string;
  sessionId?: string;
  payload?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export async function trackSilenceEvent(options: TrackOptions): Promise<void>;
export async function trackSilenceEvent(
  eventType: SilenceEventType,
  observerId: string,
  sessionId: string,
  timestamp: string,
  payload?: Record<string, unknown>
): Promise<void>;
export async function trackSilenceEvent(
  arg1: SilenceEventType | TrackOptions,
  observerId?: string,
  sessionId?: string,
  timestamp?: string,
  payload?: Record<string, unknown>
): Promise<void> {
  if (checkKillSwitch()) {
    return;
  }

  let event: SilenceEventV1;

  if (typeof arg1 === 'object') {
    const opts = arg1 as TrackOptions;
    if (!VALID_EVENT_TYPES.has(opts.eventType)) {
      console.error('[Telemetry] Invalid event type:', opts.eventType);
      return;
    }
    const seedContext = JSON.stringify(opts.context ?? {});
    const resolvedSessionId = await getSessionId(seedContext);
    event = {
      version: 1,
      eventType: opts.eventType,
      timestamp: opts.timestamp,
      observerId: opts.observerId ?? 'anonymous',
      sessionId: opts.sessionId ?? resolvedSessionId,
      payload: opts.payload ?? opts.context ?? {},
      appVersion: _appVersion,
      environment: _environment,
    };
  } else {
    if (!VALID_EVENT_TYPES.has(arg1)) {
      console.error('[Telemetry] Invalid event type:', arg1);
      return;
    }
    if (timestamp === undefined) {
      console.error('[Telemetry] timestamp is required for positional call');
      return;
    }
    const seedContext = JSON.stringify(payload ?? {});
    const resolvedSessionId = await getSessionId(seedContext);
    event = {
      version: 1,
      eventType: arg1,
      timestamp,
      observerId: observerId ?? 'anonymous',
      sessionId: sessionId ?? resolvedSessionId,
      payload: payload ?? {},
      appVersion: _appVersion,
      environment: _environment,
    };
  }

  try {
    await _adapter.emit(event);
  } catch (err) {
    // Telemetry must never crash the app
    console.error('[Telemetry] emit failed:', err);
  }
}

export function consoleAdapter(): TelemetryAdapter {
  return {
    name: 'console',
    emit(event) {
      console.log('[SilenceTelemetry]', JSON.stringify(event));
    },
  };
}

export function noopAdapter(): TelemetryAdapter {
  return {
    name: 'noop',
    emit() {
      // intentionally empty
    },
  };
}

export function batchAdapter(
  flushIntervalMs: number = 5000,
  maxBatchSize: number = 100
): TelemetryAdapter & { getBatch(): readonly SilenceEventV1[]; flush(): void; destroy(): void } {
  const batch: SilenceEventV1[] = [];
  let intervalId: ReturnType<typeof setInterval> | null = null;
  const QUEUE_KEY = 'silence-telemetry-queue';

  // Restore offline queue on init
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (raw) {
      const queued = JSON.parse(raw) as SilenceEventV1[];
      batch.push(...queued);
      localStorage.removeItem(QUEUE_KEY);
    }
  } catch {
    // ignore
  }

  const adapter = {
    name: 'batch',
    emit(event: SilenceEventV1) {
      batch.push(event);
      if (batch.length >= maxBatchSize) {
        adapter.flush();
      }
    },
    getBatch(): readonly SilenceEventV1[] {
      return batch;
    },
    flush() {
      if (batch.length === 0) return;
      console.log(`[TelemetryBatch] flushing ${batch.length} events`);
      batch.length = 0;
    },
    destroy() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
  };

  if (typeof globalThis !== 'undefined') {
    intervalId = setInterval(() => adapter.flush(), flushIntervalMs);
  }

  // Persist unsent events on page hide
  if (typeof window !== 'undefined') {
    window.addEventListener('pagehide', () => {
      if (batch.length > 0) {
        try {
          localStorage.setItem(QUEUE_KEY, JSON.stringify(batch));
        } catch {
          // storage full or unavailable
        }
      }
    });
  }

  return adapter;
}
