// ============================================
// src/lib/safety/emergency.ts
// PatternLens v5.0 - PASSIVE Safety: Resource Display
// Never blocks, never logs, shows resources when relevant.
// ============================================

import { HARD_CRISIS_KEYWORDS, HELPLINES, type Helpline } from "./keywords";

export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface EmergencyResponse {
  isEmergency: boolean;
  /** PASSIVE mode: always false */
  shouldBlock: false;
  riskLevel: RiskLevel;
  detectedKeywords: string[];
  resources: Helpline[];
  showResources: boolean;
  message: string;
}

/**
 * PASSIVE crisis detection — hard keyword match only.
 * Shows resources inline, never blocks input.
 */
export function detectCrisis(text: string): EmergencyResponse {
  const lowerText = text.toLowerCase();
  const detectedHard: string[] = [];

  for (const keyword of HARD_CRISIS_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      detectedHard.push(keyword);
    }
  }

  if (detectedHard.length > 0) {
    return {
      isEmergency: true,
      shouldBlock: false,
      riskLevel: 'critical',
      detectedKeywords: detectedHard,
      resources: HELPLINES,
      showResources: true,
      message: 'Jeśli potrzebujesz pomocy, poniżej znajdziesz numery wsparcia.',
    };
  }

  return {
    isEmergency: false,
    shouldBlock: false,
    riskLevel: 'none',
    detectedKeywords: [],
    resources: [],
    showResources: false,
    message: '',
  };
}

/**
 * Get emergency resources for static display (footer, /help, /about)
 */
export function getEmergencyResources(): Helpline[] {
  return HELPLINES;
}

/**
 * Create standardized emergency response
 */
export function createEmergencyResponse(showResources: boolean = false): EmergencyResponse {
  return {
    isEmergency: showResources,
    shouldBlock: false,
    riskLevel: showResources ? 'critical' : 'none',
    detectedKeywords: [],
    resources: showResources ? HELPLINES : [],
    showResources,
    message: showResources
      ? 'Jeśli potrzebujesz pomocy, poniżej znajdziesz numery wsparcia.'
      : '',
  };
}

export default { detectCrisis, getEmergencyResources, createEmergencyResponse };
