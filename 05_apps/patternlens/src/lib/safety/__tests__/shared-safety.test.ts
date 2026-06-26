import { describe, it, expect } from 'vitest'
import {
  normalizeInput,
  scanOutput,
  sanitizeOutput,
  detectLocalPatterns,
  checkRateLimit,
  FORBIDDEN_OUTPUT
} from '../shared-safety'

// ═══════════════════════════════════════════════════════════
// 1. DETERMINISTIC CORE — Temporal tense detection
// ═══════════════════════════════════════════════════════════

describe('detectLocalPatterns — tense detection', () => {
  it('detects past tense dominance', () => {
    const result = detectLocalPatterns('Yesterday I was feeling overwhelmed. I had too much work and used to skip meals.')
    expect(result.dominantTense).toBe('past')
  })

  it('detects present tense dominance', () => {
    const result = detectLocalPatterns('Right now I am feeling stressed. Today I have too many meetings. Currently juggling tasks.')
    expect(result.dominantTense).toBe('present')
  })

  it('detects future tense dominance', () => {
    const result = detectLocalPatterns('Tomorrow I will start the new project. I plan to change my routine soon.')
    expect(result.dominantTense).toBe('future')
  })
})

// ═══════════════════════════════════════════════════════════
// 2. DETERMINISTIC CORE — Emotional intensity
// ═══════════════════════════════════════════════════════════

describe('detectLocalPatterns — emotional intensity', () => {
  it('detects high emotional intensity', () => {
    const result = detectLocalPatterns('I am EXTREMELY frustrated!!! This is ABSOLUTELY unacceptable! I ALWAYS get treated this way! NEVER again!')
    expect(result.emotionalIntensity).toBe('high')
  })

  it('detects low emotional intensity', () => {
    const result = detectLocalPatterns('I went to the store and bought some groceries. Then I came home.')
    expect(result.emotionalIntensity).toBe('low')
  })
})

// ═══════════════════════════════════════════════════════════
// 3. DETERMINISTIC CORE — Negation ratio
// ═══════════════════════════════════════════════════════════

describe('detectLocalPatterns — negation', () => {
  it('detects high negation ratio', () => {
    const result = detectLocalPatterns('I never do anything right. Not a single day goes by without failure. No one cares.')
    expect(result.negationRatio).toBeGreaterThan(0.05)
  })
})

// ═══════════════════════════════════════════════════════════
// 4. INPUT NORMALIZATION — Zero-width character stripping
// ═══════════════════════════════════════════════════════════

describe('normalizeInput', () => {
  it('strips zero-width characters', () => {
    const input = 'chc\u200Be umrze\u200Bc'
    const result = normalizeInput(input)
    expect(result).toBe('chce umrzec')
  })

  it('strips soft hyphens and combining chars', () => {
    const input = 'test\u00AD\u034Fing'
    const result = normalizeInput(input)
    expect(result).toBe('testing')
  })

  it('normalizes whitespace', () => {
    const input = '  too   many   spaces  '
    const result = normalizeInput(input)
    expect(result).toBe('too many spaces')
  })

  it('strips control characters', () => {
    const input = 'hel\x00lo\x08test'
    const result = normalizeInput(input)
    expect(result).toBe('hellotest')
  })
})

// ═══════════════════════════════════════════════════════════
// 5. OUTPUT SCAN — Forbidden vocabulary detection
// ═══════════════════════════════════════════════════════════

describe('scanOutput', () => {
  it('detects forbidden EN terms', () => {
    const result = scanOutput('You should seek therapy for this condition.')
    expect(result.clean).toBe(false)
    expect(result.violations).toContain('therapy')
  })

  it('detects forbidden PL terms', () => {
    const result = scanOutput('Powinieneś szukać terapia i diagnoza.')
    expect(result.clean).toBe(false)
    expect(result.violations).toContain('terapia')
    expect(result.violations).toContain('diagnoza')
  })

  it('passes clean text', () => {
    const result = scanOutput('Your patterns currently align with the Explorer archetype.')
    expect(result.clean).toBe(true)
    expect(result.violations).toHaveLength(0)
  })

  it('detects through zero-width chars in output', () => {
    const result = scanOutput('the\u200Brapy is recommended')
    expect(result.clean).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════
// 6. OUTPUT SANITIZATION — Term replacement
// ═══════════════════════════════════════════════════════════

describe('sanitizeOutput', () => {
  it('replaces forbidden terms with structural equivalents', () => {
    const result = sanitizeOutput('Consider therapy for your mental health issues.')
    expect(result).toContain('structural analysis')
    expect(result).toContain('behavioral patterns')
    expect(result).not.toContain('therapy')
    expect(result).not.toContain('mental health')
  })

  it('replaces PL forbidden terms', () => {
    const result = sanitizeOutput('Terapia i diagnoza są potrzebne.')
    expect(result).toContain('analiza strukturalna')
    expect(result).toContain('klasyfikacja wzorców')
  })
})
