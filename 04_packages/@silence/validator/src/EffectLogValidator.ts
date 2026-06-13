/**
 * [PATH]: 04_packages/@silence/validator/src/EffectLogValidator.ts
 *
 * Deterministic validators for hash-chain / effect-log structures.
 */

import type { ValidationError, ValidationResult } from './types.js';

const REQUIRED_EFFECT_LOG_FIELDS = [
  'seq',
  'timestamp',
  'eventType',
  'payload',
  'prevHash',
  'hash',
] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function isIsoTimestamp(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  // ISO 8601 basic check: accepts "2026-06-13T10:00:00Z" and offset variants
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(value);
}

function missingFieldError(field: string): ValidationError {
  return {
    code: 'EFFECT_LOG_FIELD_MISSING',
    message: `Missing required effect-log field: ${field}`,
    path: [field],
  };
}

function typeError(field: string, expected: string): ValidationError {
  return {
    code: 'EFFECT_LOG_TYPE_INVALID',
    message: `Field ${field} must be ${expected}`,
    path: [field],
  };
}

export function validateEffectLogEntry(entry: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isPlainObject(entry)) {
    return { ok: false, errors: [{ code: 'EFFECT_LOG_NOT_OBJECT', message: 'Effect log entry must be an object' }] };
  }

  for (const field of REQUIRED_EFFECT_LOG_FIELDS) {
    if (!(field in entry)) {
      errors.push(missingFieldError(field));
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  if (!isPositiveInteger(entry.seq)) {
    errors.push(typeError('seq', 'a non-negative integer'));
  }

  if (!isIsoTimestamp(entry.timestamp)) {
    errors.push(typeError('timestamp', 'an ISO 8601 timestamp'));
  }

  if (!isNonEmptyString(entry.eventType)) {
    errors.push(typeError('eventType', 'a non-empty string'));
  }

  if (!isPlainObject(entry.payload)) {
    errors.push(typeError('payload', 'an object'));
  }

  if (!isNonEmptyString(entry.prevHash)) {
    errors.push(typeError('prevHash', 'a non-empty string'));
  }

  if (!isNonEmptyString(entry.hash)) {
    errors.push(typeError('hash', 'a non-empty string'));
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
