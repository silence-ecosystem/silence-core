/**
 * [PATH]: 04_packages/@silence/contracts/src/crisis.ts
 * @silence/contracts
 * Canonical crisis/safety contracts for the Silence ecosystem.
 *
 * S11: terms are operational ("risk level", "resources", "detection layer")
 *      rather than diagnostic. "Crisis" is retained only as the established
 *      safety-system domain term.
 */

export type CrisisRegion = 'PL' | 'UK' | 'US' | 'EU';

export interface CrisisResource {
  readonly name: string;
  readonly number: string;
  readonly description: string;
  readonly type: 'phone' | 'text' | 'chat' | 'other';
  readonly available: string;
  readonly region: CrisisRegion;
}

export interface RegionalCrisisResources {
  readonly region: CrisisRegion;
  readonly primary: CrisisResource;
  readonly secondary: CrisisResource;
  readonly additional: readonly CrisisResource[];
}

export interface CrisisDetectionConfig {
  readonly claudeHighRiskThreshold: number;
  readonly claudeMediumRiskThreshold: number;
  readonly claudeTimeoutMs: number;
  readonly maxProcessingTimeMs: number;
  readonly enableClaudeAssessment: boolean;
  readonly logIncidents: boolean;
  readonly defaultRegion: CrisisRegion;
}

export type CrisisRiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export type CrisisAction = 'PROCEED' | 'SHOW_RESOURCES' | 'BLOCK';

export type DetectionLayer = 'hard_keyword' | 'soft_keyword' | 'model_assessment' | 'manual';

export interface HardKeywordResult {
  readonly matched: boolean;
  readonly keywords: readonly string[];
}

export interface SoftKeywordResult {
  readonly matched: boolean;
  readonly keywords: readonly string[];
  readonly score: number;
}

export interface ClaudeAssessmentResult {
  readonly riskScore: number;
  readonly reasoning: string;
  readonly flagged: boolean;
}

export interface CrisisCheckRequest {
  readonly text: string;
  readonly locale?: CrisisRegion;
  readonly includeModelAssessment?: boolean;
}

export interface CrisisCheckResult {
  readonly riskLevel: CrisisRiskLevel;
  readonly action: CrisisAction;
  readonly detectedKeywords: readonly string[];
  readonly resources: readonly CrisisResource[];
  readonly showResources: boolean;
  readonly message: string;
}

export interface CrisisCheckResponse extends CrisisCheckResult {}

export interface CrisisIncident {
  readonly id: string;
  readonly userId: string;
  readonly textHash: string;
  readonly riskLevel: CrisisRiskLevel;
  readonly action: CrisisAction;
  readonly detectedKeywords: readonly string[];
  readonly createdAt: string;
}

export interface CrisisModalData {
  readonly title: string;
  readonly description: string;
  readonly resources: readonly CrisisResource[];
}

export interface SafetyBannerData {
  readonly message: string;
  readonly resources: readonly CrisisResource[];
  readonly visible: boolean;
}

export interface CrisisDetectionResult {
  readonly riskLevel: CrisisRiskLevel;
  readonly action: CrisisAction;
  readonly detectedKeywords: readonly string[];
  readonly resources: readonly CrisisResource[];
  readonly showResources: boolean;
  readonly message: string;
}

export interface EmergencyResponse {
  readonly isEmergency: boolean;
  readonly shouldBlock: false;
  readonly riskLevel: CrisisRiskLevel;
  readonly detectedKeywords: readonly string[];
  readonly resources: readonly CrisisResource[];
  readonly showResources: boolean;
  readonly message: string;
}

export const CRISIS_RESOURCES: Record<CrisisRegion, RegionalCrisisResources> = {
  PL: {
    region: 'PL',
    primary: {
      name: 'Telefon Zaufania dla Dorosłych',
      number: '116 123',
      description: 'Bezpłatna linia wsparcia, dostępna całą dobę',
      type: 'phone',
      available: '24/7',
      region: 'PL',
    },
    secondary: {
      name: 'Numer Alarmowy',
      number: '112',
      description: 'Służby ratunkowe',
      type: 'phone',
      available: '24/7',
      region: 'PL',
    },
    additional: [
      {
        name: 'Centrum Wsparcia dla osób w kryzysie',
        number: '800 70 2222',
        description: 'Bezpłatna linia wsparcia psychologicznego',
        type: 'phone',
        available: '14:00-22:00',
        region: 'PL',
      },
      {
        name: 'Telefon dla Dzieci i Młodzieży',
        number: '116 111',
        description: 'Bezpłatna linia dla osób poniżej 18 roku życia',
        type: 'phone',
        available: '24/7',
        region: 'PL',
      },
    ],
  },
  UK: {
    region: 'UK',
    primary: {
      name: 'Samaritans',
      number: '116 123',
      description: 'Free crisis support, available 24/7',
      type: 'phone',
      available: '24/7',
      region: 'UK',
    },
    secondary: {
      name: 'Emergency Services',
      number: '999',
      description: 'Emergency services',
      type: 'phone',
      available: '24/7',
      region: 'UK',
    },
    additional: [
      {
        name: 'SHOUT Crisis Text Line',
        number: '85258',
        description: 'Text SHOUT to 85258 for free crisis support',
        type: 'text',
        available: '24/7',
        region: 'UK',
      },
      {
        name: 'Mind Infoline',
        number: '0300 123 3393',
        description: 'Information and crisis support resources',
        type: 'phone',
        available: '9:00-18:00 Mon-Fri',
        region: 'UK',
      },
    ],
  },
  US: {
    region: 'US',
    primary: {
      name: '988 Suicide & Crisis Lifeline',
      number: '988',
      description: 'Free, confidential support 24/7',
      type: 'phone',
      available: '24/7',
      region: 'US',
    },
    secondary: {
      name: 'Emergency Services',
      number: '911',
      description: 'Emergency services',
      type: 'phone',
      available: '24/7',
      region: 'US',
    },
    additional: [
      {
        name: 'Crisis Text Line',
        number: '741741',
        description: 'Text HOME to 741741 for free crisis support',
        type: 'text',
        available: '24/7',
        region: 'US',
      },
    ],
  },
  EU: {
    region: 'EU',
    primary: {
      name: '112 Emergency Number',
      number: '112',
      description: 'EU-wide emergency number',
      type: 'phone',
      available: '24/7',
      region: 'EU',
    },
    secondary: {
      name: 'Samaritans (UK)',
      number: '116 123',
      description: 'Free crisis support, available 24/7',
      type: 'phone',
      available: '24/7',
      region: 'EU',
    },
    additional: [],
  },
};

export function getCrisisResourcesByLocale(locale: string = 'pl'): CrisisResource[] {
  const map: Record<string, CrisisRegion> = {
    pl: 'PL',
    'pl-PL': 'PL',
    'en-US': 'US',
    en: 'US',
    'en-GB': 'UK',
  };
  const region = map[locale] || 'PL';
  const bundle = CRISIS_RESOURCES[region] || CRISIS_RESOURCES.PL;
  return [bundle.primary, bundle.secondary, ...bundle.additional];
}
