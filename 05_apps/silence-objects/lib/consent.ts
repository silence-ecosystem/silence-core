/**
 * [PATH]: 05_apps/silence-objects/lib/consent.ts
 *
 * RODO consent persistence in localStorage only.
 */

import type { Consent } from './types';

const CONSENT_KEY = 'silence:consent';

export function loadConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(CONSENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Consent;
  } catch {
    return null;
  }
}

export function saveConsent(consent: Consent): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

export function hasValidConsent(consent: Consent | null): boolean {
  return Boolean(consent && consent.rodoData && consent.rodoModel);
}
