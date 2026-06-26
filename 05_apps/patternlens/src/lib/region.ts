// ===========================================
// SILENCE.OBJECTS - Region Detection & Helplines
// ===========================================

export interface Helpline {
  number: string;
  name: string;
  available: string;
  isPrimary?: boolean;
}

export interface RegionHelplines {
  region: string;
  helplines: Helpline[];
  emergencyNumber: string;
}

// Regional helplines database
const REGIONAL_HELPLINES: Record<string, RegionHelplines> = {
  US: {
    region: "United States",
    emergencyNumber: "911",
    helplines: [
      { number: "988", name: "Suicide & Crisis Lifeline", available: "24/7", isPrimary: true },
      { number: "741741", name: "Crisis Text Line (text HOME)", available: "24/7" },
    ],
  },
  GB: {
    region: "United Kingdom",
    emergencyNumber: "999",
    helplines: [
      { number: "116 123", name: "Samaritans", available: "24/7", isPrimary: true },
      { number: "0800 689 5652", name: "SANEline", available: "16:00-23:00" },
    ],
  },
  PL: {
    region: "Polska",
    emergencyNumber: "112",
    helplines: [
      { number: "116 123", name: "Telefon Zaufania dla Dorosłych", available: "24/7", isPrimary: true },
      { number: "116 111", name: "Telefon Zaufania dla Dzieci i Młodzieży", available: "24/7" },
    ],
  },
  DE: {
    region: "Deutschland",
    emergencyNumber: "112",
    helplines: [
      { number: "0800 111 0 111", name: "Telefonseelsorge", available: "24/7", isPrimary: true },
      { number: "0800 111 0 222", name: "Telefonseelsorge (alternativ)", available: "24/7" },
    ],
  },
  FR: {
    region: "France",
    emergencyNumber: "112",
    helplines: [
      { number: "3114", name: "Numéro national de prévention du suicide", available: "24/7", isPrimary: true },
    ],
  },
  DEFAULT: {
    region: "International",
    emergencyNumber: "112",
    helplines: [
      { number: "112", name: "Emergency Services", available: "24/7", isPrimary: true },
    ],
  },
};

// IASP (International Association for Suicide Prevention) link
export const IASP_LINK = "https://www.iasp.info/resources/Crisis_Centres/";

/**
 * Detect user region from navigator.language
 */
export function detectRegion(): string {
  if (typeof window === "undefined") return "DEFAULT";

  const lang = navigator.language || "en-US";

  // Extract country code from locale (e.g., "en-US" -> "US", "pl-PL" -> "PL")
  const parts = lang.split("-");
  const countryCode = parts.length > 1 ? parts[1].toUpperCase() : null;

  // Also check language code for some regions
  const langCode = parts[0].toLowerCase();

  // Priority: explicit country code > language inference
  if (countryCode && REGIONAL_HELPLINES[countryCode]) {
    return countryCode;
  }

  // Fallback: infer from language
  const langToCountry: Record<string, string> = {
    en: "US", // Default English to US
    pl: "PL",
    de: "DE",
    fr: "FR",
  };

  if (langToCountry[langCode] && REGIONAL_HELPLINES[langToCountry[langCode]]) {
    return langToCountry[langCode];
  }

  return "DEFAULT";
}

/**
 * Get helplines for detected or specified region
 */
export function getRegionalHelplines(region?: string): RegionHelplines {
  const detectedRegion = region || detectRegion();
  return REGIONAL_HELPLINES[detectedRegion] || REGIONAL_HELPLINES.DEFAULT;
}

/**
 * Get primary helpline number for quick call
 */
export function getPrimaryHelpline(region?: string): Helpline {
  const helplines = getRegionalHelplines(region);
  return helplines.helplines.find((h) => h.isPrimary) || helplines.helplines[0];
}
