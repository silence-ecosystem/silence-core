import { describe, it, expect } from 'vitest';
import { generateReport, calculateConfidence } from '../lib/report';
import type { Profile, InputMeta, Report } from '../lib/types';

const baseProfile: Profile = {
  name: 'Test',
  focus: 'pattern',
  depth: 'standard',
  neurotype: 'default',
};

const baseMeta: InputMeta = {
  source: 'self',
  intensity: 3,
  context: 'praca',
};

const S11_FORBIDDEN = [
  'STRUCTURAL_REVIEW',
  'therapist',
  'ACTIVATION_STATE',
  'THRESHOLD_STATE',
  'THRESHOLD_STATE',
  'self-care',
  'PATTERN_REVIEW',
  'recovery',
  'GUIDED_ANALYSIS',
  'PATTERN_SIGNATURE',
  'SIGNAL_COLLAPSE',
  'trauma',
  'PATTERN_SIGNATURE',
  'SIGNAL_DIVERGENCEs',
  'STRUCTURAL_VARIANCE',
  'emotional support',
  'counseling',
  'psychologist',
  'avoid',
  'struggle',
  'needs',
  'trigger',
  'help',
  'support',
  'heal',
  'care',
  'trust',
  "you're not alone",
  'should',
];

function collectText(report: Report): string {
  const texts = [
    ...Object.values(report.phases),
    ...report.alternatives,
    report.comparison?.summary ?? '',
  ];
  return texts.join(' ').toLowerCase();
}

describe('generateReport', () => {
  it('blocks crisis input and returns crisisBlocked report', () => {
    const report = generateReport('chcę umrzeć', baseMeta, baseProfile);
    expect(report.crisisBlocked).toBe(true);
    expect(report.confidence).toBe(0);
    expect(report.alternatives).toEqual([]);
  });

  it('generates a report with confidence in valid range', () => {
    const report = generateReport('Nie mogę skupić się na zadaniach, ciągle rozpraszam się szczegółami.', baseMeta, baseProfile);
    expect(report.crisisBlocked).toBe(false);
    expect(report.confidence).toBeGreaterThanOrEqual(0.48);
    expect(report.confidence).toBeLessThanOrEqual(0.96);
  });

  it('generates all four phases', () => {
    const report = generateReport('Testowy opis sytuacji', baseMeta, baseProfile);
    expect(report.phases.context).toBeTruthy();
    expect(report.phases.tension).toBeTruthy();
    expect(report.phases.meaning).toBeTruthy();
    expect(report.phases.function).toBeTruthy();
  });

  it('generates two alternatives', () => {
    const report = generateReport('Testowy opis sytuacji', baseMeta, baseProfile);
    expect(report.alternatives).toHaveLength(2);
    expect(report.alternatives[0]).not.toEqual(report.alternatives[1]);
  });

  it('alternatives depend on profile focus', () => {
    const pattern = generateReport('Test', baseMeta, { ...baseProfile, focus: 'pattern' });
    const rhythm = generateReport('Test', baseMeta, { ...baseProfile, focus: 'rhythm' });
    expect(pattern.alternatives[0]).toContain('wzorca');
    expect(rhythm.alternatives[0]).toContain('rytmu');
  });

  it('returns comparison when previous reports exist', () => {
    const previous: Report[] = [
      {
        id: '1',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        input: 'Podobny kontekst pracy',
        meta: { source: 'self', intensity: 2, context: 'praca' },
        phases: { context: '', tension: '', meaning: '', function: '' },
        confidence: 0.6,
        alternatives: [],
        crisisBlocked: false,
      },
    ];
    const report = generateReport('Nie mogę skupić się w pracy', baseMeta, baseProfile, previous);
    expect(report.comparison).toBeDefined();
    expect(report.comparison!.previous).toHaveLength(1);
    expect(report.comparison!.trend).toBe('rising');
  });

  it('detects stable trend', () => {
    const previous: Report[] = [
      {
        id: '1',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        input: 'Inny kontekst',
        meta: { source: 'self', intensity: 3, context: 'dom' },
        phases: { context: '', tension: '', meaning: '', function: '' },
        confidence: 0.6,
        alternatives: [],
        crisisBlocked: false,
      },
    ];
    const report = generateReport('Test', baseMeta, baseProfile, previous);
    expect(report.comparison!.trend).toBe('stable');
  });

  it('returns no comparison without previous reports', () => {
    const report = generateReport('Test', baseMeta, baseProfile);
    expect(report.comparison).toBeUndefined();
  });

  it('produces higher confidence for deeper profile and richer input', () => {
    const minimal = generateReport('Test', { source: 'system', intensity: 1, context: '' }, { ...baseProfile, depth: 'surface' });
    const rich = generateReport(
      'Opisuję długi i szczegółowy kontekst, w którym wzorzec powtarza się wielokrotnie w różnych sytuacjach.',
      { source: 'self', intensity: 5, context: 'bardzo szczegółowy kontekst zawodowy' },
      { ...baseProfile, depth: 'deep' }
    );
    expect(rich.confidence).toBeGreaterThan(minimal.confidence);
  });

  it('does not use S11 forbidden terms in generated text', () => {
    const report = generateReport(
      'Szczegółowy opis zmiany rytmu i napięcia w codziennym funkcjonowaniu',
      baseMeta,
      baseProfile,
      [
        {
          id: 'p1',
          createdAt: new Date().toISOString(),
          input: 'Inny szczegółowy opis',
          meta: { source: 'observed', intensity: 2, context: 'dom' },
          phases: { context: '', tension: '', meaning: '', function: '' },
          confidence: 0.55,
          alternatives: [],
          crisisBlocked: false,
        },
      ]
    );
    const text = collectText(report);
    for (const term of S11_FORBIDDEN) {
      expect(text).not.toContain(term);
    }
  });
});

describe('calculateConfidence', () => {
  it('respects min and max bounds', () => {
    const low = calculateConfidence('x', { source: 'system', intensity: 1, context: '' }, { ...baseProfile, depth: 'surface' }, 0);
    const high = calculateConfidence(
      'a'.repeat(500),
      { source: 'self', intensity: 5, context: 'a'.repeat(100) },
      { ...baseProfile, depth: 'deep' },
      10
    );
    expect(low).toBeGreaterThanOrEqual(0.48);
    expect(high).toBeLessThanOrEqual(0.96);
  });
});
