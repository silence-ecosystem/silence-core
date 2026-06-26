import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/kpi/daily — Admin KPI endpoint
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get today's date boundaries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // Parallel queries for KPI data
    const [objectsRes, profilesRes, interpretationsRes, crisisRes] = await Promise.all([
      supabase.from('objects').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('interpretations').select('id', { count: 'exact', head: true }),
      supabase.from('nuclear_events').select('id', { count: 'exact', head: true }).gte('created_at', todayISO),
    ]);

    // Today's objects
    const todayObjectsRes = await supabase
      .from('objects')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayISO);

    return NextResponse.json({
      date: new Date().toISOString().split('T')[0],
      kpi: {
        total_users: profilesRes.count ?? 0,
        total_objects: objectsRes.count ?? 0,
        total_interpretations: interpretationsRes.count ?? 0,
        objects_today: todayObjectsRes.count ?? 0,
        crisis_events_today: crisisRes.count ?? 0,
      },
      status: 'ok',
    });
  } catch (error) {
    console.error('[KPI/Daily] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
