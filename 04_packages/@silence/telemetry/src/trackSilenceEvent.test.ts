/**
 * [PATH]: 04_packages/@silence/telemetry/src/trackSilenceEvent.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  trackSilenceEvent,
  setTelemetryAdapter,
  noopAdapter,
  batchAdapter,
  resetSessionId,
} from './trackSilenceEvent';

describe('trackSilenceEvent', () => {
  it('does not throw with default adapter', async () => {
    resetSessionId();
    await assert.doesNotReject(async () => {
      await trackSilenceEvent({
        eventType: 'app_open',
        timestamp: '2026-06-10T12:00:00Z',
        context: {},
      });
    });
  });

  it('works with noop adapter', async () => {
    resetSessionId();
    setTelemetryAdapter(noopAdapter());
    await assert.doesNotReject(async () => {
      await trackSilenceEvent({
        eventType: 'app_open',
        timestamp: '2026-06-10T12:00:00Z',
        context: {},
      });
    });
  });

  it('batch adapter collects events', async () => {
    resetSessionId();
    const adapter = batchAdapter(1000, 100);
    setTelemetryAdapter(adapter);
    await trackSilenceEvent({
      eventType: 'app_open',
      timestamp: '2026-06-10T12:00:00Z',
      context: {},
    });
    assert.equal(adapter.getBatch().length, 1);
    adapter.flush();
    assert.equal(adapter.getBatch().length, 0);
    adapter.destroy();
  });

  it('generates deterministic sessionId from context', async () => {
    resetSessionId();
    const adapter = batchAdapter(1000, 100);
    setTelemetryAdapter(adapter);

    await trackSilenceEvent({
      eventType: 'app_open',
      timestamp: '2026-06-10T12:00:00Z',
      context: { source: 'unit-test' },
    });
    const first = adapter.getBatch()[0].sessionId;

    adapter.flush();
    resetSessionId();

    await trackSilenceEvent({
      eventType: 'app_open',
      timestamp: '2026-06-10T12:00:00Z',
      context: { source: 'unit-test' },
    });
    const second = adapter.getBatch()[0].sessionId;

    assert.equal(first, second);
    adapter.destroy();
  });
});
