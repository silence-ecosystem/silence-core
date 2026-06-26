'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';

export default function Step7Permissions() {
  const { t } = useLanguage();
  const { completeOnboarding } = useOnboardingState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onboarding = (t.onboarding ?? {}) as Record<string, unknown>;
  const permissions = (onboarding.permissions ?? {}) as Record<string, string>;
  const common = (t.common ?? {}) as Record<string, string>;

  const startNow = async () => {
    setLoading(true);
    completeOnboarding();
    router.push('/dashboard');
  };

  const remindLater = () => {
    completeOnboarding();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center px-6 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
          {permissions.title ?? 'Your first session is ready.'}
        </h2>
        <p className="text-[var(--text-secondary)] mb-8">
          {permissions.subtitle ?? 'When do you want to start?'}
        </p>
        <button
          type="button"
          onClick={startNow}
          disabled={loading}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] rounded-2xl py-4 font-medium mb-4 transition-colors disabled:opacity-50"
        >
          {loading ? common.loading ?? 'Loading...' : permissions.ctaNow ?? 'Start now'}
        </button>
        <button
          type="button"
          onClick={remindLater}
          className="w-full bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] rounded-2xl py-4 font-medium hover:border-[var(--primary)]/40 transition-colors"
        >
          {permissions.ctaLater ?? 'Remind me later'}
        </button>
      </motion.div>
    </div>
  );
}
