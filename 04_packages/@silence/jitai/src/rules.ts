/**
 * [PATH]: 04_packages/@silence/jitai/src/rules.ts
 *
 * 20+ threshold-based JITAI rules.
 * No AI/ML. No probabilistic models. Pure boolean threshold logic.
 */

import { JitaiContext, JitaiSignal, JitaiRule } from './types';

// ---------------------------------------------------------------------------
// Helper factories
// ---------------------------------------------------------------------------

function rule(
  id: string,
  check: (ctx: JitaiContext) => boolean,
  signal: JitaiSignal
): JitaiRule {
  return (ctx) => (check(ctx) ? signal : null);
}

// ---------------------------------------------------------------------------
// R1-R5: Streak and completion rules
// ---------------------------------------------------------------------------

/** R1: Long streak — high engagement, sustain momentum */
export const r1LongStreak: JitaiRule = rule(
  'R1_LONG_STREAK',
  (ctx) => ctx.streakLength >= 7,
  { ruleId: 'R1', priority: 2, messageKey: 'streak_sustain', cooldownMs: 86400000 }
);

/** R2: Streak at risk — 1 day missed after 3+ streak */
export const r2StreakAtRisk: JitaiRule = rule(
  'R2_STREAK_AT_RISK',
  (ctx) => ctx.streakLength === 0 && ctx.recentBreathCompletions >= 3,
  { ruleId: 'R2', priority: 1, messageKey: 'streak_recover', cooldownMs: 43200000 }
);

/** R3: New streak start — first completion after gap */
export const r3NewStreakStart: JitaiRule = rule(
  'R3_NEW_STREAK_START',
  (ctx) => ctx.streakLength === 1 && ctx.recentBreathCompletions === 1,
  { ruleId: 'R3', priority: 3, messageKey: 'streak_begin', cooldownMs: 86400000 }
);

/** R4: Breath completion milestone — every 10 completions */
export const r4BreathMilestone: JitaiRule = rule(
  'R4_BREATH_MILESTONE',
  (ctx) => ctx.recentBreathCompletions > 0 && ctx.recentBreathCompletions % 10 === 0,
  { ruleId: 'R4', priority: 3, messageKey: 'breath_milestone', cooldownMs: 86400000 }
);

/** R5: Low recent completions — < 2 in 24h */
export const r5LowCompletion: JitaiRule = rule(
  'R5_LOW_COMPLETION',
  (ctx) => ctx.recentBreathCompletions < 2 && ctx.streakLength >= 1,
  { ruleId: 'R5', priority: 2, messageKey: 'completion_nudge', cooldownMs: 21600000 }
);

// ---------------------------------------------------------------------------
// R6-R10: Garden and activity rules
// ---------------------------------------------------------------------------

/** R6: High garden activity — reinforce positive behavior */
export const r6HighGardenActivity: JitaiRule = rule(
  'R6_HIGH_GARDEN_ACTIVITY',
  (ctx) => ctx.gardenActivityLevel >= 8,
  { ruleId: 'R6', priority: 3, messageKey: 'garden_thrive', cooldownMs: 86400000 }
);

/** R7: Dormant garden — no activity for 48h */
export const r7DormantGarden: JitaiRule = rule(
  'R7_DORMANT_GARDEN',
  (ctx) => ctx.gardenActivityLevel === 0 && ctx.inactivityWindowMs > 172800000,
  { ruleId: 'R7', priority: 1, messageKey: 'garden_revive', cooldownMs: 86400000 }
);

/** R8: Quiet session surplus — > 5 sessions this week */
export const r8QuietSurplus: JitaiRule = rule(
  'R8_QUIET_SURPLUS',
  (ctx) => ctx.quietSessionCount >= 5,
  { ruleId: 'R8', priority: 3, messageKey: 'quiet_celebrate', cooldownMs: 604800000 }
);

/** R9: No quiet sessions — 0 in 7 days */
export const r9NoQuietSessions: JitaiRule = rule(
  'R9_NO_QUIET_SESSIONS',
  (ctx) => ctx.quietSessionCount === 0 && ctx.inactivityWindowMs > 604800000,
  { ruleId: 'R9', priority: 1, messageKey: 'quiet_invite', cooldownMs: 86400000 }
);

