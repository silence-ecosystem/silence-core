/**
 * [PATH]: 05_apps/garden/hooks/useJitaiSignals.ts
 *
 * JITAI rule evaluation wired to garden state.
 * Builds JitaiContext from local storage + garden state, evaluates rules,
 * returns active signals for UI display.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { evaluate, JitaiContext, JitaiSignal, ALL_RULES } from '@silence/sdk';
import type { GardenState } from '@/lib/gardenTypes';

function buildContext(state: GardenState | null): JitaiContext {
  const now = Date.now();
  const lastSession = state?.lastSessionTimestamp ?? 0;
  const inactivityMs = lastSession > 0 ? now - lastSession : 86400000;

  // Compute recent completions from sessionStorage telemetry
  let recentBreathCompletions = 0;
  let quietSessionCount = 0;
  let attentionDepth = 3;
  let intent: JitaiContext['intent'] = 'CALM';
  let experienceLevel: JitaiContext['experienceLevel'] = 'none';
  let selfReportDifficulty: JitaiContext['selfReportDifficulty'] = 'ok';
  let quietLevel = 0;

  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem('silence-breath-count-24h');
      if (raw) recentBreathCompletions = Number(raw);
    } catch {
      // sessionStorage may be unavailable
    }

    try {
      const raw = localStorage.getItem('silence-quiet-sessions');
      if (raw) {
        const sessions = JSON.parse(raw) as number[];
        const weekAgo = now - 86400000 * 7;
        quietSessionCount = sessions.filter((t) => t > weekAgo).length;
      }
    } catch {
      // ignore
    }

    attentionDepth = Number(localStorage.getItem('silence-attention-depth') || '3');
    intent = (localStorage.getItem('silence-intent') ?? 'CALM') as JitaiContext['intent'];
    experienceLevel = (localStorage.getItem('silence-experience') ?? 'none') as JitaiContext['experienceLevel'];
    selfReportDifficulty = (localStorage.getItem('silence-self-report') ?? 'ok') as JitaiContext['selfReportDifficulty'];
    quietLevel = Number(localStorage.getItem('silence-quiet-level') || '0');
  }

  const date = new Date();

  return {
    streakLength: state?.ritualStreak ?? 0,
    recentBreathCompletions,
    gardenActivityLevel: state ? Math.min(10, state.essence / 10) : 0,
    quietSessionCount,
    rhythmVariance: 0.3, // MVP static — computed from history in prod
    quotaProximity: 0.0, // MVP — no quota enforcement in open core
    inactivityWindowMs: inactivityMs,
    recentInterventionFrequency: 0, // MVP — no interventions tracked yet
    currentHour: date.getHours(),
    dayOfWeek: date.getDay(),
    attentionDepth: Math.min(5, Math.max(1, attentionDepth)),
    intent,
    experienceLevel,
    selfReportDifficulty,
    quietLevel,
  };
}

export function useJitaiSignals(state: GardenState | null) {
  const [signals, setSignals] = useState<readonly JitaiSignal[]>([]);
  const [lastEvaluated, setLastEvaluated] = useState<number>(0);

  const context = useMemo(() => buildContext(state), [state]);

  const evaluateRules = useCallback(() => {
    const result = evaluate(context, { rules: ALL_RULES, maxSignals: 2 });
    setSignals(result.signals);
    setLastEvaluated(Date.now());
  }, [context]);

  useEffect(() => {
    evaluateRules();
  }, [evaluateRules]);

  return { signals, evaluateRules, context };
}
