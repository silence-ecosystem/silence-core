/**
 * [PATH]: 04_packages/@silence/s11-lint/src/rules/s11-reporter.ts
 */

import type { S11Report, S11Violation } from '../types/config.js';
import { getSummaryByClass, getAllowedAlternativesForClass, FORBIDDEN_CLASSES } from './s11-core.js';
import type { S11TermClass } from '@silence/types/s11';

export function formatTextReport(report: S11Report): string {
  if (report.totalViolations === 0) {
    return [
      '# S11 Lint Report',
      '',
      `**Scan Date:** ${report.scanDate}`,
      '**Status:** PASS',
      '**Total Violations:** 0',
      '',
      'All scanned files maintain S11 linguistic sterility.',
    ].join('\n');
  }

  const grouped = groupByFile(report.violations);
  const classSummary = getSummaryByClass(report.violations);

  const lines: string[] = [
    '# S11 Lint Report',
    '',
    `**Scan Date:** ${report.scanDate}`,
    '**Status:** FAIL',
    `**Total Violations:** ${report.totalViolations}`,
    `**Files Affected:** ${report.filesAffected}`,
    '',
    '## Violations by File',
    '',
  ];

  for (const [file, violations] of Object.entries(grouped)) {
    lines.push(`### ${file}\n`);
    lines.push(`**Count:** ${violations.length}\n`);
    for (const v of violations) {
      lines.push(`- **Line ${v.line}:${v.column}** — Class \`${v.class}\`, Term \`${v.term}\``);
      lines.push(`  \`\`\``);
      lines.push(`  ${v.context}`);
      lines.push(`  \`\`\`\n`);
    }
  }

  lines.push('## Summary by Class\n');
  for (const cls of Object.keys(FORBIDDEN_CLASSES) as S11TermClass[]) {
    const count = classSummary.get(cls) || 0;
    if (count > 0) {
      const alternatives = getAllowedAlternativesForClass(cls).join(', ');
      lines.push(`- **${cls}**: ${count} — Use: ${alternatives}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

export function formatJsonReport(report: S11Report): string {
  return JSON.stringify(report, null, 2);
}

function groupByFile(violations: readonly S11Violation[]): Record<string, S11Violation[]> {
  const result: Record<string, S11Violation[]> = {};
  for (const v of violations) {
    if (!result[v.file]) result[v.file] = [];
    result[v.file].push(v);
  }
  return result;
}
