'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';

interface ConsentItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
  link?: { text: string; href: string };
}

export default function Step5Consents() {
  const { t } = useLanguage();
  const { setNotificationOptIn, goNext } = useOnboardingState();
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const onboarding = (t.onboarding ?? {}) as Record<string, unknown>;
  const consentsT = (onboarding.consents ?? {}) as Record<string, string>;
  const common = (t.common ?? {}) as Record<string, string>;

  const items: ConsentItem[] = [
    {
      id: 'privacy_policy',
      label: consentsT.privacyLabel ?? 'Privacy Policy',
      description: consentsT.privacyDesc ?? 'I have read the privacy policy and agree to processing my personal data.',
      required: true,
      link: { text: consentsT.readLink ?? 'Read', href: '/privacy' },
    },
    {
      id: 'terms_of_service',
      label: consentsT.termsLabel ?? 'Terms of Service',
      description: consentsT.termsDesc ?? 'I accept the terms of using SILENCE.OBJECTS.',
      required: true,
      link: { text: consentsT.readLink ?? 'Read', href: '/terms' },
    },
    {
      id: 'ai_disclaimer',
      label: consentsT.aiLabel ?? 'AI Information',
      description: consentsT.aiDesc ?? 'I understand that SILENCE.OBJECTS uses AI for analysis and results are not professional advice.',
      required: true,
    },
    {
      id: 'marketing',
      label: consentsT.marketingLabel ?? 'Marketing communication',
      description: consentsT.marketingDesc ?? 'I agree to receive updates (optional).',
      required: false,
    },
  ];

  const toggle = (id: string) => {
    setConsents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allRequired = items.filter((c) => c.required).every((c) => consents[c.id]);

  const handleContinue = async () => {
    if (!allRequired) return;
    setLoading(true);
    setNotificationOptIn(!!consents.marketing);
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consents: Object.entries(consents)
            .filter(([, accepted]) => accepted)
            .map(([type]) => ({ type, version: '1.0' })),
        }),
      });
    } finally {
      setLoading(false);
      goNext('CONSENTS', 'PLAN');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-[28px] font-semibold text-[var(--text-primary)]">
            {consentsT.title ?? 'Before we begin'}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            {consentsT.subtitle ?? 'We need a few consents to continue.'}
          </p>
        </motion.div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 space-y-4">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] cursor-pointer hover:border-[var(--primary)] transition-colors group"
            >
              <input
                type="checkbox"
                checked={consents[item.id] || false}
                onChange={() => toggle(item.id)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                  consents[item.id]
                    ? 'bg-[var(--primary)] border-[var(--primary)]'
                    : 'border-[var(--border)] group-hover:border-[var(--primary)]'
                }`}
              >
                {consents[item.id] && (
                  <svg
                    className="w-3 h-3 text-[var(--primary-text)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-[var(--text-primary)] text-sm">
                    {item.label}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded ${
                      item.required
                        ? 'bg-[var(--danger-muted)] text-[var(--danger)]'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                    }`}
                  >
                    {item.required ? consentsT.required ?? 'Required' : consentsT.optional ?? 'Optional'}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
                {item.link && (
                  <Link
                    href={item.link.href}
                    target="_blank"
                    className="text-xs text-[var(--primary)] hover:underline mt-1 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.link.text}
                  </Link>
                )}
              </div>
            </label>
          ))}

          <button
            type="button"
            onClick={handleContinue}
            disabled={!allRequired || loading}
            className="w-full mt-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] rounded-xl py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? common.loading ?? 'Loading...' : common.next ?? 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
