// ===========================================
// SILENCE.OBJECTS - Input Validation
// ===========================================
// Validates user input before processing
// Uses Zod for schema validation + custom security checks

import { z } from "zod";
import { MIN_TEXT_LENGTH, MAX_TEXT_LENGTH } from "@/constants/app";

// ===========================================
// CONFIGURATION
// ===========================================

const MIN_LENGTH = MIN_TEXT_LENGTH || 50;
const MAX_LENGTH = MAX_TEXT_LENGTH || 5000;

// ===========================================
// ZOD SCHEMAS
// ===========================================

/**
 * Object creation input schema
 */
export const ObjectCreationSchema = z.object({
  content: z
    .string({ required_error: "Tekst jest wymagany" })
    .min(MIN_LENGTH, `Tekst musi mieć co najmniej ${MIN_LENGTH} znaków`)
    .max(MAX_LENGTH, `Tekst nie może przekraczać ${MAX_LENGTH} znaków`)
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, "Tekst nie może być pusty"),
  inputMethod: z.enum(["text", "voice"]).optional().default("text"),
  locale: z.enum(["pl", "en"]).optional().default("pl"),
});

/**
 * Object creation with consents (onboarding)
 */
export const ObjectCreationWithConsentsSchema = ObjectCreationSchema.extend({
  consents: z.object({
    structuralAnalysis: z.literal(true),
    safetyGuidelines: z.literal(true),
    dataProcessing: z.literal(true),
    ageVerification: z.literal(true),
  }),
});

/**
 * Lens selection schema
 */
export const LensSelectionSchema = z.object({
  objectId: z.string().uuid("Nieprawidłowy identyfikator obiektu"),
  selectedLens: z.enum(["A", "B"]),
});

/**
 * API request schema for /api/interpret
 */
export const InterpretRequestSchema = z.object({
  text: z
    .string()
    .min(MIN_LENGTH, `Minimum ${MIN_LENGTH} znaków`)
    .max(MAX_LENGTH, `Maximum ${MAX_LENGTH} znaków`),
  locale: z.enum(["pl", "en"]).optional().default("pl"),
});

// ===========================================
// TYPE EXPORTS
// ===========================================

export type ObjectCreationInput = z.infer<typeof ObjectCreationSchema>;
export type ObjectCreationWithConsents = z.infer<typeof ObjectCreationWithConsentsSchema>;
export type LensSelection = z.infer<typeof LensSelectionSchema>;
export type InterpretRequest = z.infer<typeof InterpretRequestSchema>;

// ===========================================
// LEGACY TYPES (for backward compatibility)
// ===========================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  sanitizedText?: string;
}

export interface ValidationError {
  code: ValidationErrorCode;
  message: string;
  field?: string;
}

export type ValidationErrorCode =
  | "TEXT_TOO_SHORT"
  | "TEXT_TOO_LONG"
  | "TEXT_EMPTY"
  | "TEXT_INVALID_TYPE"
  | "TEXT_ONLY_WHITESPACE"
  | "TEXT_CONTAINS_SCRIPT"
  | "TEXT_CONTAINS_SQL"
  | "TEXT_EXCESSIVE_REPETITION"
  | "TEXT_INVALID_CHARACTERS"
  | "FORBIDDEN_LANGUAGE";

// ===========================================
// SECURITY PATTERNS
// ===========================================

// Patterns to detect potential injection attempts
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
];

const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b.*\b(FROM|INTO|TABLE|WHERE)\b)/gi,
  /(--|\/\*|\*\/|;)/g,
  /('|")\s*(OR|AND)\s*('|")/gi,
];

// Note: Not blocking user input for forbidden vocabulary - only checking Claude output
// Users might legitimately describe their situation using these terms

// ===========================================
// VALIDATION FUNCTIONS
// ===========================================

/**
 * Validates and sanitizes user input text (legacy function)
 */
