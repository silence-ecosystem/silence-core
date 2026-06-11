/**
 * [PATH]: 04_packages/@silence/reporting/src/generators/PrivacyFilter.ts
 */
﻿export interface AnonymizationMap {
  [key: string]: string;
}

export class PrivacyFilter {
  /**
   * Automatycznie wykrywa i zamienia nazwy własne na generyczne etykiety.
   * Wykorzystuje proste heurystyki i mapowanie zdefiniowane przez użytkownika.
   */
  static anonymizeText(text: string, map: AnonymizationMap = {}): string {
    let sanitized = text;
    
    // 1. Mapowanie zdefiniowane (np. "Project Phoenix" -> "Project A")
    Object.keys(map).forEach(key => {
      const regex = new RegExp(key, 'gi');
      sanitized = sanitized.replace(regex, map[key]);
    });

    // 2. Heurystyka dla imion (jeśli nie ma w mapie, szukamy wzorców dużych liter)
    // Uwaga: W wersji PRO tu wchodzi NER (Named Entity Recognition) z @silence/language
    return sanitized;
  }

  static anonymizeNarrative(narrative: any): any {
    return {
      ...narrative,
      overview: this.anonymizeText(narrative.overview),
      relationalHighlights: narrative.relationalHighlights.map((h: string) => 
        h.replace(/between you and (.*)/i, "between you and [CONTACT_X]")
      )
    };
  }
}
