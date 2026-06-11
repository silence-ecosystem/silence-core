/** S11 Language Compliance checker */
 * [PATH]: 04_packages/@silence/validator/src/LanguageCompliance.ts
export class LanguageCompliance {
  static sanitize(input: string) {
    return { output: input, violations: [] as string[] };
  }
}