/** R10: Moderate garden activity — 4-7, gentle nudge */
export const r10ModerateGarden: JitaiRule = rule(
  'R10_MODERATE_GARDEN',
  (ctx) => ctx.gardenActivityLevel >= 4 && ctx.gardenActivityLevel <= 7,
  { ruleId: 'R10', priority: 3, messageKey: 'garden_grow', cooldownMs: 86400000 }
);

// ---------------------------------------------------------------------------
// R11-R15: Rhythm and timing rules
// ---------------------------------------------------------------------------

/** R11: High rhythm variance — irregular pattern detected */
export const r11HighVariance: JitaiRule = rule(
  'R11_HIGH_VARIANCE',
  (ctx) => ctx.rhythmVariance > 0.7,
  { ruleId: 'R11', priority: 2, messageKey: 'rhythm_stabilize', cooldownMs: 86400000 }
);

/** R12: Very low variance — too rigid, suggest flexibility */
export const r12LowVariance: JitaiRule = rule(
  'R12_LOW_VARIANCE',
  (ctx) => ctx.rhythmVariance < 0.1 && ctx.recentBreathCompletions > 5,
  { ruleId: 'R12', priority: 3, messageKey: 'rhythm_flex', cooldownMs: 86400000 }
);

/** R13: Morning window — 6-9 AM, high depth */
export const r13MorningWindow: JitaiRule = rule(
  'R13_MORNING_WINDOW',
  (ctx) => ctx.currentHour >= 6 && ctx.currentHour <= 9 && ctx.attentionDepth >= 4,
  { ruleId: 'R13', priority: 2, messageKey: 'morning_focus', cooldownMs: 86400000 }
);

/** R14: Evening wind-down — 8-10 PM, low depth */
export const r14EveningWindDown: JitaiRule = rule(
  'R14_EVENING_WIND_DOWN',
  (ctx) => ctx.currentHour >= 20 && ctx.currentHour <= 22 && ctx.attentionDepth <= 2,
  { ruleId: 'R14', priority: 2, messageKey: 'evening_calm', cooldownMs: 86400000 }
);

/** R15: Weekend pattern — Saturday/Sunday, low activity */
export const r15WeekendPattern: JitaiRule = rule(
  'R15_WEEKEND_PATTERN',
  (ctx) => (ctx.dayOfWeek === 0 || ctx.dayOfWeek === 6) && ctx.quietSessionCount < 2,
  { ruleId: 'R15', priority: 3, messageKey: 'weekend_explore', cooldownMs: 604800000 }
);

// ---------------------------------------------------------------------------
// R16-R20: Quota and intervention frequency rules
// ---------------------------------------------------------------------------

/** R16: Quota critical — > 90% used */
export const r16QuotaCritical: JitaiRule = rule(
  'R16_QUOTA_CRITICAL',
  (ctx) => ctx.quotaProximity >= 0.9,
  { ruleId: 'R16', priority: 1, messageKey: 'quota_critical', cooldownMs: 3600000 }
);

/** R17: Quota warning — 70-90% used */
export const r17QuotaWarning: JitaiRule = rule(
  'R17_QUOTA_WARNING',
  (ctx) => ctx.quotaProximity >= 0.7 && ctx.quotaProximity < 0.9,
  { ruleId: 'R17', priority: 2, messageKey: 'quota_warning', cooldownMs: 21600000 }
);

/** R18: Intervention frequency high — > 3 per hour */
export const r18HighFrequency: JitaiRule = rule(
  'R18_HIGH_FREQUENCY',
  (ctx) => ctx.recentInterventionFrequency > 3,
  { ruleId: 'R18', priority: 1, messageKey: 'frequency_reduce', cooldownMs: 3600000 }
);

