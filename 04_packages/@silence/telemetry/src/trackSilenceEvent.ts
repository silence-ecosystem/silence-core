/**
 * [PATH]: 04_packages/@silence/telemetry/src/trackSilenceEvent.ts
 *
 * Event tracking with adapter pattern.
 * MVP: console adapter + noop adapter + consent-aware kill-switch.
 * Production target: Supabase batch insert, edge function, or analytics provider.
 */

import { SilenceEventV1, SilenceEventType, TelemetryAdapter, VALID_EVENT_TYPES } from './types';

let _adapter: TelemetryAdapter = consoleAdapter();
let _appVersion = '0.1.0-mvp';
let _environment: 'development' | 'staging' | 'production' = 'development';
let _sessionId: string | null = null;
let _killSwitchChecked = false;
let _killSwitchActive = false;

function generateSessionId(): string {
  const arr = new Uint8Array(8);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

function getSessionId(): string {
  if (_sessionId === null) {
    _sessionId = generateSessionId();
  }
  return _sessionId;
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
}

interface TrackOptions {
  eventType: SilenceEventType;
  timestamp?: string;
  observerId?: string;
  sessionId?: string;
  payload?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export function trackSilenceEvent(options: TrackOptions): void;
export function trackSilenceEvent(
  eventType: SilenceEventType,
  observerId: string,
  sessionId: string,
  payload?: Record<string, unknown>
): void;
export function trackSilenceEvent(
  arg1: SilenceEventType | TrackOptions,
  observerId?: string,
  sessionId?: string,
  payload?: Record<string, unknown>
): void {
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
    event = {
      version: 1,
      eventType: opts.eventType,
      timestamp: opts.timestamp ?? new Date().toISOString(),
      observerId: opts.observerId ?? 'anonymous',
      sessionId: opts.sessionId ?? getSessionId(),
      payload: opts.payload ?? opts.context ?? {},
      appVersion: _appVersion,
      environment: _environment,
    };
  } else {
    if (!VALID_EVENT_TYPES.has(arg1)) {
      console.error('[Telemetry] Invalid event type:', arg1);
      return;
    }
    event = {
      version: 1,
      eventType: arg1,
      timestamp: new Date().toISOString(),
      observerId: observerId ?? 'anonymous',
      sessionId: sessionId ?? getSessionId(),
      payload: payload ?? {},
      appVersion: _appVersion,
      environment: _environment,
    };
  }

  const result = _adapter.emit(event);
  if (result instanceof Promise) {
    result.catch((err) => {
      // Telemetry must never crash the app
      console.error('[Telemetry] async emit failed:', err);
    });
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
