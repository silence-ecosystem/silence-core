// ===========================================
// SILENCE.OBJECTS - Crisis Detection Keywords
// ===========================================
// Two-tier system: HARD (immediate crisis) / SOFT (requires context)

export const CRISIS_KEYWORDS = {
  // HARD: Immediate risk - triggers crisis modal directly
  HARD: [
    // Suicide-related
    "samobójstwo",
    "samobójstwa",
    "samobójstwie",
    "zabić się",
    "zabiję się",
    "zabić siebie",
    "odebrać sobie życie",
    "odbiorę sobie życie",
    "skończyć z życiem",
    "skończę z życiem",
    "nie chcę żyć",
    "nie chce żyć",
    "chcę umrzeć",
    "chce umrzeć",
    "wolałbym nie żyć",
    "wolałabym nie żyć",
    // Self-harm
    "skrzywdzić się",
    "skrzywdzę się",
    "ciąć się",
    "tnę się",
    "kroić się",
    "kroję się",
    "pociąć żyły",
    "podciąć żyły",
    // Methods
    "tabletki nasenne",
    "przedawkować",
    "przedawkowanie",
    "skoczyć z mostu",
    "skoczyć z okna",
    "powiesić się",
    "powieszę się",
  ],

  // SOFT: Requires Claude analysis for context
  SOFT: [
    // Hopelessness
    "beznadziejne",
    "beznadziejność",
    "bez sensu",
    "nie ma sensu",
    "nie widzę sensu",
    "po co to wszystko",
    "nie warto",
    // Burden
    "jestem ciężarem",
    "byłoby lepiej beze mnie",
    "nikomu na mnie nie zależy",
    "nikt mnie nie potrzebuje",
    // Emptiness
    "pustka",
    "wewnętrzna pustka",
    "nic nie czuję",
    "czuję się martwy",
    "czuję się martwa",
    // Giving up
    "poddaję się",
    "nie dam rady",
    "nie daję rady",
    "już nie mogę",
    "dość tego",
    "mam dość wszystkiego",
    // Farewell signals
    "pożegnać się",
    "przepraszam za wszystko",
    "będzie wam lepiej",
  ],
} as const;

// Helper function to check for keywords
export function detectCrisisKeywords(text: string): {
  hasHardKeyword: boolean;
  hasSoftKeyword: boolean;
  detectedKeywords: string[];
} {
  const normalizedText = text.toLowerCase();
  const detectedKeywords: string[] = [];

  let hasHardKeyword = false;
  let hasSoftKeyword = false;

  for (const keyword of CRISIS_KEYWORDS.HARD) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      hasHardKeyword = true;
      detectedKeywords.push(keyword);
    }
  }

  for (const keyword of CRISIS_KEYWORDS.SOFT) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      hasSoftKeyword = true;
      detectedKeywords.push(keyword);
    }
  }

  return { hasHardKeyword, hasSoftKeyword, detectedKeywords };
}
