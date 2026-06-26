'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { cn } from '@/constants/design-system';

type SubStep = 'GOAL' | 'EXPERIENCE' | 'TIME';

const GOALS = ['sleep', 'calm', 'patterns', 'curiosity'] as const;
const EXPERIENCES = ['beginner', 'some', 'advanced'] as const;
const TIMES = ['morning', 'evening', 'varies'] as const;

export default function Step2Intent() {
  const { t } = useLanguage();
  const { setPrimaryGoal, setExperienceLevel, setPracticeTime, goNext } = useOnboardingState();
  const [subStep, setSubStep] = useState<SubStep>('GOAL');

  const onboarding = (t.onboarding ?? {}) as Record<string, unknown>;
  const intent = (onboarding.intent ?? {}) as Record<string, unknown>;

  const handleGoal = (goal: string) => {
    setPrimaryGoal(goal);
    setSubStep('EXPERIENCE');
  };

  const handleExperience = (level: string) => {
    setExperienceLevel(level);
    setSubStep('TIME');
  };

  const handleTime = (time: string) => {
    setPracticeTime(time);
    goNext('INTENT', 'FIRST_OBSERVATION');
  };

  const renderOptions = (
    options: readonly string[],
    onSelect: (value: string) => void,
    labels: Record<string, string>,
    title: string
  ) => (
    <div className="w-full max-w-sm">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">{title}</h2>
      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={cn(
              'w-full text-left rounded-xl px-4 py-3.5 text-sm font-medium border transition-all',
              'bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/40 hover:text-[var(--text-primary)]'
            )}
          >
            {labels[opt] ?? opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center px-6 py-12">
      <AnimatePresence mode="wait">
        {subStep === 'GOAL' && (
          <motion.div
            key="goal"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
          >
            {renderOptions(
              GOALS,
              handleGoal,
              (intent.goalLabels ?? {}) as Record<string, string>,
              (intent.goalTitle ?? 'What brings you here?') as string
            )}
          </motion.div>
        )}
        {subStep === 'EXPERIENCE' && (
          <motion.div
            key="experience"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
          >
            {renderOptions(
              EXPERIENCES,
              handleExperience,
              (intent.experienceLabels ?? {}) as Record<string, string>,
              (intent.experienceTitle ?? 'Your experience') as string
            )}
          </motion.div>
        )}
        {subStep === 'TIME' && (
          <motion.div
            key="time"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
          >
            {renderOptions(
              TIMES,
              handleTime,
              (intent.timeLabels ?? {}) as Record<string, string>,
              (intent.timeTitle ?? 'When do you practice?') as string
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
