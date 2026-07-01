// ===========================================
// SILENCE.OBJECTS - Crisis Resources Constants
// ===========================================
// Regional crisis helplines and resources
// Supports: Poland (PL), United Kingdom (UK), United States (US), European Union (EU)

import type {
  CrisisRegion,
  RegionalCrisisResources,
  CrisisResource,
  CrisisDetectionConfig,
} from "@/types/crisis";

// ===========================================
// CRISIS RESOURCES BY REGION
// ===========================================

const POLAND_RESOURCES: RegionalCrisisResources = {
  region: "PL",
  primary: {
    name: "Telefon Zaufania dla Dorosłych",
    number: "116 123",
    description: "Bezpłatna linia wsparcia, dostępna całą dobę",
    type: "phone",
    available: "24/7",
    region: "PL",
  },
  secondary: {
    name: "Numer Alarmowy",
    number: "112",
    description: "Służby ratunkowe",
    type: "phone",
    available: "24/7",
    region: "PL",
  },
  additional: [
    {
      name: "Centrum Wsparcia dla osób w kryzysie",
      number: "800 70 2222",
      description: "Bezpłatna linia wsparcia psychologicznego",
      type: "phone",
      available: "14:00-22:00",
      region: "PL",
    },
    {
      name: "Telefon dla Dzieci i Młodzieży",
      number: "116 111",
      description: "Bezpłatna linia dla osób poniżej 18 roku życia",
      type: "phone",
      available: "24/7",
      region: "PL",
    },
  ],
};

const UK_RESOURCES: RegionalCrisisResources = {
  region: "UK",
  primary: {
    name: "Samaritans",
    number: "116 123",
    description: "Free crisis support, available 24/7",
    type: "phone",
    available: "24/7",
    region: "UK",
  },
  secondary: {
    name: "Emergency Services",
    number: "999",
    description: "Emergency services",
    type: "phone",
    available: "24/7",
    region: "UK",
  },
  additional: [
    {
      name: "SHOUT Crisis Text Line",
      number: "85258",
      description: "Text SHOUT to 85258 for free crisis support",
      type: "text",
      available: "24/7",
      region: "UK",
    },
    {
      name: "Mind Infoline",
      number: "0300 123 3393",
      description: "Information and crisis support resources",
      type: "phone",
      available: "9:00-18:00 Mon-Fri",
      region: "UK",
    },
  ],
};

const US_RESOURCES: RegionalCrisisResources = {
  region: "US",
  primary: {
    name: "988 Suicide & Crisis Lifeline",
    number: "988",
    description: "Free, confidential support 24/7",
    type: "phone",
    available: "24/7",
    region: "US",
  },
  secondary: {
    name: "Emergency Services",
    number: "911",
    description: "Emergency services",
    type: "phone",
    available: "24/7",
    region: "US",
  },
  additional: [
    {
      name: "Crisis Text Line",
      number: "741741",
      description: "Text HOME to 741741 for free crisis support",
      type: "text",
      available: "24/7",
      region: "US",
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Free, confidential treatment referral service",
      type: "phone",
      available: "24/7",
      region: "US",
    },
  ],
};

const EU_RESOURCES: RegionalCrisisResources = {
  region: "EU",
  primary: {
    name: "European Emergency Number",
    number: "112",
    description: "Pan-European emergency number",
    type: "phone",
    available: "24/7",
    region: "EU",
  },
  secondary: {
    name: "Telefono Amico (IT) / SOS Amitié (FR)",
    number: "116 123",
    description: "Crisis support helpline (varies by country)",
    type: "phone",
    available: "Varies",
    region: "EU",
  },
  additional: [
    {
      name: "Child Helpline International",
      number: "116 111",
      description: "Support for children and young people",
      type: "phone",
      available: "Varies by country",
      region: "EU",
    },
  ],
};

// ===========================================
// EXPORTS
// ===========================================

export const CRISIS_RESOURCES: Record<CrisisRegion, RegionalCrisisResources> = {
  PL: POLAND_RESOURCES,
  UK: UK_RESOURCES,
  US: US_RESOURCES,
  EU: EU_RESOURCES,
};

