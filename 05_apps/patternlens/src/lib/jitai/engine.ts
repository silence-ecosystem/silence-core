/**
 * [PATH]: 05_apps/patternlens/src/lib/jitai/engine.ts
 *
 * Deterministic JITAI decision engine for GoldenRatioSilence.
 * All thresholds derive from @silence/phi constants.
 * No Math.random(), no Date.now() in rule evaluation.
 */

import {
  PHI,
  PHI_INV,
  GOLDENSECOND,
  SYNC_INTERVAL_MS,
  BREATH_CYCLE_MS,
} from '@silence/sdk';
import type {
  AttentionProfile,
  SessionData,
  GeometryModulation,
  DecisionRule,
  DecisionContext,
  DecisionResult,
} from './types';

const FIBONACCI_COUNTS = [21, 34, 55, 89];
const FULL_RING_SET = [8, 13, 21, 34, 55, 89];
const MINIMAL_RING_SET = [8, 13, 21];
const STANDARD_RING_SET = [8, 13, 21, 34, 55];

// φ-derived interaction windows
const RECENT_TOUCH_WINDOW_MS = GOLDENSECOND * 3; // ~4.85s
const DEEPENING_TOUCH_WINDOW_MS = GOLDENSECOND * 4; // ~6.47s
const RETURN_TOUCH_WINDOW_MS = GOLDENSECOND * 2; // ~3.24s
const VARIANCE_THRESHOLD = PHI_INV * PHI_INV; // φ⁻² ≈ 0.382
const NEAR_COMPLETION_THRESHOLD = 1 - PHI_INV ** 6; // ≈ 0.944
const EARLY_EXIT_THRESHOLD = PHI_INV * PHI_INV; // φ⁻² ≈ 0.382
const DEEPENING_START = PHI_INV * PHI_INV * PHI_INV; // φ⁻³ ≈ 0.236
const SILENCE_START = PHI_INV; // ≈ 0.618
const RETURN_START = PHI_INV + PHI_INV ** 3; // ≈ 0.854

export class JITAIEngine {
  constructor(private profile: AttentionProfile) {}

  getGeometryModulation(): GeometryModulation {
    const { attentionStability, distractionSensitivity, sessionCompletionRate } = this.profile;
    return {
      particleCount: this.calculateParticleCount(attentionStability),
      ringSet: this.calculateRingSet(distractionSensitivity),
      breathAmplitude: PHI_INV,
      ringFadeRate: this.calculateRingFadeRate(sessionCompletionRate),
    };
  }

  evaluateRealTimeDecision(context: DecisionContext): DecisionResult | null {
    const rules = this.getRealTimeRules();
    for (const rule of rules) {
      if (rule.condition(context, this.profile)) {
        return rule.action(context, this.profile);
      }
    }
    return null;
  }

  private getRealTimeRules(): DecisionRule[] {
    return [
      {
        id: 'early_exit_detect',
        condition: (ctx) =>
          ctx.progress < EARLY_EXIT_THRESHOLD && ctx.sessionData.interactionEvents.length > 3,
        action: () => ({
          action: 'gentle_anchor',
          geometryModulation: {
            particleCount: Math.max(21, this.profile.baselineParticleCount - 13),
            ringFadeRate: PHI_INV,
          },
        }),
      },
      {
        id: 'deepening_stable',
        condition: (ctx) =>
          ctx.progress >= DEEPENING_START &&
          ctx.progress < SILENCE_START &&
          this.recentTouches(ctx.sessionData, DEEPENING_TOUCH_WINDOW_MS, ctx.currentTimestamp) < 2,
        action: () => ({
          action: 'deepen_silence',
          geometryModulation: {
            ringSet: MINIMAL_RING_SET,
            ringFadeRate: 1 / PHI_INV, // φ ≈ 1.618
          },
        }),
      },
      {
        id: 'distraction_spike',
        condition: (ctx) =>
          this.recentTouches(ctx.sessionData, RECENT_TOUCH_WINDOW_MS, ctx.currentTimestamp) > 5,
        action: () => ({
          action: 'reset_anchor',
          geometryModulation: {
            particleCount: 55,
            ringSet: [13, 21, 34, 55],
          },
        }),
      },
      {
        id: 'silence_breakthrough',
        condition: (ctx) =>
          ctx.progress >= SILENCE_START &&
          ctx.progress < RETURN_START &&
          this.recentTouches(ctx.sessionData, GOLDENSECOND * 5, ctx.currentTimestamp) === 0,
        action: () => ({
          action: 'celebrate_silence',
          geometryModulation: {
            particleCount: 89,
            ringFadeRate: PHI_INV * PHI_INV,
          },
        }),
      },
      {
        id: 'breathing_irregular',
        condition: (ctx) => {
          const recent = ctx.sessionData.breathingPattern.slice(-10);
          if (recent.length < 5) return false;
          const mean = recent.reduce((sum, s) => sum + s.amplitude, 0) / recent.length;
          const variance = recent.reduce((sum, s) => sum + (s.amplitude - mean) ** 2, 0) / recent.length;
          return variance > VARIANCE_THRESHOLD;
        },
        action: () => ({
          action: 'breathing_guide',
          geometryModulation: {
            breathAmplitude: PHI_INV,
            ringSet: [21, 34],
          },
        }),
      },
      {
        id: 'return_anxiety',
        condition: (ctx) =>
          ctx.progress >= RETURN_START &&
          this.recentTouches(ctx.sessionData, RETURN_TOUCH_WINDOW_MS, ctx.currentTimestamp) > 3,
        action: () => ({
          action: 'gradual_return',
          geometryModulation: {
            ringFadeRate: PHI_INV,
            particleCount: 55,
          },
        }),
      },
      {
        id: 'near_complete',
        condition: (ctx) => ctx.progress >= NEAR_COMPLETION_THRESHOLD,
        action: () => ({
          action: 'prepare_completion',
          geometryModulation: {
            ringFadeRate: PHI,
            particleCount: 34,
          },
        }),
      },
    ];
  }

  private recentTouches(
    sessionData: SessionData,
    windowMs: number,
    currentTimestamp: number
  ): number {
    const cutoff = currentTimestamp - windowMs;
    return sessionData.interactionEvents.filter((e) => e.timestamp > cutoff).length;
  }

  private calculateParticleCount(stability: number): number {
    const index = Math.floor((1 - stability) * (FIBONACCI_COUNTS.length - 1));
    return FIBONACCI_COUNTS[Math.max(0, Math.min(index, FIBONACCI_COUNTS.length - 1))];
  }

  private calculateRingSet(sensitivity: number): number[] {
    if (sensitivity > PHI_INV) return MINIMAL_RING_SET;
    if (sensitivity > PHI_INV * PHI_INV) return STANDARD_RING_SET;
    return FULL_RING_SET;
  }

  private calculateRingFadeRate(completionRate: number): number {
    const min = PHI_INV * PHI_INV; // ≈ 0.382
    const max = PHI_INV; // ≈ 0.618
    return min + completionRate * (max - min);
  }
}

export { SYNC_INTERVAL_MS, BREATH_CYCLE_MS };
