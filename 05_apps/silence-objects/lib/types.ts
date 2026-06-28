/**
 * [PATH]: 05_apps/silence-objects/lib/types.ts
 *
 * Core domain types for the SILENCE.OBJECTS Command Center.
 */

export type Profile = {
  name: string;
  focus: 'pattern' | 'rhythm' | 'tension' | 'function' | 'structure';
  depth: 'surface' | 'standard' | 'deep';
  neurotype: 'default' | 'linear' | 'parallel' | 'sensory' | 'conceptual';
};

export type Consent = {
  rodoData: boolean;
  rodoModel: boolean;
  acceptedAt: string;
};

export type InputMeta = {
  source: 'self' | 'observed' | 'system';
  intensity: 1 | 2 | 3 | 4 | 5;
  context: string;
};

export type ReportPhase =
  | 'context'
  | 'tension'
  | 'meaning'
  | 'function';

export type Trend = 'rising' | 'falling' | 'stable' | 'new';

export type ComparedReport = {
  id: string;
  createdAt: string;
  similarityScore: number;
  intensity: number;
  confidence: number;
};

export type Comparison = {
  trend: Trend;
  previous: ComparedReport[];
  summary: string;
};

export type Report = {
  id: string;
  createdAt: string;
  input: string;
  meta: InputMeta;
  phases: Record<ReportPhase, string>;
  confidence: number;
  alternatives: string[];
  comparison?: Comparison;
  crisisBlocked: boolean;
};

/**
 * Legacy shape kept only for local-storage migration.
 * @deprecated Remove after a few releases.
 */
export type LegacyReport = Omit<Report, 'alternatives' | 'comparison'> & {
  alternative: string;
};

export type Subscription = 'free' | 'pro';

export type AppState = {
  profile: Profile | null;
  consent: Consent | null;
  reports: Report[];
  subscription: Subscription;
};
