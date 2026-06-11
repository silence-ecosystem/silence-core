/**
 * [PATH]: 04_packages/@silence/narrative-engine/src/PatternObserver.ts
 * PatternObserver – monitoruje powtarzalność wzorców strukturalnych.
 * Cel: Wykrywanie "Ghost Patterns" (recydywa 3x w oknie czasowym).
 */
export interface PatternOccurrence {
  patternId: string;
  timestamp: string;
}

export class PatternObserver {
  private static THRESHOLD = 3;
  private static LOOKBACK_DAYS = 7;

  static checkGhostPattern(history: PatternOccurrence[], newPatternId: string): boolean {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - (this.LOOKBACK_DAYS * 24 * 60 * 60 * 1000));

    const recentOccurrences = history.filter(occ => 
      occ.patternId === newPatternId && 
      new Date(occ.timestamp) > weekAgo
    );

    // Jeśli to trzecie wystąpienie (lub więcej), aktywujemy Ghost Alert
    return recentOccurrences.length >= (this.THRESHOLD - 1);
  }

  static getNotificationPayload(patternId: string): { title: string; body: string } {
    const templates: Record<string, any> = {
      'asymmetric-initiation': {
        title: "Ghost Pattern: Relational Asymmetry",
        body: "To trzecia interakcja w tym tygodniu o wysokiej asymetrii inicjatywy. Sprawdź raport kognitywny."
      },
      'delayed-response-pattern': {
        title: "Ghost Pattern: Latency Drift",
        body: "Wykryto powtarzający się wzorzec opóźnionej odpowiedzi. Twoja spójność kognitywna może na tym ucierpieć."
      },
      'default': {
        title: "Pattern Recurrence Detected",
        body: "Strukturalny wzorzec powtórzył się 3 razy w ciągu ostatnich 7 dni."
      }
    };
    return templates[patternId] || templates['default'];
  }
}
