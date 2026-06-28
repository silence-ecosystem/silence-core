import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/archetypes/history — Get user's archetype shift history
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('archetype_history')
      .select('id, blend, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('[Archetypes/History] Query error:', error);
      return NextResponse.json({ history: [], error: 'Failed to fetch history' });
    }

    return NextResponse.json({ history: data || [], count: data?.length || 0 });
  } catch (error) {
    console.error('[Archetypes/History] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
