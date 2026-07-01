'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { BREATH_CYCLE_MS } from '@silence/sdk';

export default function Step4Calibration() {
  const { t } = useLanguage();
  const { setBaselineResult, goNext } = useOnboardingState();
  const [state, setState] = useState<'ready' | 'running' | 'complete'>('ready');
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const duration = BREATH_CYCLE_MS;

  const finish = useCallback(
    (result: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setElapsed(result);
      setBaselineResult(Math.round(result));
      setState('complete');
    },
    [setBaselineResult]
  );

  const start = useCallback(() => {
    setState('running');
    startRef.current = performance.now();
    const tick = (now: number) => {
      const e = Math.min(now - startRef.current, duration);
      setElapsed(e);
      if (e < duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        finish(duration);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [duration, finish]);

  const handleDistracted = useCallback(() => {
    finish(elapsed);
  }, [finish, elapsed]);

  const handleContinue = useCallback(() => {
    goNext('BASELINE', 'CONSENTS');
  }, [goNext]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onboarding = (t.onboarding ?? {}) as Record<string, unknown>;
  const baseline = (onboarding.baseline ?? {}) as Record<string, string>;
  const seconds = (elapsed / 1000).toFixed(1);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center px-6 py-12 text-center">
      {state === 'ready' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
            {baseline.title ?? 'Your baseline silence'}
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            {baseline.instruction ?? 'Hold attention on the breath. Tap when thoughts pull you away.'}
          </p>
          <button
            type="button"
            onClick={start}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] rounded-2xl py-4 font-medium transition-colors"
          >
            {baseline.start ?? 'Begin'}
          </button>
        </motion.div>
      )}

      {state === 'running' && (
        <div className="w-full max-w-sm">
          <div className="text-4xl font-mono text-[var(--primary)] mb-8">{seconds}s</div>
          <button
            type="button"
            onClick={handleDistracted}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-2xl py-4 font-medium hover:border-[var(--primary)]/40 transition-colors"
          >
            {baseline.distracted ?? 'Thoughts appeared'}
          </button>
        </div>
      )}

      {state === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
            {baseline.completeTitle ?? 'Baseline recorded'}
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            {baseline.completeText ?? 'You sustained attention for'} {seconds}s
          </p>
          <button
            type="button"
            onClick={handleContinue}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] rounded-2xl py-4 font-medium transition-colors"
          >
            {(t.common ?? {}).next ?? 'Next'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
