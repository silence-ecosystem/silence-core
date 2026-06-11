/**
 * [PATH]: 04_packages/@silence/phi/src/constants.ts
 *
 * Phi-derived mathematical constants — SSoT for SILENCE.OBJECTS.
 * All timings derived from φ = (1 + √5) / 2.
 * No magic numbers permitted outside this package.
 */

/** φ = (1 + √5) / 2 — algebraic derivation from λ² = λ + 1 */
export const PHI = (1 + Math.sqrt(5)) / 2; // 1.618033988749895

/** φ⁻¹ = φ − 1 = 1 / φ */
export const PHI_INV = 1 / PHI; // 0.6180339887498948

/** φ² = φ + 1 */
export const PHI_SQ = PHI * PHI; // 2.618033988749895

/** φ³ = φ² + φ */
export const PHI_CUBE = PHI_SQ * PHI; // 4.23606797749979

/** φ⁴ = φ³ + φ² */
export const PHI_FOURTH = PHI_CUBE * PHI; // 6.854101966249685

/** Probability of Correct Sterility base: 1 − φ⁻¹² */
export const PCS_BASE = 1 - Math.pow(PHI_INV, 12); // > 0.997

/** Base temporal unit: floor(φ × 1000) ms */
export const GOLDENSECOND = Math.floor(PHI * 1000); // 1618 ms

/** Validation window for schedule computation: GOLDENSECOND × φ⁻² ≈ 382 ms */
export const VALIDATION_WINDOW_MS = Math.round(GOLDENSECOND * PHI_INV * PHI_INV); // 382 ms

/** Sync interval: GOLDENSECOND × φ² ≈ 2618 ms */
export const SYNC_INTERVAL_MS = Math.round(GOLDENSECOND * PHI_SQ); // 2618 ms

/** Breath cycle / MVP cycle window: GOLDENSECOND × φ⁴ ≈ 6854 ms */
export const BREATH_CYCLE_MS = Math.round(GOLDENSECOND * PHI_FOURTH); // 6854 ms

/** Intervention window: GOLDENSECOND × φ⁻¹ ≈ 618 ms */
export const INTERVENTION_WINDOW_MS = Math.round(GOLDENSECOND * PHI_INV); // 618 ms

/** Review window: GOLDENSECOND × φ³ ≈ 4236 ms */
export const REVIEW_WINDOW_MS = Math.round(GOLDENSECOND * PHI_CUBE); // 4236 ms

/** Max prompts per cycle: floor(φ²) = 2 (conservative: 3) */
export const MAX_PROMPTS_PER_CYCLE = Math.floor(PHI_SQ); // 2

/** Conservative prompt limit for MVP */
export const CONSERVATIVE_PROMPT_LIMIT = 3 as const;

/** Fixed-point representation for 1/φ in integer arithmetic */
export const PHI_INV_NUM = 618_033_988_749_894 as const;
export const PHI_INV_DEN = 1_000_000_000_000_000 as const;
