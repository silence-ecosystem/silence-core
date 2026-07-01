// ============================================
// src/lib/safety/index.ts
// PatternLens v5.0 - PASSIVE Safety Module
// Profile: INFORMED_ADULT_TOOL
// Never blocks, shows resources when relevant.
// ============================================

// === FROM DETECTOR.TS (PASSIVE) ===
export {
  SafetyDetector,
  safetyDetector,
  containsCrisisContent,
  shouldBlockSubmission,
  type CrisisDetectionResult,
  type RiskLevel,
} from "./detector";

// === FROM CRISIS-DETECTION.TS (PASSIVE) ===
export {
  CrisisDetectionSystem,
  crisisDetection,
  getCrisisResourcesByLocale,
  CRISIS_RESOURCES,
} from "./crisis-detection";

// === FROM EMERGENCY.TS (PASSIVE) ===
export {
  detectCrisis,
  getEmergencyResources,
  createEmergencyResponse,
  type EmergencyResponse,
} from "./emergency";

// === FROM HELPLINES.TS ===
export {
  getRegionalHelplines,
  getPrimaryHelpline,
  detectRegion,
  IASP_LINK,
  type RegionHelplines,
} from "./helplines";

// === FROM KEYWORDS.TS ===
export {
  HARD_CRISIS_KEYWORDS,
  SOFT_CRISIS_KEYWORDS,
  HELPLINES,
  type Helpline,
} from "./keywords";

// === FROM SHARED-SAFETY.TS (MIDDLEWARE) ===
export {
  normalizeInput,
  scanOutput,
  sanitizeOutput,
  detectLocalPatterns,
  checkRateLimit,
  createCircuitBreaker,
  FORBIDDEN_OUTPUT,
} from "./shared-safety";
