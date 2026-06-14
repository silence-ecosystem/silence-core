/**
 * [PATH]: 04_packages/@silence/language/src/index.ts
 *
 * @silence/language
 * Deterministic, read-only provider of the S11 Language Standard vocabulary.
 * Re-exports the canonical terminology contract from @silence/types.
 */

import { getAllForbiddenTerms } from '@silence/types';

export {
  FORBIDDEN_CLASSES,
  ALLOWED_ALTERNATIVES,
  ALLOWED_VOCABULARY,
  getAllForbiddenTerms,
} from '@silence/types';

export type {
  S11TermClass,
  ForbiddenTerm,
  AllowedAlternative,
} from '@silence/types';

/**
 * Deterministically checks whether a term is present in the canonical
 * S11 forbidden vocabulary. Case-sensitive, whitespace-sensitive.
 */
export function isForbiddenTerm(term: string): boolean {
  return getAllForbiddenTerms().some((forbidden) => forbidden.term === term);
}
