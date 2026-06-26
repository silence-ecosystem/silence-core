import { createClient } from '@supabase/supabase-js';
import type { ProtocolKey } from '@silence/sdk';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars');
  return createClient(url, key);
}

export interface ProtocolBaselineRecord {
  userId: string;
  protocolKey: ProtocolKey;
  baselineSeconds: number;
  maintained: boolean;
}

/**
 * Save user protocol baseline measurement to Supabase.
 * Uses anon key + RLS — no service key in client code.
 */
export async function saveProtocolBaseline(
  record: ProtocolBaselineRecord,
): Promise<void> {
  const supabase = getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== record.userId) {
    throw new Error('Auth mismatch: cannot save baseline for another user');
  }

  const { error } = await supabase
    .from('user_protocols_baseline')
    .insert({
      user_id: record.userId,
      protocol_key: record.protocolKey,
      baseline_seconds: record.baselineSeconds,
      maintained: record.maintained,
      measured_at: new Date().toISOString(),
    });

  if (error) throw error;
}

/**
 * Get user's latest baseline for a specific protocol.
 */
export async function getProtocolBaseline(
  userId: string,
  protocolKey: ProtocolKey,
): Promise<number | null> {
  const supabase = getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    throw new Error('Auth mismatch: cannot fetch baseline for another user');
  }

  const { data, error } = await supabase
    .from('user_protocols_baseline')
    .select('baseline_seconds')
    .eq('user_id', userId)
    .eq('protocol_key', protocolKey)
    .order('measured_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }

  return data?.baseline_seconds ?? null;
}
