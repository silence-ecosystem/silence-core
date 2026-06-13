/**
 * [PATH]: 04_packages/@silence/validator/src/index.ts
 *
 * Public barrel for @silence/validator.
 */

export type { ValidationError, ValidationResult } from './types';
export { validateEffectLogEntry } from './EffectLogValidator';
export {
  validateEventPayload,
  isValidEventType,
  ALLOWED_EVENT_TYPES,
} from './EventValidator';
export type { AllowedEventType } from './EventValidator';
