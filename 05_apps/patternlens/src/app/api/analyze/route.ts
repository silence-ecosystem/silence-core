import { NextResponse } from 'next/server'
import {
  normalizeInput,
  scanOutput,
  sanitizeOutput,
  checkRateLimit,
  detectLocalPatterns,
  createCircuitBreaker
} from '@/lib/safety'

export const dynamic = 'force-dynamic'

// ═══════════════════════════════════════════════════════════
// CRISIS DETECTION — 3-layer system
// ═══════════════════════════════════════════════════════════
const CRISIS_KEYWORDS_PL = [
  'samobójstwo', 'samobojstwo', 'zabić się', 'zabic sie',
  'chcę umrzeć', 'chce umrzec', 'nie chcę żyć', 'nie chce zyc',
  'samookaleczenie', 'skrzywdzić się', 'skrzywdzic sie'
]
const CRISIS_KEYWORDS_EN = [
  'suicide', 'kill myself', 'want to die', 'self-harm',
  'end my life', 'hurt myself'
]
const ALL_CRISIS = [...CRISIS_KEYWORDS_PL, ...CRISIS_KEYWORDS_EN]

// ═══════════════════════════════════════════════════════════
// POST HANDLER
// ═══════════════════════════════════════════════════════════
export async function POST(request: Request) {
  try {
    // 1. Rate limit check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 20 analyses per minute.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const rawText = body.text

    if (!rawText || rawText.length < 10) {
      return NextResponse.json({ error: 'Text too short. Minimum 10 characters.' }, { status: 400 })
    }

    // 2. Input normalization (zero-width stripping)
    const text = normalizeInput(rawText)

    if (text !== rawText.replace(/\s+/g, ' ').trim()) {
      console.warn('[SAFETY] Input normalization stripped suspicious characters')
    }

    // 3. Crisis detection (hard keywords on normalized text)
    const lowerText = text.toLowerCase()
    const crisisMatch = ALL_CRISIS.find(kw => lowerText.includes(kw))
    if (crisisMatch) {
      return NextResponse.json({
        crisis: true,
        message: 'Wykryto treść wymagającą natychmiastowej uwagi.',
        resources: {
          pl: 'Telefon Zaufania dla Dzieci i Młodzieży: 116 111 | Centrum Wsparcia: 800 70 2222',
          en: 'Crisis Text Line: Text HOME to 741741 | National Suicide Prevention: 988',
          eu: 'European Emergency: 112'
        },
        disclaimer: 'PatternLens jest narzędziem analizy strukturalnej. W sytuacji zagrożenia życia skontaktuj się z profesjonalną pomocą.'
      }, { status: 200 })
    }

    // 4. Deterministic core — local pattern detection BEFORE Claude
    const localPatterns = detectLocalPatterns(text)

    // Enriched prompt with deterministic pre-analysis
    const enrichedPrompt = `Analyze this Object structurally.

Pre-analysis signals (deterministic):
- Word count: ${localPatterns.wordCount}
- Emotional intensity: ${localPatterns.emotionalIntensity}
- Dominant tense: ${localPatterns.dominantTense}
- Negation ratio: ${(localPatterns.negationRatio * 100).toFixed(1)}%
- Question ratio: ${(localPatterns.questionRatio * 100).toFixed(1)}%
- Repetition score: ${localPatterns.repetitionScore}

Object text:
${text}`

    // Try Claude API
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey) {
      return NextResponse.json(mockAnalysis(text))
    }

    // 5. Circuit breaker with 15s timeout
    const breaker = createCircuitBreaker(15000)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: `You are a structural pattern analyst for SILENCE.OBJECTS framework.
You perform dual-lens structural interpretation of behavioral patterns.
NEVER give advice, therapy, diagnosis, or treatment recommendations.
ALWAYS frame results as structural observations and proposals.
Use the 4-phase protocol: Context → Tension → Meaning → Function.
Provide Lens A (primary interpretation) and Lens B (alternative interpretation).
Identify dominant archetype from: Creator, Ruler, Caregiver, Explorer, Sage, Hero, Rebel, Magician, Lover, Jester, Innocent, Orphan.
Respond in the same language as the input text.
Format as JSON with fields: context, tension, meaning, function, lensA, lensB, archetype, confidence.`,
          messages: [{ role: 'user', content: enrichedPrompt }]
        }),
        signal: breaker.signal
      })
      breaker.clear()

      if (!response.ok) {
        return NextResponse.json(mockAnalysis(text))
      }

      const data = await response.json()
      let content = data.content?.[0]?.text || ''

      // 6. Output scan — check for forbidden vocabulary BEFORE returning
      const outputScanResult = scanOutput(content)
      if (!outputScanResult.clean) {
        content = sanitizeOutput(content)
        console.warn('[SAFETY] Output violations sanitized:', outputScanResult.violations)
      }

      // Parse JSON from Claude response
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])

          // Scan parsed fields too
          for (const key of Object.keys(parsed)) {
            if (typeof parsed[key] === 'string') {
              const fieldScan = scanOutput(parsed[key])
              if (!fieldScan.clean) {
                parsed[key] = sanitizeOutput(parsed[key])
              }
            }
          }

          return NextResponse.json({
            analysis: parsed,
            localPatterns,
            model: 'claude-sonnet-4',
            timestamp: new Date().toISOString(),
            disclaimer: 'Structural analysis proposal. Not advice, diagnosis, or treatment.'
          })
        }
      } catch { /* JSON parse failed, fall through */ }

      // Return raw text if JSON parse fails
      return NextResponse.json({
        analysis: { raw: content },
        localPatterns,
        model: 'claude-sonnet-4',
        timestamp: new Date().toISOString(),
        disclaimer: 'Structural analysis proposal. Not advice, diagnosis, or treatment.'
      })

    } catch (e: unknown) {
      breaker.clear()
      if (e instanceof Error && e.name === 'AbortError') {
        console.warn('[SAFETY] Claude API timeout — circuit breaker triggered')
        return NextResponse.json({
          ...mockAnalysis(text),
          note: 'Analysis timed out. Showing structural mock.'
        })
      }
      return NextResponse.json(mockAnalysis(text))
    }

  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

