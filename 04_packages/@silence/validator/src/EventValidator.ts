/**
 * [PATH]: 04_packages/@silence/validator/src/EventValidator.ts
 *
 * Deterministic validators for event taxonomy payloads.
 */

import type { ValidationError, ValidationResult } from './types';

export const ALLOWED_EVENT_TYPES = [
  'SILENCE.SESSION.STARTED',
  'SILENCE.SESSION.ENDED',
  'SILENCE.EVENT.LOGGED',
  'SILENCE.CONTRACT.SIGNED',
] as const;

export type AllowedEventType = (typeof ALLOWED_EVENT_TYPES)[number];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isValidEventType(type: unknown): type is AllowedEventType {
  return typeof type === 'string' && (ALLOWED_EVENT_TYPES as readonly string[]).includes(type);
}

export function validateEventPayload(payload: unknown): ValidationResult {
  if (!isPlainObject(payload)) {
    return { ok: false, errors: [{ code: 'EVENT_PAYLOAD_NOT_OBJECT', message: 'Event payload must be an object' }] };
  }

  const errors: ValidationError[] = [];

  if (!('type' in payload)) {
    errors.push({ code: 'EVENT_TYPE_MISSING', message: 'Event payload must contain a type field', path: ['type'] });
  } else if (!isValidEventType(payload.type)) {
    errors.push({
      code: 'EVENT_TYPE_INVALID',
      message: `Event type must be one of: ${ALLOWED_EVENT_TYPES.join(', ')}`,
      path: ['type'],
    });
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
