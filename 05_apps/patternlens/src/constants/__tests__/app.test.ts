// P0 Test: Application constants
import { describe, it, expect } from 'vitest'
import {
  FREE_OBJECT_LIMIT,
  PRO_PRICE_PLN,
  MAX_RECORDING_SECONDS,
  MIN_RECORDING_SECONDS,
  MIN_TEXT_LENGTH,
  MAX_TEXT_LENGTH,
  CLAUDE_MODEL,
  TIERS,
  REPORT_PHASES,
  RISK_LEVELS,
} from '../app'

describe('Application constants', () => {
  it('FREE_OBJECT_LIMIT is 7', () => {
    expect(FREE_OBJECT_LIMIT).toBe(7)
  })

  it('PRO_PRICE_PLN is 49', () => {
    expect(PRO_PRICE_PLN).toBe(49)
  })

  it('text length bounds are valid', () => {
    expect(MIN_TEXT_LENGTH).toBeGreaterThan(0)
    expect(MAX_TEXT_LENGTH).toBeGreaterThan(MIN_TEXT_LENGTH)
    expect(MAX_TEXT_LENGTH).toBe(5000)
  })

  it('recording limits are valid', () => {
    expect(MIN_RECORDING_SECONDS).toBeGreaterThan(0)
    expect(MAX_RECORDING_SECONDS).toBeGreaterThan(MIN_RECORDING_SECONDS)
    expect(MAX_RECORDING_SECONDS).toBe(300) // 5 minutes
  })

  it('CLAUDE_MODEL is defined', () => {
    expect(CLAUDE_MODEL).toBeTruthy()
    expect(typeof CLAUDE_MODEL).toBe('string')
  })

  it('TIERS has FREE and PRO', () => {
    expect(TIERS.FREE).toBe('FREE')
    expect(TIERS.PRO).toBe('PRO')
  })

  it('REPORT_PHASES has all 4 phases', () => {
    expect(REPORT_PHASES.CONTEXT).toBe('context')
    expect(REPORT_PHASES.TENSION).toBe('tension')
    expect(REPORT_PHASES.MEANING).toBe('meaning')
    expect(REPORT_PHASES.FUNCTION).toBe('function')
  })

  it('RISK_LEVELS has all levels', () => {
    expect(RISK_LEVELS.HIGH).toBe('HIGH')
    expect(RISK_LEVELS.MEDIUM).toBe('MEDIUM')
    expect(RISK_LEVELS.LOW).toBe('LOW')
    expect(RISK_LEVELS.NONE).toBe('NONE')
  })
})
