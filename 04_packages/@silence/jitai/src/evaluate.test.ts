/**
 * [PATH]: 04_packages/@silence/jitai/src/evaluate.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, verifyDeterminism } from './evaluate';
import { JitaiContext } from './types';

const BASE_CTX: JitaiContext = {
  streakLength: 0,
  recentBreathCompletions: 0,
  gardenActivityLevel: 0,
  quietSessionCount: 0,
  rhythmVariance: 0.3,
  quotaProximity: 0,
  inactivityWindowMs: 86400000,
  recentInterventionFrequency: 0,
  currentHour: 12,
  dayOfWeek: 1,
  attentionDepth: 3,
  intent: 'CALM',
  experienceLevel: 'none',
  selfReportDifficulty: 'ok',
  quietLevel: 0,
};

describe('evaluate', () => {
  it('returns deterministic signals for neutral context', () => {
    const result1 = evaluate(BASE_CTX);
    const result2 = evaluate(BASE_CTX);
    assert.equal(result1.triggered, result2.triggered);
    assert.equal(result1.matchedRules.join(','), result2.matchedRules.join(','));
  });

  it('detects long streak', () => {
    const ctx = { ...BASE_CTX, streakLength: 7 };
    const result = evaluate(ctx);
    assert.equal(result.triggered, true);
    assert.ok(result.matchedRules.includes('R1'));
  });

  it('detects streak at risk', () => {
    const ctx = { ...BASE_CTX, streakLength: 0, recentBreathCompletions: 3 };
    const result = evaluate(ctx);
    assert.equal(result.triggered, true);
    assert.ok(result.matchedRules.includes('R2'));
  });

  it('respects maxSignals limit', () => {
    const ctx = { ...BASE_CTX, streakLength: 7, recentBreathCompletions: 10, gardenActivityLevel: 9 };
    const result = evaluate(ctx, { maxSignals: 1 });
    assert.equal(result.signals.length, 1);
  });

  it('sorts signals by priority', () => {
    const ctx = { ...BASE_CTX, streakLength: 0, recentBreathCompletions: 3 };
    const result = evaluate(ctx, { maxSignals: 3 });
    for (let i = 1; i < result.signals.length; i++) {
      assert.ok(result.signals[i - 1].priority <= result.signals[i].priority);
    }
  });
});

describe('verifyDeterminism', () => {
  it('confirms determinism for neutral context', () => {
    assert.equal(verifyDeterminism(BASE_CTX), true);
  });

  it('confirms determinism for active context', () => {
    const ctx = { ...BASE_CTX, streakLength: 7, recentBreathCompletions: 5 };
    assert.equal(verifyDeterminism(ctx), true);
  });
});
