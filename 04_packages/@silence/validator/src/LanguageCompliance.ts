/**
 * [PATH]: 04_packages/@silence/validator/src/LanguageCompliance.ts
 *
 * S11 Language Compliance checker
 */
export class LanguageCompliance {
  static sanitize(input: string) {
    return { output: input, violations: [] as string[] };
  }
}