// ═══════════════════════════════════════════════════════════
// MOCK ANALYSIS — Enhanced with deterministic core
// ═══════════════════════════════════════════════════════════
function mockAnalysis(text: string) {
  const lp = detectLocalPatterns(text)

  let archetype = 'Explorer'
  if (lp.negationRatio > 0.05 && lp.dominantTense === 'past') archetype = 'Orphan'
  else if (lp.questionRatio > 0.3) archetype = 'Sage'
  else if (lp.emotionalIntensity === 'high') archetype = 'Hero'
  else if (lp.repetitionScore > 3) archetype = 'Ruler'
  else if (lp.dominantTense === 'future') archetype = 'Creator'
  else if (lp.negationRatio > 0.03) archetype = 'Rebel'

  return {
    analysis: {
      context: `Input contains ${lp.wordCount} words across ${lp.sentenceCount} sentences. Temporal orientation: ${lp.dominantTense}. Emotional intensity: ${lp.emotionalIntensity}.`,
      tension: lp.negationRatio > 0.03
        ? 'Elevated negation patterns suggest resistance or conflict in the described situation.'
        : 'Low negation suggests acceptance or observational stance toward the described patterns.',
      meaning: `The structural significance centers on ${lp.dominantTense}-oriented framing with ${lp.emotionalIntensity} intensity.`,
      function: lp.repetitionScore > 2
        ? 'Repetitive pattern detected — this may serve a reinforcement or processing function.'
        : 'The described pattern serves an adaptive or exploratory function.',
      lensA: 'Primary structural reading: The pattern represents a response mechanism to environmental pressures.',
      lensB: 'Alternative reading: The pattern may indicate a transitional phase between established behavioral modes.',
      archetype,
      confidence: 0.45 + (lp.wordCount > 50 ? 0.15 : 0) + (lp.sentenceCount > 3 ? 0.1 : 0),
    },
    localPatterns: lp,
    model: 'deterministic-fallback',
    timestamp: new Date().toISOString(),
    disclaimer: 'Structural analysis proposal. Not advice, diagnosis, or treatment.',
    note: 'AI unavailable. Showing deterministic pattern analysis based on linguistic markers.'
  }
}
