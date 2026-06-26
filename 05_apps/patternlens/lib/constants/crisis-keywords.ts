/**
 * PATTERNLENS CRISIS DETECTION KEYWORDS
 * 
 * Layer 1 (HARD): Instant block - no AI assessment needed
 * Layer 2 (SOFT): Trigger Claude risk assessment
 * 
 * CRITICAL: These keywords are safety-critical. Changes require review.
 */

// ============================================
// LAYER 1: HARD KEYWORDS - INSTANT BLOCK
// ============================================
// If ANY of these appear, immediately show CrisisModal
// NO AI processing, NO interpretation generation

export const HARD_KEYWORDS_PL = [
  // Suicide
  'chcę się zabić',
  'zabiję się',
  'skończę z tym wszystkim',
  'nie chcę żyć',
  'popełnię samobójstwo',
  'samobójstwo',
  'odebrać sobie życie',
  'targnąć się na życie',
  'skok z mostu',
  'przedawkować',
  'połknąć tabletki',
  'podciąć żyły',
  'powiesić się',
  // Self-harm
  'będę się kroić',
  'będę się ciąć',
  'zrobię sobie krzywdę',
  'chcę się skrzywdzić',
  // Violence
  'zabiję go',
  'zabiję ją',
  'zabiję ich',
  'chcę kogoś zabić',
];

export const HARD_KEYWORDS_EN = [
  // Suicide
  'i want to kill myself',
  'i will kill myself',
  'end it all',
  'i dont want to live',
  "i don't want to live",
  'commit suicide',
  'take my own life',
  'jump off a bridge',
  'overdose',
  'swallow pills',
  'slit my wrists',
  'hang myself',
  // Self-harm
  'i will cut myself',
  'i want to hurt myself',
  'harm myself',
  // Violence
  'i will kill him',
  'i will kill her',
  'i will kill them',
  'i want to kill someone',
];

export const HARD_KEYWORDS = [...HARD_KEYWORDS_PL, ...HARD_KEYWORDS_EN];

// ============================================
// LAYER 2: SOFT KEYWORDS - TRIGGER AI ASSESSMENT
// ============================================
// If any of these appear, send to Claude for risk scoring
// Score >= 0.7 = block, 0.5-0.7 = warn, < 0.5 = proceed

export const SOFT_KEYWORDS_PL = [
  // Depression indicators
  'nie mam siły',
  'nie widzę sensu',
  'jestem zmęczony życiem',
  'wszystko jest beznadziejne',
  'nikomu na mnie nie zależy',
  'jestem sam',
  'jestem sama',
  'nikt mnie nie rozumie',
  'nie mam po co żyć',
  'lepiej by było bez mnie',
  'jestem ciężarem',
  'nie zasługuję',
  'nienawidzę siebie',
  // Crisis indicators
  'nie wiem co zrobić',
  'nie daję rady',
  'nie mogę tak dalej',
  'załamuję się',
  'tracę kontrolę',
  'wszystko się wali',
  'czuję się pusta',
  'czuję się pusty',
  'nie czuję nic',
  'odrętwienie',
  // Isolation
  'odcinam się',
  'izoluję się',
  'nie chcę nikogo widzieć',
  'zamykam się',
  // Anxiety
  'panika',
  'atak paniki',
  'nie mogę oddychać',
  'serce mi wali',
  'boję się',
  'przerażenie',
  // Trauma
  'flashback',
  'koszmary',
  'nie mogę spać',
  'wspomnienia wracają',
];

export const SOFT_KEYWORDS_EN = [
  // Depression indicators
  'i have no strength',
  'i see no point',
  'tired of living',
  'everything is hopeless',
  'nobody cares about me',
  'i am alone',
  'no one understands me',
  'nothing to live for',
  'better off without me',
  'i am a burden',
  "i don't deserve",
  'i hate myself',
  // Crisis indicators
  "i don't know what to do",
  "i can't cope",
  "i can't go on",
  'breaking down',
  'losing control',
  'everything is falling apart',
  'i feel empty',
  'i feel nothing',
  'numbness',
  // Isolation
  'cutting off',
  'isolating myself',
  "don't want to see anyone",
  'shutting down',
  // Anxiety
  'panic',
  'panic attack',
  "can't breathe",
  'heart racing',
  "i'm scared",
  'terrified',
  // Trauma
  'flashback',
  'nightmares',
  "can't sleep",
  'memories coming back',
];

