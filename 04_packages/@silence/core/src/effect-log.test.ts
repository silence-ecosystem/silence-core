/**
 * [PATH]: 04_packages/@silence/core/src/effect-log.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EffectLog } from './effect-log';

describe('EffectLog', () => {
  it('starts with initial hash', () => {
    const log = new EffectLog();
    assert.equal(log.getLastHash(), '0'.repeat(64));
  });

  it('accepts custom initial hash', () => {
    const log = new EffectLog({ initialHash: 'a'.repeat(64) });
    assert.equal(log.getLastHash(), 'a'.repeat(64));
  });

  it('appends entry and updates last hash', async () => {
    const log = new EffectLog();
    const entry = await log.append({
      id: '001',
      timestamp: '2026-06-10T12:00:00Z',
      eventType: 'DECISION',
      actor: 'test',
      prevHash: '0'.repeat(64),
      status: 'PASS',
      change: 'test change',
    });
    assert.equal(entry.id, '001');
    assert.equal(entry.status, 'PASS');
    assert.notEqual(log.getLastHash(), '0'.repeat(64));
  });

  it('validates chain continuity', async () => {
    const log = new EffectLog();
    await log.append({
      id: '001',
      timestamp: '2026-06-10T12:00:00Z',
      eventType: 'DECISION',
      actor: 'test',
      prevHash: '0'.repeat(64),
      status: 'PASS',
      change: 'first',
    });
    await log.append({
      id: '002',
      timestamp: '2026-06-10T12:01:00Z',
      eventType: 'DECISION',
      actor: 'test',
      prevHash: log.getLastHash(),
      status: 'PASS',
      change: 'second',
    });
    assert.equal(log.validate(), true);
    assert.equal(log.getEntries().length, 2);
  });

  it('rejects broken chain', async () => {
    const log = new EffectLog();
    await log.append({
      id: '001',
      timestamp: '2026-06-10T12:00:00Z',
      eventType: 'DECISION',
      actor: 'test',
      prevHash: '0'.repeat(64),
      status: 'PASS',
      change: 'first',
    });
    await assert.rejects(
      log.append({
        id: '002',
        timestamp: '2026-06-10T12:01:00Z',
        eventType: 'DECISION',
        actor: 'test',
        prevHash: 'wrong-hash',
        status: 'PASS',
        change: 'second',
      }),
      /CHAIN_BREAK/
    );
  });

  it('supports disabling chain validation', async () => {
    const log = new EffectLog({ validateChain: false });
    await log.append({
      id: '001',
      timestamp: '2026-06-10T12:00:00Z',
      eventType: 'DECISION',
      actor: 'test',
      prevHash: '0'.repeat(64),
      status: 'PASS',
      change: 'first',
    });
    await log.append({
      id: '002',
      timestamp: '2026-06-10T12:01:00Z',
      eventType: 'DECISION',
      actor: 'test',
      prevHash: 'wrong-hash',
      status: 'PASS',
      change: 'second',
    });
    assert.equal(log.getEntries().length, 2);
  });

  it('serializes and deserializes', async () => {
    const log = new EffectLog();
    await log.append({
      id: '001',
      timestamp: '2026-06-10T12:00:00Z',
      eventType: 'DECISION',
      actor: 'test',
      prevHash: '0'.repeat(64),
      status: 'PASS',
      change: 'first',
    });
    const json = log.toJSON();
    const log2 = new EffectLog();
    log2.loadFromJSON(json);
    assert.equal(log2.getEntries().length, 1);
    assert.equal(log2.validate(), true);
  });
});
