/**
 * apps/patternlens/src/lib/telemetry/__tests__/telemetry.test.ts
 *
 * DIR-09: TelemetryClient unit tests
 *
 * Tests queue batching and flush logic using a mock Supabase client.
 * Does NOT require a live Supabase connection.
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TelemetryClient } from '../client';
import type { SilenceEventV2 } from '../types';

// ─── Mock @supabase/ssr ──────────────────────────────────────────────────────

const { mockInsert, mockFrom, mockCreateBrowserClient } = vi.hoisted(() => {
  const mockInsert = vi.fn().mockResolvedValue({ error: null });
  const mockFrom = vi.fn(() => ({ insert: mockInsert }));
  const mockCreateBrowserClient = vi.fn(() => ({ from: mockFrom }));
  return { mockInsert, mockFrom, mockCreateBrowserClient };
});

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: mockCreateBrowserClient,
}));

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeEvent(suffix = '1'): SilenceEventV2 {
  return {
    event_id:    `evt-${suffix}`,
    event_type:  'session.started',
    session_id:  `sess-${suffix}`,
    timestamp:   '2026-03-23T12:00:00.000Z',
    app_version: '1.0.0',
    platform:    'pwa',
    payload:     {},
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('TelemetryClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('queues an event without immediate flush', () => {
    const client = new TelemetryClient({ debounceMs: 500, maxBatchSize: 20 });
    client.track(makeEvent());
    expect(client.queueLength).toBe(1);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('flushes after debounce period', async () => {
    const client = new TelemetryClient({ debounceMs: 500, maxBatchSize: 20 });
    client.track(makeEvent('1'));
    client.track(makeEvent('2'));

    vi.advanceTimersByTime(500);
    // Let the async flush complete
    await Promise.resolve();
    await Promise.resolve();

    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(client.queueLength).toBe(0);
  });

  it('flushes immediately when batch reaches maxBatchSize', async () => {
    const client = new TelemetryClient({ debounceMs: 500, maxBatchSize: 3 });
    client.track(makeEvent('1'));
    client.track(makeEvent('2'));
    client.track(makeEvent('3')); // triggers immediate flush

    await Promise.resolve();
    await Promise.resolve();

    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(client.queueLength).toBe(0);
  });

  it('flush returns correct flushed count on success', async () => {
    const client = new TelemetryClient();
    client.track(makeEvent('1'));
    client.track(makeEvent('2'));

    const result = await client.flush();
    expect(result.flushed).toBe(2);
    expect(result.errors).toBe(0);
  });

  it('flush returns errors count on Supabase error', async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: 'DB error' } });
    const client = new TelemetryClient();
    client.track(makeEvent('1'));

    const result = await client.flush();
    expect(result.flushed).toBe(0);
    expect(result.errors).toBe(1);
  });

  it('flush on empty queue returns zeros', async () => {
    const client = new TelemetryClient();
    const result = await client.flush();
    expect(result.flushed).toBe(0);
    expect(result.errors).toBe(0);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('passes correct row shape to Supabase insert', async () => {
    const client = new TelemetryClient();
    const event = makeEvent('x');
    client.track(event);
    await client.flush();

    expect(mockFrom).toHaveBeenCalledWith('silence_event_log');
    const rows = mockInsert.mock.calls[0][0] as Record<string, unknown>[];
    expect(rows[0]).toMatchObject({
      event_id:    'evt-x',
      event_type:  'session.started',
      session_id:  'sess-x',
      occurred_at: '2026-03-23T12:00:00.000Z',
      platform:    'pwa',
    });
    // phi_score should default to null
    expect(rows[0].phi_score).toBeNull();
  });
});
