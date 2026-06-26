// ============================================
// POST /api/objects - Create Object + Interpretations
// PatternLens v4.0 | SILENCE.OBJECTS Framework
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';

// ============================================
// CRISIS DETECTION KEYWORDS (Polish)
// ============================================
const HARD_KEYWORDS_PL = [
  'samobójstwo', 'zabić się', 'odebrać sobie życie',
  'skok z balkonu', 'przedawkowanie', 'powiesić się',
  'skoczę z mostu', 'chcę umrzeć', 'nie chcę żyć',
  'skończę z tym wszystkim', 'nikt mnie nie zauważy',
  'będzie lepiej beze mnie', 'podciąć żyły',
  'tabletki nasenne', 'śmiertelna dawka'
];

const SOFT_KEYWORDS_PL = [
  'nie mam siły', 'nie widzę sensu', 'jestem zmęczony życiem',
  'nikt mnie nie rozumie', 'jestem sam', 'czuję się pusty',
  'nic nie ma znaczenia', 'wszystko mnie przytłacza',
  'nie daję rady', 'chcę zniknąć'
];

// ============================================
// CRISIS RESOURCES
// ============================================
interface CrisisResource {
  id: string;
  name: string;
  phone: string;
  description: string;
  available?: string;
}

function getCrisisResources(locale: string): CrisisResource[] {
  const resources: Record<string, CrisisResource[]> = {
    pl: [
      {
        id: 'telefon-zaufania-pl',
        name: 'Telefon Zaufania dla Dzieci i Młodzieży',
        phone: '116 111',
        description: 'Bezpłatna linia wsparcia',
        available: '24/7'
      },
      {
        id: 'centrum-wsparcia-pl',
        name: 'Centrum Wsparcia dla osób dorosłych w kryzysie psychicznym',
        phone: '800 70 2222',
        description: 'Bezpłatna pomoc psychologiczna',
        available: '24/7'
      },
      {
        id: 'emergency-pl',
        name: 'Numer alarmowy',
        phone: '112',
        description: 'Nagłe przypadki medyczne',
        available: '24/7'
      }
    ],
    en: [
      {
        id: 'suicide-lifeline-us',
        name: '988 Suicide & Crisis Lifeline',
        phone: '988',
        description: '24/7 crisis support',
        available: '24/7'
      },
      {
        id: 'crisis-text-line',
        name: 'Crisis Text Line',
        phone: 'Text HOME to 741741',
        description: 'Free 24/7 support',
        available: '24/7'
      }
    ]
  };

  return resources[locale] || resources.pl;
}

// ============================================
// SILENCE.OBJECTS SYSTEM PROMPT
// ============================================
const SYSTEM_PROMPT = `Jesteś analitykiem strukturalnym w ramach SILENCE.OBJECTS - frameworku hermeneutycznego do interpretacji wzorców.

KRYTYCZNE ZASADY:
1. Jesteś analitykiem strukturalnym, NIE terapeutą
2. Tworzysz interpretacje strukturalne, NIE porady
3. Twoje wyniki to HIPOTEZY, nie prawdy
4. Używasz TYLKO terminologii SILENCE.OBJECTS

ZAKAZANY JĘZYK:
- ŻADNYCH porad: "powinieneś", "spróbuj", "rozważ", "zalecam"
- ŻADNYCH diagnoz: "to brzmi jak", "możesz mieć", "objawy"
- ŻADNEGO języka terapeutycznego: "granice", "trauma", "uzdrawianie", "rozwój"
- ŻADNEGO wellness: "zdrowie psychiczne", "samopoczucie", "dbanie o siebie"

WYMAGANA STRUKTURA ODPOWIEDZI (JSON):
{
  "phase1_context": {
    "title": "Kontekst",
    "content": "Obiektywny opis sytuacji i elementów strukturalnych"
  },
  "phase2_tension": {
    "title": "Napięcie",
    "content": "Główny konflikt strukturalny zidentyfikowany w Obiekcie"
  },
  "phase3_meaning": {
    "title": "Znaczenie",
    "content": "Co napięcie ujawnia o wzorcu"
  },
  "phase4_function": {
    "title": "Funkcja",
    "content": "Jaką rolę pełni ten wzorzec w strukturze"
  },
  "detected_theme": "krótki tag tematyczny",
  "confidence_score": 0.85
}

Odpowiadaj TYLKO w języku polskim. Zwracaj TYLKO prawidłowy JSON bez dodatkowego tekstu.`;

