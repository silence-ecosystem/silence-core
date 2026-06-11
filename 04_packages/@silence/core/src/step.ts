/**
 * [PATH]: 04_packages/@silence/core/src/step.ts
 *
 * Deterministic integrative step engine for SILENCE.OBJECTS.
 * Connects Φ-derived time, threshold-based JITAI rules and garden growth.
 * All decisions are append-only logged via EffectLog.
 */

import { evaluate } from '@silence/jitai';
import type { JitaiContext, JitaiSignal } from '@silence/jitai';
import { GOLDENSECOND, PHI_INV } from '@silence/phi';
import { EffectLog } from './effect-log';

export interface PhiGardenState {
  /** Timestamp (ms) when the garden was seeded */
  seedTimestamp: number;
  /** Timestamp (ms) of the last step() invocation */
  lastStepTimestamp: number;
  /** Total breath completions since seed */
  breathCompletions: number;
  /** Current consecutive-completion streak */
  streakLength: number;
  /** Breath completions in the last 24h window */
  recentBreathCompletions: number;
  /** Quiet sessions completed in the last 7 days */
  quietSessionCount: number;
  /** Garden activity level on a 0-10 scale */
  gardenActivityLevel: number;
  /** Normalized growth score in [0, 1] */
  growthScore: number;
}

export interface StepInput {
  readonly state: PhiGardenState;
  /** Deterministic timestamp (ms); caller must provide, no Date.now() here */
  readonly now: number;
  readonly breathCompleted?: boolean;
  readonly quietSessionCompleted?: boolean;
}

export interface StepOutput {
  readonly nextState: PhiGardenState;
  readonly signal: JitaiSignal | null;
  readonly eventHash: string;
}

function buildJitaiContext(state: PhiGardenState, now: number): JitaiContext {
  return {
    streakLength: state.streakLength,
    recentBreathCompletions: state.recentBreathCompletions,
    gardenActivityLevel: state.gardenActivityLevel,
    quietSessionCount: state.quietSessionCount,
    rhythmVariance: 0.0,
    quotaProximity: 0.0,
    inactivityWindowMs: now - state.lastStepTimestamp,
    recentInterventionFrequency: 0,
    currentHour: 0,
    dayOfWeek: 0,
    attentionDepth: 3,
  };
}

function computeGrowthScore(state: PhiGardenState): number {
  const breathComponent = state.breathCompletions * PHI_INV * 0.01;
  const streakComponent = state.streakLength * PHI_INV * PHI_INV * 0.1;
  const raw = breathComponent + streakComponent + state.gardenActivityLevel * 0.01;
  return Math.min(1, Math.max(0, raw));
}

export async function step(input: StepInput, log: EffectLog): Promise<StepOutput> {
  const { state, now } = input;

  // Time delta expressed in φ-seconds for timing-aware rules
  const dtGolden = Math.floor((now - state.lastStepTimestamp) / GOLDENSECOND);

  const ctx = buildJitaiContext(state, now);
  const result = evaluate(ctx);
  const signal = result.signals[0] ?? null;

  const nextState: PhiGardenState = {
    ...state,
    lastStepTimestamp: now,
  };

  if (input.breathCompleted) {
    nextState.breathCompletions += 1;
    nextState.recentBreathCompletions += 1;
    nextState.streakLength += 1;
    nextState.gardenActivityLevel = Math.min(10, nextState.gardenActivityLevel + 1);
  } else if (dtGolden > 0) {
    // Streak decays slightly when no breath is completed within a φ-second window
    nextState.streakLength = Math.max(0, nextState.streakLength - 1);
  }

  if (input.quietSessionCompleted) {
    nextState.quietSessionCount += 1;
    nextState.gardenActivityLevel = Math.min(10, nextState.gardenActivityLevel + 1);
  }

  nextState.growthScore = computeGrowthScore(nextState);

  const entry = await log.append({
    id: `step-${now}`,
    timestamp: new Date(now).toISOString(),
    eventType: 'DECISION',
    actor: 'core',
    prevHash: log.getLastHash(),
    status: signal ? 'PENDING' : 'PASS',
    change: signal ? signal.ruleId : 'noop',
  });

  return {
    nextState,
    signal,
    eventHash: entry.entryHash,
  };
}
