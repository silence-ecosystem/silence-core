'use client';

import { useState, useCallback } from 'react';
import { 
  detectCrisisKeywords, 
  getResourcesForLocale,
  type DetectionResult,
  type RegionalResources 
} from '@/lib/constants/crisis-keywords';

export type RiskLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'BLOCKED';

export interface CrisisAssessment {
  riskLevel: RiskLevel;
  shouldBlock: boolean;
  shouldWarn: boolean;
  detectionLayer: 1 | 2 | 3 | null;
  resources: RegionalResources;
  aiRiskScore?: number;
}

interface UseCrisisDetectionOptions {
  locale?: string;
  onCrisisDetected?: (assessment: CrisisAssessment) => void;
}

/**
 * Hook for 3-tier crisis detection system
 * 
 * Layer 1: Hard keywords → Instant block
 * Layer 2: Soft keywords → Claude AI assessment
 * Layer 3: Claude semantic analysis → Risk scoring
 */
export function useCrisisDetection(options: UseCrisisDetectionOptions = {}) {
  const { locale = 'pl', onCrisisDetected } = options;
  
  const [isAssessing, setIsAssessing] = useState(false);
  const [lastAssessment, setLastAssessment] = useState<CrisisAssessment | null>(null);
  
  const resources = getResourcesForLocale(locale);

  /**
   * Assess text for crisis indicators
   * Returns assessment with risk level and recommended action
   */
  const assessText = useCallback(async (text: string): Promise<CrisisAssessment> => {
    setIsAssessing(true);
    
    try {
      // Step 1: Local keyword detection (Layer 1 & 2)
      const detection: DetectionResult = detectCrisisKeywords(text);
      
      // Layer 1: Hard keywords - instant block
      if (detection.layer === 1) {
        const assessment: CrisisAssessment = {
          riskLevel: 'BLOCKED',
          shouldBlock: true,
          shouldWarn: false,
          detectionLayer: 1,
          resources,
        };
        
        setLastAssessment(assessment);
        onCrisisDetected?.(assessment);
        
        // Log anonymously (no user data, no text)
        await logCrisisIncident('HARD_KEYWORD', 1.0, 1, locale, text.length);
        
        return assessment;
      }
      
      // Layer 2: Soft keywords - trigger AI assessment
      if (detection.layer === 2) {
        // Call Claude API for risk scoring
        const aiScore = await getAIRiskScore(text);
        
        let riskLevel: RiskLevel;
        let shouldBlock = false;
        let shouldWarn = false;
        
        if (aiScore >= 0.7) {
          riskLevel = 'HIGH';
          shouldBlock = true;
        } else if (aiScore >= 0.5) {
          riskLevel = 'MEDIUM';
          shouldWarn = true;
        } else if (aiScore >= 0.3) {
          riskLevel = 'LOW';
          shouldWarn = true;
        } else {
          riskLevel = 'NONE';
        }
        
        const assessment: CrisisAssessment = {
          riskLevel,
          shouldBlock,
          shouldWarn,
          detectionLayer: 2,
          resources,
          aiRiskScore: aiScore,
        };
        
        setLastAssessment(assessment);
        if (shouldBlock || shouldWarn) {
          onCrisisDetected?.(assessment);
        }
        
        // Log anonymously
        await logCrisisIncident('SOFT_KEYWORD', aiScore, 2, locale, text.length);
        
        return assessment;
      }
      
      // No keywords detected - return safe
      const assessment: CrisisAssessment = {
        riskLevel: 'NONE',
        shouldBlock: false,
        shouldWarn: false,
        detectionLayer: null,
        resources,
      };
      
      setLastAssessment(assessment);
      return assessment;
      
    } finally {
      setIsAssessing(false);
    }
  }, [locale, resources, onCrisisDetected]);
  
  /**
   * Quick check without AI assessment
   * Use for real-time typing feedback
   */
  const quickCheck = useCallback((text: string): DetectionResult => {
    return detectCrisisKeywords(text);
  }, []);
  
  return {
    assessText,
    quickCheck,
    isAssessing,
    lastAssessment,
    resources,
  };
}

// ============================================
// PRIVATE HELPERS
// ============================================

async function getAIRiskScore(text: string): Promise<number> {
  try {
    const response = await fetch('/api/safety/assess-risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      console.error('AI risk assessment failed, defaulting to 0.5');
      return 0.5;
    }
    
    const data = await response.json();
    return data.riskScore ?? 0.5;
  } catch (error) {
    console.error('AI risk assessment error:', error);
    return 0.5; // Default to medium risk on error
  }
}

async function logCrisisIncident(
  type: string,
  score: number,
  layer: number,
  locale: string,
  inputLength: number
): Promise<void> {
  try {
    // Fire and forget - don't block user flow
    fetch('/api/safety/log-incident', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        incidentType: type,
        riskScore: score,
        detectionLayer: layer,
        locale,
        inputLength,
      }),
    }).catch(() => {
      // Silently fail - logging should never block user
    });
  } catch {
    // Silently fail
  }
}
