// ============================================
// src/lib/safety/hooks.ts
// PatternLens v5.0 - PASSIVE Safety Hook
// Profile: INFORMED_ADULT_TOOL
// Shows inline resource banner, never blocks input.
// No modal. No logging. No Claude assessment.
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { HARD_CRISIS_KEYWORDS } from './keywords';

export interface CrisisResource {
  id: string;
  name: string;
  phone: string;
  description: string;
}

export interface SafetyState {
  isChecking: boolean;
  /** PASSIVE: inline banner, never modal */
  showResourceBanner: boolean;
  detectedKeywords: string[];
  crisisResources: CrisisResource[];
}

export interface SafetyCheckResult {
  /** PASSIVE: always true — input is never blocked */
  safe: true;
  showResources: boolean;
  keywords: string[];
  resources: CrisisResource[];
}

const DEFAULT_RESOURCES: CrisisResource[] = [
  {
    id: 'telefon-zaufania',
    name: 'Telefon Zaufania dla Dzieci i Młodzieży',
    phone: '116 111',
    description: 'Bezpłatna, anonimowa pomoc 24/7',
  },
  {
    id: 'centrum-wsparcia',
    name: 'Centrum Wsparcia dla osób w kryzysie',
    phone: '800 70 2222',
    description: 'Bezpłatna pomoc 24/7',
  },
  {
    id: 'telefon-nadziei',
    name: 'Telefon Zaufania dla Dorosłych',
    phone: '116 123',
    description: 'Wsparcie 24/7',
  },
  {
    id: 'emergency',
    name: 'Numer alarmowy',
    phone: '112',
    description: 'Służby ratunkowe',
  },
];

/**
 * PASSIVE safety hook — shows inline resource banner when hard keywords detected.
 * Never blocks input. No modal. No logging. No Claude risk assessment.
 */
export function useCrisisSafety() {
  const [safetyState, setSafetyState] = useState<SafetyState>({
    isChecking: false,
    showResourceBanner: false,
    detectedKeywords: [],
    crisisResources: DEFAULT_RESOURCES,
  });

  const checkSafety = useCallback((text: string): SafetyCheckResult => {
    const lowerText = text.toLowerCase();

    const hardMatches = HARD_CRISIS_KEYWORDS.filter(keyword =>
      lowerText.includes(keyword.toLowerCase())
    );

    if (hardMatches.length > 0) {
      setSafetyState({
        isChecking: false,
        showResourceBanner: true,
        crisisResources: DEFAULT_RESOURCES,
        detectedKeywords: hardMatches,
      });

      return {
        safe: true,
        showResources: true,
        keywords: hardMatches,
        resources: DEFAULT_RESOURCES,
      };
    }

    setSafetyState({
      isChecking: false,
      showResourceBanner: false,
      crisisResources: [],
      detectedKeywords: [],
    });

    return {
      safe: true,
      showResources: false,
      keywords: [],
      resources: [],
    };
  }, []);

  const dismissBanner = useCallback(() => {
    setSafetyState(prev => ({
      ...prev,
      showResourceBanner: false,
    }));
  }, []);

  const resetSafety = useCallback(() => {
    setSafetyState({
      isChecking: false,
      showResourceBanner: false,
      crisisResources: [],
      detectedKeywords: [],
    });
  }, []);

  return {
    safetyState,
    checkSafety,
    dismissBanner,
    resetSafety,
    /** PASSIVE: always false */
    isBlocked: false as const,
  };
}

export default useCrisisSafety;
