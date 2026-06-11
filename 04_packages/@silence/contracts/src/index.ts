/**
 * [PATH]: 04_packages/@silence/contracts/src/index.ts
 * @silence/contracts
 * Shared contracts and types for the Silence ecosystem.
 *
 * Originally extracted from legacy monorepo and reconstructed
 * from cross-package usage patterns. Acts as the canonical SSoT
 * for inter-package type boundaries.
 */

// ─── Primitive Aliases ─────────────────────────────────────────
export type UUID = string;
export type Timestamp = string;
export type TenantID = string;

// ─── Event System ──────────────────────────────────────────────
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
  payload: any;
}

// ─── Narrative Engine ──────────────────────────────────────────
export interface SituationSummaryInput {
  objectId: string;
  relationalContext: { selfRole: string };
  relationalTurns?: any[];
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
  relationalHighlights: any;
}

// ─── Behaviour Engine ──────────────────────────────────────────
export interface UserInteractionPreferences {
  activeCoCreateMode: boolean;
}

export interface OnboardingIntention {
  primaryIntent: string;
  anchor: PracticeAnchor;
}

export type PracticeAnchor = string;
export type ProtocolPriority = string;

export function mapIntentToProtocolPriorities(_intent: string): ProtocolPriority[] {
  return [];
}

// ─── Behavioral Engine (EE) ────────────────────────────────────
export interface AttentionMonitorSnapshot {
  facialPresence: { facePresent: boolean };
  engagementLevel: string;
  engagementScore: number;
}
