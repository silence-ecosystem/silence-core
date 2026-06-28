'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';

export default function Step1Welcome() {
  const { t } = useLanguage();
  const { goNext } = useOnboardingState();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center px-6 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-4">
          {t.onboarding?.welcome?.headline}
        </h1>
        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
          {t.onboarding?.welcome?.subheadline}
        </p>
        <button
          type="button"
          onClick={() => goNext('WELCOME', 'INTENT')}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] rounded-2xl py-4 font-medium transition-colors"
        >
          {t.onboarding?.welcome?.cta}
        </button>
        <div className="mt-6">
          <Link
            href="/login"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {t.onboarding?.welcome?.loginLink}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
