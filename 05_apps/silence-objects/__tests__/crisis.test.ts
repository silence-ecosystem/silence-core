/**
 * [PATH]: 05_apps/silence-objects/__tests__/crisis.test.ts
 *
 * Deterministic crisis detection tests.
 */

import { describe, it, expect } from 'vitest';
import { detectCrisis, shouldBlock } from '../lib/crisis';

describe('crisis detection', () => {
  it('blocks explicit self-harm phrases', () => {
    const result = detectCrisis('chcę umrzeć i zabiję się');
    expect(result.level).toBe('block');
    expect(shouldBlock(result.level)).toBe(true);
  });

  it('flags critical despair without blocking', () => {
    const result = detectCrisis('nie chcę już żyć');
    expect(result.level).toBe('critical');
    expect(shouldBlock(result.level)).toBe(false);
  });

  it('detects warning-level tension', () => {
    const result = detectCrisis('czuję rozpacz i beznadzieję');
    expect(result.level).toBe('warning');
  });

  it('returns none for neutral structural input', () => {
    const result = detectCrisis('zauważyłem wzorzec aktywacji po wzmożonym natężeniu bodźców');
    expect(result.level).toBe('none');
  });

  it('is deterministic for the same input', () => {
    const input = 'jestem samotny i mam PATTERN_SIGNATURE';
    expect(detectCrisis(input)).toStrictEqual(detectCrisis(input));
  });
});
