/**
 * [PATH]: 04_packages/@silence/s11-lint/src/index.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { lintFile } from './index.js';

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
});
