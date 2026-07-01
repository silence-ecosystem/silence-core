// P0 Test: Pricing configuration (ADR §4.1)
import { describe, it, expect } from 'vitest'
import { PRICING, getPricing, FREE_TIER, PRO_TIER } from '../pricing'
import { PRO_PRICE_PLN, FREE_OBJECT_LIMIT } from '../app'

describe('Pricing — ADR §4.1 compliance', () => {
  it('PL price is 49 PLN', () => {
    expect(PRICING.PL.amount).toBe(49)
    expect(PRICING.PL.currency).toBe('PLN')
    expect(PRICING.PL.display).toContain('49')
  })

  it('US price is $12.99', () => {
    expect(PRICING.US.amount).toBe(12.99)
    expect(PRICING.US.currency).toBe('USD')
  })

  it('UK price is £10.99', () => {
    expect(PRICING.UK.amount).toBe(10.99)
    expect(PRICING.UK.currency).toBe('GBP')
  })

  it('EU price is €11.99', () => {
    expect(PRICING.EU.amount).toBe(11.99)
    expect(PRICING.EU.currency).toBe('EUR')
  })

  it('PRO_PRICE_PLN constant matches pricing', () => {
    expect(PRO_PRICE_PLN).toBe(49)
  })

  it('FREE_OBJECT_LIMIT is 7', () => {
    expect(FREE_OBJECT_LIMIT).toBe(7)
  })
})

describe('getPricing()', () => {
  it('returns PL by default', () => {
    const pricing = getPricing()
    expect(pricing.amount).toBe(49)
    expect(pricing.currency).toBe('PLN')
  })

  it('returns correct region pricing', () => {
    expect(getPricing('US').amount).toBe(12.99)
    expect(getPricing('UK').amount).toBe(10.99)
    expect(getPricing('EU').amount).toBe(11.99)
  })
})

describe('FREE_TIER config', () => {
  it('has 7 objects per week', () => {
    expect(FREE_TIER.objectsPerWeek).toBe(7)
  })

  it('has features list', () => {
    expect(FREE_TIER.features.length).toBeGreaterThan(0)
  })
})

describe('PRO_TIER config', () => {
  it('has features list', () => {
    expect(PRO_TIER.features.length).toBeGreaterThan(0)
  })
})