export function validateObjectInput(input: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  // Type check
  if (input === null || input === undefined) {
    errors.push({
      code: "TEXT_EMPTY",
      message: "Tekst jest wymagany",
      field: "text",
    });
    return { valid: false, errors };
  }

  if (typeof input !== "string") {
    errors.push({
      code: "TEXT_INVALID_TYPE",
      message: "Tekst musi być ciągiem znaków",
      field: "text",
    });
    return { valid: false, errors };
  }

  // Trim and normalize whitespace
  let text = input.trim();
  text = text.replace(/\s+/g, " ");

  // Empty check after trim
  if (text.length === 0) {
    errors.push({
      code: "TEXT_ONLY_WHITESPACE",
      message: "Tekst nie może składać się tylko z białych znaków",
      field: "text",
    });
    return { valid: false, errors };
  }

  // Length validation
  if (text.length < MIN_LENGTH) {
    errors.push({
      code: "TEXT_TOO_SHORT",
      message: `Tekst musi mieć co najmniej ${MIN_LENGTH} znaków (obecnie: ${text.length})`,
      field: "text",
    });
  }

  if (text.length > MAX_LENGTH) {
    errors.push({
      code: "TEXT_TOO_LONG",
      message: `Tekst nie może przekraczać ${MAX_LENGTH} znaków (obecnie: ${text.length})`,
      field: "text",
    });
  }

  // Security: Check for script injection
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(text)) {
      errors.push({
        code: "TEXT_CONTAINS_SCRIPT",
        message: "Tekst zawiera niedozwolone elementy",
        field: "text",
      });
      break;
    }
  }

  // Security: Check for SQL injection attempts (log only)
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      console.warn("[Validation] Potential SQL pattern detected:", text.slice(0, 100));
      break;
    }
  }

  // Check for excessive repetition
  if (hasExcessiveRepetition(text)) {
    errors.push({
      code: "TEXT_EXCESSIVE_REPETITION",
      message: "Tekst zawiera nadmierne powtórzenia",
      field: "text",
    });
  }

  // Sanitize text for storage
  const sanitizedText = sanitizeText(text);

  return {
    valid: errors.length === 0,
    errors,
    sanitizedText: errors.length === 0 ? sanitizedText : undefined,
  };
}

/**
 * Validates using Zod schema and returns formatted result
 */
export function validateWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: ValidationError[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationError[] = result.error.issues.map((issue) => ({
    code: mapZodErrorCode(issue.code),
    message: issue.message,
    field: issue.path.join("."),
  }));

  return { success: false, errors };
}

function mapZodErrorCode(zodCode: string): ValidationErrorCode {
  switch (zodCode) {
    case "too_small":
      return "TEXT_TOO_SHORT";
    case "too_big":
      return "TEXT_TOO_LONG";
    case "invalid_type":
      return "TEXT_INVALID_TYPE";
    default:
      return "TEXT_INVALID_TYPE";
  }
}

/**
 * Quick validation for pre-flight checks
 */
export function quickValidate(text: unknown): {
  valid: boolean;
  reason?: string;
} {
  if (typeof text !== "string") {
    return { valid: false, reason: "invalid_type" };
  }

  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { valid: false, reason: "empty" };
  }

  if (trimmed.length < MIN_LENGTH) {
    return { valid: false, reason: "too_short" };
  }

  if (trimmed.length > MAX_LENGTH) {
    return { valid: false, reason: "too_long" };
  }

  return { valid: true };
}

/**
 * Validates lens selection
 */
export function validateLensSelection(lens: unknown): {
  valid: boolean;
  value?: "A" | "B";
} {
  if (lens === "A" || lens === "B") {
    return { valid: true, value: lens };
  }
  return { valid: false };
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function hasExcessiveRepetition(text: string): boolean {
  const words = text.toLowerCase().split(/\s+/);
  let consecutiveCount = 1;

  for (let i = 1; i < words.length; i++) {
    if (words[i] === words[i - 1] && words[i].length > 2) {
      consecutiveCount++;
      if (consecutiveCount >= 5) return true;
    } else {
      consecutiveCount = 1;
    }
  }

  const charRepeat = /(.)\1{9,}/;
  if (charRepeat.test(text)) return true;

  const phrases = text.match(/\b(\w+\s+\w+\s+\w+)\b/g) || [];
  const phraseCount: Record<string, number> = {};

  for (const phrase of phrases) {
    const normalized = phrase.toLowerCase();
    phraseCount[normalized] = (phraseCount[normalized] || 0) + 1;
    if (phraseCount[normalized] >= 5) return true;
  }

  return false;
}

function sanitizeText(text: string): string {
  return text
    .replace(/\0/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

/**
 * Estimates token count for rate limiting
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Truncates text to maximum length while preserving word boundaries
 */
export function truncateText(text: string, maxLength: number = MAX_LENGTH): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace) + "...";
  }

  return truncated + "...";
}

// ===========================================
// EXPORTS
// ===========================================

export const VALIDATION_LIMITS = {
  MIN_LENGTH,
  MAX_LENGTH,
} as const;
