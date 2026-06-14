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

export type Report = {
  id: string;
  createdAt: string;
  input: string;
  meta: InputMeta;
  phases: Record<ReportPhase, string>;
  confidence: number;
  alternative: string;
  crisisBlocked: boolean;
};

export type Subscription = 'free' | 'pro';

export type AppState = {
  profile: Profile | null;
  consent: Consent | null;
  reports: Report[];
  subscription: Subscription;
};
