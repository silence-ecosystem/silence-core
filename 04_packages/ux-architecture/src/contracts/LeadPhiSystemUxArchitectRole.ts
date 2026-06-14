// File: 04_packages/ux-architecture/src/contracts/LeadPhiSystemUxArchitectRole.ts
// φ-def: A — φ = (1+√5)/2 ≈ 1.618; SILENCE_CYCLE_MS = φ⁴×1000 = 6854ms

import {
  PHI,
  PHI_INVERSE,
  PHI_INVERSE_SQ,
  PHI_INVERSE_CU,
  GOLDEN_SECOND_MS,
  GOLDEN_SECOND_SQUARED_MS,
  GOLDEN_SECOND_CUBED_MS,
  SILENCE_CYCLE_MS,
  phiDivide,
  phiTimeGrid,
  phiScale,
  phiSequence,
} from '@silence/phi-engine';

export type PhiPreset = '1M' | '3M' | '5M' | 'CUSTOM';
export type PhiPhase =
  | 'ENTRY'
  | 'DEEPENING'
  | 'SILENCE'
  | 'RETURN'
  | 'BREATH_IN'
  | 'HOLD'
  | 'BREATH_OUT';

export type FibonacciStep = 1 | 2 | 3 | 5 | 8 | 13 | 21;
export type SoftNoirTier = 0 | 1 | 2 | 3 | 4;
export type DeterministicEasing = 'cubic-bezier(0.382, 0.000, 0.236, 1.000)';

export interface DeterministicClockInput {
  readonly epochMs: bigint;
  readonly renderTick: bigint;
}

export interface SilenceEventV1 {
  readonly eventId: string;
  readonly sessionId: string;
  readonly prevHash: string;
  readonly eventName: string;
  readonly phiPhase: PhiPhase;
  readonly phiPreset: PhiPreset;
  readonly fibonacciStep: FibonacciStep;
  readonly timestamp: bigint;
}

export interface SoftNoirSurface {
  readonly tier: SoftNoirTier;
  readonly lightness: 12 | 15.3 | 19.4 | 24.7 | 30;
  readonly contentRatio: typeof PHI_INVERSE;
  readonly breathingRatio: typeof PHI_INVERSE_SQ;
}

export interface BreathKeyframeStop {
  readonly percent: 0 | 23.6 | 38.2 | 50 | 61.8 | 76.4 | 100;
  readonly opacity: number;
  readonly scale: number;
}

export interface GoldenSilencePhases {
  readonly totalMs: bigint;
  readonly entryMs: bigint;
  readonly deepeningMs: bigint;
  readonly silenceMs: bigint;
  readonly returnMs: bigint;
  readonly checkpoints: readonly bigint[];
}

export interface DeterministicVariantInput {
  readonly sessionId: string;
  readonly modulo: FibonacciStep;
}

export interface LeadPhiSystemUxArchitectRoleContract {
  readonly identity: 'Lead Φ-System UX Architect';
  readonly mode: 'φ-DETERMINISTIC';
  readonly sourceOfTruth: '@silence/phi-engine';
  readonly allowedFibonacci: readonly [1, 1, 2, 3, 5, 8, 13, 21];
  readonly allowedKeyframeStops: readonly [0, 23.6, 38.2, 50, 61.8, 76.4, 100];
  readonly bannedPatterns: readonly [
    'Math.random()',
    'Date.now()',
    'clamp() in system tokens',
    'min() in system tokens',
    'max() in system tokens',
    'arbitrary literals outside {0,1,100}',
    'clinical vocabulary',
  ];
}

const FNV_OFFSET_BASIS_32 = 0x811c9dc5;
const FNV_PRIME_32 = 0x01000193;

/**
 * phi-derived:
 * formula: hash = FNV-1a(sessionId), assignment = hash mod Fn
 * domain: deterministic A/B allocation without RNG
 * refs: R05 / PHI_guardrails_engine / MATH_CORE
 */
export function fnv1a32(value: string): number {
  let hash = FNV_OFFSET_BASIS_32;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME_32) >>> 0;
  }

  return hash >>> 0;
}

/**
 * phi-derived:
 * formula: assignment = FNV-1a(sessionId) mod Fn
 * domain: deterministic variant routing
 * refs: R05 / TEMPORAL_SYSTEMS
 */
export function assignDeterministicVariant(
  input: DeterministicVariantInput
): number {
  return fnv1a32(input.sessionId) % input.modulo;
}

/**
 * phi-derived:
 * formula: [entry, residual] = phiDivide(total), deepening = total × φ⁻³, silence = residual - deepening, return = total - entry - deepening - silence
 * domain: Golden Silence four-phase runtime
 * refs: PHI_kb_index / MATH_CORE
 */