/** R19: Intervention frequency low — < 1 per 6h */
export const r19LowFrequency: JitaiRule = rule(
  'R19_LOW_FREQUENCY',
  (ctx) => ctx.recentInterventionFrequency < 1 && ctx.inactivityWindowMs > 21600000,
  { ruleId: 'R19', priority: 2, messageKey: 'frequency_increase', cooldownMs: 21600000 }
);

/** R20: Deep attention + quota available — premium slot */
export const r20DeepAttentionQuota: JitaiRule = rule(
  'R20_DEEP_ATTENTION_QUOTA',
  (ctx) => ctx.attentionDepth >= 4 && ctx.quotaProximity < 0.5,
  { ruleId: 'R20', priority: 1, messageKey: 'deep_explore', cooldownMs: 86400000 }
);

// ---------------------------------------------------------------------------
// R21-R22: Alpha-beta filter safety rules
// ---------------------------------------------------------------------------

/** R21: Inactivity spike — > 72h inactive after daily habit */
export const r21InactivitySpike: JitaiRule = rule(
  'R21_INACTIVITY_SPIKE',
  (ctx) => ctx.inactivityWindowMs > 259200000 && ctx.streakLength >= 5,
  { ruleId: 'R21', priority: 1, messageKey: 'inactivity_return', cooldownMs: 86400000 }
);

/** R22: First-time user — < 3 total interactions */
export const r22FirstTimeUser: JitaiRule = rule(
  'R22_FIRST_TIME_USER',
  (ctx) => ctx.recentBreathCompletions <= 2 && ctx.quietSessionCount <= 1,
  { ruleId: 'R22', priority: 1, messageKey: 'onboard_welcome', cooldownMs: 172800000 }
);

// ---------------------------------------------------------------------------
// R23-R26: Onboarding-derived signal rules
// ---------------------------------------------------------------------------

/** R23: Intent Calm + low experience — suggest shorter sessions */
export const r23CalmBeginner: JitaiRule = rule(
  'R23_CALM_BEGINNER',
  (ctx) => ctx.intent === 'CALM' && ctx.experienceLevel === 'none',
  { ruleId: 'R23', priority: 2, messageKey: 'calm_beginner', cooldownMs: 86400000 }
);

/** R24: Self-report too_hard — reduce intensity */
export const r24TooHard: JitaiRule = rule(
  'R24_TOO_HARD',
  (ctx) => ctx.selfReportDifficulty === 'too_hard',
  { ruleId: 'R24', priority: 1, messageKey: 'difficulty_reduce', cooldownMs: 86400000 }
);

/** R25: Self-report too_easy — increase intensity */
export const r25TooEasy: JitaiRule = rule(
  'R25_TOO_EASY',
  (ctx) => ctx.selfReportDifficulty === 'too_easy',
  { ruleId: 'R25', priority: 2, messageKey: 'difficulty_increase', cooldownMs: 86400000 }
);

/** R26: Low quiet level (0-1) — high protection mode */
export const r26LowQuietLevel: JitaiRule = rule(
  'R26_LOW_QUIET_LEVEL',
  (ctx) => (ctx.quietLevel ?? 2) <= 1,
  { ruleId: 'R26', priority: 1, messageKey: 'protection_mode', cooldownMs: 86400000 }
);

// ---------------------------------------------------------------------------
// Rule registry
// ---------------------------------------------------------------------------

export const ALL_RULES: readonly JitaiRule[] = [
  r1LongStreak,
  r2StreakAtRisk,
  r3NewStreakStart,
  r4BreathMilestone,
  r5LowCompletion,
  r6HighGardenActivity,
  r7DormantGarden,
  r8QuietSurplus,
  r9NoQuietSessions,
  r10ModerateGarden,
  r11HighVariance,
  r12LowVariance,
  r13MorningWindow,
  r14EveningWindDown,
  r15WeekendPattern,
  r16QuotaCritical,
  r17QuotaWarning,
  r18HighFrequency,
  r19LowFrequency,
  r20DeepAttentionQuota,
  r21InactivitySpike,
  r22FirstTimeUser,
  r23CalmBeginner,
  r24TooHard,
  r25TooEasy,
  r26LowQuietLevel,
];
