/**
 * Shared safety utilities for all API routes.
 * S11_SAFETY_GUARD — runtime lists intentionally enumerate prohibited terms for detection.
 * TODO: migrate to packages/safety/ as @silence/safety module
 * Used by /api/analyze, should be adopted by /api/voice/*, /api/interpret, etc.
 */

// ═══════════════════════════════════════════════════════════
// INPUT NORMALIZATION — Zero-width character stripping
// ═══════════════════════════════════════════════════════════
export function normalizeInput(text: string): string {
  let normalized = text.replace(/[\u200B\u200C\u200D\uFEFF\u00AD\u034F\u2028\u2029]/g, '')
  normalized = normalized.replace(/\s+/g, ' ').trim()
  normalized = normalized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  return normalized
}

// ═══════════════════════════════════════════════════════════
// OUTPUT SCAN — Forbidden vocabulary check
// ═══════════════════════════════════════════════════════════
export const FORBIDDEN_OUTPUT = [
  'therapy', 'therapist', 'therapeutic', 'diagnosis', 'diagnose', 'diagnostic',
  'treatment', 'treat', 'medication', 'prescribe', 'prescription',
  'mental health', 'mental illness', 'mental disorder', 'psychiatric',
  'clinical', 'pathology', 'pathological', 'psychotherapy',
  'healing', 'wellness', 'spiritual', 'mystical', 'divine', 'cosmic',
  'horoscope', 'fortune', 'divination', 'oracle',
  'terapia', 'terapeuta', 'terapeutyczny', 'diagnoza', 'diagnozować',
  'leczenie', 'leczyć', 'lek', 'recepta', 'psychiatryczny',
  'zaburzenie', 'choroba psychiczna', 'zdrowie psychiczne',
  'uzdrawianie', 'duchowy', 'mistyczny', 'boski', 'kosmiczny',
  'horoskop', 'wróżba', 'wyrocznia'
]

export function scanOutput(text: string): { clean: boolean; violations: string[] } {
  const normalized = text.toLowerCase().replace(/[\u200B\u200C\u200D\uFEFF\u00AD]/g, '')
  const violations = FORBIDDEN_OUTPUT.filter(term => normalized.includes(term))
  return { clean: violations.length === 0, violations }
}

export function sanitizeOutput(text: string): string {
  let result = text.replace(/[\u200B\u200C\u200D\uFEFF\u00AD]/g, '')
  const replacements: Record<string, string> = {
    'therapy': 'structural analysis', 'therapist': 'analyst',
    'diagnosis': 'pattern classification', 'treatment': 'approach',
    'mental health': 'behavioral patterns', 'mental illness': 'pattern disruption',
    'healing': 'pattern reconstruction', 'wellness': 'structural balance',
    'terapia': 'analiza strukturalna', 'diagnoza': 'klasyfikacja wzorców',
    'leczenie': 'podejście', 'zdrowie psychiczne': 'wzorce behawioralne',
  }
  for (const [from, to] of Object.entries(replacements)) {
    result = result.replace(new RegExp(from, 'gi'), to)
  }
  return result
}

// ═══════════════════════════════════════════════════════════
// DETERMINISTIC CORE — Local pattern detection
// ═══════════════════════════════════════════════════════════
export function detectLocalPatterns(text: string) {
  const words = text.split(/\s+/)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim())
  const questions = text.match(/\?/g) || []
  const negations = text.match(/\b(nie|never|not|no|don't|won't|can't|nigdy|żaden|brak)\b/gi) || []
  const pastMarkers = text.match(/\b(yesterday|ago|was|were|had|used to|wczoraj|kiedyś|dawniej|byłem|byłam|miałem)\b/gi) || []
  const futureMarkers = text.match(/\b(will|going to|plan|tomorrow|soon|jutro|zamierzam|planuję|będę)\b/gi) || []
  const presentMarkers = text.match(/\b(now|today|currently|right now|teraz|aktualnie|dzisiaj|jestem|mam)\b/gi) || []
  const exclamations = (text.match(/!/g) || []).length
  const capsWords = words.filter(w => w === w.toUpperCase() && w.length > 2).length
  const intensifiers = text.match(/\b(very|extremely|absolutely|always|never|bardzo|zawsze|nigdy|strasznie|mega)\b/gi) || []
  const intensityScore = exclamations + capsWords * 2 + intensifiers.length
  const wordFreq = new Map<string, number>()
  words.forEach(w => {
    const lower = w.toLowerCase().replace(/[^a-ząćęłńóśźż]/g, '')
    if (lower.length > 3) wordFreq.set(lower, (wordFreq.get(lower) || 0) + 1)
  })
  const repetitions = [...wordFreq.values()].filter(v => v > 2).length
  let dominantTense: 'past' | 'present' | 'future' | 'mixed' = 'mixed'
  const max = Math.max(pastMarkers.length, presentMarkers.length, futureMarkers.length)
  if (max > 0) {
    if (pastMarkers.length === max) dominantTense = 'past'
    else if (presentMarkers.length === max) dominantTense = 'present'
    else if (futureMarkers.length === max) dominantTense = 'future'
  }
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    questionRatio: questions.length / Math.max(sentences.length, 1),
    negationRatio: negations.length / Math.max(words.length, 1),
    temporalMarkers: [...pastMarkers, ...presentMarkers, ...futureMarkers],
    emotionalIntensity: (intensityScore > 5 ? 'high' : intensityScore > 2 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
    repetitionScore: repetitions,
    dominantTense
  }
}

// ═══════════════════════════════════════════════════════════
// RATE LIMITING — In-memory (dev only)
// ═══════════════════════════════════════════════════════════
// SAFETY_RATE_DEV_ONLY: This in-memory rate limiter works within a single serverless instance.
// TODO: Replace with Upstash Redis for production-grade cross-instance rate limiting.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string, limit: number = 20, windowMs: number = 60000): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  entry.count++
  if (entry.count > limit) return false
  return true
}

// ═══════════════════════════════════════════════════════════
// CIRCUIT BREAKER — AbortController with configurable timeout
// ═══════════════════════════════════════════════════════════
export function createCircuitBreaker(timeoutMs: number = 15000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  }
}
