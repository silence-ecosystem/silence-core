/**
 * [PATH]: 04_packages/@silence/validator/src/types.ts
 *
 * Shared validation result contract for open-core validators.
 */

export type ValidationError = {
  code: string;
  message: string;
  path?: (string | number)[];
};

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: ValidationError[] };
