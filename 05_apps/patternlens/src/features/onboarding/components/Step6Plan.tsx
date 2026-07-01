'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';

const PLAN: Record<string, string[]> = {
  sleep: ['Evening wind-down', 'Breath pacing', 'Screen curfew check', 'Body scan', 'Quiet loop', 'Reflection', 'Sleep quality review'],
  calm: ['Morning anchor', 'Tension scan', 'Mid-day reset', 'Grounding', 'Quiet loop', 'Pattern log', 'Week review'],
  patterns: ['Pattern capture', 'Dual-lens review', 'Archetype check', 'Context map', 'Tension log', 'Synthesis', 'Insight export'],
  curiosity: ['Daily observation', 'Question journal', 'First thought', 'Silence cycle', 'Pattern match', 'Curiosity log', 'Share insight'],
};

export default function Step6Plan() {
  const { t } = useLanguage();
  const { state, goNext } = useOnboardingState();
  const goal = state.primaryGoal ?? 'curiosity';
  const days = PLAN[goal] ?? PLAN.curiosity;

  const onboarding = (t.onboarding ?? {}) as Record<string, unknown>;
  const plan = (onboarding.plan ?? {}) as Record<string, string>;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
          {plan.title ?? 'Your 7-day discovery path'}
        </h2>
        <p className="text-[var(--text-secondary)] mb-6">
          {plan.subtitle ?? 'Tailored to your goal and starting point.'}
        </p>
        <ol className="space-y-3 mb-8">
          {days.map((day, i) => (
            <li
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]"
            >
              <span className="w-6 h-6 rounded-full bg-[var(--lens-a-muted)] text-[var(--lens-a)] text-xs flex items-center justify-center font-mono">
                {i + 1}
              </span>
              <span className="text-sm text-[var(--text-primary)]">{day}</span>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() => goNext('PLAN', 'PERMISSIONS')}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] rounded-2xl py-4 font-medium transition-colors"
        >
          {plan.cta ?? 'Start Day 1'}
        </button>
      </motion.div>
    </div>
  );
}
