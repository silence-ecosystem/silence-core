/**
 * [PATH]: 04_packages/@silence/language/src/__tests__/language.test.ts
 *
 * Deterministic tests for @silence/language.
 */

import { describe, it, expect } from 'vitest';
import {
  FORBIDDEN_CLASSES,
  ALLOWED_ALTERNATIVES,
  ALLOWED_VOCABULARY,
  getAllForbiddenTerms,
  isForbiddenTerm,
} from '../index.js';

describe('@silence/language', () => {
  it('exports forbidden classes from canonical S11 source', () => {
    expect(FORBIDDEN_CLASSES.DIAGNOSTIC).toContain('bipolar');
    expect(FORBIDDEN_CLASSES.MYSTICAL_SPIRITUAL).toContain('spiritual');
  });

  it('exports allowed alternatives', () => {
    expect(ALLOWED_ALTERNATIVES.DIAGNOSTIC).toContain('pattern signature');
  });

  it('exports allowed vocabulary', () => {
    expect(ALLOWED_VOCABULARY).toContain('attention profile');
  });

  it('getAllForbiddenTerms is deterministic and returns all terms', () => {
    const first = getAllForbiddenTerms();
    const second = getAllForbiddenTerms();
    expect(first).toStrictEqual(second);
    expect(first.length).toBeGreaterThan(0);
    expect(first.every((t) => t.severity === 'MUST_NOT')).toBe(true);
  });

  it('isForbiddenTerm detects canonical forbidden terms', () => {
    expect(isForbiddenTerm('bipolar')).toBe(true);
    expect(isForbiddenTerm('spiritual')).toBe(true);
  });

  it('isForbiddenTerm does not flag allowed terms', () => {
    expect(isForbiddenTerm('attention profile')).toBe(false);
    expect(isForbiddenTerm('pattern signature')).toBe(false);
  });
});
