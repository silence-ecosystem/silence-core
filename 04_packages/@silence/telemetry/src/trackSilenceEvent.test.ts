/**
 * [PATH]: 04_packages/@silence/telemetry/src/trackSilenceEvent.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { trackSilenceEvent, setTelemetryAdapter, noopAdapter, batchAdapter } from './trackSilenceEvent';

describe('trackSilenceEvent', () => {
  it('does not throw with default adapter', () => {
    assert.doesNotThrow(() => {
      trackSilenceEvent({
        eventType: 'app_open',
        timestamp: '2026-06-10T12:00:00Z',
        context: {},
      });
    });
  });

  it('works with noop adapter', () => {
    setTelemetryAdapter(noopAdapter());
    assert.doesNotThrow(() => {
      trackSilenceEvent({
        eventType: 'app_open',
        timestamp: '2026-06-10T12:00:00Z',
        context: {},
      });
    });
  });

  it('batch adapter collects events', () => {
    const adapter = batchAdapter(1000, 100);
    setTelemetryAdapter(adapter);
    trackSilenceEvent({
      eventType: 'app_open',
      timestamp: '2026-06-10T12:00:00Z',
      context: {},
    });
    assert.equal(adapter.getBatch().length, 1);
    adapter.flush();
    assert.equal(adapter.getBatch().length, 0);
    adapter.destroy();
  });
});
