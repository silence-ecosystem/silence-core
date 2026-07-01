import { createClient } from '@supabase/supabase-js';
import type { OnboardingIntention } from '@silence/sdk';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars');
  return createClient(url, key);
}

/**
 * Upsert the user's onboarding intention into Supabase.
 * Uses anon key + RLS — no service key in client code.
 * One active row per user (upsert on user_id).
 */
export async function saveUserIntention(
  intent: OnboardingIntention,
): Promise<void> {
  const supabase = getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== intent.userId) {
    throw new Error('Auth mismatch: cannot save intention for another user');
  }

  const { error } = await supabase
    .from('onboarding_intentions')
    .upsert(
      {
        user_id: intent.userId,
        primary_intent: intent.primaryIntent,
        experience: intent.experience,
        anchor: intent.anchor,
      },
      { onConflict: 'user_id' },
    );

  if (error) throw error;
}
