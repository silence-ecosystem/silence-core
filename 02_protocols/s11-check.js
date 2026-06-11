#!/usr/bin/env node
/**
 * [PATH]: 02_protocols/s11-check.js
 *
 * S11 Language Standard — CI gate wrapper.
 * Delegates scanning to @silence/s11-lint CLI.
 *
 * Usage:
 *   node 02_protocols/s11-check.js [paths...]
 *
 * If no paths provided, defaults to:
 *   01_governance 02_protocols 04_packages 05_apps
 */

const { execSync } = require('child_process');
const path = require('path');

const DEFAULT_PATHS = ['01_governance', '02_protocols', '04_packages', '05_apps'];

function main() {
  const args = process.argv.slice(2);
  const targetPaths = args.length > 0 ? args : DEFAULT_PATHS;

  // Resolve the s11-lint binary from workspace node_modules
  const s11LintBin = path.resolve(
    __dirname,
    '..',
    'node_modules',
    '.bin',
    's11-lint'
  );

  const cmd = `node "${s11LintBin}" ${targetPaths.join(' ')}`;

  try {
    execSync(cmd, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
    console.log('\n✅ S11 Language Standard: PASSED');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ S11 Language Standard: FAILED');
    console.error('   Fix violations or request steward exception.');
    process.exit(1);
  }
}

main();
