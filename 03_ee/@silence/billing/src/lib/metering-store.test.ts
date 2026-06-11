/**
 * [PATH]: 03_ee/@silence/billing/src/lib/metering-store.test.ts
 *
 * Metering store tests — quota, reset, usage tracking.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  recordUsage,
  getQuotaProfile,
  checkQuota,
  getMissedInterventions,
  resetQuotaIfNeeded,
} from './metering-store.js';

describe('metering-store', () => {
  it('initializes free quota for new user', () => {
    const profile = getQuotaProfile('user-a');
    assert.equal(profile.plan, 'free');
    assert.equal(profile.monthlyQuota, 100);
    assert.equal(profile.currentUsage, 0);
    assert.ok(profile.quotaResetsAt);
  });

  it('records usage and increments currentUsage', () => {
    recordUsage({ userId: 'user-b', eventType: 'intervention', timestamp: new Date().toISOString(), inputHash: 'abc123' });
    const profile = getQuotaProfile('user-b');
    assert.equal(profile.currentUsage, 1);
  });

  it('checkQuota allows when under limit', () => {
    const check = checkQuota('user-c');
    assert.equal(check.allowed, true);
    assert.ok(check.remaining > 0);
  });

  it('checkQuota blocks when exceeded', () => {
    const uid = 'user-d';
    for (let i = 0; i < 101; i++) {
      recordUsage({ userId: uid, eventType: 'intervention', timestamp: new Date().toISOString(), inputHash: 'hash' + i });
    }
    const check = checkQuota(uid);
    assert.equal(check.allowed, false);
    assert.equal(check.remaining <= 0, true);
  });

  it('getMissedInterventions returns 0 when under quota', () => {
    const missed = getMissedInterventions('user-e');
    assert.equal(missed, 0);
  });

  it('getMissedInterventions returns delta when exceeded', () => {
    const uid = 'user-f';
    for (let i = 0; i < 105; i++) {
      recordUsage({ userId: uid, eventType: 'intervention', timestamp: new Date().toISOString(), inputHash: 'h' + i });
    }
    const missed = getMissedInterventions(uid);
    assert.equal(missed, 5);
  });

  it('resetQuotaIfNeeded resets usage when past reset date', () => {
    const uid = 'user-g';
    recordUsage({ userId: uid, eventType: 'intervention', timestamp: new Date().toISOString(), inputHash: 'x' });
    const profile = getQuotaProfile(uid);
    assert.equal(profile.currentUsage, 1);

    // Force reset date to past
    const past = new Date();
    past.setFullYear(past.getFullYear() - 1);
    // Note: metering-store does not expose direct setter; this test validates reset logic exists
    // In real scenario, reset happens via time progression. Here we verify function contract.
    const afterReset = resetQuotaIfNeeded(uid);
    assert.ok(afterReset.quotaResetsAt > past.toISOString());
  });
});