/**
 * Get crisis resources for a specific region
 */
export function getCrisisResources(region: CrisisRegion): RegionalCrisisResources {
  return CRISIS_RESOURCES[region] || CRISIS_RESOURCES.EU;
}

/**
 * Get primary crisis contact for a region
 */
export function getPrimaryContact(region: CrisisRegion): CrisisResource {
  return getCrisisResources(region).primary;
}

// ===========================================
// HARD KEYWORDS (IMMEDIATE BLOCK)
// ===========================================

export const HARD_KEYWORDS_PL = [
  // Suicide - direct
  "samobójstwo",
  "samobójstwa",
  "samobójstwie",
  "zabić się",
  "zabiję się",
  "zabić siebie",
  "odebrać sobie życie",
  "odbiorę sobie życie",
  "skończyć z życiem",
  "skończę z życiem",
  "nie chcę żyć",
  "nie chce żyć",
  "chcę umrzeć",
  "chce umrzeć",
  "wolałbym nie żyć",
  "wolałabym nie żyć",
  "lepiej bez mnie",
  "świat bez mnie",
  "zmęczony życiem",
  "zmęczona życiem",
  // Methods
  "skok z balkonu",
  "skoczyć z balkonu",
  "skoczyć z mostu",
  "skoczyć z okna",
  "przedawkowanie",
  "przedawkować",
  "powiesić się",
  "powieszę się",
  "podciąć żyły",
  "pociąć żyły",
  "tabletki nasenne",
  // Self-harm
  "skrzywdzić się",
  "skrzywdzę się",
  "zrobić sobie krzywdę",
  "ciąć się",
  "tnę się",
  "kroić się",
  "kroję się",
  // Finality
  "skończyć z sobą",
  "nie ma sensu żyć",
  "wszystko skończone",
  "niech to się skończy",
  "niech to się kończy",
  "już nie mogę więcej",
  // Objects / methods (single words)
  "nóż",
  "tabletki",
  "powieszenie",
] as const;

export const HARD_KEYWORDS_EN = [
  // Suicide - direct
  "suicide",
  "suicidal",
  "kill myself",
  "kill me",
  "take my life",
  "end my life",
  "end it all",
  "ending it all",
  "want to die",
  "wanna die",
  "dont want to live",
  "don't want to live",
  "rather be dead",
  "better off dead",
  "wish i was dead",
  "wish i were dead",
  "want to disappear forever",
  "tired of living",
  "no point living",
  "cant go on",
  "can't go on",
  "done with life",
  // Methods
  "jump off",
  "overdose",
  "hang myself",
  "shoot myself",
  "slit my wrists",
  "take all my pills",
  "knife",
  "pills",
  "rope",
  "bridge",
  // Self-harm
  "hurt myself",
  "harm myself",
  "self harm",
  "self-harm",
  "cutting myself",
  "burn myself",
  // Finality
  "nobody would miss me",
  "world better without me",
  "everyone better without me",
] as const;

export const HARD_KEYWORDS = [...HARD_KEYWORDS_PL, ...HARD_KEYWORDS_EN] as const;

// ===========================================
// SOFT KEYWORDS (CONTEXTUAL ASSESSMENT)
// ===========================================

export const SOFT_KEYWORDS_PL = [
  // Emotional distress
  "beznadzieja",
  "beznadziejnie",
  "beznadziejne",
  "beznadziejność",
  "bezsens",
  "samotność",
  "samotny",
  "samotna",
  "cierpienie",
  "desperacja",
  "desperacki",
  "załamanie",
  "załamany",
  "załamana",
  "strach",
  "lęk",
  "panika",
  "pustka",
  "wewnętrzna pustka",
  "ból",
  "ciemność",
  "koniec",
  // Hopelessness
  "nie daje rady",
  "nie daję rady",
  "nie dam rady",
  "nie mam siły",
  "nie mam już siły",
  "przytłoczony",
  "przytłoczona",
  "bez sensu",
  "nie ma sensu",
  "nie widzę sensu",
  "po co to wszystko",
  "nie warto",
  // Burden
  "jestem ciężarem",
  "byłoby lepiej beze mnie",
  "nikomu na mnie nie zależy",
  "nikt mnie nie potrzebuje",
  // Emptiness
  "nic nie czuję",
  "czuję się martwy",
  "czuję się martwa",
  "pusty w środku",
  "pusta w środku",
  // Giving up
  "poddaję się",
  "już nie mogę",
  "nie wytrzymam",
  "za dużo",
  "zbyt ciężko",
  "dość tego",
  "mam dość wszystkiego",
  // Farewell signals
  "pożegnać się",
  "przepraszam za wszystko",
  "będzie wam lepiej",
] as const;

