#!/usr/bin/env node
/**
 * [PATH]: 04_packages/@silence/s11-lint/src/cli.ts
 */

import { lintProject, formatTextReport, formatJsonReport } from './index.js';
import type { S11LintConfig } from './types/config.js';

function parseArgs(argv: readonly string[]): S11LintConfig {
  const args = argv.slice(2);
  const paths: string[] = [];
  let reportFormat: 'text' | 'json' = 'text';
  let reportOnly = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--json') {
      reportFormat = 'json';
    } else if (arg === '--report-only') {
      reportOnly = true;
    } else if (!arg.startsWith('--')) {
      paths.push(arg);
    }
  }

  if (paths.length === 0) {
    paths.push('.');
  }

  return { paths, reportFormat, reportOnly };
}

function main() {
  const config = parseArgs(process.argv);
  const report = lintProject(config);

  if (config.reportFormat === 'json') {
    console.log(formatJsonReport(report));
  } else {
    console.log(formatTextReport(report));
  }

  if (report.staleIgnores && report.staleIgnores.length > 0) {
    console.error('WARNING: stale ignore patterns (paths do not exist):');
    for (const stale of report.staleIgnores) {
      console.error(`  - ${stale}`);
    }
  }

  if (!config.reportOnly && report.totalViolations > 0) {
    process.exit(1);
  }
}

main();
