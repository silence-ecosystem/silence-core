#!/usr/bin/env node
/**
 * [PATH]: 02_protocols/s11-fixer.cjs
 *
 * S11 Language Standard — Opt-in autofixer.
 * WARNING: This script modifies files in-place. Run only after manual review
 * of the S11 lint report. Do not run in CI without explicit approval.
 *
 * Uses the same canonical rule set as @silence/s11-lint.
 */

const fs = require('fs');
const path = require('path');

// Canonical replacements derived from S11-01 v2.1 mapping rules.
const REPLACEMENTS = [
  { from: /\bdiagnos(?:is|e|ed|ing)\b/gi, to: 'classification' },
  { from: /\bdepression\b/gi, to: 'suppression pattern' },
  { from: /\banxiety\b/gi, to: 'activation pattern' },
  { from: /\btherapy\b/gi, to: 'structured observation' },
  { from: /\btreatment\b/gi, to: 'intervention' },
  { from: /\bdisorder\b/gi, to: 'pattern' },
  { from: /\bsymptom\b/gi, to: 'signal' },
  { from: /\bpatient\b/gi, to: 'observer' },
  { from: /\billness\b/gi, to: 'structural variant' },
  { from: /\bcure\b/gi, to: 'resolution' },
  { from: /\bclinical\b/gi, to: 'observational' },
  { from: /\bdysfunction\b/gi, to: 'divergence' },
  { from: /\babnormal\b/gi, to: 'atypical' },
  { from: /\bmedication\b/gi, to: 'support protocol' },
  { from: /\bhealing\b/gi, to: 'recovery loop' },
  { from: /\bwellness\b/gi, to: 'capacity state' },
  { from: /\bmental health\b/gi, to: 'attention architecture' },
  { from: /\bemotional analysis\b/gi, to: 'pattern evaluation' },
  { from: /\bmood tracking\b/gi, to: 'rhythm observation' },
  { from: /\bpersonality type\b/gi, to: 'interaction profile' },
  { from: /\bpersonality test\b/gi, to: 'pattern assessment' },
];

function fixFile(filePath) {
  const full = path.resolve(filePath);
  if (!fs.existsSync(full)) {
    console.error(`[S11-FIX] File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(full, 'utf8');
  let changed = false;

  for (const rule of REPLACEMENTS) {
    if (rule.from.test(content)) {
      content = content.replace(rule.from, rule.to);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(full, content, 'utf8');
    console.log(`[S11-FIX] Updated: ${filePath}`);
    return true;
  } else {
    console.log(`[S11-FIX] No changes: ${filePath}`);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('[S11-FIX] Usage: node s11-fixer.cjs <file1> <file2> ...');
    console.error('[S11-FIX] No automatic directory scanning — specify files explicitly.');
    process.exit(1);
  }

  let updatedCount = 0;
  for (const relPath of args) {
    if (fixFile(relPath)) updatedCount++;
  }

  console.log(`\n[S11-FIX] Done. ${updatedCount}/${args.length} files updated.`);
}

if (require.main === module) main();
