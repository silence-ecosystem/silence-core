// src/lib/safety/helplines.ts
// Regional crisis helplines for PatternLens

export interface Helpline {
  name: string;
  phone: string;
  description: string;
  hours: string;
  url?: string;
  sms?: string;
}

export interface RegionHelplines {
  region: string;
  regionCode: string;
  flag: string;
  primary: Helpline;
  secondary?: Helpline;
  emergency: string;
}

export const HELPLINES: Record<string, RegionHelplines> = {
  US: {
    region: 'United States',
    regionCode: 'US',
    flag: '🇺🇸',
    primary: {
      name: '988 Suicide & Crisis Lifeline',
      phone: '988',
      description: 'Free, confidential support for people in distress',
      hours: '24/7',
      url: 'https://988lifeline.org',
    },
    secondary: {
      name: 'Crisis Text Line',
      phone: '741741',
      description: 'Text HOME to 741741',
      hours: '24/7',
      sms: 'HOME',
      url: 'https://www.crisistextline.org',
    },
    emergency: '911',
  },
  
  UK: {
    region: 'United Kingdom',
    regionCode: 'UK',
    flag: '🇬🇧',
    primary: {
      name: 'Samaritans',
      phone: '116 123',
      description: 'Free emotional support for anyone in distress',
      hours: '24/7',
      url: 'https://www.samaritans.org',
    },
    secondary: {
      name: 'Shout',
      phone: '85258',
      description: 'Text SHOUT to 85258',
      hours: '24/7',
      sms: 'SHOUT',
      url: 'https://giveusashout.org',
    },
    emergency: '999',
  },
  
  PL: {
    region: 'Polska',
    regionCode: 'PL',
    flag: '🇵🇱',
    primary: {
      name: 'Telefon Zaufania dla Dorosłych',
      phone: '116 123',
      description: 'Bezpłatna pomoc emocjonalna',
      hours: '24/7',
      url: 'https://116123.pl',
    },
    secondary: {
      name: 'Centrum Wsparcia',
      phone: '800 70 2222',
      description: 'Bezpłatna linia wsparcia psychologicznego',
      hours: '14:00-22:00',
    },
    emergency: '112',
  },
};

export const DEFAULT_REGION = 'US';

/**
 * Get helplines for a specific region
 */
export function getHelplines(regionCode: string): RegionHelplines {
  return HELPLINES[regionCode.toUpperCase()] || HELPLINES[DEFAULT_REGION];
}

/**
 * Get all available regions
 */
export function getAllRegions(): RegionHelplines[] {
  return Object.values(HELPLINES);
}

/**
 * Try to detect region from browser locale
 */
export function detectRegionFromLocale(locale?: string): string {
  if (!locale) {
    if (typeof navigator !== 'undefined') {
      locale = navigator.language;
    }
  }
  
  if (!locale) return DEFAULT_REGION;
  
  const localeUpper = locale.toUpperCase();
  
  if (localeUpper.includes('PL')) return 'PL';
  if (localeUpper.includes('GB') || localeUpper.includes('UK')) return 'UK';
  if (localeUpper.includes('US') || localeUpper.includes('EN')) return 'US';
  
  return DEFAULT_REGION;
}
