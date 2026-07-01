/**
 * Object Interpretation API Route
 * PatternLens v4.1
 * 
 * POST /api/objects/interpret
 * Interprets user content through selected lens using Claude API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { calculateRiskLevel, type RiskLevel } from '@/lib/constants/crisis-keywords';
import { getCopy } from '@/lib/copy';

// Types
interface InterpretRequest {
  content: string;
  lens: 'A' | 'B';
  locale?: 'pl' | 'en';
  object_id?: string;
}

interface InterpretResponse {
  success: boolean;
  data?: {
    interpretation: string;
    lens: 'A' | 'B';
    object_id: string;
    risk_level: RiskLevel;
  };
  error?: string;
  crisis_detected?: boolean;
}

// Lens prompts - SILENCE.OBJECTS methodology
const LENS_PROMPTS = {
  A: {
    pl: `Jesteś analitykiem strukturalnym PatternLens. Analizujesz tekst przez Soczewkę A - perspektywę FUNKCJONALNĄ.

Twoim zadaniem jest:
1. Zidentyfikować główną FUNKCJĘ opisywanego zachowania/sytuacji
2. Określić jaką POTRZEBĘ realizuje to zachowanie
3. Wskazać WZORCE powtarzające się w narracji
4. Zaproponować strukturalną interpretację (nie poradę)

Odpowiadaj w języku polskim. Używaj terminologii strukturalnej, nie terapeutycznej.
Unikaj słów: terapia, leczenie, diagnoza, zaburzenie.
Używaj: wzorzec, funkcja, struktura, mechanizm, dynamika.`,
    en: `You are a PatternLens structural analyst. Analyze text through Lens A - FUNCTIONAL perspective.

Your task:
1. Identify the main FUNCTION of described behavior/situation
2. Determine what NEED this behavior fulfills
3. Point out repeating PATTERNS in the narrative
4. Propose structural interpretation (not advice)

Respond in English. Use structural terminology, not therapeutic.
Avoid: therapy, treatment, diagnosis, disorder.
Use: pattern, function, structure, mechanism, dynamics.`,
  },
  B: {
    pl: `Jesteś analitykiem strukturalnym PatternLens. Analizujesz tekst przez Soczewkę B - perspektywę RELACYJNĄ.

Twoim zadaniem jest:
1. Zidentyfikować DYNAMIKI relacyjne w opisie
2. Określić role i pozycje w opisywanych interakcjach
3. Wskazać WZORCE komunikacyjne
4. Zaproponować strukturalną interpretację kontekstu społecznego

Odpowiadaj w języku polskim. Używaj terminologii strukturalnej, nie terapeutycznej.
Unikaj słów: terapia, leczenie, diagnoza, zaburzenie.
Używaj: wzorzec, dynamika, relacja, struktura, interakcja.`,
    en: `You are a PatternLens structural analyst. Analyze text through Lens B - RELATIONAL perspective.

Your task:
1. Identify RELATIONAL dynamics in the description
2. Determine roles and positions in described interactions
3. Point out COMMUNICATION patterns
4. Propose structural interpretation of social context

Respond in English. Use structural terminology, not therapeutic.
Avoid: therapy, treatment, diagnosis, disorder.
Use: pattern, dynamics, relationship, structure, interaction.`,
  },
};

export async function POST(request: NextRequest): Promise<NextResponse<InterpretResponse>> {
  try {
    // Parse request
    const body = await request.json() as InterpretRequest;
    const { content, lens, locale = 'pl', object_id } = body;

    // Validate input
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!lens || !['A', 'B'].includes(lens)) {
      return NextResponse.json(
        { success: false, error: 'Valid lens (A or B) is required' },
        { status: 400 }
      );
    }

    if (content.length > 10000) {
      return NextResponse.json(
        { success: false, error: 'Content too long (max 10000 characters)' },
        { status: 400 }
      );
    }

    // Check for crisis content FIRST
    const riskLevel = calculateRiskLevel(content, locale as 'pl' | 'en');
    
    if (riskLevel === 'critical') {
      // Log crisis detection (without blocking)
      console.warn('[CRISIS] Critical content detected', {
        timestamp: new Date().toISOString(),
        locale,
        risk_level: riskLevel,
      });

      return NextResponse.json({
        success: false,
        error: 'crisis_detected',
        crisis_detected: true,
      }, { status: 200 }); // 200 because this is expected behavior
    }

    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user tier and limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier, object_count')
      .eq('user_id', user.id)
      .single();

    const tier = profile?.tier || 'FREE';
    const objectCount = profile?.object_count || 0;
    const limit = tier === 'PRO' ? 1000 : 5;

    if (objectCount >= limit) {
      return NextResponse.json(
        { success: false, error: 'Object limit reached. Upgrade to Pro for unlimited.' },
        { status: 403 }
      );
    }

    // Initialize Claude
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Get appropriate prompt
    const systemPrompt = LENS_PROMPTS[lens][locale as 'pl' | 'en'] || LENS_PROMPTS[lens].pl;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Przeanalizuj następujący tekst:\n\n${content}`,
        },
      ],
    });

    // Extract interpretation
    const interpretation = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    // Store interpretation in database
    let finalObjectId = object_id;

    if (!finalObjectId) {
      // Create new object
      const { data: newObject, error: objectError } = await supabase
        .from('reports') // Using 'reports' as per schema
        .insert({
          user_id: user.id,
          content,
          status: 'completed',
        })
        .select('id')
        .single();

      if (objectError) {
        console.error('Failed to create object:', objectError);
        // Continue anyway - interpretation is the priority
      } else {
        finalObjectId = newObject?.id;
      }
    }

    // Store interpretation
    if (finalObjectId) {
      const { error: interpError } = await supabase
        .from('interpretations')
        .insert({
          report_id: finalObjectId,
          lens,
          content: interpretation,
        });

      if (interpError) {
        console.error('Failed to store interpretation:', interpError);
      }

      // Update object count
      await supabase
        .from('profiles')
        .update({ object_count: objectCount + 1 })
        .eq('user_id', user.id);
    }

    return NextResponse.json({
      success: true,
      data: {
        interpretation,
        lens,
        object_id: finalObjectId || 'temp',
        risk_level: riskLevel,
      },
    });

  } catch (error) {
    console.error('[interpret] Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: '/api/objects/interpret' });
}
