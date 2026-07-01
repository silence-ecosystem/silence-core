// ===========================================
// SILENCE.OBJECTS - Authentication Helpers
// ===========================================
// Server-side authentication utilities for API routes

import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

// ===========================================
// TYPES
// ===========================================

export interface AuthenticatedUser {
  id: string;
  email: string | undefined;
  tier: "FREE" | "PRO";
  objectCount: number;
  onboardingCompleted: boolean;
}

export interface AuthResult {
  authenticated: true;
  user: AuthenticatedUser;
}

export interface AuthError {
  authenticated: false;
  error: string;
  code: "NO_SESSION" | "INVALID_SESSION" | "PROFILE_ERROR" | "SUPABASE_ERROR";
}

export type AuthOutcome = AuthResult | AuthError;

export interface ProfileData {
  id: string;
  tier: "FREE" | "PRO";
  object_count: number;
  onboarding_completed: boolean;
  stripe_customer_id: string | null;
}

// ===========================================
// MAIN AUTHENTICATION FUNCTION
// ===========================================

/**
 * Authenticates a request and returns user data with profile
 * Use this in API routes that need authenticated access
 */
export async function authenticateRequest(): Promise<AuthOutcome> {
  try {
    const supabase = await createClient();

    // Get user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("[Auth] Supabase auth error:", authError.message);
      return {
        authenticated: false,
        error: "Authentication failed",
        code: "SUPABASE_ERROR",
      };
    }

    if (!user) {
      return {
        authenticated: false,
        error: "No active session",
        code: "NO_SESSION",
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, tier, object_count, onboarding_completed, stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("[Auth] Profile fetch error:", profileError.message);

      // Profile might not exist yet - create it
      if (profileError.code === "PGRST116") {
        const newProfile = await createUserProfile(supabase, user);
        if (newProfile) {
          return {
            authenticated: true,
            user: {
              id: user.id,
              email: user.email,
              tier: newProfile.tier,
              objectCount: newProfile.object_count,
              onboardingCompleted: newProfile.onboarding_completed,
            },
          };
        }
      }

      return {
        authenticated: false,
        error: "Failed to fetch user profile",
        code: "PROFILE_ERROR",
      };
    }

    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        tier: (profile.tier as "FREE" | "PRO") || "FREE",
        objectCount: profile.object_count || 0,
        onboardingCompleted: profile.onboarding_completed || false,
      },
    };
  } catch (error) {
    console.error("[Auth] Unexpected error:", error);
    return {
      authenticated: false,
      error: "Authentication service unavailable",
      code: "SUPABASE_ERROR",
    };
  }
}

/**
 * Quick authentication check - returns user or null
 * Use when you just need to know if user is logged in
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

/**
 * Check if user has PRO tier
 */
export async function isProUser(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", userId)
      .single();

    return profile?.tier === "PRO";
  } catch {
    return false;
  }
}

/**
 * Get user's current object count
 */
export async function getUserObjectCount(userId: string): Promise<number> {
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from("objects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .is("deleted_at", null);

    return count || 0;
  } catch {
    return 0;
  }
}

/**
 * Check if user can create more objects (tier limit check)
 */
export async function canCreateObject(
  userId: string,
  tier: "FREE" | "PRO"
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const { FREE_OBJECT_LIMIT } = await import("@/constants/app");

  if (tier === "PRO") {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }

  const count = await getUserObjectCount(userId);
  const remaining = Math.max(0, FREE_OBJECT_LIMIT - count);

  return {
    allowed: count < FREE_OBJECT_LIMIT,
    remaining,
    limit: FREE_OBJECT_LIMIT,
  };
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Creates a new user profile if one doesn't exist
 */
async function createUserProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: User
): Promise<ProfileData | null> {
  try {
    const newProfile = {
      id: user.id,
      user_id: user.id,
      tier: "FREE" as const,
      object_count: 0,
      onboarding_completed: false,
      stripe_customer_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      console.error("[Auth] Failed to create profile:", error.message);
      return null;
    }

    console.log("[Auth] Created new profile for user:", user.id);
    return data as ProfileData;
  } catch (error) {
    console.error("[Auth] Profile creation error:", error);
    return null;
  }
}

/**
 * Updates user's object count
 */
export async function incrementObjectCount(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.rpc("increment_object_count", {
      user_id_param: userId,
    });

    if (error) {
      // Fallback to direct update if RPC doesn't exist
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          object_count: await getUserObjectCount(userId) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("[Auth] Failed to increment object count:", updateError.message);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("[Auth] Object count increment error:", error);
    return false;
  }
}

/**
 * Mark user onboarding as completed
 */
export async function completeOnboarding(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("[Auth] Failed to complete onboarding:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Auth] Onboarding completion error:", error);
    return false;
  }
}

// ===========================================
// RATE LIMITING HELPERS
// ===========================================

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter
 * For production, use Redis or similar
 */
export function checkRateLimit(
  userId: string,
  limit: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = `rate:${userId}`;
  const entry = rateLimitMap.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);