export const SOFT_KEYWORDS = [...SOFT_KEYWORDS_PL, ...SOFT_KEYWORDS_EN];

// ============================================
// CRISIS RESOURCES BY REGION
// ============================================

export interface CrisisResource {
  name: string;
  phone: string;
  description: string;
  available: string;
  url?: string;
}

export interface RegionalResources {
  emergency: string;
  resources: CrisisResource[];
}

export const CRISIS_RESOURCES: Record<string, RegionalResources> = {
  PL: {
    emergency: '112',
    resources: [
      {
        name: 'Telefon Zaufania dla Dzieci i Młodzieży',
        phone: '116 111',
        description: 'Bezpłatna pomoc dla dzieci i młodzieży',
        available: '24/7',
      },
      {
        name: 'Telefon Zaufania dla Dorosłych',
        phone: '116 123',
        description: 'Wsparcie emocjonalne dla dorosłych',
        available: '24/7',
      },
      {
        name: 'Centrum Wsparcia dla osób w kryzysie psychicznym',
        phone: '800 70 2222',
        description: 'Bezpłatna linia wsparcia',
        available: '24/7',
      },
    ],
  },
  US: {
    emergency: '911',
    resources: [
      {
        name: '988 Suicide & Crisis Lifeline',
        phone: '988',
        description: 'Free, confidential support',
        available: '24/7',
        url: 'https://988lifeline.org',
      },
      {
        name: 'Crisis Text Line',
        phone: 'Text HOME to 741741',
        description: 'Free crisis counseling via text',
        available: '24/7',
      },
    ],
  },
  UK: {
    emergency: '999',
    resources: [
      {
        name: 'Samaritans',
        phone: '116 123',
        description: 'Free emotional support',
        available: '24/7',
        url: 'https://samaritans.org',
      },
      {
        name: 'Shout',
        phone: 'Text SHOUT to 85258',
        description: 'Free text support service',
        available: '24/7',
      },
    ],
  },
};

// ============================================
// DETECTION FUNCTIONS
// ============================================

export type DetectionResult = {
  detected: boolean;
  layer: 1 | 2 | null;
  matchedKeywords: string[];
};

/**
 * Check input text for crisis keywords
 * Returns detection result with layer and matched keywords
 */
export function detectCrisisKeywords(text: string): DetectionResult {
  const normalizedText = text.toLowerCase().trim();
  
  // Layer 1: Hard keywords - instant block
  const hardMatches = HARD_KEYWORDS.filter(keyword => 
    normalizedText.includes(keyword.toLowerCase())
  );
  
  if (hardMatches.length > 0) {
    return {
      detected: true,
      layer: 1,
      matchedKeywords: hardMatches,
    };
  }
  
  // Layer 2: Soft keywords - trigger AI assessment
  const softMatches = SOFT_KEYWORDS.filter(keyword =>
    normalizedText.includes(keyword.toLowerCase())
  );
  
  if (softMatches.length > 0) {
    return {
      detected: true,
      layer: 2,
      matchedKeywords: softMatches,
    };
  }
  
  return {
    detected: false,
    layer: null,
    matchedKeywords: [],
  };
}

/**
 * Get crisis resources for user's locale
 */
export function getResourcesForLocale(locale: string): RegionalResources {
  const upperLocale = locale.toUpperCase();
  
  // Map common locale codes to our resource keys
  const localeMap: Record<string, string> = {
    'PL': 'PL',
    'PL-PL': 'PL',
    'EN': 'US',
    'EN-US': 'US',
    'EN-GB': 'UK',
    'GB': 'UK',
  };
  
  const resourceKey = localeMap[upperLocale] || 'US';
  return CRISIS_RESOURCES[resourceKey] || CRISIS_RESOURCES.US;
}