export function buildGoldenSilencePhases(
  totalMs: bigint,
  startEpochMs: bigint
): GoldenSilencePhases {
  const [entryMs, residualMs] = phiDivide(totalMs);
  const deepeningMs = (totalMs * BigInt(236068)) / BigInt(1000000);
  const silenceMs = residualMs - deepeningMs;
  const returnMs = totalMs - entryMs - deepeningMs - silenceMs;
  const checkpoints = phiTimeGrid(startEpochMs, startEpochMs + totalMs, 5);

  return {
    totalMs,
    entryMs,
    deepeningMs,
    silenceMs,
    returnMs,
    checkpoints,
  };
}

/**
 * phi-derived:
 * formula: scale(n) = phiSequence(start, length)
 * domain: spacing rhythm / layout rhythm
 * refs: PHI_kb_index / MATH_CORE
 */
export function buildSpacingRhythm(
  start: bigint,
  length: number
): readonly bigint[] {
  return phiSequence(start, length);
}

/**
 * phi-derived:
 * formula: next = phiScale(value, direction)
 * domain: deterministic layout/timing scaling
 * refs: PHI_kb_index / MATH_CORE
 */
export function scalePhiValue(value: bigint, direction: 'up' | 'down'): bigint {
  return phiScale(value, direction);
}

/**
 * phi-derived:
 * formula: tier L values = {12, 15.3, 19.4, 24.7, 30}
 * domain: SoftNoir structural surfaces only
 * refs: PHI_guardrails_engine / SoftNoir levels
 */
export function resolveSoftNoirSurface(tier: SoftNoirTier): SoftNoirSurface {
  const levels: Record<SoftNoirTier, 12 | 15.3 | 19.4 | 24.7 | 30> = {
    0: 12,
    1: 15.3,
    2: 19.4,
    3: 24.7,
    4: 30,
  };

  return {
    tier,
    lightness: levels[tier],
    contentRatio: PHI_INVERSE,
    breathingRatio: PHI_INVERSE_SQ,
  };
}

/**
 * phi-derived:
 * formula: percentages ∈ {0, 23.6, 38.2, 50, 61.8, 76.4, 100}
 * domain: canonical breathing keyframes
 * refs: timing canon / PHI_guardrails_engine
 */
export function buildBreathFocusKeyframes(): readonly BreathKeyframeStop[] {
  return [
    { percent: 0, opacity: 0.9, scale: 1.0 },
    { percent: 23.6, opacity: 0.95, scale: 1.009 },
    { percent: 61.8, opacity: 0.95, scale: 1.009 },
    { percent: 100, opacity: 0.9, scale: 1.0 },
  ] as const;
}

/**
 * phi-derived:
 * formula: durations = {φ×1000, φ²×1000, φ³×1000, φ⁴×1000}
 * domain: runtime timing constants through import-only policy
 * refs: sourceOfTruth = @silence/phi-engine
 */
export function resolveCanonicalDurations(): readonly [
  number,
  number,
  number,
  number,
] {
  return [
    GOLDEN_SECOND_MS,
    GOLDEN_SECOND_SQUARED_MS,
    GOLDEN_SECOND_CUBED_MS,
    SILENCE_CYCLE_MS,
  ] as const;
}

export function resolvePhase(
  elapsedMs: bigint,
  phases: GoldenSilencePhases
): PhiPhase {
  const deepeningBoundary = phases.entryMs + phases.deepeningMs;
  const silenceBoundary = deepeningBoundary + phases.silenceMs;

  if (elapsedMs < phases.entryMs) {
    return 'ENTRY';
  }

  if (elapsedMs < deepeningBoundary) {
    return 'DEEPENING';
  }

  if (elapsedMs < silenceBoundary) {
    return 'SILENCE';
  }

  return 'RETURN';
}

export function buildSilenceEvent(
  input: DeterministicClockInput,
  payload: Omit<SilenceEventV1, 'timestamp'>
): SilenceEventV1 {
  return {
    ...payload,
    timestamp: input.epochMs,
  };
}

export const LEAD_PHI_SYSTEM_UX_ARCHITECT_ROLE: LeadPhiSystemUxArchitectRoleContract =
  {
    identity: 'Lead Φ-System UX Architect',
    mode: 'φ-DETERMINISTIC',
    sourceOfTruth: '@silence/phi-engine',
    allowedFibonacci: [1, 1, 2, 3, 5, 8, 13, 21],
    allowedKeyframeStops: [0, 23.6, 38.2, 50, 61.8, 76.4, 100],
    bannedPatterns: [
      'Math.random()',
      'Date.now()',
      'clamp() in system tokens',
      'min() in system tokens',
      'max() in system tokens',
      'arbitrary literals outside {0,1,100}',
      'clinical vocabulary',
    ],
  };
