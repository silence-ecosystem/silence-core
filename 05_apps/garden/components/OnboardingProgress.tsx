'use client';

import { colors, radius, timing } from '@/lib/tokens';

const STEPS = ['crisis', 'welcome', 'intent', 'experience', 'selfReport', 'consents'] as const;

interface Props {
  currentStep: (typeof STEPS)[number];
}

export default function OnboardingProgress({ currentStep }: Props) {
  const currentIndex = STEPS.indexOf(currentStep);
  const progress = currentIndex / (STEPS.length - 1);

  return (
    <div
      role="progressbar"
      aria-valuenow={currentIndex + 1}
      aria-valuemin={1}
      aria-valuemax={STEPS.length}
      aria-label={`Onboarding step ${currentIndex + 1} of ${STEPS.length}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: colors.surfaceHover,
        zIndex: 50,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          background: colors.accentPrimary,
          borderRadius: radius.sm,
          transition: `width ${timing.micro}ms cubic-bezier(0.618, 0, 0.382, 1)`,
        }}
      />
    </div>
  );
}
