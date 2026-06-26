'use strict';

import { createClient } from '@/lib/supabase/server';

/**
 * Interpretation phase data structure
 */
export interface InterpretationPhase {
  lens: 'A' | 'B';
  phase_1_context: Record<string, unknown>;
  phase_2_tension: Record<string, unknown>;
  phase_3_meaning: Record<string, unknown>;
  phase_4_function: Record<string, unknown>;
  confidence_score?: number;
  model_version?: string;
}

/**
 * Database function result
 */
export interface ObjectCreationResult {
  success: boolean;
  object_id: string | null;
  error_message: string | null;
  tier_remaining: number | null;
}

/**
 * CREATE OBJECT WITH INTERPRETATION - ATOMIC TRANSACTION
 * 
 * Purpose:
 *   Single transaction combining:
 *   1. Object creation
 *   2. Interpretation creation (bulk)
 *   3. User counter increment
 *   4. Audit logging
 *   
 *   Automatic rollback on any failure → zero data inconsistency
 *
 * Tier Enforcement:
 *   ✅ Checked at database level (impossible to bypass)
 *   ✅ Returns remaining quota on FREE tier
 *   ✅ PRO tier gets unlimited weekly objects
 *
 * Rollback Safety:
 *   ✅ Input validation → fail immediately
 *   ✅ Database errors → auto-cascade deletes
 *   ✅ Counter misalignment → impossible (atomic)
 *   ✅ Orphaned data → not possible
 *
 * GDPR Compliance:
 *   ✅ Article 5: Data integrity (atomic semantics)
 *   ✅ Article 28: Processor logging (audit trail)
 *   ✅ Article 32: Security (all-or-nothing)
 */
export async function createObjectWithInterpretation(
  userId: string,
  inputText: string,
  interpretations: InterpretationPhase[],
  detectedTheme: 'work' | 'relationship' | 'self',
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'crisis' | 'BLOCKED' = 'none',
  inputMethod: 'text' | 'voice' | 'file' = 'text'
): Promise<ObjectCreationResult> {
  const supabase = await createClient();

  try {
    // Validate input before calling database function
    if (!userId || !inputText) {
      return {
        success: false,
        object_id: null,
        error_message: 'userId and inputText are required',
        tier_remaining: null,
      };
    }

    if (inputText.length < 50 || inputText.length > 5000) {
      return {
        success: false,
        object_id: null,
        error_message: 'inputText must be 50-5000 characters',
        tier_remaining: null,
      };
    }

    if (interpretations.length === 0) {
      return {
        success: false,
        object_id: null,
        error_message: 'at least one interpretation is required',
        tier_remaining: null,
      };
    }

    // Prepare interpretations JSON
    const interpretationsJson = interpretations.map(interp => ({
      lens: interp.lens,
      phase_1_context: interp.phase_1_context,
      phase_2_tension: interp.phase_2_tension,
      phase_3_meaning: interp.phase_3_meaning,
      phase_4_function: interp.phase_4_function,
      confidence_score: interp.confidence_score || 0.85,
      model_version: interp.model_version || 'claude-sonnet-4-20250514',
    }));

    // Call Supabase function (atomic transaction at DB level)
    const { data, error } = await supabase.rpc('create_object_with_interpretation', {
      p_user_id: userId,
      p_input_text: inputText,
      p_input_method: inputMethod,
      p_detected_theme: detectedTheme,
      p_risk_level: riskLevel,
      p_interpretations: interpretationsJson,
    });

    if (error) {
      console.error('[ObjectCreation] RPC error:', error);
      return {
        success: false,
        object_id: null,
        error_message: error.message || 'database error',
        tier_remaining: null,
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        object_id: null,
        error_message: 'no response from database',
        tier_remaining: null,
      };
    }

    const result = data[0] as ObjectCreationResult;
    
    if (result.success) {
      console.log(`[ObjectCreation] ✅ Object created: ${result.object_id}`);
      if (result.tier_remaining !== null) {
        console.log(`[ObjectCreation] 📊 Tier remaining: ${result.tier_remaining}/week`);
      }
    } else {
      console.warn(`[ObjectCreation] ❌ Failed: ${result.error_message}`);
    }

    return result;

  } catch (error) {
    console.error('[ObjectCreation] Unhandled error:', error);
    return {
      success: false,
      object_id: null,
      error_message: error instanceof Error ? error.message : 'unknown error',
      tier_remaining: null,
    };
  }
}

/**
 * CHECK TIER LIMIT - Query user quota
 * 
 * Purpose:
 *   Pre-check if user can create new object
 *   Especially useful for UI to show remaining quota
 * 
 * Returns:
 *   - can_create: boolean
 *   - tier: 'FREE' | 'PRO'
 *   - remaining_weekly: number (null for PRO)
 *   - reset_date: when weekly limit resets
 */
export async function checkTierLimit(userId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc('check_tier_limit_by_user_id', {
      p_user_id: userId,
    });

    if (error) {
      console.error('[TierCheck] RPC error:', error);
      return {
        can_create: false,
        tier: null,
        remaining_weekly: null,
        reset_date: null,
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {
        can_create: false,
        tier: null,
        remaining_weekly: null,
        reset_date: null,
        error: 'user not found',
      };
    }

    return data[0];

  } catch (error) {
    console.error('[TierCheck] Unhandled error:', error);
    return {
      can_create: false,
      tier: null,
      remaining_weekly: null,
      reset_date: null,
      error: error instanceof Error ? error.message : 'unknown error',
    };
  }
}

/**
 * INTEGRATION EXAMPLE
 * 
 * Before:
 *   1. Create object
 *   2. Create interpretations (separate)
 *   3. Increment counter (separate)
 *   4. Handle partial failures manually
 *   ❌ Risk of orphaned data if step 2 or 3 fail
 * 
 * After:
 *   const result = await createObjectWithInterpretation(
 *     userId,
 *     inputText,
 *     [
 *       {
 *         lens: 'A',
 *         phase_1_context: { ... },
 *         phase_2_tension: { ... },
 *         phase_3_meaning: { ... },
 *         phase_4_function: { ... }
 *       },
 *       {
 *         lens: 'B',
 *         phase_1_context: { ... },
 *         phase_2_tension: { ... },
 *         phase_3_meaning: { ... },
 *         phase_4_function: { ... }
 *       }
 *     ],
 *     'work'
 *   );
 * 
 *   if (!result.success) {
 *     return response(400, { error: result.error_message });
 *   }
 * 
 *   // result.object_id is guaranteed to be valid
 *   // All data is consistent
 *   // Nothing was partially created
 *   // ✅ Zero inconsistency risk
 */
