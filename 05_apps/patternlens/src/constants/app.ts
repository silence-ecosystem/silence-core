// ===========================================
// SILENCE.OBJECTS - Application Constants
// ===========================================

// Tier limits
export const FREE_OBJECT_LIMIT = 7;
export const PRO_PRICE_PLN = 49;

// Recording limits
export const MAX_RECORDING_SECONDS = 300; // 5 minutes
export const MIN_RECORDING_SECONDS = 3;

// Text input limits
export const MIN_TEXT_LENGTH = 10;
export const MAX_TEXT_LENGTH = 5000;

// API
export const CLAUDE_MODEL = "claude-3-5-sonnet-20241022";

// Crisis resources (Poland)
export const CRISIS_RESOURCES = {
  primary: {
    name: "Telefon Zaufania dla Dorosłych w Kryzysie Emocjonalnym",
    number: "116 123",
    available: "24/7",
  },
  emergency: {
    name: "Numer alarmowy",
    number: "112",
    available: "24/7",
  },
} as const;

// Tiers
export const TIERS = {
  FREE: "FREE",
  PRO: "PRO",
} as const;

export type Tier = (typeof TIERS)[keyof typeof TIERS];

// Report phases
export const REPORT_PHASES = {
  CONTEXT: "context",
  TENSION: "tension",
  MEANING: "meaning",
  FUNCTION: "function",
} as const;

export type ReportPhase = (typeof REPORT_PHASES)[keyof typeof REPORT_PHASES];

// Risk levels for crisis detection
export const RISK_LEVELS = {
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
  NONE: "NONE",
} as const;

export type RiskLevel = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS];
