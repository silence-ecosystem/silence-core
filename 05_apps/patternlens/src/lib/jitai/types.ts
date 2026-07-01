/**
 * [PATH]: 05_apps/patternlens/src/lib/jitai/types.ts
 *
 * JITAI local-first type definitions for PatternLens onboarding DCI.
 * All timing constants are imported from @silence/phi via @silence/sdk.
 * No descriptive diagnostic labels — operational S11 vocabulary only.
 */

export type Phase = 'ENTRY' | 'DEEPENING' | 'SILENCE' | 'RETURN';

export interface PhaseTransition {
  from: Phase;
  to: Phase;
  timestamp: number;
  progressAtTransition: number;
}

export interface BreathingSample {
  timestamp: number;
  amplitude: number;
  frequency: number;
}

export interface InteractionEvent {
  type: 'touch' | 'click';
  timestamp: number;
  x: number;
  y: number;
}

export interface SessionData {
  sessionId?: string;
  userId?: string;
  startedAt: number;
  completedAt?: number;
  durationMs: number;
  phaseTransitions: PhaseTransition[];
  breathingPattern: BreathingSample[];
  interactionEvents: InteractionEvent[];
}

export interface AttentionProfile {
  userId: string;
  attentionStability: number; // 0-1
  distractionSensitivity: number; // 0-1
  sessionCompletionRate: number; // 0-1
  baselineParticleCount: number; // Fibonacci 21-89
  preferredRingSet: number[]; // subset of [8,13,21,34,55,89]
  totalSessions: number;
  lastSessionAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface GeometryModulation {
  particleCount: number;
  ringSet: number[];
  breathAmplitude: number;
  ringFadeRate: number;
}

export interface DecisionContext {
  progress: number;
  currentPhase: Phase;
  sessionData: SessionData;
  currentTimestamp: number;
}

export interface DecisionResult {
  action: string;
  geometryModulation?: Partial<GeometryModulation>;
}

export interface DecisionRule {
  id: string;
  condition: (context: DecisionContext, profile: AttentionProfile) => boolean;
  action: (context: DecisionContext, profile: AttentionProfile) => DecisionResult;
}
