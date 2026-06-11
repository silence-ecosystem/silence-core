/**
 * [PATH]: 05_apps/garden/lib/breathRitualBridge.ts
 *
 * BreathRitualBridge — deterministic handoff layer between /breath and /garden.
 * Encapsulates sessionStorage ritual result transfer.
 * No randomness. No backend. Local-first.
 */

const RITUAL_RESULT_KEY = 'silence-last-ritual-breaths';
const RITUAL_COUNT_24H_KEY = 'silence-breath-count-24h';

export interface RitualTransfer {
  readonly breathCount: number;
  readonly transferredAt: string; // ISO-8601
}

export function transferRitualResult(breathCount: number): RitualTransfer {
  const payload: RitualTransfer = {
    breathCount,
    transferredAt: new Date().toISOString(),
  };
  try {
    sessionStorage.setItem(RITUAL_RESULT_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage unavailable
  }
  return payload;
}

export function consumeRitualResult(): RitualTransfer | null {
  try {
    const raw = sessionStorage.getItem(RITUAL_RESULT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RitualTransfer;
    if (typeof parsed.breathCount !== 'number' || !Number.isFinite(parsed.breathCount) || parsed.breathCount <= 0) {
      sessionStorage.removeItem(RITUAL_RESULT_KEY);
      return null;
    }
    sessionStorage.removeItem(RITUAL_RESULT_KEY);
    return parsed;
  } catch {
    return null;
  }
}

export function incrementBreathCount24h(count: number): void {
  try {
    const existing = sessionStorage.getItem(RITUAL_COUNT_24H_KEY);
    const current = existing ? Number(existing) : 0;
    sessionStorage.setItem(RITUAL_COUNT_24H_KEY, String(current + count));
  } catch {
    // ignore
  }
}
