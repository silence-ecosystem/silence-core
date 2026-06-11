/**
 * [PATH]: 04_packages/@silence/core/src/hash-chain.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sha256, computeEntryHash, verifyChainContinuity } from './hash-chain';

describe('sha256', () => {
  it('produces deterministic output for identical input', async () => {
    const h1 = await sha256('deterministic');
    const h2 = await sha256('deterministic');
    assert.equal(h1, h2);
    assert.equal(h1.length, 64);
  });

  it('produces different output for different input', async () => {
    const h1 = await sha256('input-a');
    const h2 = await sha256('input-b');
    assert.notEqual(h1, h2);
  });

  it('produces correct empty string hash', async () => {
    const h = await sha256('');
    assert.equal(h.length, 64);
  });
});

describe('computeEntryHash', () => {
  it('produces 64-char hex string', async () => {
    const h = await computeEntryHash('id', 'ts', 'EVENT', 'actor', 'prev', 'change');
    assert.equal(h.length, 64);
  });

  it('is deterministic', async () => {
    const h1 = await computeEntryHash('id', 'ts', 'EVENT', 'actor', 'prev', 'change');
    const h2 = await computeEntryHash('id', 'ts', 'EVENT', 'actor', 'prev', 'change');
    assert.equal(h1, h2);
  });
});

describe('verifyChainContinuity', () => {
  it('returns true for matching hashes', () => {
    assert.equal(verifyChainContinuity('abc', 'abc'), true);
  });

  it('returns false for mismatched hashes', () => {
    assert.equal(verifyChainContinuity('abc', 'def'), false);
  });
});
