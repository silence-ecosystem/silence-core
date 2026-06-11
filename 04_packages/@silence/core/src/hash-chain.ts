/**
 * [PATH]: 04_packages/@silence/core/src/hash-chain.ts
 *
 * SHA-256 hash chain utilities for EffectLog.
 * Deterministic, browser + Node compatible.
 */

/**
 * Compute SHA-256 of a UTF-8 string.
 * Uses Web Crypto API (browser) or Node crypto (Node).
 */
export async function sha256(input: string): Promise<string> {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  throw new Error('SHA-256 requires Web Crypto API. Upgrade to Node.js 20+ or a modern browser.');
}

/**
 * Compute entry hash from structured data.
 * Format: SHA-256(EFFECTLOG.ID + TIMESTAMP + EVENT_TYPE + ACTOR + PREV_HASH + CHANGE)
 */
export async function computeEntryHash(
  id: string,
  timestamp: string,
  eventType: string,
  actor: string,
  prevHash: string,
  change: string
): Promise<string> {
  const payload = `${id}\n${timestamp}\n${eventType}\n${actor}\n${prevHash}\n${change}`;
  return sha256(payload);
}

/**
 * Verify chain continuity: current.prevHash === previous.entryHash
 */
export function verifyChainContinuity(
  prevEntryHash: string,
  currentPrevHash: string
): boolean {
  return prevEntryHash === currentPrevHash;
}
