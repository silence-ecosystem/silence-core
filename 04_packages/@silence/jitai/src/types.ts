/**
 * [PATH]: 04_packages/@silence/jitai/src/types.ts
 *
 * JITAI rule engine types — S11-safe structural vocabulary.
 */

export interface JitaiContext {
  readonly streakLength: number;           // consecutive completions
  readonly recentBreathCompletions: number; // last 24h
  readonly gardenActivityLevel: number;    // 0-10
  readonly quietSessionCount: number;      // last 7 days
  readonly rhythmVariance: number;         // 0.0-1.0
  readonly quotaProximity: number;         // 0.0-1.0 (1.0 = at limit)
  readonly inactivityWindowMs: number;     // ms since last interaction
  readonly recentInterventionFrequency: number; // per hour
  readonly currentHour: number;            // 0-23
  readonly dayOfWeek: number;             // 0-6
  readonly attentionDepth: number;         // 1-5
  readonly intent?: 'FLOW' | 'FOCUS' | 'CALM';
  readonly experienceLevel?: 'none' | 'occasional' | 'regular';
  readonly selfReportDifficulty?: 'too_hard' | 'ok' | 'too_easy';
  readonly quietLevel?: number;           // 0-4
}

export interface JitaiSignal {
  readonly ruleId: string;
  readonly priority: 1 | 2 | 3; // 1 = highest
  readonly messageKey: string;
  readonly cooldownMs: number;
}

export interface JitaiResult {
  readonly triggered: boolean;
  readonly signals: readonly JitaiSignal[];
  readonly matchedRules: readonly string[];
}

export type JitaiRule = (ctx: JitaiContext) => JitaiSignal | null;