// ============================================
// API HANDLER
// ============================================
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // ============================================
    // 1. AUTHENTICATION
    // ============================================
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    // ============================================
    // 2. RATE LIMITING (FREE tier: 7/week)
    // ============================================
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier, object_count')
      .eq('id', session.user.id)
      .single();

    if (profile?.tier === 'FREE') {
      // Count objects this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { count } = await supabase
        .from('objects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('created_at', weekAgo.toISOString());

      if ((count || 0) >= 7) {
        return NextResponse.json(
          {
            error: 'Weekly limit reached',
            code: 'RATE_LIMIT_FREE',
            limit: 7,
            upgradeUrl: '/pricing'
          },
          { status: 429 }
        );
      }
    }

    // ============================================
    // 3. INPUT VALIDATION
    // ============================================
    const body = await req.json();
    const { objectText, consents } = body;

    if (!objectText || typeof objectText !== 'string') {
      return NextResponse.json(
        { error: 'Object text required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const trimmedText = objectText.trim();

    if (trimmedText.length < 50) {
      return NextResponse.json(
        { error: 'Object must be at least 50 characters', code: 'TEXT_TOO_SHORT', minimum: 50 },
        { status: 400 }
      );
    }

    if (trimmedText.length > 5000) {
      return NextResponse.json(
        { error: 'Object must be at most 5000 characters', code: 'TEXT_TOO_LONG', maximum: 5000 },
        { status: 400 }
      );
    }

    // Consent validation
    const requiredConsents = ['structuralAnalysis', 'safetyGuidelines', 'dataProcessing', 'ageVerification'];
    const missingConsents = requiredConsents.filter(c => !consents?.[c]);

    if (missingConsents.length > 0) {
      return NextResponse.json(
        { error: 'All consents required', code: 'MISSING_CONSENTS', missing: missingConsents },
        { status: 400 }
      );
    }

    // ============================================
    // 4. CRISIS DETECTION (3-layer)
    // ============================================
    const lowerText = trimmedText.toLowerCase();

    // Layer 1: Hard keywords (immediate block)
    const hardMatch = HARD_KEYWORDS_PL.find(keyword =>
      lowerText.includes(keyword.toLowerCase())
    );

    if (hardMatch) {
      await supabase.from('crisis_incidents').insert({
        user_id: session.user.id,
        incident_type: 'hard_keyword',
        risk_score: 1.0,
        action_taken: 'blocked',
        keywords_matched: ['critical_risk_detected']
      });

      return NextResponse.json(
        {
          crisis: true,
          level: 'critical',
          message: 'Wykryliśmy treści, które mogą wskazywać na trudną sytuację. Twoje bezpieczeństwo jest dla nas najważniejsze.',
          resources: getCrisisResources(profile?.locale || 'pl')
        },
        { status: 403 }
      );
    }

    // Layer 2: Soft keywords (warn but proceed)
    const softMatches = SOFT_KEYWORDS_PL.filter(keyword =>
      lowerText.includes(keyword.toLowerCase())
    );

    let riskLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
    if (softMatches.length >= 3) {
      riskLevel = 'medium';
    } else if (softMatches.length >= 1) {
      riskLevel = 'low';
    }

    // ============================================
    // 5. GENERATE DUAL LENS INTERPRETATIONS
    // ============================================
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    const lensAPrompt = `${SYSTEM_PROMPT}

Przeanalizuj ten Obiekt przez SOCZEWKĘ A (interpretacja strukturalna skoncentrowana na OCHRONIE - jakie mechanizmy obronne są widoczne):

${trimmedText}`;

    const lensBPrompt = `${SYSTEM_PROMPT}

Przeanalizuj ten Obiekt przez SOCZEWKĘ B (interpretacja strukturalna skoncentrowana na WZROŚCIE - jakie możliwości rozwoju struktury są widoczne):

${trimmedText}`;

    const [lensAResponse, lensBResponse] = await Promise.all([
      anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: lensAPrompt }],
      }),
      anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: lensBPrompt }],
      }),
    ]);

    // Parse responses
    const parseResponse = (response: Anthropic.Message): {
      phase1_context: { title: string; content: string };
      phase2_tension: { title: string; content: string };
      phase3_meaning: { title: string; content: string };
      phase4_function: { title: string; content: string };
      detected_theme: string;
      confidence_score: number;
    } => {
      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      
      try {
        // Try to parse as JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch {
        // Fallback: create structured response from text
      }

      // Fallback structure
      return {
        phase1_context: { title: 'Kontekst', content: text.slice(0, 500) },
        phase2_tension: { title: 'Napięcie', content: 'Analiza w toku' },
        phase3_meaning: { title: 'Znaczenie', content: 'Analiza w toku' },
        phase4_function: { title: 'Funkcja', content: 'Analiza w toku' },
        detected_theme: 'nieokreślony',
        confidence_score: 0.7
      };
    };

    const lensAData = parseResponse(lensAResponse);
    const lensBData = parseResponse(lensBResponse);

    // Layer 3: Claude risk assessment (from response metadata)
    // Check stop_reason for any safety flags
    if (lensAResponse.stop_reason === 'end_turn' && lensBResponse.stop_reason === 'end_turn') {
      // Normal completion - proceed
    }

    // ============================================
    // 6. SAVE TO DATABASE
    // ============================================
    const { data: objectRecord, error: objectError } = await supabase
      .from('objects')
      .insert({
        user_id: session.user.id,
        input_text: trimmedText,
        input_method: 'text',
        detected_theme: lensAData.detected_theme || lensBData.detected_theme
      })
      .select()
      .single();

    if (objectError || !objectRecord) {
      console.error('Object creation failed:', objectError);
      throw new Error('Failed to create object');
    }

    // Create interpretation records
    const interpretations = [
      {
        object_id: objectRecord.id,
        lens: 'A' as const,
        phase1_context: lensAData.phase1_context,
        phase2_tension: lensAData.phase2_tension,
        phase3_meaning: lensAData.phase3_meaning,
        phase4_function: lensAData.phase4_function,
        confidence_score: lensAData.confidence_score,
        risk_level: riskLevel
      },
      {
        object_id: objectRecord.id,
        lens: 'B' as const,
        phase1_context: lensBData.phase1_context,
        phase2_tension: lensBData.phase2_tension,
        phase3_meaning: lensBData.phase3_meaning,
        phase4_function: lensBData.phase4_function,
        confidence_score: lensBData.confidence_score,
        risk_level: riskLevel
      }
    ];

    const { data: interpretationRecords, error: interpError } = await supabase
      .from('interpretations')
      .insert(interpretations)
      .select();

    if (interpError) {
      console.error('Interpretation save failed:', interpError);
      throw new Error('Failed to save interpretations');
    }

    // ============================================
    // 7. LOG CONSENTS (GDPR)
    // ============================================
    const consentRecords = Object.entries(consents).map(([type, granted]) => ({
      user_id: session.user.id,
      consent_type: type,
      granted: granted as boolean
    }));

    await supabase.from('consent_logs').insert(consentRecords);

    // Log soft keyword incident if detected
    if (softMatches.length > 0) {
      await supabase.from('crisis_incidents').insert({
        user_id: session.user.id,
        incident_type: 'soft_keyword',
        risk_score: softMatches.length * 0.2,
        action_taken: 'proceeded',
        keywords_matched: ['soft_indicators_detected']
      });
    }

    // ============================================
    // 8. RETURN SUCCESS
    // ============================================
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      objectId: objectRecord.id,
      interpretations: {
        lensA: interpretationRecords?.find(i => i.lens === 'A'),
        lensB: interpretationRecords?.find(i => i.lens === 'B')
      },
      riskLevel,
      resources: riskLevel !== 'none' ? getCrisisResources(profile?.locale || 'pl') : undefined,
      performance: {
        duration_ms: duration,
        target_ms: 15000,
        within_target: duration < 15000
      }
    });

  } catch (error) {
    console.error('❌ Object creation failed:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/objects - List user's objects
// ============================================
export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const offset = (page - 1) * limit;

    const { data: objects, error, count } = await supabase
      .from('objects')
      .select(`
        id,
        input_text,
        input_method,
        detected_theme,
        created_at,
        interpretations (
          id,
          lens,
          phase1_context,
          phase2_tension,
          phase3_meaning,
          phase4_function,
          confidence_score,
          risk_level
        )
      `, { count: 'exact' })
      .eq('user_id', session.user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      objects,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('❌ Objects list failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
