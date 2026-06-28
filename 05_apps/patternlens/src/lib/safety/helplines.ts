// ===========================================
// SILENCE.OBJECTS - Crisis Helplines Database
// ===========================================
// Regional crisis resources for US, UK, PL

export interface Helpline {
  number: string;
  name: string;
  available: string;
  isPrimary?: boolean;
  textLine?: string;
}

export interface RegionHelplines {
  region: string;
  regionCode: string;
  emergencyNumber: string;
  helplines: Helpline[];
}

// IASP (International Association for Suicide Prevention) link
export const IASP_LINK = "https://www.iasp.info/resources/Crisis_Centres/";

export const HELPLINES: Record<string, RegionHelplines> = {
  US: {
    region: "United States",
    regionCode: "US",
    emergencyNumber: "911",
    helplines: [
      {
        number: "988",
        name: "Suicide & Crisis Lifeline",
        available: "24/7",
        isPrimary: true,
        textLine: "Text HOME to 741741",
      },
      {
        number: "741741",
        name: "Crisis Text Line",
        available: "24/7",
      },
      {
        number: "1-800-273-8255",
        name: "National Suicide Prevention",
        available: "24/7",
      },
    ],
  },
  GB: {
    region: "United Kingdom",
    regionCode: "GB",
    emergencyNumber: "999",
    helplines: [
      {
        number: "116 123",
        name: "Samaritans",
        available: "24/7",
        isPrimary: true,
      },
      {
        number: "0800 689 5652",
        name: "SANEline",
        available: "16:00-23:00",
      },
      {
        number: "0800 068 4141",
        name: "Papyrus HOPELINEUK",
        available: "09:00-midnight",
      },
    ],
  },
  PL: {
    region: "Polska",
    regionCode: "PL",
    emergencyNumber: "112",
    helplines: [
      {
        number: "116 123",
        name: "Telefon Zaufania dla Dorosłych",
        available: "24/7",
        isPrimary: true,
      },
      {
        number: "116 111",
        name: "Telefon Zaufania dla Dzieci i Młodzieży",
        available: "24/7",
      },
      {
        number: "800 70 2222",
        name: "Centrum Wsparcia dla osób dorosłych w kryzysie psychicznym",
        available: "14:00-22:00",
      },
    ],
  },
  DEFAULT: {
    region: "International",
    regionCode: "INT",
    emergencyNumber: "112",
    helplines: [
      {
        number: "112",
        name: "Emergency Services",
        available: "24/7",
        isPrimary: true,
      },
    ],
  },
};

/**
 * Detect user region from navigator.language
 */
export function detectRegion(): string {
  if (typeof window === "undefined") return "DEFAULT";

  const lang = navigator.language || "en-US";
  const parts = lang.split("-");
  const countryCode = parts.length > 1 ? parts[1].toUpperCase() : null;
  const langCode = parts[0].toLowerCase();

  // Priority: explicit country code > language inference
  if (countryCode && HELPLINES[countryCode]) {
    return countryCode;
  }

  // Fallback: infer from language
  const langToCountry: Record<string, string> = {
    en: "US",
    pl: "PL",
  };

  if (langToCountry[langCode] && HELPLINES[langToCountry[langCode]]) {
    return langToCountry[langCode];
  }

  return "DEFAULT";
}

/**
 * Get helplines for detected or specified region
 */
export function getRegionalHelplines(region?: string): RegionHelplines {
  const detectedRegion = region || detectRegion();
  return HELPLINES[detectedRegion] || HELPLINES.DEFAULT;
}

/**
 * Get primary helpline number for quick call
 */
export function getPrimaryHelpline(region?: string): Helpline {
  const helplines = getRegionalHelplines(region);
  return helplines.helplines.find((h) => h.isPrimary) || helplines.helplines[0];
}
