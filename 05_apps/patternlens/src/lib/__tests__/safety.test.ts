import { describe, test, expect } from 'vitest'
import { detectLocalPatterns, normalizeInput, scanOutput, sanitizeOutput, checkRateLimit } from '../safety'

describe('detectLocalPatterns', () => {
  test('past tense dominant', () => {
    const r = detectLocalPatterns('Yesterday I was feeling lost. I had been struggling for months ago.')
    expect(r.dominantTense).toBe('past')
  })
  test('present tense dominant', () => {
    const r = detectLocalPatterns('Right now I am currently dealing with this today.')
    expect(r.dominantTense).toBe('present')
  })
  test('future tense dominant', () => {
    const r = detectLocalPatterns('Tomorrow I will plan to change. I am going to improve soon.')
    expect(r.dominantTense).toBe('future')
  })
  test('high emotional intensity', () => {
    const r = detectLocalPatterns('ALWAYS the same!! I am EXTREMELY frustrated!!! This is NEVER going to change!!!')
    expect(r.emotionalIntensity).toBe('high')
  })
  test('low emotional intensity', () => {
    const r = detectLocalPatterns('I noticed a pattern in how I respond to deadlines at work.')
    expect(r.emotionalIntensity).toBe('low')
  })
  test('negation heavy', () => {
    const r = detectLocalPatterns("I never feel good. Not once. No hope. Nothing works. I can't do it.")
    expect(r.negationRatio).toBeGreaterThan(0.1)
  })
})

describe('normalizeInput', () => {
  test('strips zero-width characters', () => {
    expect(normalizeInput('m\u200Be\u200Bn\u200Bt\u200Ba\u200Bl')).toBe('mental')
  })
  test('strips control characters', () => {
    expect(normalizeInput('hello\x00world')).toBe('helloworld')
  })
})

describe('scanOutput', () => {
  test('detects forbidden terms', () => {
    const r = scanOutput('This is a therapy session for mental health diagnosis.')
    expect(r.clean).toBe(false)
    expect(r.violations).toContain('therapy')
    expect(r.violations).toContain('mental health')
    expect(r.violations).toContain('diagnosis')
  })
  test('passes clean text', () => {
    const r = scanOutput('Your patterns currently align with Explorer archetype.')
    expect(r.clean).toBe(true)
  })
})
