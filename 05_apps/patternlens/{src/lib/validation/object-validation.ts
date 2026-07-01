/**
 * Object Validation Schemas
 * PatternLens v4.1
 * 
 * Uses Zod for runtime validation
 */

import { z } from 'zod';

// Lens type enum
export const LensSchema = z.enum(['A', 'B'], {
  required_error: 'Wybierz soczewkę analizy',
  invalid_type_error: 'Nieprawidłowy typ soczewki',
});

export type Lens = z.infer<typeof LensSchema>;

// Object input validation
export const ObjectInputSchema = z.object({
  content: z
    .string({
      required_error: 'Treść jest wymagana',
      invalid_type_error: 'Treść musi być tekstem',
    })
    .min(10, { message: 'Treść musi mieć minimum 10 znaków' })
    .max(10000, { message: 'Treść może mieć maksymalnie 10000 znaków' }),
  
  title: z
    .string({
      invalid_type_error: 'Tytuł musi być tekstem',
    })
    .min(1, { message: 'Tytuł jest wymagany' })
    .max(200, { message: 'Tytuł może mieć maksymalnie 200 znaków' })
    .optional(),
  
  lens: LensSchema,
  
  locale: z.enum(['pl', 'en'], {
    invalid_type_error: 'Nieprawidłowy język',
  }).default('pl'),
});

export type ObjectInput = z.infer<typeof ObjectInputSchema>;

// Interpretation result validation
export const InterpretationResultSchema = z.object({
  id: z.string().uuid(),
  object_id: z.string().uuid(),
  lens: LensSchema,
  content: z.string(),
  created_at: z.string().datetime(),
});

export type InterpretationResult = z.infer<typeof InterpretationResultSchema>;

// Object with interpretations
export const ObjectWithInterpretationsSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().nullable(),
  content: z.string(),
  status: z.enum(['draft', 'processing', 'completed', 'error']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  interpretations: z.array(InterpretationResultSchema).optional(),
});

export type ObjectWithInterpretations = z.infer<typeof ObjectWithInterpretationsSchema>;

// Voice input validation
export const VoiceInputSchema = z.object({
  audio: z.instanceof(Blob, { message: 'Nieprawidłowy format audio' }),
  locale: z.enum(['pl', 'en']).default('pl'),
});

export type VoiceInput = z.infer<typeof VoiceInputSchema>;

// API Response schemas
export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const ApiSuccessSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  });

// Validation helpers
export function validateObjectInput(data: unknown): {
  success: boolean;
  data?: ObjectInput;
  error?: string;
} {
  const result = ObjectInputSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const firstError = result.error.errors[0];
  return {
    success: false,
    error: firstError?.message || 'Błąd walidacji',
  };
}

export function validateVoiceInput(data: unknown): {
  success: boolean;
  data?: VoiceInput;
  error?: string;
} {
  const result = VoiceInputSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const firstError = result.error.errors[0];
  return {
    success: false,
    error: firstError?.message || 'Błąd walidacji audio',
  };
}

export default {
  ObjectInputSchema,
  VoiceInputSchema,
  LensSchema,
  validateObjectInput,
  validateVoiceInput,
};
