/**
 * [PATH]: 04_packages/@silence/phi/src/constants.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PHI, PHI_INV, GOLDENSECOND, BREATH_CYCLE_MS } from './constants';

describe('phi constants', () => {
  it('PHI is approximately 1.618', () => {
    assert.ok(PHI > 1.617 && PHI < 1.619);
  });

  it('PHI_INV is approximately 0.618', () => {
    assert.ok(PHI_INV > 0.617 && PHI_INV < 0.619);
  });

  it('GOLDENSECOND is 1618', () => {
    assert.equal(GOLDENSECOND, 1618);
  });

  it('BREATH_CYCLE_MS is positive', () => {
    assert.ok(BREATH_CYCLE_MS > 0);
  });
});
