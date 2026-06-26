import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/archetypes/blend — Get user's current archetype blend
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get most recent archetype history entry
    const { data, error } = await supabase
      .from('archetype_history')
      .select('blend, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ blend: null, message: 'No archetype data yet' });
    }

    return NextResponse.json({ blend: data.blend, updated_at: data.created_at });
  } catch (error) {
    console.error('[Archetypes/Blend] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
