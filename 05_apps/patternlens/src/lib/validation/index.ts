// ===========================================
// SILENCE.OBJECTS - Validation Module
// ===========================================

// Zod Schemas
export {
  ObjectCreationSchema,
  ObjectCreationWithConsentsSchema,
  LensSelectionSchema,
  InterpretRequestSchema,
} from "./object-validation";

// Type exports
export type {
  ObjectCreationInput,
  ObjectCreationWithConsents,
  LensSelection,
  InterpretRequest,
} from "./object-validation";

// Legacy exports
export {
  validateObjectInput,
  validateWithZod,
  quickValidate,
  validateLensSelection,
  estimateTokens,
  truncateText,
  VALIDATION_LIMITS,
  type ValidationResult,
  type ValidationError,
  type ValidationErrorCode,
} from "./object-validation";
