/**
 * [PATH]: 04_packages/@silence/s11-lint/src/index.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import type { S11LintConfig, S11Report, S11Violation } from './types/config.js';
import { scanLine } from './rules/s11-core.js';

const DEFAULT_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.yaml', '.yml'];
const DEFAULT_IGNORE = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  'S11_CLEANUP_REPORT.md',
  'S11_POST_FIX_REPORT.md',
  'ROLES',
];

const S11_META_FILES = [
  'SILENCE_STRUCT_v2_0.md',
  'SILENCE_SYSTEM_DCI_BRIEF_v3_0.md',
  'S11-01.md',
  'language/src/forbidden.ts',
];

function shouldIgnore(filePath: string, ignorePatterns: readonly string[]): boolean {
  const parts = filePath.split(path.sep);
  return parts.some((part) => ignorePatterns.includes(part));
}

function shouldScan(filePath: string, extensions: readonly string[]): boolean {
  return extensions.includes(path.extname(filePath));
}

function scanFile(filePath: string, relativePath: string): readonly S11Violation[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const violations: S11Violation[] = [];

    // Exempt S11 meta-documentation and runtime guard constants
    if (
      relativePath.includes('s11-lint') ||
      relativePath.includes('S11_INTERNAL_CERTIFICATE.md') ||
      S11_META_FILES.some((meta) => relativePath.endsWith(meta)) ||
      content.includes('FORBIDDEN_CLASSES') ||
      content.includes('ALLOWED_ALTERNATIVES') ||
      content.includes('S11_FORBIDDEN_TERMS') ||
      content.includes('S11 Policy Constants')
    ) {
      return violations;
    }

    for (let i = 0; i < lines.length; i++) {
      violations.push(...scanLine(lines[i], i, relativePath));
    }

    return violations;
  } catch {
    return [];
  }
}

function scanDirectory(dirPath: string, baseDir: string, config: Required<S11LintConfig>): readonly S11Violation[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const violations: S11Violation[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      if (!shouldIgnore(fullPath, config.ignorePatterns)) {
        violations.push(...scanDirectory(fullPath, baseDir, config));
      }
    } else if (entry.isFile() && shouldScan(fullPath, config.extensions)) {
      violations.push(...scanFile(fullPath, relativePath));
    }
  }

  return violations;
}

export function lintProject(config: S11LintConfig): S11Report {
  const merged: Required<S11LintConfig> = {
    extensions: DEFAULT_EXTENSIONS,
    ignorePatterns: DEFAULT_IGNORE,
    reportFormat: 'text',
    reportOnly: false,
    ...config,
  };

  const allViolations: S11Violation[] = [];

  for (const targetPath of config.paths) {
    const resolved = path.resolve(targetPath);
    const stat = fs.statSync(resolved);

    if (stat.isDirectory()) {
      allViolations.push(...scanDirectory(resolved, resolved, merged));
    } else if (stat.isFile() && shouldScan(resolved, merged.extensions)) {
      allViolations.push(...scanFile(resolved, path.relative(process.cwd(), resolved)));
    }
  }

  // Deduplicate by file+line+column+term
  const seen = new Set<string>();
  const deduped = allViolations.filter((v) => {
    const key = `${v.file}:${v.line}:${v.column}:${v.term}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const filesAffected = new Set(deduped.map((v) => v.file)).size;

  return {
    scanDate: new Date().toISOString(),
    totalViolations: deduped.length,
    filesAffected,
    violations: deduped,
  };
}

export function lintFile(filePath: string, content: string): readonly S11Violation[] {
  const lines = content.split('\n');
  const violations: S11Violation[] = [];
  for (let i = 0; i < lines.length; i++) {
    violations.push(...scanLine(lines[i], i, filePath));
  }
  return violations;
}

export { formatTextReport, formatJsonReport } from './rules/s11-reporter.js';
