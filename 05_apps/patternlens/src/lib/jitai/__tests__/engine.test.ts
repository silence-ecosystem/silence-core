/**
 * [PATH]: 05_apps/patternlens/src/lib/jitai/__tests__/engine.test.ts
 *
 * Determinism and boundary tests for JITAIEngine.
 */

import { describe, it, expect } from 'vitest';
import { JITAIEngine } from '../engine';
import type { AttentionProfile, DecisionContext, SessionData } from '../types';

const baseProfile: AttentionProfile = {
  userId: 'test-user',
  attentionStability: 0.5,
  distractionSensitivity: 0.3,
  sessionCompletionRate: 0.5,
  baselineParticleCount: 34,
  preferredRingSet: [8, 13, 21, 34, 55, 89],
  totalSessions: 1,
  lastSessionAt: 1_000_000,
  createdAt: 1_000_000,
  updatedAt: 1_000_000,
};

function makeSessionData(overrides?: Partial<SessionData>): SessionData {
  return {
    startedAt: 1_000_000,
    durationMs: 6_472,
    phaseTransitions: [],
    breathingPattern: [],
    interactionEvents: [],
    ...overrides,
  };
}

function makeContext(overrides?: Partial<DecisionContext>): DecisionContext {
  return {
    progress: 0.5,
    currentPhase: 'SILENCE',
    sessionData: makeSessionData(),
    currentTimestamp: 1_010_000,
    ...overrides,
  };
}

describe('JITAIEngine', () => {
  it('getGeometryModulation is deterministic for the same profile', () => {
    const engine = new JITAIEngine(baseProfile);
    const a = engine.getGeometryModulation();
    const b = engine.getGeometryModulation();
    expect(a).toEqual(b);
  });

  it('uses full ring set for low distraction sensitivity', () => {
    const engine = new JITAIEngine({ ...baseProfile, distractionSensitivity: 0.1 });
    const geo = engine.getGeometryModulation();
    expect(geo.ringSet).toEqual([8, 13, 21, 34, 55, 89]);
  });

  it('uses minimal ring set for high distraction sensitivity', () => {
    const engine = new JITAIEngine({ ...baseProfile, distractionSensitivity: 0.8 });
    const geo = engine.getGeometryModulation();
    expect(geo.ringSet).toEqual([8, 13, 21]);
  });

  it('detects distraction spike from recent touches', () => {
    const engine = new JITAIEngine(baseProfile);
    const ctx = makeContext({
      progress: 0.5,
      sessionData: makeSessionData({
        interactionEvents: Array.from({ length: 6 }, (_, i) => ({
          type: 'touch' as const,
          timestamp: 1_009_500 + i * 100,
          x: 0,
          y: 0,
        })),
      }),
      currentTimestamp: 1_010_000,
    });
    const decision = engine.evaluateRealTimeDecision(ctx);
    expect(decision).not.toBeNull();
    expect(decision?.action).toBe('reset_anchor');
  });

  it('detects silence breakthrough when no recent touches', () => {
    const engine = new JITAIEngine(baseProfile);
    const ctx = makeContext({
      progress: 0.7,
      currentPhase: 'SILENCE',
      sessionData: makeSessionData({
        interactionEvents: [{ type: 'touch', timestamp: 1_000_000, x: 0, y: 0 }],
      }),
      currentTimestamp: 1_010_000,
    });
    const decision = engine.evaluateRealTimeDecision(ctx);
    expect(decision?.action).toBe('celebrate_silence');
  });

  it('evaluates identically for identical inputs (determinism)', () => {
    const engine = new JITAIEngine(baseProfile);
    const ctx = makeContext({
      progress: 0.95,
      currentPhase: 'RETURN',
      sessionData: makeSessionData({
        interactionEvents: [
          { type: 'touch', timestamp: 1_009_800, x: 0, y: 0 },
          { type: 'touch', timestamp: 1_009_900, x: 0, y: 0 },
          { type: 'touch', timestamp: 1_009_950, x: 0, y: 0 },
          { type: 'touch', timestamp: 1_009_990, x: 0, y: 0 },
        ],
      }),
      currentTimestamp: 1_010_000,
    });
    const a = engine.evaluateRealTimeDecision(ctx);
    const b = engine.evaluateRealTimeDecision(ctx);
    expect(a).toEqual(b);
  });
});
