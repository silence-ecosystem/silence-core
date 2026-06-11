/**
 * [PATH]: 04_packages/@silence/jitai/src/evaluate.ts
 *
 * Deterministic JITAI rule evaluator.
 * No AI/ML. No randomness. Pure threshold logic with alpha-beta filtering.
 */

import { JitaiContext, JitaiResult, JitaiSignal, JitaiRule } from './types';
import { ALL_RULES } from './rules';
import { AlphaBetaFilter } from './alpha-beta';

export interface EvaluateOptions {
  readonly rules?: readonly JitaiRule[];
  readonly maxSignals?: number;
  readonly filter?: AlphaBetaFilter;
}

/**
 * Evaluate all rules against context.
 * Returns deterministic result: same context + same filter state → same output.
 */
export function evaluate(
  ctx: JitaiContext,
  options: EvaluateOptions = {}
): JitaiResult {
  const rules = options.rules ?? ALL_RULES;
  const maxSignals = options.maxSignals ?? 3;
  const filter = options.filter;

  const signals: JitaiSignal[] = [];
  const matchedRules: string[] = [];
  const now = Date.now();

  for (const rule of rules) {
    const signal = rule(ctx);
    if (!signal) continue;

    // Alpha-beta filter: reject if in cooldown or suppression window
    if (filter && !filter.allow(signal, now)) {
      continue;
    }

    signals.push(signal);
    matchedRules.push(signal.ruleId);

    if (signals.length >= maxSignals) {
      break;
    }
  }

  // Sort by priority (1 = highest)
  signals.sort((a, b) => a.priority - b.priority);

  return {
    triggered: signals.length > 0,
    signals,
    matchedRules,
  };
}

/**
 * Batch evaluate multiple contexts.
 * Useful for testing and CI equivalence verification.
 */
export function evaluateBatch(
  contexts: readonly JitaiContext[],
  options: EvaluateOptions = {}
): readonly JitaiResult[] {
  return contexts.map((ctx) => evaluate(ctx, options));
}

/**
 * Verify determinism: same context evaluated twice yields identical results.
 */
export function verifyDeterminism(ctx: JitaiContext, options: EvaluateOptions = {}): boolean {
  const r1 = evaluate(ctx, options);
  const r2 = evaluate(ctx, options);
  return (
    r1.triggered === r2.triggered &&
    r1.matchedRules.join(',') === r2.matchedRules.join(',') &&
    r1.signals.length === r2.signals.length &&
    r1.signals.every((s, i) => s.ruleId === r2.signals[i].ruleId)
  );
}