export const SOFT_KEYWORDS_EN = [
  // Emotional distress
  "hopeless",
  "feel hopeless",
  "hopelessness",
  "worthless",
  "feel worthless",
  "worthlessness",
  "alone",
  "so alone",
  "suffering",
  "lonely",
  "desperate",
  "desperation",
  "breakdown",
  "breaking down",
  "scared",
  "anxious",
  "anxiety",
  "panic",
  "depression",
  "empty",
  "empty inside",
  "pain",
  "darkness",
  "pointless",
  "too much",
  // Hopelessness
  "overwhelmed",
  "cant cope",
  "can't cope",
  "cannot cope",
  "falling apart",
  "no way out",
  "trapped",
  "no point",
  "whats the point",
  "what's the point",
  // Burden
  "burden to everyone",
  "everyone would be better without me",
  "no one cares",
  "nobody cares",
  "no one would notice",
  // Emptiness
  "numb",
  "feel nothing",
  "dead inside",
  // Giving up
  "giving up",
  "give up",
  "exhausted from life",
  "tired of life",
  "cant take it",
  "can't take it",
  "cant take it anymore",
  "can't take it anymore",
  // Farewell signals
  "goodbye everyone",
  "sorry for everything",
  "you'll be better off",
] as const;

export const SOFT_KEYWORDS = [...SOFT_KEYWORDS_PL, ...SOFT_KEYWORDS_EN] as const;

// ===========================================
// DETECTION CONFIG
// ===========================================

export const DEFAULT_CRISIS_CONFIG: CrisisDetectionConfig = {
  // Thresholds (unused in PASSIVE mode)
  claudeHighRiskThreshold: 0.7,
  claudeMediumRiskThreshold: 0.5,

  // Timeouts (unused in PASSIVE mode)
  claudeTimeoutMs: 5000,
  maxProcessingTimeMs: 500,

  // Behavior — PASSIVE (v5.0 ADR §2.3)
  enableClaudeAssessment: false,
  logIncidents: false,
  defaultRegion: "PL",
};

// ===========================================
// CRISIS MESSAGES
// ===========================================

export const CRISIS_MESSAGES = {
  PL: {
    high: "System wykrył treści wskazujące na sytuację kryzysową. Proszę skontaktować się z linią wsparcia.",
    medium: "Jeśli doświadczasz trudności, dostępne są zasoby wsparcia.",
    low: "Jeśli potrzebujesz rozmowy, dostępne są zasoby wsparcia.",
    modalTitle: "Ważna informacja",
    modalDescription:
      "PatternLens to narzędzie analizy strukturalnej i nie zapewnia interwencji kryzysowej. Jeśli potrzebujesz natychmiastowej pomocy, skontaktuj się z jedną z poniższych linii wsparcia.",
    showResources: "Pokaż Zasoby",
    returnToDashboard: "Powrót",
  },
  EN: {
    high: "Content indicating a crisis situation was detected. Please contact a support line.",
    medium: "If you are experiencing difficulties, support resources are available.",
    low: "If you need to talk, support resources are available.",
    modalTitle: "Important Notice",
    modalDescription:
      "PatternLens is a structural analysis tool and does not provide crisis intervention. If you need immediate assistance, please contact one of the support lines below.",
    showResources: "Show Resources",
    returnToDashboard: "Return",
  },
} as const;

export type CrisisMessageLanguage = keyof typeof CRISIS_MESSAGES;
