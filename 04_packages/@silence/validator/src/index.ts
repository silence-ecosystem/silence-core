/**
 * [PATH]: 04_packages/@silence/validator/src/index.ts
 *
 * Public barrel for @silence/validator.
 */

export type { ValidationError, ValidationResult } from './types.js';
export { validateEffectLogEntry } from './EffectLogValidator.js';
export {
  validateEventPayload,
  isValidEventType,
  ALLOWED_EVENT_TYPES,
} from './EventValidator.js';
export type { AllowedEventType } from './EventValidator.js';
