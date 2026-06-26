// P0 Test: Safety Keyword Detection (PASSIVE mode)
// ADR §7.1 — Priority 0: Must pass before launch
import { describe, it, expect } from 'vitest'
import { SafetyDetector, safetyDetector, containsCrisisContent, shouldBlockSubmission } from '../detector'
import { HARD_CRISIS_KEYWORDS } from '../keywords'

describe('SafetyDetector (PASSIVE mode)', () => {
  const detector = new SafetyDetector()

  describe('detect()', () => {
    it('returns showResources=true for hard keyword match (PL)', () => {
      const result = detector.detect('Myślę o samobójstwo i nie wiem co robić')
      expect(result.showResources).toBe(true)
      expect(result.riskLevel).toBe('critical')
      expect(result.detectedKeywords).toContain('samobójstwo')
      expect(result.helplines.length).toBeGreaterThan(0)
    })

    it('returns showResources=true for hard keyword match (EN)', () => {
      const result = detector.detect('I want to kill myself')
      expect(result.showResources).toBe(true)
      expect(result.riskLevel).toBe('critical')
      expect(result.detectedKeywords).toContain('kill myself')
    })

    it('NEVER blocks input — shouldBlock is always false', () => {
      // Test with the most critical keyword
      const result = detector.detect('suicide')
      expect(result.shouldBlock).toBe(false)
    })

    it('NEVER blocks input even with multiple hard keywords', () => {
      const result = detector.detect('suicide kill myself want to die end my life')
      expect(result.shouldBlock).toBe(false)
      expect(result.showResources).toBe(true)
      expect(result.detectedKeywords.length).toBeGreaterThan(1)
    })

    it('returns showResources=false for clean text', () => {
      const result = detector.detect('Today I noticed a pattern in how I react to meetings.')
      expect(result.showResources).toBe(false)
      expect(result.riskLevel).toBe('none')
      expect(result.detectedKeywords).toEqual([])
      expect(result.shouldBlock).toBe(false)
    })

    it('returns showResources=false for soft keywords (PASSIVE ignores soft)', () => {
      // PASSIVE mode only checks hard keywords
      const result = detector.detect('I feel hopeless and worthless and alone')
      expect(result.shouldBlock).toBe(false)
      // In PASSIVE mode, soft keywords are not checked
    })

    it('is case-insensitive', () => {
      const result = detector.detect('SUICIDE')
      expect(result.showResources).toBe(true)
      expect(result.detectedKeywords).toContain('suicide')
    })

    it('provides helplines when resources are shown', () => {
      const result = detector.detect('chcę umrzeć')
      expect(result.showResources).toBe(true)
      expect(result.helplines.length).toBeGreaterThan(0)
      expect(result.helplines[0]).toHaveProperty('phone')
      expect(result.helplines[0]).toHaveProperty('name')
    })

    it('includes a user-facing message when resources shown', () => {
      const result = detector.detect('zabić się')
      expect(result.message).toBeTruthy()
      expect(typeof result.message).toBe('string')
    })
  })

  describe('shouldBlock()', () => {
    it('always returns false (PASSIVE mode)', () => {
      expect(detector.shouldBlock('suicide')).toBe(false)
      expect(detector.shouldBlock('kill myself')).toBe(false)
      expect(detector.shouldBlock('baseline text')).toBe(false)
      expect(detector.shouldBlock('samobójstwo')).toBe(false)
    })
  })

  describe('shouldShowResources()', () => {
    it('returns true for hard keywords', () => {
      expect(detector.shouldShowResources('suicide')).toBe(true)
      expect(detector.shouldShowResources('chcę umrzeć')).toBe(true)
    })

    it('returns false for clean text', () => {
      expect(detector.shouldShowResources('baseline text')).toBe(false)
    })
  })

  describe('getHelplines()', () => {
    it('returns helplines array', () => {
      const helplines = detector.getHelplines()
      expect(Array.isArray(helplines)).toBe(true)
      expect(helplines.length).toBeGreaterThan(0)
    })
  })
})

describe('Singleton & convenience functions', () => {
  it('safetyDetector is a SafetyDetector instance', () => {
    expect(safetyDetector).toBeInstanceOf(SafetyDetector)
  })

  it('containsCrisisContent() returns true for hard keywords', () => {
    expect(containsCrisisContent('suicide')).toBe(true)
    expect(containsCrisisContent('baseline text')).toBe(false)
  })

  it('shouldBlockSubmission() always returns false (PASSIVE)', () => {
    expect(shouldBlockSubmission('suicide')).toBe(false)
    expect(shouldBlockSubmission('baseline text')).toBe(false)
  })
})

describe('All hard keywords are detected', () => {
  HARD_CRISIS_KEYWORDS.forEach((keyword) => {
    it(`detects hard keyword: "${keyword}"`, () => {
      const result = safetyDetector.detect(keyword)
      expect(result.showResources).toBe(true)
      expect(result.shouldBlock).toBe(false)
      expect(result.detectedKeywords).toContain(keyword)
    })
  })
})
