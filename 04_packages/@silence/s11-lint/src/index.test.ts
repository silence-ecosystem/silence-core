/**
 * [PATH]: 04_packages/@silence/s11-lint/src/index.test.ts
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { lintFile, lintProject } from './index.js';

describe('s11-lint', () => {
  it('exports lintFile function', () => {
    assert.equal(typeof lintFile, 'function');
  });

  it('detects forbidden term in text', () => {
    const result = lintFile('test.tsx', 'This is a clinical observation.');
    assert.ok(result.length > 0);
    assert.ok(result.some((v: { term: string }) => v.term === 'clinical'));
  });

  it('returns empty array for clean text', () => {
    const result = lintFile('test.tsx', 'This is a standard observation.');
    assert.equal(result.length, 0);
  });

  it('reports stale path-based ignore patterns without masking real violations', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 's11-stale-ignore-'));
    const existingSubdir = path.join(tmpDir, 'existing');
    fs.mkdirSync(existingSubdir, { recursive: true });
    fs.writeFileSync(path.join(existingSubdir, 'file.tsx'), 'This is a clinical observation.');

    const report = lintProject({
      paths: [tmpDir],
      ignorePatterns: ['non-existent-subdir/'],
    });

    fs.rmSync(tmpDir, { recursive: true, force: true });

    assert.ok(report.staleIgnores?.includes('non-existent-subdir/'), 'stale ignore should be reported');
    assert.ok(report.totalViolations > 0, 'existing files must still be scanned');
  });
});
