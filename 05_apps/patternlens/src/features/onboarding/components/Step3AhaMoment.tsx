'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { cn } from '@/constants/design-system';
import GoldenRatioSilence from './GoldenRatioSilence';

type Phase = 'SILENCE' | 'QUESTION' | 'RESULT';

type ThoughtCategory =
  | 'PRESENT_AWARENESS'
  | 'CURIOUS_OBSERVATION'
  | 'LOOP_SIGNATURE'
  | 'AMPLIFICATION_SIGNATURE'
  | 'UNKNOWN';

const CATEGORIES: { value: ThoughtCategory; key: string; adaptive: boolean }[] = [
  { value: 'PRESENT_AWARENESS', key: 'observation.category.PRESENT_AWARENESS', adaptive: true },
  { value: 'CURIOUS_OBSERVATION', key: 'observation.category.CURIOUS_OBSERVATION', adaptive: true },
  { value: 'LOOP_SIGNATURE', key: 'observation.category.LOOP_SIGNATURE', adaptive: false },
  { value: 'AMPLIFICATION_SIGNATURE', key: 'observation.category.AMPLIFICATION_SIGNATURE', adaptive: false },
  { value: 'UNKNOWN', key: 'observation.category.UNKNOWN', adaptive: false },
];

export default function Step3AhaMoment() {
  const { t } = useLanguage();
  const { setFirstObservation, goNext } = useOnboardingState();
  const [phase, setPhase] = useState<Phase>('SILENCE');
  const [selected, setSelected] = useState<ThoughtCategory | null>(null);

  const handleSilenceComplete = useCallback(() => {
    setPhase('QUESTION');
  }, []);

  const handleSelect = useCallback(
    (cat: ThoughtCategory) => {
      setSelected(cat);
      setFirstObservation(cat);
      setPhase('RESULT');
    },
    [setFirstObservation]
  );

  const handleContinue = useCallback(() => {
    goNext('FIRST_OBSERVATION', 'BASELINE');
  }, [goNext]);

  const categoryLabels = (t.onboarding?.observation?.category ?? {}) as Record<string, string>;
  const resultLabels = (t.onboarding?.observation?.result ?? {}) as Record<string, string>;
  const selectedResult = selected ? resultLabels[selected] : resultLabels.UNKNOWN;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center px-6 py-12">
      <AnimatePresence mode="wait">
        {phase === 'SILENCE' && (
          <motion.div
            key="silence"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-sm mx-auto mb-8 text-center">
              <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
                {t.onboarding?.observation?.title}
              </h1>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {t.onboarding?.observation?.instruction}
              </p>
            </div>
            <div className="w-full max-w-2xl aspect-video max-h-[420px] rounded-3xl overflow-hidden border border-[var(--border)] bg-black/80 shadow-xl">
              <GoldenRatioSilence onComplete={handleSilenceComplete} jitaiEnabled={false} />
            </div>
            <p className="mt-6 text-[var(--text-muted)] text-xs text-center max-w-xs">
              {t.onboarding?.observation?.timerReady}
            </p>
          </motion.div>
        )}

        {phase === 'QUESTION' && (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-sm"
          >
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
              {t.onboarding?.observation?.question}
            </h2>
            <div className="space-y-3">
              {CATEGORIES.map(({ value, adaptive }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelect(value)}
                  className={cn(
                    'w-full text-left rounded-xl px-4 py-3.5 text-sm font-medium border transition-all',
                    adaptive
                      ? 'bg-[var(--lens-a-muted)] border-[var(--lens-a-border)] text-[var(--text-primary)] hover:border-[var(--lens-a)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/40'
                  )}
                >
                  {categoryLabels[value] ?? value}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'RESULT' && selected && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm text-center"
          >
            <p className="text-[var(--text-muted)] text-sm mb-2">
              {t.onboarding?.observation?.resultPrefix}
            </p>
            <p className="text-[var(--text-primary)] text-lg font-medium mb-8">
              {selectedResult}
            </p>
            <button
              type="button"
              onClick={handleContinue}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] rounded-2xl py-4 font-medium transition-colors"
            >
              {t.common?.next ?? 'Next'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
