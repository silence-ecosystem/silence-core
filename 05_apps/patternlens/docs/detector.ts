// src/lib/safety/detector.ts
// Crisis detection engine for PatternLens

import { ALL_HARD_KEYWORDS, ALL_SOFT_KEYWORDS } from './keywords';

export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface DetectionResult {
  riskLevel: RiskLevel;
  shouldBlock: boolean;
  showResources: boolean;
  detectedKeywords: string[];
  hardKeywordsFound: string[];
  softKeywordsFound: string[];
  confidence: number;
  message: string;
}

/**
 * Normalize text for keyword matching
 * - lowercase
 * - remove diacritics optionally
 * - normalize whitespace
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics for matching
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if text contains any keywords from a list
 * Returns array of matched keywords
 */
function findKeywords(text: string, keywords: readonly string[]): string[] {
  const normalizedText = normalizeText(text);
  const originalLower = text.toLowerCase();
  
  const found: string[] = [];
  
  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);
    
    // Check both normalized and original (for proper Polish matching)
    if (
      normalizedText.includes(normalizedKeyword) ||
      originalLower.includes(keyword.toLowerCase())
    ) {
      found.push(keyword);
    }
  }
  
  return found;
}

/**
 * Calculate risk score based on detected keywords
 */
function calculateRiskScore(
  hardCount: number,
  softCount: number,
  textLength: number
): number {
  if (hardCount > 0) {
    return 1.0; // Max risk for hard keywords
  }
  
  if (softCount === 0) {
    return 0.0;
  }
  
  // Score based on soft keyword density
  const density = softCount / Math.max(textLength / 100, 1);
  const baseScore = Math.min(softCount * 0.15, 0.6);
  const densityBonus = Math.min(density * 0.2, 0.3);
  
  return Math.min(baseScore + densityBonus, 0.9);
}

/**
 * Determine risk level from score
 */
function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 0.9) return 'critical';
  if (score >= 0.7) return 'high';
  if (score >= 0.5) return 'medium';
  if (score >= 0.2) return 'low';
  return 'none';
}

/**
 * Main detection function
 * Analyzes text for crisis indicators
 */
export function detectCrisis(text: string): DetectionResult {
  if (!text || text.trim().length === 0) {
    return {
      riskLevel: 'none',
      shouldBlock: false,
      showResources: false,
      detectedKeywords: [],
      hardKeywordsFound: [],
      softKeywordsFound: [],
      confidence: 0,
      message: '',
    };
  }

  const hardKeywordsFound = findKeywords(text, ALL_HARD_KEYWORDS);
  const softKeywordsFound = findKeywords(text, ALL_SOFT_KEYWORDS);
  const allDetected = [...new Set([...hardKeywordsFound, ...softKeywordsFound])];
  
  const riskScore = calculateRiskScore(
    hardKeywordsFound.length,
    softKeywordsFound.length,
    text.length
  );
  
  const riskLevel = scoreToRiskLevel(riskScore);
  
  // Determine actions based on risk level
  let shouldBlock = false;
  let showResources = false;
  let message = '';
  
  if (hardKeywordsFound.length > 0 || riskLevel === 'critical') {
    shouldBlock = true;
    showResources = true;
    message = 'System detected keywords indicating safety concern. If you need immediate assistance, please access crisis resources.';
  } else if (riskLevel === 'high') {
    shouldBlock = true;
    showResources = true;
    message = 'Your input suggests you may be going through a difficult time. Crisis resources are available if needed.';
  } else if (riskLevel === 'medium') {
    shouldBlock = false;
    showResources = true;
    message = 'If you are experiencing distress, crisis resources are available.';
  } else if (riskLevel === 'low') {
    shouldBlock = false;
    showResources = false;
    message = '';
  }
  
  return {
    riskLevel,
    shouldBlock,
    showResources,
    detectedKeywords: allDetected,
    hardKeywordsFound,
    softKeywordsFound,
    confidence: riskScore,
    message,
  };
}

/**
 * Quick check - returns true if text should be blocked
 * Use for fast pre-validation before API calls
 */
export function shouldBlockInput(text: string): boolean {
  const result = detectCrisis(text);
  return result.shouldBlock;
}

/**
 * Check if any hard keywords are present
 * Fastest check for critical content
 */
export function hasHardKeywords(text: string): boolean {
  return findKeywords(text, ALL_HARD_KEYWORDS).length > 0;
}

/**
 * Get appropriate crisis resources based on detected language
 */
export function detectLanguage(text: string): 'en' | 'pl' | 'unknown' {
  const polishIndicators = [
    'ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż',
    ' się ', ' nie ', ' jest ', ' tak ', ' jak ',
    ' to ', ' że ', ' na ', ' do ', ' w ',
  ];
  
  const textLower = text.toLowerCase();
  let polishScore = 0;
  
  for (const indicator of polishIndicators) {
    if (textLower.includes(indicator)) {
      polishScore++;
    }
  }
  
  if (polishScore >= 2) return 'pl';
  if (text.match(/[a-zA-Z]/)) return 'en';
  return 'unknown';
}
