/**
 * [PATH]: 04_packages/@silence/types/s11.ts
 *
 * S11 Language Standard — Canonical Terminology
 * SSoT for forbidden classes and allowed structural vocabulary.
 * Version: 2.1
 * Source: 01_governance/S11-01.md
 */

export type S11TermClass =
  | 'DIAGNOSTIC'
  | 'THERAPEUTIC'
  | 'AFFECTIVE_ASSESSMENT'
  | 'NORMATIVE_JUDGMENT'
  | 'MYSTICAL_SPIRITUAL';

export interface ForbiddenTerm {
  readonly class: S11TermClass;
  readonly term: string;
  readonly severity: 'MUST_NOT';
}

export interface AllowedAlternative {
  readonly class: S11TermClass;
  readonly alternative: string;
}

export const FORBIDDEN_CLASSES: Record<S11TermClass, readonly string[]> = {
  DIAGNOSTIC: [
    'disorder',
    'anxiety',
    'ADHD',
    'OCD',
    'PTSD',
    'bipolar',
    'burnout',
    'depression',
    'syndrome',
    'illness',
    'diagnosis',
    'symptom',
    'patient',
    'clinical',
    'dysfunction',
    'abnormal',
    'medication',
  ],
  THERAPEUTIC: [
    'therapy',
    'treatment',
    'healing',
    'cure',
    'prognosis',
    'prescription',
    'rehabilitation',
    'remedy',
  ],
  AFFECTIVE_ASSESSMENT: [
    'mood tracking',
    'emotion recognition',
    'sentiment analysis',
    'affect',
    'emotional analysis',
    'personality type',
    'personality test',
    'mental health',
  ],
  NORMATIVE_JUDGMENT: [
    'healthy',
    'unhealthy',
    'normal',
    'abnormal',
    'disordered',
    'dysfunctional',
    'maladaptive',
    'pathological',
    'disabled',
    'wellness',
  ],
  MYSTICAL_SPIRITUAL: [
    'spiritual',
    'mystical',
    'divine',
    'cosmic',
    'horoscope',
    'fortune',
    'energy',
    'universe',
    'destiny',
    'fate',
    'oracle',
    'aura',
  ],
} as const;

export const ALLOWED_ALTERNATIVES: Record<S11TermClass, readonly string[]> = {
  DIAGNOSTIC: [
    'pattern signature',
    'classification',
    'structural hypothesis',
    'signal',
    'observer',
    'observational',
    'divergence',
    'atypical',
    'support protocol',
  ],
  THERAPEUTIC: [
    'pattern review',
    'structural review',
    'guided analysis',
    'structured observation',
    'intervention',
    'resolution',
  ],
  AFFECTIVE_ASSESSMENT: [
    'activation state',
    'suppression state',
    'tension pattern',
    'interaction pattern',
  ],
  NORMATIVE_JUDGMENT: [
    'deviation',
    'variance',
    'threshold state',
    'capacity shift',
  ],
  MYSTICAL_SPIRITUAL: [
    'system signal',
    'structural relation',
    'observed recurrence',
  ],
} as const;

export const ALLOWED_VOCABULARY: readonly string[] = [
  'attention profile',
  'interaction pattern',
  'behavioral sequence',
  'rhythm',
  'cycle',
  'drift',
  'recurrence',
  'tension',
  'activation',
  'suppression',
  'signal',
  'indicator',
  'metric',
  'confidence',
  'probability',
  'suggestion',
  'reminder',
  'prompt',
  'structural exercise',
] as const;

export function getAllForbiddenTerms(): readonly ForbiddenTerm[] {
  const terms: ForbiddenTerm[] = [];
  (Object.keys(FORBIDDEN_CLASSES) as S11TermClass[]).forEach((cls) => {
    FORBIDDEN_CLASSES[cls].forEach((term) => {
      terms.push({ class: cls, term, severity: 'MUST_NOT' });
    });
  });
  return terms;
}
