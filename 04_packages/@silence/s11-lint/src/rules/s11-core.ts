/**
 * [PATH]: 04_packages/@silence/s11-lint/src/rules/s11-core.ts
 */

import {
  getAllForbiddenTerms,
  FORBIDDEN_CLASSES,
  ALLOWED_ALTERNATIVES,
  type S11TermClass,
} from '@silence/types';
import type { S11Violation } from '../types/config.js';

const ALL_TERMS = getAllForbiddenTerms();

export function buildRegexForTerm(term: string): RegExp {
  // Escape regex special characters in term
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'gi');
}

export function scanLine(
  line: string,
  lineIndex: number,
  relativePath: string
): readonly S11Violation[] {
  const violations: S11Violation[] = [];

  for (const entry of ALL_TERMS) {
    const regex = buildRegexForTerm(entry.term);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      violations.push({
        file: relativePath,
        line: lineIndex + 1,
        column: match.index + 1,
        term: entry.term,
        class: entry.class,
        context: line.trim(),
        severity: 'MUST_NOT',
      });
    }
  }

  return violations;
}

export function getSummaryByClass(
  violations: readonly S11Violation[]
): ReadonlyMap<S11TermClass, number> {
  const map = new Map<S11TermClass, number>();
  for (const v of violations) {
    map.set(v.class as S11TermClass, (map.get(v.class as S11TermClass) || 0) + 1);
  }
  return map;
}

export function getAllowedAlternativesForClass(cls: S11TermClass): readonly string[] {
  return ALLOWED_ALTERNATIVES[cls];
}

export { ALL_TERMS, FORBIDDEN_CLASSES };
