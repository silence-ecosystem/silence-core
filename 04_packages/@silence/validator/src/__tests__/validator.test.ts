/**
 * [PATH]: 04_packages/@silence/validator/src/__tests__/validator.test.ts
 */

import { describe, it, expect } from 'vitest';
import {
  validateEffectLogEntry,
  validateEventPayload,
  isValidEventType,
  ALLOWED_EVENT_TYPES,
} from '../index';

const validEffectLogEntry = {
  seq: 1,
  timestamp: '2026-06-13T10:00:00Z',
  eventType: 'SILENCE.EVENT.LOGGED',
  payload: { note: 'structural event' },
  prevHash: 'abc123',
  hash: 'def456',
};

describe('validateEffectLogEntry', () => {
  it('returns ok for a valid effect log entry', () => {
    const result = validateEffectLogEntry(validEffectLogEntry);
    expect(result.ok).toBe(true);
  });

  it('fails when required fields are missing', () => {
    const result = validateEffectLogEntry({ timestamp: '2026-06-13T10:00:00Z' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some(e => e.code === 'EFFECT_LOG_FIELD_MISSING')).toBe(true);
  });

  it('fails when seq is negative or non-integer', () => {
    const result = validateEffectLogEntry({ ...validEffectLogEntry, seq: -1 });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some(e => e.path?.includes('seq'))).toBe(true);
  });

  it('fails when timestamp is not ISO 8601', () => {
    const result = validateEffectLogEntry({ ...validEffectLogEntry, timestamp: 'not-a-date' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some(e => e.path?.includes('timestamp'))).toBe(true);
  });

  it('fails when payload is not an object', () => {
    const result = validateEffectLogEntry({ ...validEffectLogEntry, payload: 'string-payload' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some(e => e.path?.includes('payload'))).toBe(true);
  });
});

describe('validateEventPayload', () => {
  it('returns ok for a valid event payload', () => {
    const result = validateEventPayload({ type: 'SILENCE.SESSION.STARTED', payload: {} });
    expect(result.ok).toBe(true);
  });

  it('fails when type is missing', () => {
    const result = validateEventPayload({ payload: {} });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some(e => e.code === 'EVENT_TYPE_MISSING')).toBe(true);
  });

  it('fails when type is not in the allowed list', () => {
    const result = validateEventPayload({ type: 'SILENCE.UNKNOWN.EVENT' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some(e => e.code === 'EVENT_TYPE_INVALID')).toBe(true);
  });

  it('fails when payload is not an object', () => {
    const result = validateEventPayload('not-an-object');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors[0].code).toBe('EVENT_PAYLOAD_NOT_OBJECT');
  });
});

describe('isValidEventType', () => {
  it('returns true for all allowed event types', () => {
    for (const type of ALLOWED_EVENT_TYPES) {
      expect(isValidEventType(type)).toBe(true);
    }
  });

  it('returns false for arbitrary strings', () => {
    expect(isValidEventType('SILENCE.INVALID')).toBe(false);
    expect(isValidEventType(123)).toBe(false);
    expect(isValidEventType(null)).toBe(false);
  });
});
