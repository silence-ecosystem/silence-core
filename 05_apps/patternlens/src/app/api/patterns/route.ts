// ============================================
// src/app/api/patterns/route.ts
// PatternLens v5.0 - Pattern Synthesis API
// MATCHED TO 001_patternlens.sql MIGRATION SCHEMA
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

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

const SYNTHESIS_PROMPT = `Jesteś analitykiem strukturalnym SILENCE.OBJECTS. Na podstawie wielu interpretacji zidentyfikuj POWTARZAJĄCE SIĘ WZORCE.

ZASADY:
1. Szukaj WZORCÓW między obiektami, nie opisuj pojedynczych
2. ZAKAZANE: terapia, diagnoza, porada
3. WYMAGANE: wzorzec, struktura, funkcja, napięcie
4. Minimum 3 obiekty do syntezy

ODPOWIEDŹ (JSON array):
[
  {
    "pattern_name": "Nazwa wzorca (max 5 słów)",
    "pattern_theme": "work|relationship|conflict|self",
    "frequency": "jak często się pojawia",
    "related_objects": ["object_id1", "object_id2"]
  }
]

Zidentyfikuj 1-3 główne wzorce. Odpowiadaj TYLKO JSON.`;

// GET /api/patterns - List user patterns
export async function GET() {
  try {
    const supabase = await createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Columns match 001_patternlens.sql: id, user_id, pattern_name, pattern_theme, object_count, first_detected, last_updated
    const { data: patterns, error } = await supabase
      .from('patterns')
      .select('*')
      .eq('user_id', user.id)
      .order('last_updated', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ patterns });
  } catch (error) {
    console.error('Patterns list error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST /api/patterns - Synthesize patterns from objects
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const supabase = await createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { object_ids } = body;

    // Validate: need at least 3 objects
    if (!object_ids || object_ids.length < 3) {
      return NextResponse.json({
        error: 'Minimum 3 obiekty wymagane do syntezy wzorców',
        required: 3,
        provided: object_ids?.length || 0
      }, { status: 400 });
    }

    // Fetch objects with interpretations (REAL schema: TEXT columns)
    const { data: objects, error: fetchError } = await supabase
      .from('objects')
      .select(`
        id,
        input_text,
        theme,
        interpretations (
          lens,
          context_phase,
          tension_phase,
          meaning_phase,
          function_phase
        )
      `)
      .eq('user_id', user.id)
      .eq('is_archived', false)
      .in('id', object_ids);

    if (fetchError || !objects || objects.length < 3) {
      return NextResponse.json({
        error: 'Nie znaleziono wystarczającej liczby obiektów',
        found: objects?.length || 0
      }, { status: 404 });
    }

    // Prepare context for Claude
    const objectsContext = objects.map((obj, idx) => {
      const lensA = obj.interpretations?.find((i: { lens: string }) => i.lens === 'A');
      const lensB = obj.interpretations?.find((i: { lens: string }) => i.lens === 'B');

      return `
OBIEKT ${idx + 1} (ID: ${obj.id}):
Temat: ${obj.theme || 'brak'}
Input: "${obj.input_text.substring(0, 200)}..."

Soczewka A:
- Kontekst: ${lensA?.context_phase || 'brak'}
- Napięcie: ${lensA?.tension_phase || 'brak'}
- Znaczenie: ${lensA?.meaning_phase || 'brak'}
- Funkcja: ${lensA?.function_phase || 'brak'}

Soczewka B:
- Kontekst: ${lensB?.context_phase || 'brak'}
- Napięcie: ${lensB?.tension_phase || 'brak'}
- Znaczenie: ${lensB?.meaning_phase || 'brak'}
- Funkcja: ${lensB?.function_phase || 'brak'}
`;
    }).join('\n---\n');

    // Call Claude for synthesis
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Przeanalizuj poniższe obiekty i zidentyfikuj POWTARZAJĄCE SIĘ WZORCE:\n\n${objectsContext}\n\n${SYNTHESIS_PROMPT}`
      }]
    });

    // Parse response
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    let patterns;

    try {
      const match = text.match(/\[[\s\S]*\]/);
      patterns = match ? JSON.parse(match[0]) : [];
    } catch {
      console.error('Pattern parse error:', text);
      patterns = [];
    }

    if (!patterns.length) {
      return NextResponse.json({
        success: false,
        error: 'Nie udało się zidentyfikować wzorców',
        duration_ms: Date.now() - startTime
      }, { status: 422 });
    }

    // Save patterns to database (REAL schema: pattern_name, pattern_description, confidence)
    const patternRecords = patterns.map((p: {
      pattern_name: string;
      pattern_theme: string;
      frequency?: string;
      related_objects?: string[];
    }) => ({
      user_id: user.id,
      object_id: object_ids[0],
      pattern_name: p.pattern_name,
      pattern_description: `Theme: ${p.pattern_theme || 'unknown'}. Frequency: ${p.frequency || 'unknown'}. Objects: ${(p.related_objects || object_ids).length}`,
      confidence: 0.75,
    }));

    const { data: savedPatterns, error: saveError } = await supabase
      .from('patterns')
      .insert(patternRecords)
      .select();

    if (saveError) {
      console.error('Pattern save error:', saveError);
    }

    return NextResponse.json({
      success: true,
      patterns: savedPatterns || patterns,
      analyzed_objects: objects.length,
      performance: {
        duration_ms: Date.now() - startTime,
        target_ms: 20000
      }
    });

  } catch (error) {
    console.error('Pattern synthesis error:', error);
    return NextResponse.json({
      error: 'Synthesis failed',
      duration_ms: Date.now() - startTime
    }, { status: 500 });
  }
}
