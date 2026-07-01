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

/**
 * Contextual allowlist for terms that are forbidden in descriptive prose
 * but occur as unavoidable API/syntax tokens in JSX, HTML, CSS, Tailwind,
 * or TypeScript type declarations.
 */
const CONTEXTUAL_ALLOWLISTS: Readonly<
  Record<string, ReadonlyArray<{ pattern: RegExp; reason: string }>>
> = {
  disabled: [
    { pattern: /\baria-disabled\b/gi, reason: 'ARIA accessibility attribute' },
    {
      pattern: /\bdisabled\s*=\s*\{[^}]*\}/gi,
      reason: 'JSX boolean attribute expression',
    },
    {
      pattern: /\bdisabled\s*=\s*(?:"[^"]*"|'[^']*'|true|false)/gi,
      reason: 'JSX/HTML boolean attribute',
    },
    { pattern: /\bdisabled[\s>]/gi, reason: 'HTML attribute shorthand' },
    {
      pattern: /\bdisabled\?\s*:/gi,
      reason: 'TypeScript prop type declaration',
    },
    {
      pattern: /\bdisabled\s*:\s*["#]/gi,
      reason: 'design token or style map key',
    },
    {
      pattern: /\{[^}]*\bdisabled\b\s*,[^}]*\}/gi,
      reason: 'React prop destructuring',
    },
    {
      pattern: /function\s*\([^)]*\bdisabled\b\s*[),]/gi,
      reason: 'function parameter destructuring',
    },
    {
      pattern: /&?:disabled\b/gi,
      reason: 'CSS pseudo-class',
    },
    {
      pattern: /\.\bdisabled\b\s*\{/gi,
      reason: 'CSS class selector',
    },
    {
      pattern: /className="[^"]*\bdisabled\b[^"]*"/gi,
      reason: 'Tailwind/CSS class attribute',
    },
    {
      pattern: /\bdisabled:[a-z0-9_-]+/gi,
      reason: 'Tailwind disabled variant',
    },
  ],
  normal: [
    {
      pattern: /var\(--[^)]*normal\)/gi,
      reason: 'CSS custom property token',
    },
    {
      pattern: /font-normal/gi,
      reason: 'Tailwind font-weight utility',
    },
  ],
  subject: [
    {
      pattern: /\bsubject\s+to\b/gi,
      reason: 'legal/business phrase',
    },
  ],
};

export function buildRegexForTerm(term: string): RegExp {
  // Escape regex special characters in term
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'gi');
}

const CONTEXT_WINDOW_BEFORE = 60;
const CONTEXT_WINDOW_AFTER = 80;

function getContextWindow(line: string, startIndex: number, termLength: number): string {
  const begin = Math.max(0, startIndex - CONTEXT_WINDOW_BEFORE);
  const end = Math.min(line.length, startIndex + termLength + CONTEXT_WINDOW_AFTER);
  return line.slice(begin, end);
}

function isContextuallyAllowed(term: string, contextWindow: string): boolean {
  const allowlists = CONTEXTUAL_ALLOWLISTS[term.toLowerCase()];
  if (!allowlists) return false;
  return allowlists.some(({ pattern }) => {
    pattern.lastIndex = 0;
    return pattern.test(contextWindow);
  });
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
      const contextWindow = getContextWindow(line, match.index, match[0].length);
      if (isContextuallyAllowed(entry.term, contextWindow)) {
        continue;
      }
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
