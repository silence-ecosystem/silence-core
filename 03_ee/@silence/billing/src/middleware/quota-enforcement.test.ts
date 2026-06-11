/**
 * [PATH]: 03_ee/@silence/billing/src/middleware/quota-enforcement.test.ts
 *
 * Quota enforcement + rich 402 response shape tests.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { enforceQuota } from './quota-enforcement.js';
import { recordUsage } from '../lib/metering-store.js';

describe('quota-enforcement', () => {
  it('allows request when under quota', () => {
    const result = enforceQuota('tenant-ok', false);
    assert.equal(result.allowed, true);
    assert.equal(result.statusCode, 200);
  });

  it('returns 402 with rich payload when exceeded', () => {
    const uid = 'tenant-blocked';
    for (let i = 0; i < 102; i++) {
      recordUsage({ userId: uid, eventType: 'intervention', timestamp: new Date().toISOString(), inputHash: 'b' + i });
    }
    const result = enforceQuota(uid, false);
    assert.equal(result.allowed, false);
    assert.equal(result.statusCode, 402);
    assert.ok(result.body);
    assert.equal(result.headers?.['X-Silence-Quota-Status'], 'exceeded');
  });

  it('rich 402 contains required fields', () => {
    const uid = 'tenant-rich';
    for (let i = 0; i < 101; i++) {
      recordUsage({ userId: uid, eventType: 'intervention', timestamp: new Date().toISOString(), inputHash: 'r' + i });
    }
    const result = enforceQuota(uid, false);
    const body = result.body as Record<string, unknown>;
    assert.ok(typeof body.currentUsage === 'number');
    assert.ok(typeof body.monthlyQuota === 'number');
    assert.ok(typeof body.quotaResetsAt === 'string');
    assert.ok(typeof body.missedInterventions === 'number');
    assert.ok(typeof body.estimatedValueMissed === 'string');
    assert.ok(Array.isArray(body.upgradeOptions));
    assert.ok(typeof body.dataRetentionNote === 'string');
    assert.ok(body.debug === undefined, 'debug must not appear in production');
  });

  it('rich 402 includes debug in dev/staging', () => {
    const uid = 'tenant-debug';
    for (let i = 0; i < 101; i++) {
      recordUsage({ userId: uid, eventType: 'intervention', timestamp: new Date().toISOString(), inputHash: 'd' + i });
    }
    const result = enforceQuota(uid, true);
    const body = result.body as Record<string, unknown>;
    assert.ok(body.debug);
    assert.ok(typeof (body.debug as Record<string, unknown>).userId === 'string');
  });
});
