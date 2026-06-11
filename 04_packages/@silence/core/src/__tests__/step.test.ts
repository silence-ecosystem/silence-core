/**
 * [PATH]: 04_packages/@silence/core/src/__tests__/step.test.ts
 *
 * Determinism and integration tests for the step() engine.
 */

import { describe, it, expect } from 'vitest';
import { step, PhiGardenState } from '../step';
import { EffectLog } from '../effect-log';

const seedState = (): PhiGardenState => ({
  seedTimestamp: 0,
  lastStepTimestamp: 0,
  breathCompletions: 0,
  streakLength: 0,
  recentBreathCompletions: 0,
  quietSessionCount: 0,
  gardenActivityLevel: 0,
  growthScore: 0,
});

describe('step — integrative engine', () => {
  it('is deterministic for identical input', async () => {
    const logA = new EffectLog();
    const logB = new EffectLog();
    const input = { state: seedState(), now: 1618 };

    const outA = await step(input, logA);
    const outB = await step(input, logB);

    expect(outA.eventHash).toBe(outB.eventHash);
    expect(outA.nextState.lastStepTimestamp).toBe(outB.nextState.lastStepTimestamp);
    expect(outA.signal).toEqual(outB.signal);
  });

  it('increments breath completions and streak on breathCompleted', async () => {
    const log = new EffectLog();
    const out = await step({ state: seedState(), now: 1618, breathCompleted: true }, log);

    expect(out.nextState.breathCompletions).toBe(1);
    expect(out.nextState.streakLength).toBe(1);
    expect(out.nextState.gardenActivityLevel).toBe(1);
    expect(out.nextState.growthScore).toBeGreaterThan(0);
  });

  it('deserializes and continues from a previous state', async () => {
    const log = new EffectLog();
    const first = await step({ state: seedState(), now: 1618, breathCompleted: true }, log);
    const second = await step({ state: first.nextState, now: 3236, breathCompleted: true }, log);

    expect(second.nextState.breathCompletions).toBe(2);
    expect(second.nextState.streakLength).toBe(2);
  });

  it('logs every step to EffectLog', async () => {
    const log = new EffectLog();
    await step({ state: seedState(), now: 1618 }, log);
    await step({ state: seedState(), now: 3236, breathCompleted: true }, log);

    const entries = log.getEntries();
    expect(entries).toHaveLength(2);
    expect(entries[0].eventType).toBe('DECISION');
    expect(entries[1].eventType).toBe('DECISION');
  });
});
