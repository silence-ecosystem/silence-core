/**
 * [PATH]: /home/ewa/silence/04_packages/@silence/contracts/src/index.ts
 * @silence/contracts
 * Shared contracts and types for the Silence ecosystem.
 *
 * Acts as the canonical SSoT for inter-package type boundaries.
 */

// ─── Primitive Aliases ─────────────────────────────────────────
export type UUID = string;
export type Timestamp = string;
export type TenantID = string;

// ─── Event System ──────────────────────────────────────────────
export * from './events/pulseTap';

export enum BehavioralEventType {
  CAPACITY_SHIFTED = 'CAPACITY_SHIFTED',
  CAPACITY_CHANGED = 'CAPACITY_CHANGED',
  PATTERN_DETECTED = 'PATTERN_DETECTED',
  RHYTHM_DRIFT = 'RHYTHM_DRIFT',
  SEQUENCE_COMPLETED = 'SEQUENCE_COMPLETED',
}

export interface SilenceEvent {
  id?: string;
  type: string;
  timestamp: string;
  userId: string;
  payload: unknown;
}

// ─── Crisis / Safety ───────────────────────────────────────────
export * from './crisis';

// ─── Audio / Voice / Objects ───────────────────────────────────
export * from './audio';

// ─── Protocols ─────────────────────────────────────────────────
export * from './protocols';

// ─── Narrative Engine ──────────────────────────────────────────
export interface SituationSummaryInput {
  objectId: string;
  relationalContext: { selfRole: string };
  relationalTurns?: unknown[];
  patternLabels: string[];
}

export interface SituationCommentary {
  objectId: string;
  summary: string;
  patternExplanation: string;
  relationalAngle?: string;
  disclaimers: string[];
}

// ─── Reporting ─────────────────────────────────────────────────
export interface SessionSummary {
  sessionId: string;
}

export interface SessionCommentary {
  overview: string;
  relationalHighlights: unknown;
}

// ─── Onboarding / Intention ────────────────────────────────────
export type PracticeAnchor = string;
export type ProtocolPriority = string;

export interface OnboardingIntention {
  readonly userId: string;
  readonly primaryIntent: string;
  readonly experience: string;
  readonly anchor: PracticeAnchor;
}

export function mapIntentToProtocolPriorities(_intent: string): ProtocolPriority[] {
  return [];
}

// ─── Behaviour Engine (EE) ────────────────────────────────────
export interface AttentionMonitorSnapshot {
  facialPresence: { facePresent: boolean };
  engagementLevel: string;
  engagementScore: number;
}
