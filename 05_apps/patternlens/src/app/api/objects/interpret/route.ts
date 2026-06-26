// ============================================
// /api/objects/interpret — AI dual-lens analysis
// MATCHED TO REAL SUPABASE SCHEMA
// interpretations: TEXT columns (context_phase, tension_phase, etc.)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const HARD_KEYWORDS_PL = [
  'samobójstwo', 'zabić się', 'odebrać sobie życie',
  'skok z balkonu', 'przedawkowanie', 'powiesić się',
  'chcę umrzeć', 'nie chcę żyć', 'skończę z tym',
  'zakończyć życie', 'targnąć się na życie'
];

async function createSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

function getCrisisResources() {
  return [
    { id: 'telefon-zaufania', name: 'Telefon Zaufania', phone: '116 123', description: '24/7' },
    { id: 'centrum-wsparcia', name: 'Centrum Wsparcia', phone: '800 70 2222', description: '24/7' },
    { id: 'emergency', name: 'Numer alarmowy', phone: '112', description: '24/7' }
  ];
}

// ============================================
// POST /api/objects/interpret
// ============================================

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const supabase = await createSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { object_id } = body;

    if (!object_id) {
      return NextResponse.json({ error: 'object_id required' }, { status: 400 });
    }

    // Fetch object — REAL schema columns
    const { data: object, error: fetchError } = await supabase
      .from('objects')
      .select('id, input_text, input_source, selected_lens, theme')
      .eq('id', object_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !object) {
      return NextResponse.json({ error: 'Object not found' }, { status: 404 });
    }

    // Crisis check
    const lowerText = object.input_text.toLowerCase();
    const hardMatch = HARD_KEYWORDS_PL.some(k => lowerText.includes(k));
    if (hardMatch) {
      return NextResponse.json({
        crisis: true,
        level: 'critical',
        resources: getCrisisResources()
      }, { status: 403 });
    }

    // Single Claude call for dual-lens analysis
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: `You are a structural behavioral pattern analyst using the SILENCE.OBJECTS framework.
Analyze the input using dual-lens structural interpretation with 4 phases each.
NEVER provide therapy, diagnosis, advice, or treatment.
You provide structural analysis only — patterns, tensions, and functions.

Respond ONLY in valid JSON:
{
  "lens_a": {
    "context": "Phase 1 — what context/situation is described",
    "tension": "Phase 2 — what structural tension exists",
    "meaning": "Phase 3 — what meaning or significance emerges",
    "function": "Phase 4 — what function does this pattern serve"
  },
  "lens_b": {
    "context": "Phase 1 — alternative contextual reading",
    "tension": "Phase 2 — alternative tension interpretation",
    "meaning": "Phase 3 — alternative meaning",
    "function": "Phase 4 — alternative functional reading"
  },
  "patterns": [
    { "name": "pattern name", "description": "brief description", "confidence": 0.85 }
  ],
  "theme": "work|relationship|conflict|self",
  "confidence": 0.82
}`,
      messages: [{
        role: 'user',
        content: `Analyze this structural pattern:\n\n${object.input_text}`
      }],
    });

    const generationTime = Date.now() - startTime;
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      analysis = null;
    }

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis parsing failed' }, { status: 500 });
    }

    // Save interpretations — REAL schema: TEXT columns, not JSONB
    const { data: lensAData } = await supabase
      .from('interpretations')
      .insert({
        object_id: object.id,
        lens: 'A',
        context_phase: analysis.lens_a.context,
        tension_phase: analysis.lens_a.tension,
        meaning_phase: analysis.lens_a.meaning,
        function_phase: analysis.lens_a.function,
        model_version: 'claude-sonnet-4-20250514',
        generation_time_ms: generationTime,
        confidence: analysis.confidence || 0.5,
        risk_level: 'NONE',
      })
      .select()
      .single();

    const { data: lensBData } = await supabase
      .from('interpretations')
      .insert({
        object_id: object.id,
        lens: 'B',
        context_phase: analysis.lens_b.context,
        tension_phase: analysis.lens_b.tension,
        meaning_phase: analysis.lens_b.meaning,
        function_phase: analysis.lens_b.function,
        model_version: 'claude-sonnet-4-20250514',
        generation_time_ms: generationTime,
        confidence: analysis.confidence || 0.5,
        risk_level: 'NONE',
      })
      .select()
      .single();

    // Save patterns to separate table
    if (analysis.patterns?.length) {
      await supabase.from('patterns').insert(
        analysis.patterns.map((p: any) => ({
          object_id: object.id,
          user_id: user.id,
          pattern_name: p.name,
          pattern_description: p.description,
          confidence: p.confidence || 0.5,
        }))
      );
    }

    // Update object status + theme
    await supabase
      .from('objects')
      .update({
        processing_status: 'completed',
        completed_at: new Date().toISOString(),
        theme: analysis.theme || 'self',
      })
      .eq('id', object.id);

    // Increment weekly count (non-blocking)
    try { await supabase.rpc('increment_weekly_objects', { uid: user.id }); } catch {}

    return NextResponse.json({
      success: true,
      object_id,
      interpretations: {
        lensA: lensAData,
        lensB: lensBData,
      },
      patterns: analysis.patterns,
      confidence: analysis.confidence,
      performance: {
        duration_ms: Date.now() - startTime,
        target_ms: 15000,
        within_target: (Date.now() - startTime) < 15000
      }
    });

  } catch (error) {
    console.error('Interpret error:', error);
    return NextResponse.json({
      error: 'Processing failed',
      message: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      duration_ms: Date.now() - startTime
    }, { status: 500 });
  }
}

// ============================================
// GET /api/objects/interpret — Status Check
// ============================================

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const object_id = searchParams.get('object_id');

  if (!object_id) {
    return NextResponse.json({ error: 'object_id required' }, { status: 400 });
  }

  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // REAL schema columns
  const { data, error } = await supabase
    .from('objects')
    .select(`
      id,
      input_text,
      input_source,
      selected_lens,
      theme,
      processing_status,
      created_at,
      interpretations (
        id,
        lens,
        context_phase,
        tension_phase,
        meaning_phase,
        function_phase,
        confidence,
        risk_level,
        created_at
      )
    `)
    .eq('id', object_id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Object not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
