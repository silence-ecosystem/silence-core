/**
 * [PATH]: 05_apps/silence-objects/lib/report.ts
 *
 * Deterministic report generation for the SILENCE.OBJECTS Command Center.
 * No network, no randomness beyond UUID/timestamp, no side effects.
 */

import { detectCrisis, shouldBlock } from './crisis';
import type { Profile, InputMeta, Report, ReportPhase, Comparison, ComparedReport, Trend } from './types';

const PHASES: ReportPhase[] = ['context', 'tension', 'meaning', 'function'];

const PHASE_LABELS: Record<ReportPhase, string> = {
  context: 'Kontekst',
  tension: 'Napięcie',
  meaning: 'Znaczenie',
  function: 'Funkcja',
};

const FOCUS_LABELS: Record<Profile['focus'], string> = {
  pattern: 'wzorca',
  rhythm: 'rytmu',
  tension: 'napięcia',
  function: 'funkcji',
  structure: 'struktury',
};

const SOURCE_WEIGHTS: Record<InputMeta['source'], number> = {
  self: 0.05,
  observed: 0.03,
  system: 0.01,
};

const DEPTH_WEIGHTS: Record<Profile['depth'], number> = {
  surface: 0,
  standard: 0.03,
  deep: 0.05,
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function calculateConfidence(
  input: string,
  meta: InputMeta,
  profile: Profile,
  previousCount: number
): number {
  const inputScore = Math.min(Math.floor(input.length / 20) * 0.02, 0.1);
  const contextScore = meta.context.length > 15 ? 0.05 : meta.context.length > 3 ? 0.03 : 0;
  const intensityScore = meta.intensity * 0.02;
  const sourceScore = SOURCE_WEIGHTS[meta.source];
  const depthScore = DEPTH_WEIGHTS[profile.depth];
  const focusScore = 0.02;
  const historyScore = Math.min(previousCount * 0.02, 0.06);

  const confidence = 0.5 + inputScore + contextScore + intensityScore + sourceScore + depthScore + focusScore + historyScore;
  return round2(clamp(confidence, 0.48, 0.96));
}

function generatePhases(input: string, meta: InputMeta, profile: Profile): Record<ReportPhase, string> {
  const focus = FOCUS_LABELS[profile.focus];
  const intensityWord = INTENSITY_WORDS[meta.intensity - 1];

  return {
    context: `Opisany zapis pojawia się w kontekście ${meta.context || 'nieokreślonym'}, z intensywnością ${meta.intensity} (${intensityWord}). Wejście pochodzi z perspektywy ${meta.source}.`,
    tension: `Napięcie strukturalne jest zlokalizowane wokół ${focus}. Wskazuje na obszar o podwyższonym natężeniu aktywacji w danym cyklu.`,
    meaning: `Wzorzec można odczytać jako sygnał o równowadze między aktywacją a supresją. Nie jest to cecha stała, lecz zapis relacji w danym momencie.`,
    function: `Funkcjonalnie ten zapis wydaje się regulować przepływ uwagi w obliczu ${meta.intensity >= 4 ? 'wzmożonego' : 'zmiennego'} natężenia bodźców w polu ${focus}.`,
  };
}

const INTENSITY_WORDS = ['minimalna', 'niska', 'umiarkowana', 'podwyższona', 'wysoka'];

function generateAlternatives(profile: Profile): string[] {
  const focus = FOCUS_LABELS[profile.focus];

  const byFocus: Record<Profile['focus'], string> = {
    pattern: `Z perspektywy ${focus}: obserwowany zapis może być powtarzalną sekwencją, a nie trwałą cechą.`,
    rhythm: `Z perspektywy ${focus}: zapis może odzwierciedlać chwilowe zaburzenie cyklu, a nie stałą niestabilność.`,
    tension: `Z perspektywy ${focus}: napięcie może być lokalnym skutkiem obciążenia, a nie fundamentalnym konfliktem.`,
    function: `Z perspektywy ${focus}: zapis może pełnić rolę ochronną dla przepływu uwagi, a nie być błędem regulacji.`,
    structure: `Z perspektywy ${focus}: zapis może być przejściowym przestawieniem ram, a nie trwałą deformacją.`,
  };

  const neutral = `Neutralny odczyt: opisany zapis może być efektem zmiany kontekstu, a nie wewnętrznej właściwości systemu.`;

  return [byFocus[profile.focus], neutral];
}

function tokenize(text: string): Set<string> {
  const normalized = text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ' ');
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);
  return new Set(words);
}

function similarityScore(a: string, b: string): number {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  if (tokensA.size === 0 && tokensB.size === 0) return 1;
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  const intersection = new Set([...tokensA].filter((x) => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);
  return round2(intersection.size / union.size);
}

function calculateTrend(currentIntensity: number, previous: ComparedReport[]): Trend {
  if (previous.length === 0) return 'new';
  const avgIntensity = previous.reduce((sum, r) => sum + r.intensity, 0) / previous.length;
  if (currentIntensity > avgIntensity + 0.5) return 'rising';
  if (currentIntensity < avgIntensity - 0.5) return 'falling';
  return 'stable';
}

function buildComparison(input: string, meta: InputMeta, confidence: number, previousReports: Report[]): Comparison | undefined {
  if (previousReports.length === 0) return undefined;

  const previous = previousReports
    .slice(0, 3)
    .map((r): ComparedReport => ({
      id: r.id,
      createdAt: r.createdAt,
      similarityScore: similarityScore(`${input} ${meta.context}`, `${r.input} ${r.meta.context}`),
      intensity: r.meta.intensity,
      confidence: r.confidence,
    }));

  const trend = calculateTrend(meta.intensity, previous);
  const trendLabels: Record<Trend, string> = {
    rising: 'intensywność rośnie względem ostatnich zapisów',
    falling: 'intensywność maleje względem ostatnich zapisów',
    stable: 'intensywność pozostaje stabilna względem ostatnich zapisów',
    new: 'brak wcześniejszych zapisów do porównania',
  };

  const avgSimilarity = round2(previous.reduce((sum, r) => sum + r.similarityScore, 0) / previous.length);
  const summary = `Trend: ${trendLabels[trend]}. Średnie podobieństwo do ${previous.length} poprzednie${previous.length === 1 ? 'go' : 'ch'} zapis${previous.length === 1 ? 'u' : 'ów'}: ${Math.round(avgSimilarity * 100)}%.`;

  return { trend, previous, summary };
}

export function generateReport(
  input: string,
  meta: InputMeta,
  profile: Profile,
  previousReports: Report[] = []
): Report {
  const crisis = detectCrisis(input);

  if (shouldBlock(crisis.level)) {
    return {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      input,
      meta,
      phases: { context: '', tension: '', meaning: '', function: '' },
      confidence: 0,
      alternatives: [],
      crisisBlocked: true,
    };
  }

  const confidence = calculateConfidence(input, meta, profile, previousReports.length);
  const phases = generatePhases(input, meta, profile);
  const alternatives = generateAlternatives(profile);
  const comparison = buildComparison(input, meta, confidence, previousReports);

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    meta,
    phases,
    confidence,
    alternatives,
    comparison,
    crisisBlocked: false,
  };
}

export { PHASES, PHASE_LABELS };
