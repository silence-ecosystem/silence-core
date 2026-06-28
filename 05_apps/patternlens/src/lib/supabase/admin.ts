// ===========================================
// SILENCE.OBJECTS - Supabase Admin Client
// ===========================================
// Service role client for admin operations
// WARNING: Only use server-side, never expose to client

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.warn("[Supabase Admin] NEXT_PUBLIC_SUPABASE_URL not set");
}

if (!supabaseServiceKey) {
  console.warn("[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY not set");
}

/**
 * Admin client with service role permissions
 * Use for:
 * - Crisis incident insertion
 * - Stripe webhook handling
 * - Bypassing RLS for admin operations
 *
 * WARNING: Never expose this client to the frontend
 */
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || "placeholder-service-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Log a crisis detection incident (service role only)
 */
export async function logCrisisEvent(data: {
  userId?: string;
  incidentType: "hard_keyword" | "soft_keyword" | "claude_risk";
  riskScore?: number;
  actionTaken: "blocked" | "warned" | "proceeded";
  keywordsMatched?: string[];
}): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from("crisis_incidents").insert({
      user_id: data.userId || null,
      incident_type: data.incidentType,
      risk_score: data.riskScore ?? null,
      action_taken: data.actionTaken,
      keywords_matched: data.keywordsMatched || [],
    });

    if (error) {
      console.error("[Crisis Log] Insert error:", error.message);
    }
  } catch (error) {
    console.error("[Crisis Log] Error:", error);
  }
}

/**
 * Update user tier (admin operation)
 */
export async function updateUserTier(
  userId: string,
  tier: "FREE" | "PRO"
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        tier,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("[Admin] Update tier error:", error.message);
      return false;
    }

    console.log(`[Admin] Updated user ${userId} to tier ${tier}`);
    return true;
  } catch (error) {
    console.error("[Admin] Error:", error);
    return false;
  }
}

/**
 * Delete all user data (GDPR right to erasure)
 */
export async function deleteAllUserData(userId: string): Promise<boolean> {
  try {
    // Delete in order (due to foreign keys)
    // 1. Interpretations cascade from objects
    // 2. Delete objects
    const { error: objectsError } = await supabaseAdmin
      .from("objects")
      .delete()
      .eq("user_id", userId);

    if (objectsError) {
      console.error("[Admin] Delete objects error:", objectsError.message);
      return false;
    }

    // 3. Delete patterns
    const { error: patternsError } = await supabaseAdmin
      .from("patterns")
      .delete()
      .eq("user_id", userId);

    if (patternsError) {
      console.error("[Admin] Delete patterns error:", patternsError.message);
      return false;
    }

    // 4. Delete consent logs
    const { error: consentsError } = await supabaseAdmin
      .from("consent_logs")
      .delete()
      .eq("user_id", userId);

    if (consentsError) {
      console.error("[Admin] Delete consent_logs error:", consentsError.message);
      return false;
    }

    // 5. Delete crisis incidents
    const { error: crisisError } = await supabaseAdmin
      .from("crisis_incidents")
      .delete()
      .eq("user_id", userId);

    if (crisisError) {
      console.error("[Admin] Delete crisis_incidents error:", crisisError.message);
      return false;
    }

    // 6. Delete profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("[Admin] Delete profile error:", profileError.message);
      return false;
    }

    console.log(`[Admin] Deleted all data for user ${userId}`);
    return true;
  } catch (error) {
    console.error("[Admin] Error:", error);
    return false;
  }
}
