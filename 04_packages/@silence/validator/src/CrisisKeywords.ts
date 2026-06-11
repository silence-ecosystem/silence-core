/**
 * [PATH]: 04_packages/@silence/validator/src/CrisisKeywords.ts
 */
export const CRISIS_KEYWORDS = ['suicide', 'self-harm', 'kill myself', 'end it all', 'hurt others', 'emergency', 'overdose'];
export class CrisisValidator {
  static check(input: string): { isCrisis: boolean; detected: string[] } {
    const detected = CRISIS_KEYWORDS.filter(word => new RegExp(`\\b${word}\\b`, 'gi').test(input));
    return { isCrisis: detected.length > 0, detected };
  }
}
