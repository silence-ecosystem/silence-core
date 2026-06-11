/**
 * [PATH]: 04_packages/@silence/s11-lint/src/types/config.ts
 */

export interface S11LintConfig {
  readonly paths: readonly string[];
  readonly extensions?: readonly string[];
  readonly ignorePatterns?: readonly string[];
  readonly reportFormat?: 'text' | 'json';
  readonly reportOnly?: boolean;
}

export interface S11Violation {
  readonly file: string;
  readonly line: number;
  readonly column: number;
  readonly term: string;
  readonly class: string;
  readonly context: string;
  readonly severity: 'MUST_NOT';
}

export interface S11Report {
  readonly scanDate: string;
  readonly totalViolations: number;
  readonly filesAffected: number;
  readonly violations: readonly S11Violation[];
}
