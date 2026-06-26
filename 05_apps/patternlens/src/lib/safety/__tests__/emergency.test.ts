// P0 Test: Emergency detection (PASSIVE mode)
import { describe, it, expect } from 'vitest'
import { detectCrisis, getEmergencyResources, createEmergencyResponse } from '../emergency'

describe('detectCrisis() — PASSIVE mode', () => {
  it('never blocks — shouldBlock is always false', () => {
    const result = detectCrisis('suicide')
    expect(result.shouldBlock).toBe(false)
  })

  it('shows resources for hard keyword (EN)', () => {
    const result = detectCrisis('I want to kill myself')
    expect(result.showResources).toBe(true)
    expect(result.isEmergency).toBe(true)
    expect(result.riskLevel).toBe('critical')
    expect(result.detectedKeywords).toContain('kill myself')
    expect(result.resources.length).toBeGreaterThan(0)
  })

  it('shows resources for hard keyword (PL)', () => {
    const result = detectCrisis('samobójstwo')
    expect(result.showResources).toBe(true)
    expect(result.isEmergency).toBe(true)
    expect(result.detectedKeywords).toContain('samobójstwo')
  })

  it('does NOT show resources for clean text', () => {
    const result = detectCrisis('I noticed a pattern in how I handle conflict')
    expect(result.showResources).toBe(false)
    expect(result.isEmergency).toBe(false)
    expect(result.riskLevel).toBe('none')
    expect(result.detectedKeywords).toEqual([])
    expect(result.message).toBe('')
  })

  it('includes message when resources shown', () => {
    const result = detectCrisis('chcę umrzeć')
    expect(result.message).toBeTruthy()
    expect(result.message.length).toBeGreaterThan(0)
  })

  it('is case-insensitive', () => {
    const result = detectCrisis('SUICIDE KILL MYSELF')
    expect(result.showResources).toBe(true)
    expect(result.detectedKeywords.length).toBeGreaterThanOrEqual(1)
  })
})

describe('getEmergencyResources()', () => {
  it('returns array of helplines', () => {
    const resources = getEmergencyResources()
    expect(Array.isArray(resources)).toBe(true)
    expect(resources.length).toBeGreaterThan(0)
    expect(resources[0]).toHaveProperty('phone')
    expect(resources[0]).toHaveProperty('name')
  })
})

describe('createEmergencyResponse()', () => {
  it('creates clean response by default', () => {
    const response = createEmergencyResponse()
    expect(response.shouldBlock).toBe(false)
    expect(response.showResources).toBe(false)
    expect(response.isEmergency).toBe(false)
    expect(response.riskLevel).toBe('none')
  })

  it('creates resource-showing response when requested', () => {
    const response = createEmergencyResponse(true)
    expect(response.shouldBlock).toBe(false)
    expect(response.showResources).toBe(true)
    expect(response.isEmergency).toBe(true)
    expect(response.riskLevel).toBe('critical')
    expect(response.resources.length).toBeGreaterThan(0)
  })
})
