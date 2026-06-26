import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================
// GET /api/objects/[id] - Get single object
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get object (RLS ensures user can only see their own)
    const { data: object, error } = await supabase
      .from('objects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single();

    if (error || !object) {
      return NextResponse.json({ error: 'Object not found' }, { status: 404 });
    }

    return NextResponse.json({ object });

  } catch (error) {
    console.error('[Objects] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============================================
// DELETE /api/objects/[id] - Soft delete object
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Soft delete (set deleted_at timestamp)
    const { error } = await supabase
      .from('objects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('[Objects] Delete error:', error);
      return NextResponse.json({ error: 'Failed to delete object' }, { status: 500 });
    }

    console.log('[Objects] Object deleted', { id });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Objects] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
