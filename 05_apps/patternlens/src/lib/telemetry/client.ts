/**
 * apps/patternlens/src/lib/telemetry/client.ts
 *
 * DIR-09: trackSilenceEvent() — telemetry client
 *
 * Batched, debounced insert of SilenceEventV2 events into the
 * silence_event_log Supabase table (DIR-06).
 *
 * Design:
 *  - Browser-side only ('use client' callers) — uses createBrowserClient.
 *  - Events are queued in memory and flushed in batches via debounce.
 *  - Batch size capped at maxBatchSize (default: 20) to stay within
 *    Supabase row-insert limits per request.
 *  - On flush failure: events are NOT re-queued (fire-and-forget for
 *    telemetry — Benchmark 2030 tolerates some event loss).
 *
 * Zero-PII contract:
 *  - This module does NOT add, inspect, or transform PII fields.
 *  - Caller is responsible for ensuring SilenceEventV2.payload is PII-free.
 *  - PII Scanner CI (DIR-02) enforces this at the source.
 *
 * S11: no pathologizing terms.
 */

'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SilenceEventV2, TelemetryConfig, FlushResult } from './types.js';
import { DEFAULT_TELEMETRY_CONFIG } from './types.js';

// ─── Row shape for silence_event_log (DIR-06) ──────────────────────────────

interface EventLogRow {
  event_id: string;
  event_type: string;
  session_id: string;
  occurred_at: string;
  app_version: string;
  platform: string;
  payload: Record<string, unknown>;
  phi_score: number | null;
  metadata: Record<string, unknown> | null;
}

function toRow(event: SilenceEventV2): EventLogRow {
  return {
    event_id:    event.event_id,
    event_type:  event.event_type,
    session_id:  event.session_id,
    occurred_at: event.timestamp,
    app_version: event.app_version,
    platform:    event.platform,
    payload:     event.payload as Record<string, unknown>,
    phi_score:   event.phi_score ?? null,
    metadata:    (event.metadata as Record<string, unknown> | undefined) ?? null,
  };
}

// ─── TelemetryClient ───────────────────────────────────────────────────────

export class TelemetryClient {
  private readonly queue: SilenceEventV2[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly config: TelemetryConfig;

  constructor(config: Partial<TelemetryConfig> = {}) {
    this.config = { ...DEFAULT_TELEMETRY_CONFIG, ...config };
  }

  /**
   * Enqueue a SilenceEventV2 event for batched insert.
   * Schedules a flush after debounceMs. If the queue reaches
   * maxBatchSize, flushes immediately.
   */
  track(event: SilenceEventV2): void {
    this.queue.push(event);

    if (this.queue.length >= this.config.maxBatchSize) {
      // Immediate flush — batch is full
      this.cancelDebounce();
      void this.flush();
      return;
    }

    // Debounced flush
    this.cancelDebounce();
    this.flushTimer = setTimeout(() => {
      void this.flush();
    }, this.config.debounceMs);
  }

  /**
   * Flush all queued events to Supabase as a single batch insert.
   * Returns a FlushResult with counts of successful/failed inserts.
   *
   * Fire-and-forget for callers: errors are logged but not re-queued.
   */
  async flush(): Promise<FlushResult> {
    if (this.queue.length === 0) {
      return { flushed: 0, errors: 0 };
    }

    // Drain the queue atomically
    const batch = this.queue.splice(0, this.config.maxBatchSize);
    const rows = batch.map(toRow);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase
        .from('silence_event_log')
        .insert(rows);

      if (error) {
        // Log for observability — do NOT re-queue (telemetry is best-effort)
        console.error('[telemetry] flush error:', error.message);
        return { flushed: 0, errors: batch.length };
      }

      return { flushed: batch.length, errors: 0 };
    } catch (err) {
      console.error('[telemetry] flush exception:', err);
      return { flushed: 0, errors: batch.length };
    }
  }

  /** Cancel pending debounced flush timer. */
  private cancelDebounce(): void {
    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /** Expose queue length for testing and monitoring. */
  get queueLength(): number {
    return this.queue.length;
  }
}

// ─── Singleton ──────────────────────────────────────────────────────────────

/**
 * Module-level singleton TelemetryClient.
 * Import trackSilenceEvent() for fire-and-forget event emission.
 */
const _client = new TelemetryClient();

/**
 * Track a SilenceEventV2 event.
 * Events are batched (max 20) and flushed via debounce (500ms).
 *
 * Usage:
 *   trackSilenceEvent({
 *     event_id: crypto.randomUUID(),
 *     event_type: 'session.started',
 *     session_id: sessionId,
 *     timestamp: new Date().toISOString(),
 *     app_version: APP_VERSION,
 *     platform: 'pwa',
 *     payload: {},
 *   });
 *
 * Emitter call sites per Playbook:
 *   SILENCE.BREATH_CYCLE — GoldenSilenceScreen breathing cycle completion
 *   FLOW_STATE           — JITAI engine flow state transition
 */
export function trackSilenceEvent(event: SilenceEventV2): void {
  _client.track(event);
}

/**
 * Flush all pending events immediately.
 * Call on page unload or critical navigation to avoid event loss.
 */
export async function flushTelemetry(): Promise<FlushResult> {
  return _client.flush();
}
