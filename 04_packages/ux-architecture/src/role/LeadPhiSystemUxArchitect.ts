// File: 04_packages/ux-architecture/src/role/LeadPhiSystemUxArchitect.ts
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

export interface UiSurfaceTokenSet {
  readonly backgroundL: 12 | 15.3 | 19.4 | 24.7 | 30 | 32;
  readonly contentRatio: typeof PHI_INVERSE;
  readonly breathingRatio: typeof PHI_INVERSE_SQ;
  readonly animationCycleMs: number;
  readonly easing: 'cubic-bezier(0.382, 0.000, 0.236, 1.000)';
}

export interface GoldenSilencePlan {
  readonly totalMs: bigint;
  readonly entryMs: bigint;
  readonly deepeningMs: bigint;
  readonly silenceMs: bigint;
  readonly returnMs: bigint;
  readonly breathCycleMs: bigint;
  readonly checkpoints: readonly bigint[];
}

export interface ExperimentAssignmentInput {
  readonly sessionId: string;
  readonly modulo: FibonacciStep;
}

export interface ArchitectResponse<TCode extends string> {
  readonly goal: string;
  readonly deterministicRule: string;
  readonly code: TCode;
}

const FNV_OFFSET_BASIS_32 = 0x811c9dc5;
const FNV_PRIME_32 = 0x01000193;

function fnv1a32(value: string): number {
  let hash = FNV_OFFSET_BASIS_32;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME_32) >>> 0;
  }
  return hash >>> 0;
}

/**
 * phi-derived:
 * formula: short = 18 × GOLDEN_SECOND_MS, long = 37 × GOLDEN_SECOND_MS
 * domain: preset-driven session windows for Golden Silence Entry
 * refs: MATH_CORE / PHI guardrails / deterministic runtime
 */
export function resolvePresetDurationMs(
  preset: PhiPreset,
  customMs?: bigint
): bigint {
  if (preset === '1M') {
    return BigInt(37 * GOLDEN_SECOND_MS);
  }

  if (preset === '3M') {
    return BigInt(3 * 37 * GOLDEN_SECOND_MS);
  }

  if (preset === '5M') {
    return BigInt(5 * 37 * GOLDEN_SECOND_MS);
  }

  if (preset === 'CUSTOM') {
    if (typeof customMs !== 'bigint') {
      throw new Error(
        '[Potrzebne dane: bigint, customMs, @silence/phi-engine]'
      );
    }
    return customMs;
  }

  return BigInt(18 * GOLDEN_SECOND_MS);
}

/**
 * phi-derived:
 * formula: [entry, silenceLike] = phiDivide(total), deepening = total × φ⁻³, return = total - entry - deepening - silence
 * domain: deterministic 4-phase Golden Silence plan
 * refs: PHI_kb_index / MATH_CORE
 */
export function buildGoldenSilencePlan(
  totalMs: bigint,
  startEpochMs: bigint
): GoldenSilencePlan {
  const [entryMs, residualAfterEntry] = phiDivide(totalMs);
  const deepeningMs = (totalMs * BigInt(236068)) / BigInt(1000000);
  const silenceMs = residualAfterEntry - deepeningMs;
  const returnMs = totalMs - entryMs - deepeningMs - silenceMs;
  const breathCycleMs = BigInt(GOLDEN_SECOND_SQUARED_MS);
  const checkpoints = phiTimeGrid(startEpochMs, startEpochMs + totalMs, 5);

  return {
    totalMs,
    entryMs,
    deepeningMs,
    silenceMs,
    returnMs,
    breathCycleMs,
    checkpoints,
  };
}

/**
 * phi-derived:
 * formula: content = φ⁻¹, breathing = φ⁻², cycle = φ⁴ × 1000
 * domain: layout/timing token set
 * refs: PHI_kb_index / MATH_CORE
 */
export function resolveSoftNoirSurface(
  level: 0 | 1 | 2 | 3 | 4
): UiSurfaceTokenSet {
  const backgroundLMap: Record<
    0 | 1 | 2 | 3 | 4,
    12 | 15.3 | 19.4 | 24.7 | 30
  > = {
    0: 12,
    1: 15.3,
    2: 19.4,
    3: 24.7,
    4: 30,
  };

  return {
    backgroundL: backgroundLMap[level],
    contentRatio: PHI_INVERSE,
    breathingRatio: PHI_INVERSE_SQ,
    animationCycleMs: SILENCE_CYCLE_MS,
    easing: 'cubic-bezier(0.382, 0.000, 0.236, 1.000)',
  };
}

/**
 * phi-derived:
 * formula: assignment = FNV-1a(sessionId) mod Fn
 * domain: deterministic A/B or preset routing
 * refs: R05 / TEMPORAL_SYSTEMS / PHI guardrails
 */
export function assignDeterministicVariant(
  input: ExperimentAssignmentInput
): number {
  return fnv1a32(input.sessionId) % input.modulo;
}

/**
 * phi-derived:
 * formula: scale progression through phiSequence(start, length)
 * domain: layout spacing and component rhythm
 * refs: PHI_kb_index / MATH_CORE
 */
export function buildSpacingSequence(
  start: bigint,
  length: number
): readonly bigint[] {
  return phiSequence(start, length);
}

export function nextPhase(
  elapsedMs: bigint,
  plan: GoldenSilencePlan
): PhiPhase {
  if (elapsedMs < plan.entryMs) {
    return 'ENTRY';
  }

  if (elapsedMs < plan.entryMs + plan.deepeningMs) {
    return 'DEEPENING';
  }

  if (elapsedMs < plan.entryMs + plan.deepeningMs + plan.silenceMs) {
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

export function architectEnvelope<TCode extends string>(
  goal: string,
  deterministicRule: string,
  code: TCode
): ArchitectResponse<TCode> {
  return {
    goal,
    deterministicRule,
    code,
  };
}

export const LEAD_PHI_SYSTEM_UX_ARCHITECT = {
  identity: 'Lead Φ-System UX Architect',
  mode: 'DETERMINISTIC_ONLY',
  imports: '@silence/phi-engine',
  bans: [
    'Math.random()',
    'Date.now() in decision logic',
    'arbitrary literals outside {0,1,100}',
    'clamp()/min()/max() in system tokens',
    'clinical vocabulary',
  ] as const,
  allowedFibonacci: [1, 1, 2, 3, 5, 8, 13, 21] as const,
  allowedKeyframeStops: [0, 23.6, 38.2, 50, 61.8, 76.4, 100] as const,
  softNoirL: [12, 15.3, 19.4, 24.7, 30] as const,
} as const;
