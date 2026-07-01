/**
 * Crisis Keywords Detection System
 * PatternLens v4.1 - Safety Layer
 * 
 * IMPORTANT: These keywords are used for user safety.
 * Handle with care and never expose to users.
 */

export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface KeywordMatch {
  keyword: string;
  category: 'hard' | 'soft' | 'contextual';
  weight: number;
}

// HARD KEYWORDS - Immediate intervention required
// These indicate acute crisis and trigger immediate modal
export const HARD_KEYWORDS_PL = [
  'chcę się zabić',
  'chce sie zabic',
  'samobójstwo',
  'samobojstwo',
  'popełnię samobójstwo',
  'popelnie samobojstwo',
  'skończę z tym',
  'skoncze z tym',
  'nie chcę żyć',
  'nie chce zyc',
  'odbiorę sobie życie',
  'odbiore sobie zycie',
  'wezmę tabletki',
  'wezme tabletki',
  'skoczę',
  'skocze',
  'powieszę się',
  'powiesze sie',
  'podetnę żyły',
  'podetne zyly',
] as const;

export const HARD_KEYWORDS_EN = [
  'kill myself',
  'want to die',
  'end my life',
  'suicide',
  'take my own life',
  'end it all',
  'better off dead',
  'no reason to live',
  'can\'t go on',
  'overdose',
  'jump off',
  'hang myself',
  'slit my wrists',
] as const;

// SOFT KEYWORDS - Elevated monitoring
// These may indicate distress but need context
export const SOFT_KEYWORDS_PL = [
  'nie mam siły',
  'nie daję rady',
  'nie dam rady',
  'chcę zniknąć',
  'chce zniknac',
  'nikt mnie nie rozumie',
  'jestem bezwartościowy',
  'jestem bezwartosciowy',
  'jestem bezwartościowa',
  'jestem bezwartosciowa',
  'nic nie ma sensu',
  'po co to wszystko',
  'nie wytrzymam',
  'mam dość',
  'mam dosc',
  'jestem sam',
  'jestem sama',
  'nikomu nie zależy',
  'nikomu nie zalezy',
  'nikt mi nie pomoże',
  'nikt mi nie pomoze',
] as const;

export const SOFT_KEYWORDS_EN = [
  'no strength',
  'can\'t cope',
  'want to disappear',
  'nobody understands',
  'worthless',
  'pointless',
  'what\'s the point',
  'can\'t take it',
  'had enough',
  'all alone',
  'nobody cares',
  'no one can help',
  'hopeless',
  'exhausted',
  'overwhelmed',
  'breaking down',
] as const;

// Combined exports
export const HARD_KEYWORDS = {
  pl: HARD_KEYWORDS_PL,
  en: HARD_KEYWORDS_EN,
} as const;

export const SOFT_KEYWORDS = {
  pl: SOFT_KEYWORDS_PL,
  en: SOFT_KEYWORDS_EN,
} as const;

/**
 * Check if text contains any hard keywords
 */
export function containsHardKeyword(text: string, locale: 'pl' | 'en' = 'pl'): KeywordMatch | null {
  const normalizedText = text.toLowerCase().trim();
  const keywords = HARD_KEYWORDS[locale];
  
  for (const keyword of keywords) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      return {
        keyword,
        category: 'hard',
        weight: 1.0,
      };
    }
  }
  return null;
}

/**
 * Check if text contains any soft keywords
 */
export function containsSoftKeyword(text: string, locale: 'pl' | 'en' = 'pl'): KeywordMatch | null {
  const normalizedText = text.toLowerCase().trim();
  const keywords = SOFT_KEYWORDS[locale];
  
  for (const keyword of keywords) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      return {
        keyword,
        category: 'soft',
        weight: 0.5,
      };
    }
  }
  return null;
}

/**
 * Calculate risk level based on keyword matches
 */
export function calculateRiskLevel(text: string, locale: 'pl' | 'en' = 'pl'): RiskLevel {
  const hardMatch = containsHardKeyword(text, locale);
  if (hardMatch) {
    return 'critical';
  }
  
  const softMatch = containsSoftKeyword(text, locale);
  if (softMatch) {
    return 'medium';
  }
  
  return 'none';
}

export default {
  HARD_KEYWORDS,
  SOFT_KEYWORDS,
  containsHardKeyword,
  containsSoftKeyword,
  calculateRiskLevel,
};
