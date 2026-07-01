import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { detectCrisisKeywords } from '@/lib/constants/crisis-keywords';

export const runtime = 'edge';
export const maxDuration = 60;

// ============================================
// TYPES
// ============================================

interface InterpretRequest {
  inputText: string;
  locale?: 'pl' | 'en';
}

interface Interpretation {
  lens: 'A' | 'B';
  contextPhase: string;
  tensionPhase: string;
  meaningPhase: string;
  functionPhase: string;
}

interface InterpretResponse {
  objectId: string;
  theme: 'work' | 'relationship' | 'self';
  interpretations: {
    A: Interpretation;
    B: Interpretation;
  };
  riskLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
}

// ============================================
// PROMPTS
// ============================================

const DUAL_LENS_PROMPT_PL = `Jesteś narzędziem konstrukcyjnym SILENCE.OBJECTS do strukturalnej analizy wzorców.

ZASADY ABSOLUTNE:
1. NIE jesteś terapeutą. NIE udzielasz porad. NIE oceniasz.
2. Tworzysz DWE równie wiarygodne, strukturalnie RÓŻNE interpretacje (Lens A i Lens B).
3. Każda interpretacja zawiera 4 fazy: Kontekst, Napięcie, Znaczenie, Funkcja.
4. Obie interpretacje muszą być równie przekonujące - żadna nie jest "lepsza".
5. NIGDY nie używaj słów: pomoc, wsparcie, terapia, poprawa, ulga, zdrowie psychiczne.
6. ZAWSZE używaj: konstrukcja, wzorzec, struktura, napięcie, funkcja, interpretacja.

TEKST UŻYTKOWNIKA:
"""
{INPUT}
"""

OKREŚL TEMAT: work | relationship | self

Odpowiedz TYLKO w formacie JSON:
{
  "theme": "work|relationship|self",
  "lensA": {
    "context": "Opis kontekstu strukturalnego...",
    "tension": "Opis napięcia między elementami...",
    "meaning": "Możliwa interpretacja znaczenia wzorca...",
    "function": "Funkcja regulacyjna tego wzorca..."
  },
  "lensB": {
    "context": "INNY kontekst strukturalny...",
    "tension": "INNE napięcie między elementami...",
    "meaning": "ALTERNATYWNA interpretacja znaczenia...",
    "function": "INNA funkcja regulacyjna..."
  }
}`;

const DUAL_LENS_PROMPT_EN = `You are the SILENCE.OBJECTS construction tool for structural pattern analysis.

ABSOLUTE RULES:
1. You are NOT a therapist. You do NOT give advice. You do NOT judge.
2. Create TWO equally credible, structurally DIFFERENT interpretations (Lens A and Lens B).
3. Each interpretation contains 4 phases: Context, Tension, Meaning, Function.
4. Both interpretations must be equally convincing - neither is "better".
5. NEVER use words: help, support, therapy, improvement, relief, mental health.
6. ALWAYS use: construction, pattern, structure, tension, function, interpretation.

USER TEXT:
"""
{INPUT}
"""

DETERMINE THEME: work | relationship | self

Respond ONLY in JSON format:
{
  "theme": "work|relationship|self",
  "lensA": {
    "context": "Description of structural context...",
    "tension": "Description of tension between elements...",
    "meaning": "Possible interpretation of pattern meaning...",
    "function": "Regulatory function of this pattern..."
  },
  "lensB": {
    "context": "DIFFERENT structural context...",
    "tension": "DIFFERENT tension between elements...",
    "meaning": "ALTERNATIVE interpretation of meaning...",
    "function": "DIFFERENT regulatory function..."
  }
}`;

// ============================================
// MAIN HANDLER
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    // 1. Parse and validate request
    const body: InterpretRequest = await request.json();
    const { inputText, locale = 'pl' } = body;

    if (!inputText || typeof inputText !== 'string') {
      return NextResponse.json(
        { error: 'inputText is required' },
        { status: 400 }
      );
    }

    if (inputText.length < 50 || inputText.length > 5000) {
      return NextResponse.json(
        { error: 'inputText must be 50-5000 characters' },
        { status: 400 }
      );
    }

    // 2. Get user from auth header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 3. Initialize clients
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // 4. CRISIS DETECTION - Layer 1 (Hard keywords)
    const crisisCheck = detectCrisisKeywords(inputText);
    if (crisisCheck.layer === 1) {
      return NextResponse.json(
        { 
          error: 'CRISIS_DETECTED',
          riskLevel: 'BLOCKED',
          message: 'Crisis keywords detected. Please see resources.',
        },
        { status: 200 } // 200 to not trigger error handling on client
      );
    }

    // 5. Get user ID from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // 6. Check tier limit
    const { data: canCreate } = await supabase.rpc('check_tier_limit', {
      p_user_id: user.id,
    });

    if (!canCreate) {
      return NextResponse.json(
        { 
          error: 'TIER_LIMIT_REACHED',
          message: 'Weekly limit reached. Upgrade to PRO for unlimited.',
        },
        { status: 403 }
      );
    }

    // 7. Generate dual-lens interpretation via Claude
    const prompt = locale === 'pl' 
      ? DUAL_LENS_PROMPT_PL.replace('{INPUT}', inputText)
      : DUAL_LENS_PROMPT_EN.replace('{INPUT}', inputText);

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = message.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // 8. Parse Claude response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Claude response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const theme = parsed.theme as 'work' | 'relationship' | 'self';

    // 9. Insert object into database
    const { data: object, error: insertError } = await supabase
      .from('objects')
      .insert({
        user_id: user.id,
        input_text: inputText,
        input_source: 'text',
        theme,
        risk_level: crisisCheck.layer === 2 ? 'LOW' : 'NONE',
      })
      .select('id')
      .single();

    if (insertError || !object) {
      throw new Error(`Failed to insert object: ${insertError?.message}`);
    }

    // 10. Insert interpretations
    const interpretations = [
      {
        object_id: object.id,
        lens: 'A' as const,
        context_phase: parsed.lensA.context,
        tension_phase: parsed.lensA.tension,
        meaning_phase: parsed.lensA.meaning,
        function_phase: parsed.lensA.function,
        model_version: 'claude-3-5-sonnet-20241022',
        generation_time_ms: Date.now() - startTime,
      },
      {
        object_id: object.id,
        lens: 'B' as const,
        context_phase: parsed.lensB.context,
        tension_phase: parsed.lensB.tension,
        meaning_phase: parsed.lensB.meaning,
        function_phase: parsed.lensB.function,
        model_version: 'claude-3-5-sonnet-20241022',
        generation_time_ms: Date.now() - startTime,
      },
    ];

    const { error: interpError } = await supabase
      .from('interpretations')
      .insert(interpretations);

    if (interpError) {
      throw new Error(`Failed to insert interpretations: ${interpError.message}`);
    }

    // 11. Increment user's object count
    await supabase.rpc('increment_object_count', { p_user_id: user.id });

    // 12. Return response
    const response: InterpretResponse = {
      objectId: object.id,
      theme,
      interpretations: {
        A: {
          lens: 'A',
          contextPhase: parsed.lensA.context,
          tensionPhase: parsed.lensA.tension,
          meaningPhase: parsed.lensA.meaning,
          functionPhase: parsed.lensA.function,
        },
        B: {
          lens: 'B',
          contextPhase: parsed.lensB.context,
          tensionPhase: parsed.lensB.tension,
          meaningPhase: parsed.lensB.meaning,
          functionPhase: parsed.lensB.function,
        },
      },
      riskLevel: crisisCheck.layer === 2 ? 'LOW' : 'NONE',
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Interpret error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
