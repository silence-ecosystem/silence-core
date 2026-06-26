// P0 Test: CrisisDetectionSystem (PASSIVE mode)
import { describe, it, expect } from 'vitest'
import { CrisisDetectionSystem, crisisDetection, getCrisisResourcesByLocale } from '../crisis-detection'

describe('CrisisDetectionSystem — PASSIVE mode', () => {
  const system = new CrisisDetectionSystem()

  describe('checkContent()', () => {
    it('never blocks — blocked is always false', () => {
      const result = system.checkContent('suicide kill myself want to die')
      expect(result.blocked).toBe(false)
    })

    it('returns SHOW_RESOURCES for hard keyword match', () => {
      const result = system.checkContent('samobójstwo')
      expect(result.action).toBe('SHOW_RESOURCES')
      expect(result.level).toBe('critical')
      expect(result.matchedKeywords).toContain('samobójstwo')
    })

    it('returns PROCEED for clean text', () => {
      const result = system.checkContent('I observed a recurring structure in my behavior')
      expect(result.action).toBe('PROCEED')
      expect(result.level).toBe('none')
      expect(result.matchedKeywords).toBeUndefined()
    })

    it('includes timestamp', () => {
      const result = system.checkContent('test')
      expect(result.timestamp).toBeTruthy()
      expect(() => new Date(result.timestamp)).not.toThrow()
    })

    it('is synchronous (no async, no Claude assessment)', () => {
      // checkContent should be synchronous in PASSIVE mode
      const result = system.checkContent('suicide')
      expect(result).toBeDefined()
      // Not a Promise
      expect(result).not.toBeInstanceOf(Promise)
    })
  })
})

describe('crisisDetection singleton', () => {
  it('is a CrisisDetectionSystem instance', () => {
    expect(crisisDetection).toBeInstanceOf(CrisisDetectionSystem)
  })

  it('works correctly', () => {
    const result = crisisDetection.checkContent('baseline text')
    expect(result.blocked).toBe(false)
    expect(result.action).toBe('PROCEED')
  })
})

describe('getCrisisResourcesByLocale()', () => {
  it('returns PL resources by default', () => {
    const resources = getCrisisResourcesByLocale()
    expect(resources.length).toBeGreaterThan(0)
    expect(resources[0].region).toBe('PL')
  })

  it('returns US resources for en-US', () => {
    const resources = getCrisisResourcesByLocale('en-US')
    expect(resources.length).toBeGreaterThan(0)
    expect(resources[0].region).toBe('US')
  })

  it('returns UK resources for en-GB', () => {
    const resources = getCrisisResourcesByLocale('en-GB')
    expect(resources.length).toBeGreaterThan(0)
    expect(resources[0].region).toBe('UK')
  })

  it('falls back to PL for unknown locale', () => {
    const resources = getCrisisResourcesByLocale('xx-YY')
    expect(resources.length).toBeGreaterThan(0)
    expect(resources[0].region).toBe('PL')
  })
})
